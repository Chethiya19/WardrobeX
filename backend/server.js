const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust for your frontend port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const adminAuthRoutes = require('./routes/adminAuth');
const adminRoutes = require('./routes/admin');
const adminProductRoutes = require('./routes/adminProducts');
const customerAuthRoutes = require('./routes/customerAuth');
const productRoutes = require('./routes/productRoutes'); // ✅ for frontend view
const accountDetailsRoute = require('./routes/accountDetails');
const addressRoute = require('./routes/address');

// Use routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/customer', customerAuthRoutes);
app.use('/api/products', productRoutes); // ✅ for frontend product grid
app.use('/api/account-details', accountDetailsRoute);
app.use('/api/address', addressRoute);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log('🚀 Server running on port', process.env.PORT || 5000));
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
  });
