import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SiteConfig } from './types';
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

// 2. Fetch config from Firestore ONLY - No LocalStorage/KVDB Fallbacks
export async function loadSiteConfigFromDb(): Promise<SiteConfig | null> {
  const docPath = 'site_config/anika';
  try {
    const docRef = doc(db, 'site_config', 'anika');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.config) {
        console.log('Site configuration successfully loaded from live Firestore database.');
        return data.config as SiteConfig;
      }
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

// 3. Save config to Firestore ONLY - No LocalStorage/KVDB Fallbacks
export async function saveSiteConfigToDb(config: SiteConfig): Promise<void> {
  const docPath = 'site_config/anika';
  try {
    const docRef = doc(db, 'site_config', 'anika');
    const sanitizedConfig = sanitizeForFirestore(config);
    await setDoc(docRef, {
      id: 'anika',
      config: sanitizedConfig,
      updatedAt: new Date().toISOString()
    });
    console.log('Site configuration successfully saved to live Firestore database.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// 4. Upload raw physical image file directly to Firebase Storage ONLY
export async function uploadImageToStorage(file: File, folder: string = 'images'): Promise<string> {
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
    throw new Error('Firebase Storage upload failed. Please verify that your storage bucket has been provisioned and is accessible.');
  }
}
