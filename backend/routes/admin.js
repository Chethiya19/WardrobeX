const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const AccountDetail = require('../models/AccountDetail');
const verifyAdmin = require('../middleware/adminAuthMiddleware');

// Get all customers (admin only)
router.get('/customers', verifyAdmin, async (req, res) => {
  try {
    const customers = await Customer.find({}, '-password'); // Exclude password field
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

// Get all account details (admin only)
router.get('/accountdetails', verifyAdmin, async (req, res) => {
  try {
    const accountDetails = await AccountDetail.find({})
      .populate('customerId', 'firstName lastName email');
    res.json(accountDetails);
  } catch (err) {
    console.error('Error fetching account details:', err);
    res.status(500).json({ message: 'Failed to fetch account details' });
  }
});

// Get total customer count (admin only)
router.get('/customers/count', verifyAdmin, async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ totalCustomers: count });
  } catch (err) {
    console.error('Error counting customers:', err);
    res.status(500).json({ message: 'Failed to count customers' });
  }
});

// Get total order count (admin only)
router.get('/orders/count', verifyAdmin, async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ totalOrders: count });
  } catch (err) {
    console.error('Error counting orders:', err);
    res.status(500).json({ message: 'Failed to count orders' });
  }
});

// Get total order count (admin only)
router.get('/products/count', verifyAdmin, async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ totalProducts: count });
  } catch (err) {
    console.error('Error counting products:', err);
    res.status(500).json({ message: 'Failed to count products' });
  }
});

module.exports = router;
