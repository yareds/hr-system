import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: config.projectId || 'placeholder',
  appId: config.appId || 'placeholder',
  apiKey: config.apiKey || 'placeholder',
  authDomain: config.authDomain || 'placeholder',
  firestoreDatabaseId: config.firestoreDatabaseId || '(default)',
  storageBucket: config.storageBucket || 'placeholder',
  messagingSenderId: config.messagingSenderId || 'placeholder',
};

const isConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, config.firestoreDatabaseId)
      : getFirestore(app);
  } catch (err) {
    console.warn('Firebase initialization skipped or failed:', err);
  }
}

export { auth, db };
export default app;
