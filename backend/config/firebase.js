const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin SDK
try {
  // If you are hosting on a platform like Google Cloud, Firebase can sometimes
  // initialize automatically without credentials. 
  // Otherwise, you must download the serviceAccountKey.json from Firebase Console.
  const path = require('path');
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../serviceAccountKey.json';
  const serviceAccount = require(path.resolve(__dirname, serviceAccountPath));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error.message);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
};
