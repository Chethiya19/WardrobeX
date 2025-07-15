const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const verifyAdmin = require('../middleware/adminAuthMiddleware');

// Get all customers (admin only)
router.get('/customers', verifyAdmin, async (req, res) => {
  try {
    const users = await Customer.find({}, '-password'); // Exclude passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
