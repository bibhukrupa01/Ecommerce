const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { verifyToken, adminOnly } = require('../middleware/authMiddleware');
// Define routes for products
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin protected routes for product management
router.post('/', verifyToken, adminOnly, createProduct);
router.put('/:id', verifyToken, adminOnly, updateProduct);
router.delete('/:id', verifyToken, adminOnly, deleteProduct);

module.exports = router;
