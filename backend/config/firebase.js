const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../serviceAccountKey.json';
      const absolutePath = path.resolve(__dirname, serviceAccountPath);
      const serviceAccount = require(absolutePath);
      
      // Fix for newline escaping issues
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      
      console.log('Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error.message);
  }
};

initializeFirebase();

const db = admin.firestore();
const auth = admin.auth();

// Set settings for Firestore if needed (e.g. to avoid warnings)
try {
  db.settings({ ignoreUndefinedProperties: true });
} catch (e) {}

module.exports = {
  admin,
  db,
  auth
};

