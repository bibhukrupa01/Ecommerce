const { db } = require('../config/firebase');

// Helper to safely get a Date from a Firestore field (could be Timestamp, string, or null)
const toDate = (val) => {
  if (!val) return null;
  if (typeof val.toDate === 'function') return val.toDate(); // Firestore Timestamp
  return new Date(val); // ISO string fallback
};

// ─── POST /api/coupons (admin) ───────────────────────────────────────────────
// Create a new coupon and store it in Firestore
const createCoupon = async (req, res, next) => {
  try {
    const { code, type, value, minOrder, maxUses, expiresAt } = req.body;
    if (!code || !type || !value) {
      return res.status(400).json({ message: 'code, type and value are required' });
    }

    const couponData = {
      code: code.toUpperCase(),
      type,                            // 'percentage' | 'fixed'
      value: parseFloat(value),
      minOrder: parseFloat(minOrder) || 0,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
      usedCount: 0,
      expiresAt: expiresAt || null,     // stored as ISO string
      active: true,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('coupons').add(couponData);
    return res.status(201).json({ id: docRef.id, ...couponData });
  } catch (err) {
    console.error('createCoupon error', err);
    next(err);
  }
};

// ─── GET /api/coupons (admin) ────────────────────────────────────────────────
// List all coupons
const getAllCoupons = async (req, res, next) => {
  try {
    const snapshot = await db.collection('coupons').orderBy('createdAt', 'desc').get();
    const coupons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(coupons);
  } catch (err) {
    console.error('getAllCoupons error', err);
    next(err);
  }
};

// ─── DELETE /api/coupons/:id (admin) ─────────────────────────────────────────
const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('coupons').doc(id).delete();
    return res.status(200).json({ message: 'Coupon deleted' });
  } catch (err) {
    console.error('deleteCoupon error', err);
    next(err);
  }
};

// ─── POST /api/coupons/apply (authenticated user) ───────────────────────────
// Validates and applies a coupon, returns the discount amount
const applyCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code || typeof orderTotal !== 'number') {
      return res.status(400).json({ message: 'Invalid request payload' });
    }

    // Find coupon by code
    const couponsRef = db.collection('coupons');
    const snapshot = await couponsRef.where('code', '==', code.toUpperCase()).limit(1).get();
    if (snapshot.empty) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    const doc = snapshot.docs[0];
    const coupon = doc.data();

    // Validation
    const now = new Date();
    if (!coupon.active) {
      return res.status(400).json({ message: 'Coupon is inactive' });
    }

    const expiry = toDate(coupon.expiresAt);
    if (expiry && now > expiry) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }
    if (coupon.minOrder && orderTotal < coupon.minOrder) {
      return res.status(400).json({ message: `Minimum order amount $${coupon.minOrder} required` });
    }

    // Calculate discount
    const discount = coupon.type === 'percentage'
      ? Math.round(orderTotal * (coupon.value / 100) * 100) / 100
      : coupon.value;

    // Update usage count
    const newUsedCount = (coupon.usedCount || 0) + 1;
    const stillActive = coupon.maxUses ? newUsedCount < coupon.maxUses : true;
    await doc.ref.update({ usedCount: newUsedCount, active: stillActive });

    const responseCoupon = {
      id: doc.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder || 0,
      maxUses: coupon.maxUses || null,
      usedCount: newUsedCount,
      active: stillActive,
      expiresAt: coupon.expiresAt || null
    };

    return res.status(200).json({ coupon: responseCoupon, discount });
  } catch (err) {
    console.error('applyCoupon error', err);
    next(err);
  }
};

module.exports = { createCoupon, getAllCoupons, deleteCoupon, applyCoupon };
