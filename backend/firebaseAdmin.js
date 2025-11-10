// backend/firebaseAdmin.js - Admin SDK init (Updated with improved validation, logging, and error handling)
require('dotenv').config();  // Load env vars (add if not already in your app entry)

const admin = require('firebase-admin');

// Build service account object from env vars
const serviceAccount = {
  type: process.env.SERVICE_ACCOUNT_TYPE,
  project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),  // Unescape \n to actual newlines
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
};

// Enhanced validation (for debugging - remove sensitive logs in production)
if (!serviceAccount.private_key || serviceAccount.private_key.includes('undefined') || serviceAccount.private_key.length < 100) {
  throw new Error('Missing or invalid SERVICE_ACCOUNT_PRIVATE_KEY in .env - Regenerate from Firebase Console');
}

if (!serviceAccount.project_id) {
  throw new Error('Missing SERVICE_ACCOUNT_PROJECT_ID in .env');
}

console.log('Service account loaded with project:', serviceAccount.project_id);  // Safe log (no secrets)

let adminApp;
try {
  if (!admin.apps.length) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id  // Use env or from service account
    });
    console.log('Firebase Admin initialized successfully for project:', adminApp.options.projectId);
  } else {
    adminApp = admin.app();  // Use existing app if already initialized
    console.log('Firebase Admin app already initialized');
  }
} catch (initErr) {
  console.error('Firebase Admin init failed:', initErr.message || initErr);
  // Optionally, throw or exit process in prod: process.exit(1);
  throw initErr;  // Re-throw to halt if critical
}

module.exports = adminApp || admin;  // Export the app instance