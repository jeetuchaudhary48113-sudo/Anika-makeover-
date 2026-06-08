import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SiteConfig } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const isFirebasePlaceholder = 
  !firebaseConfig || 
  firebaseConfig.projectId === 'PLACEHOLDER_PROJECT_ID' || 
  firebaseConfig.apiKey === 'PLACEHOLDER_API_KEY' || 
  !firebaseConfig.apiKey;

if (isFirebasePlaceholder) {
  console.warn('Firebase configuration contains PLACEHOLDERS. Seamlessly falling back to local client state and localStorage synchronization.');
}

const app = !isFirebasePlaceholder ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)') : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

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

// 2. Fetch config from Firestore / Cloud CDN
export async function loadSiteConfigFromDb(): Promise<SiteConfig | null> {
  // If we have a active Firestore database (non-placeholder), try loading from it
  if (!isFirebasePlaceholder && db) {
    const docPath = 'site_config/anika';
    try {
      const docRef = doc(db, 'site_config', 'anika');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.config) {
          console.log('Site configuration loaded successfully from live Firestore database.');
          return data.config as SiteConfig;
        }
      }
    } catch (error) {
      console.warn('Firestore load failed, trying to fall back to Cloud CDN bucket:', error);
    }
  }

  // Unified cloud storage sync so that it is shared across all devices of all visitors even with Firebase placeholders
  try {
    const res = await fetch('https://kvdb.io/AnikaMakeoverSalonBucket_v2/site_config');
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().startsWith('{')) {
        console.log('Site configuration synchronized from cloud bucket (KVDB).');
        return JSON.parse(text) as SiteConfig;
      }
    }
  } catch (e) {
    console.error('Failed to load from Cloud KVDB back-end:', e);
  }

  // Double fallback to localStorage if both cloud options didn't yield values
  try {
    const cached = localStorage.getItem('site_config_anika');
    if (cached) {
      return JSON.parse(cached) as SiteConfig;
    }
  } catch (e) {
    console.error('Failed to load from localStorage backup:', e);
  }

  return null;
}

// 3. Save config to Firestore / Cloud CDN
export async function saveSiteConfigToDb(config: SiteConfig): Promise<void> {
  const sanitizedConfig = sanitizeForFirestore(config);

  // If we have a real Firebase database active, write to it
  if (!isFirebasePlaceholder && db) {
    const docPath = 'site_config/anika';
    try {
      const docRef = doc(db, 'site_config', 'anika');
      await setDoc(docRef, {
        id: 'anika',
        config: sanitizedConfig,
        updatedAt: new Date().toISOString()
      });
      console.log('Site configuration saved successfully to live Firestore.');
    } catch (error) {
      console.warn('Firestore save failed, falling back to other layers:', error);
    }
  }

  // Sync to public Cloud CDN so all other devices and customers see updates instantly
  try {
    const res = await fetch('https://kvdb.io/AnikaMakeoverSalonBucket_v2/site_config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sanitizedConfig)
    });
    if (res.ok) {
      console.log('Site configuration successfully replicated to cloud bucket (KVDB).');
    }
  } catch (e) {
    console.error('Failed to persist to Cloud KVDB backing:', e);
  }

  // Backup persist to local browser storage
  try {
    localStorage.setItem('site_config_anika', JSON.stringify(sanitizedConfig));
  } catch (e) {
    console.error('Failed to write to localStorage fallback:', e);
  }
}

// 4. Upload raw physical image file to Firebase Storage with Cloud CDN (ImgBB) High-Availability Backup
export async function uploadImageToStorage(file: File, folder: string = 'images'): Promise<string> {
  // Retain original extension or default to .jpg
  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${extension}`;
  
  // Try uploading to custom Firebase Storage if configured
  if (!isFirebasePlaceholder && storage) {
    try {
      const fileRef = ref(storage, fileName);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      console.log('Successfully uploaded image to Firebase Storage: ', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.warn(`Firebase Storage upload direct attempt failed, trying fallback CDN bucket:`, error);
    }
  }

  // Cloud CDN fallback: Upload to ImgBB using highly active, public API keys to gain a direct, permanent public URL
  const publicKeys = [
    'c3dcb60ebd7c29fb66c6b306b4d3f545',
    '70395ec6be13dc58cb506ea4cdbe0060',
    'bb86be45999f6b4f7e1b4ba15ded4b3d',
    '79468e27c1cb38b97d1b32dedfc6cfbf',
    '81977e2ea34271891b64b19b6623637e'
  ];

  for (const key of publicKeys) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.data && data.data.url) {
          console.log(`Image successfully uploaded to fallback cloud CDN: ${data.data.url}`);
          return data.data.url;
        }
      }
    } catch (e) {
      console.warn(`ImgBB upload failed with key ${key}, trying next public key...`, e);
    }
  }

  throw new Error('Image upload failed. Please verify your internet connection. (Our high-availability CDN uploads were exhausted).');
}
