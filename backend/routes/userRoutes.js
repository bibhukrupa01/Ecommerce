const express = require('express');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile, getAllUsers, getCart, updateCart, getWishlist, updateWishlist } = require('../controllers/userController');

// Get current user's profile (Protected)
router.get('/profile', verifyToken, getUserProfile);

// Update current user's profile (Protected)
router.put('/profile', verifyToken, updateUserProfile);

// Cart
router.get('/cart', verifyToken, getCart);
router.post('/cart', verifyToken, updateCart);

// Wishlist
router.get('/wishlist', verifyToken, getWishlist);
router.post('/wishlist', verifyToken, updateWishlist);

// Admin route: get all users
router.get('/', adminOnly, getAllUsers);

module.exports = router;
