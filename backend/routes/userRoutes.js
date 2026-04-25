const express = require('express');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const { getUserProfile, updateUserProfile, getAllUsers } = require('../controllers/userController');

// Get current user's profile (Protected)
router.get('/profile', verifyToken, getUserProfile);

// Update current user's profile (Protected)
router.put('/profile', verifyToken, updateUserProfile);

// Admin route: get all users
router.get('/', adminOnly, getAllUsers);

module.exports = router;
