require('dotenv').config();
const admin = require('firebase-admin');

// Same service account build as firebaseAdmin.js
const serviceAccount = {
  type: process.env.SERVICE_ACCOUNT_TYPE,
  project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
  universe_domain: process.env.SERVICE_ACCOUNT_UNIVERSE_DOMAIN,
};

console.log('Server time (UTC):', new Date().toISOString());  // For time debug

let app;
try {
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Init success');
} catch (err) {
  console.error('Init fail:', err.message);
  process.exit(1);
}

// Trigger a real auth call to test token fetch
(async () => {
  try {
    const listUsers = await admin.auth().listUsers(1);  // Lightweight test (no create)
    console.log('Auth test success! Users count:', listUsers.users.length);
    process.exit(0);
  } catch (authErr) {
    console.error('Auth test fail:', authErr.message);
    process.exit(1);
  }
})();