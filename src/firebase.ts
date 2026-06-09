import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, query, collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { SiteConfig, ServiceItem, GalleryItem, Testimonial, VideoTestimonial } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Detect placeholder config
export const isFirebasePlaceholder = 
  !firebaseConfig || 
  firebaseConfig.projectId === 'PLACEHOLDER_PROJECT_ID' || 
  firebaseConfig.apiKey === 'PLACEHOLDER_API_KEY' || 
  !firebaseConfig.apiKey;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const storage = getStorage(app);

// 1. Error Handling following the Firebase integration skill structure
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to deeply remove undefined fields
function sanitizeForFirestore(obj: any): any {
  if (obj === undefined) {
    return null;
  }
  if (obj === null) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForFirestore(item));
  }
  if (typeof obj === 'object') {
    const cleanObj: any = {};
    for (const key of Object.keys(obj)) {
      cleanObj[key] = sanitizeForFirestore(obj[key]);
    }
    return cleanObj;
  }
  return obj;
}

// 2. Fetch config from Firestore / Local Storage fallback
export async function loadSiteConfigFromDb(): Promise<SiteConfig | null> {
  if (isFirebasePlaceholder) {
    const local = localStorage.getItem('site_config_anika');
    if (local) {
      try {
        console.log('Site configuration loaded from local storage fallback.');
        return JSON.parse(local) as SiteConfig;
      } catch (err) {
        console.error('Failed to parse local site config');
      }
    }
    return null;
  }

  const docPath = 'settings/anika';
  try {
    const docRef = doc(db, 'settings', 'anika');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.config) {
        console.log('Site configuration successfully loaded from settings/anika Firestore.');
        return data.config as SiteConfig;
      }
    }
    
    // Also check legacy path
    const fallbackRef = doc(db, 'site_config', 'anika');
    const fallbackSnap = await getDoc(fallbackRef);
    if (fallbackSnap.exists()) {
      const data = fallbackSnap.data();
      if (data && data.config) {
        console.log('Site configuration loaded from legacy site_config/anika Firestore.');
        return data.config as SiteConfig;
      }
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

// 3. Save config to settings collection + site_config + sync other collections
export async function saveSiteConfigToDb(config: SiteConfig): Promise<void> {
  const sanitizedConfig = sanitizeForFirestore(config);
  
  if (isFirebasePlaceholder) {
    localStorage.setItem('site_config_anika', JSON.stringify(sanitizedConfig));
    console.log('Site configuration saved to local storage fallback.');
    return;
  }

  // 1. Save to settings collection as master
  const docPath = 'settings/anika';
  try {
    const docRef = doc(db, 'settings', 'anika');
    await setDoc(docRef, {
      id: 'anika',
      config: sanitizedConfig,
      updatedAt: new Date().toISOString()
    });

    // Mirror to legacy site_config/anika
    await setDoc(doc(db, 'site_config', 'anika'), {
      id: 'anika',
      config: sanitizedConfig,
      updatedAt: new Date().toISOString()
    });

    // 2. Dynamic audit-ready sync of separate collections
    // Owner
    if (config.founder) {
      await setDoc(doc(db, 'owner', 'founder_details'), sanitizeForFirestore(config.founder));
    }
    // Services
    if (config.services) {
      for (const cat of config.services) {
        const catId = cat.category.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await setDoc(doc(db, 'services', catId), sanitizeForFirestore(cat));
      }
    }
    // Gallery
    if (config.gallery) {
      for (const item of config.gallery) {
        await setDoc(doc(db, 'gallery', item.id), sanitizeForFirestore(item));
      }
    }
    // Testimonials
    if (config.testimonials) {
      for (const t of config.testimonials) {
        await setDoc(doc(db, 'reviews', t.id), sanitizeForFirestore(t));
      }
    }
    // Banners
    if (config.banners) {
      for (const b of config.banners) {
        await setDoc(doc(db, 'banners', b.id), { ...sanitizeForFirestore(b), type: 'hero' });
      }
    }
    if (config.welcomeBanner) {
      await setDoc(doc(db, 'banners', 'welcome'), { ...sanitizeForFirestore(config.welcomeBanner), type: 'welcome' });
    }
    if (config.promoBanner) {
      await setDoc(doc(db, 'banners', 'promo'), { ...sanitizeForFirestore(config.promoBanner), type: 'promo' });
    }
    if (config.shopBanner) {
      await setDoc(doc(db, 'banners', 'shop'), { ...sanitizeForFirestore(config.shopBanner), type: 'shop' });
    }

    console.log('Site configuration successfully saved and split-synced in live Firestore.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// 4. Upload raw physical image file directly to Firebase Storage ONLY
export async function uploadImageToStorage(file: File, folder: string = 'images'): Promise<string> {
  if (isFirebasePlaceholder) {
    // Return high-quality persistent Base64 Data URL for standalone offline mockup
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Local mock file reader failed.'));
      };
      reader.readAsDataURL(file);
    });
  }

  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${extension}`;
  
  try {
    const fileRef = ref(storage, fileName);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log('Successfully uploaded image to Firebase Storage:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Firebase Storage upload failed for file:', fileName, error);
    throw new Error('Firebase Storage upload failed. Please verify that your storage bucket has been provisioned.');
  }
}

// 5. Upload Video directly to Firebase Storage
export async function uploadVideoToStorage(file: File): Promise<string> {
  if (isFirebasePlaceholder) {
    // Return high-quality persistent Base64/ObjectURL for inline preview
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Local media reader error'));
      };
      reader.readAsDataURL(file);
    });
  }

  const extension = file.name.split('.').pop() || 'mp4';
  const fileName = `videos/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${extension}`;
  
  try {
    const fileRef = ref(storage, fileName);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log('Successfully uploaded video to Firebase Storage:', downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error('Video upload failed:', error);
    throw new Error('Firebase Storage video upload failed.');
  }
}

// 6. APPOINTMENTS COLLECTION SCHEMA & METHODS
export interface AppointmentData {
  id?: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Create Appointment
export async function addAppointmentToDb(appt: AppointmentData): Promise<string> {
  const sanitizedAppt = sanitizeForFirestore(appt);
  
  if (isFirebasePlaceholder) {
    const items = getLocalAppointments();
    const newId = `appt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newItem = { ...sanitizedAppt, id: newId };
    items.unshift(newItem);
    localStorage.setItem('salon_appointments', JSON.stringify(items));
    return newId;
  }

  try {
    const collRef = collection(db, 'appointments');
    const docRef = await addDoc(collRef, sanitizedAppt);
    // Also save the generated ID inside the document
    await setDoc(docRef, { ...sanitizedAppt, id: docRef.id });
    console.log('Appointment written to Firestore successfully:', docRef.id);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'appointments');
  }
}

