const express = require('express');
const router = express.Router();
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
const { createCoupon, getAllCoupons, deleteCoupon, applyCoupon } = require('../controllers/couponController');

// ── User route ──────────────────────────────────────────────────────────────
// Apply coupon (authenticated user)
router.post('/apply', verifyToken, applyCoupon);

// ── Admin routes ────────────────────────────────────────────────────────────
// Create coupon
router.post('/', verifyToken, adminOnly, createCoupon);

// List all coupons
router.get('/', verifyToken, adminOnly, getAllCoupons);

// Delete coupon
router.delete('/:id', verifyToken, adminOnly, deleteCoupon);

module.exports = router;
