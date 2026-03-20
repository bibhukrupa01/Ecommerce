const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

// Define route for categories
router.get('/', getCategories);

module.exports = router;
