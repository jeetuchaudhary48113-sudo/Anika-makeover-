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

// 2. Fetch config from Firestore
export async function loadSiteConfigFromDb(): Promise<SiteConfig | null> {
  if (isFirebasePlaceholder || !db) {
    try {
      const cached = localStorage.getItem('site_config_anika');
      if (cached) {
        return JSON.parse(cached) as SiteConfig;
      }
    } catch (e) {
      console.error('Failed to load site config from fallback localStorage:', e);
    }
    return null;
  }

  const docPath = 'site_config/anika';
  try {
    const docRef = doc(db, 'site_config', 'anika');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.config) {
        return data.config as SiteConfig;
      }
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

// 3. Save config to Firestore
export async function saveSiteConfigToDb(config: SiteConfig): Promise<void> {
  if (isFirebasePlaceholder || !db) {
    try {
      localStorage.setItem('site_config_anika', JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save site config to fallback localStorage:', e);
    }
    return;
  }

  const docPath = 'site_config/anika';
  try {
    const docRef = doc(db, 'site_config', 'anika');
    const sanitizedConfig = sanitizeForFirestore(config);
    await setDoc(docRef, {
      id: 'anika',
      config: sanitizedConfig,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// 4. Upload raw physical image file to Firebase Storage
export async function uploadImageToStorage(file: File, folder: string = 'images'): Promise<string> {
  // Retain original extension or default to .jpg
  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${extension}`;
  
  if (isFirebasePlaceholder || !storage) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read file as DataURL inside fallback'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader errored out'));
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileRef = ref(storage, fileName);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error(`Firebase Storage upload failed for ${fileName}, falling back to local FileReader fallback:`, error);
    // Return standard helper data-url if configuration/bucket is not active yet in playground
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read file as DataURL inside fallback'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader errored out'));
      reader.readAsDataURL(file);
    });
  }
}
