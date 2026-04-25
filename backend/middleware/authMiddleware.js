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
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: 'error', message: 'Unauthenticated' });
  }
  // Assuming custom claim `admin` is set on the Firebase user.
  if (req.user.admin === true) {
    return next();
  }
  return res.status(403).json({ status: 'error', message: 'Admin access required' });
};

module.exports = { verifyToken, adminOnly };
