const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
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

module.exports = router;
