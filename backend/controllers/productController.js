const { admin, db } = require('../config/firebase');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.orderBy('createdAt', 'desc').get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products from Firebase:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const productRef = db.collection('products').doc(req.params.id);
    const doc = await productRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error fetching product from Firebase:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// @desc    Create a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const data = req.body;
    data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    const docRef = await db.collection('products').add(data);
    const newDoc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...newDoc.data() });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const productRef = db.collection('products').doc(id);
    const doc = await productRef.get();
    if (!doc.exists) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    await productRef.update(data);
    const updatedDoc = await productRef.get();
    res.status(200).json({ id, ...updatedDoc.data() });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = db.collection('products').doc(id);
    const doc = await productRef.get();
    if (!doc.exists) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    await productRef.delete();
    res.status(200).json({ status: 'success', message: 'Product deleted' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviewsRef = db.collection('products').doc(id).collection('reviews');
    const snapshot = await reviewsRef.orderBy('createdAt', 'desc').get();
    const reviews = [];
    snapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const addProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, userName } = req.body;
    const uid = req.user.uid || req.user.id || req.user.sub;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ status: 'error', message: 'Valid rating between 1 and 5 is required' });
    }

    const reviewData = {
      userId: uid,
      userName: userName || 'Anonymous',
      rating: Number(rating),
      comment: comment || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const reviewRef = await db.collection('products').doc(id).collection('reviews').add(reviewData);
    const newReview = await reviewRef.get();
    
    // Optional: Update product's average rating here

    res.status(201).json({ id: reviewRef.id, ...newReview.data() });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  addProductReview
};