// Read Appointments
export async function loadAppointmentsFromDb(): Promise<AppointmentData[]> {
  if (isFirebasePlaceholder) {
    return getLocalAppointments();
  }

  try {
    const q = query(collection(db, 'appointments'));
    const snapshot = await getDocs(q);
    const results: AppointmentData[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      results.push({
        ...data,
        id: doc.id
      } as AppointmentData);
    });
    // Sort by timestamp descending
    return results.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'appointments');
  }
}

// Update Appointment Status
export async function updateAppointmentStatusInDb(id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled'): Promise<void> {
  if (isFirebasePlaceholder) {
    const items = getLocalAppointments();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index].status = status;
      localStorage.setItem('salon_appointments', JSON.stringify(items));
    }
    return;
  }

  try {
    const docRef = doc(db, 'appointments', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await setDoc(docRef, { ...snap.data(), status }, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
  }
}

// Delete Appointment
export async function deleteAppointmentFromDb(id: string): Promise<void> {
  if (isFirebasePlaceholder) {
    const items = getLocalAppointments();
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem('salon_appointments', JSON.stringify(filtered));
    return;
  }

  try {
    await deleteDoc(doc(db, 'appointments', id));
    console.log('Deleted appointment:', id);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `appointments/${id}`);
  }
}

// Local fallback helper
function getLocalAppointments(): AppointmentData[] {
  const local = localStorage.getItem('salon_appointments');
  if (local) {
    try {
      return JSON.parse(local) as AppointmentData[];
    } catch (e) {
      return [];
    }
  }
  // Seeding initial appointment mock for clean first run
  const initialMocks: AppointmentData[] = [
    {
      id: 'appt_mock_1',
      name: 'Riya Gupta',
      phone: '8954125478',
      service: 'Bridal Makeup',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '11:00 AM',
      notes: 'Wants Airbrush details with custom jewel matching.',
      timestamp: new Date().toISOString(),
      status: 'pending'
    },
    {
      id: 'appt_mock_2',
      name: 'Simran Singh',
      phone: '9845785124',
      service: 'Hair Spa',
      date: new Date().toISOString().split('T')[0],
      time: '03:00 PM',
      notes: 'Has custom dry hair concerns.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'confirmed'
    }
  ];
  localStorage.setItem('salon_appointments', JSON.stringify(initialMocks));
  return initialMocks;
}
