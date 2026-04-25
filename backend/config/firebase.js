const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');



// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
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

