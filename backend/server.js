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
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const adminAuthRoutes = require('./routes/adminAuth');
const adminRoutes = require('./routes/admin');
const adminOrderRoutes = require('./routes/adminOrder');
const adminProductRoutes = require('./routes/adminProducts');
const customerAuthRoutes = require('./routes/customerAuth');
const productRoutes = require('./routes/productRoutes');
const accountDetailsRoute = require('./routes/accountDetails');
const addressRoute = require('./routes/address');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cardRoutes = require('./routes/cardRoutes');


// Use routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/customer', customerAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/account-details', accountDetailsRoute);
app.use('/api/address', addressRoute);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminOrderRoutes);
app.use('/api/cards', cardRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => console.log('🚀 Server running on port', process.env.PORT || 5000));
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
  });
