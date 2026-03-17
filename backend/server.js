const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeFirebase } = require('./config/firebase');

// Load environment variables
dotenv.config();

// Initialize Firebase (happens automatically when we require the config)
require('./config/firebase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
