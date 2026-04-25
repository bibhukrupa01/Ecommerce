const express = require('express');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

// Create a new order (Authenticated users)
router.post('/', verifyToken, createOrder);

// Get orders for the logged-in user
router.get('/my-orders', verifyToken, getMyOrders);

// Admin routes
router.get('/', adminOnly, getAllOrders);
router.patch('/:id', adminOnly, updateOrderStatus);

module.exports = router;
