const { admin, db } = require('../config/firebase');

/**
 * @desc    Get profile of the authenticated user
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid || req.user.id || req.user.sub;
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * @desc    Update profile of the authenticated user
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid || req.user.id || req.user.sub;
    const updates = req.body;
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    await userRef.update(updates);
    const updatedDoc = await userRef.get();
    res.status(200).json({ id: uid, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const usersRef = db.collection('users').orderBy('createdAt', 'desc');
    const snapshot = await usersRef.get();
    const users = [];
    snapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getCart = async (req, res) => {
  try {
    const uid = req.user.uid || req.user.id || req.user.sub;
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    const data = doc.data();
    res.status(200).json({ cart: data.cart || [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const updateCart = async (req, res) => {
  try {
    const uid = req.user.uid || req.user.id || req.user.sub;
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ status: 'error', message: 'Cart must be an array' });
    }
    const userRef = db.collection('users').doc(uid);
    await userRef.update({ cart });
    res.status(200).json({ status: 'success', message: 'Cart updated', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const uid = req.user.uid || req.user.id || req.user.sub;
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    const data = doc.data();
    res.status(200).json({ wishlist: data.wishlist || [] });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const updateWishlist = async (req, res) => {
  try {
    const uid = req.user.uid || req.user.id || req.user.sub;
    const { wishlist } = req.body;
    if (!Array.isArray(wishlist)) {
      return res.status(400).json({ status: 'error', message: 'Wishlist must be an array' });
    }
    const userRef = db.collection('users').doc(uid);
    await userRef.update({ wishlist });
    res.status(200).json({ status: 'success', message: 'Wishlist updated', wishlist });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getCart,
  updateCart,
  getWishlist,
  updateWishlist
};

