const dotenv = require("dotenv");
const path = require("path");
// Explicitly load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, './.env') });

const express = require('express');
const cors = require('cors');
const { admin, db, auth } = require('./config/firebase');

// Fallback for API Key if .env fails to load intermittently
if (!process.env.FIREBASE_WEB_API_KEY) {
  process.env.FIREBASE_WEB_API_KEY = "AIzaSyDwhyyFNV6ud9puMCTJuFFqfQRybb5e3yk";
}

// Load environment variables

// Initialize Firebase occurs when we import from config above.

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is healthy' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
