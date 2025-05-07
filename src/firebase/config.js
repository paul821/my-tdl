import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Debug: Log all environment variables
console.log('All env variables:', import.meta.env);

// Check if all required environment variables are present
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// Debug: Log each required variable
requiredEnvVars.forEach(varName => {
  console.log(`${varName}:`, import.meta.env[varName] ? 'present' : 'missing');
});

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  // Don't throw error, just log it
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Log config for debugging (remove in production)
console.log('Firebase Config Status:', {
  hasApiKey: !!firebaseConfig.apiKey,
  hasAuthDomain: !!firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  hasAppId: !!firebaseConfig.appId,
  missingVars: missingVars
});

let app;
let auth;
let db;

try {
  // Only initialize if we have the minimum required config
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    console.log('Attempting to initialize Firebase...');
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
    console.log('Auth instance:', !!auth);
    console.log('Firestore instance:', !!db);
  } else {
    console.warn('Firebase not initialized - missing required configuration');
    console.warn('Required values present:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasProjectId: !!firebaseConfig.projectId
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Enable custom authentication
if (auth) {
  auth.useDeviceLanguage();
  auth.settings.appVerificationDisabledForTesting = true;
  console.log('Auth settings configured');
}

export { app, auth, db }; 