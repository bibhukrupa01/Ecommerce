const { db } = require('../config/firebase');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categoriesRef = db.collection('categories');
    const snapshot = await categoriesRef.get();
    
    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const categories = [];
    snapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories from Firebase:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  getCategories
};
