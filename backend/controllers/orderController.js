const { admin, db } = require('../config/firebase');

// @desc    Create a new order (Authenticated user)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    // Attach user ID and timestamp
    orderData.userId = req.user.uid || req.user.id || req.user.sub;
    orderData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await db.collection('orders').add(orderData);
    const newDoc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...newDoc.data() });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// @desc    Get orders for the logged-in user
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.uid || req.user.id || req.user.sub;
    const ordersRef = db.collection('orders').where('userId', '==', userId).orderBy('createdAt', 'desc');
    const snapshot = await ordersRef.get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const ordersRef = db.collection('orders').orderBy('createdAt', 'desc');
    const snapshot = await ordersRef.get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// @desc    Update order status (Admin only)
// @route   PATCH /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ status: 'error', message: 'Status field is required' });
    }
    const orderRef = db.collection('orders').doc(id);
    const doc = await orderRef.get();
    if (!doc.exists) {
      return res.status(404).json({ status: 'error', message: 'Order not found' });
    }
    await orderRef.update({ status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    const updatedDoc = await orderRef.get();
    res.status(200).json({ id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
