const { admin } = require('../config/firebase');

/**
 * Middleware to verify Firebase ID token.
 * Expects token in Authorization header as Bearer <token>.
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }
  const idToken = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

/**
 * Middleware to restrict access to admin users only.
 * Assumes verifyToken has already run and populated req.user.
 */
const adminOnly = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'Unauthenticated' });
  }
  
  try {
    const { db } = require('../config/firebase');
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    
    const userData = userDoc.data();
    if (userData.role === 'admin' || req.user.admin === true) {
      req.user.role = 'admin';
      return next();
    }
    
    return res.status(403).json({ status: 'error', message: 'Admin access required' });
  } catch (error) {
    console.error('Error checking admin role:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = { verifyToken, adminOnly };
