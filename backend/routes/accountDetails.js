const express = require('express');
const router = express.Router();
const AccountDetail = require('../models/AccountDetail');
const customerAuth = require('../middleware/customerAuthMiddleware');

// GET /api/account-details/me
router.get('/me', customerAuth, async (req, res) => {
  try {
    const detail = await AccountDetail.findOne({ customerId: req.user._id });
    res.json(detail || {});
  } catch (err) {
    console.error('Error fetching account details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/account-details/save
router.post('/save', customerAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    let existing = await AccountDetail.findOne({ customerId: req.user._id });

    if (existing) {
      existing.firstName = firstName;
      existing.lastName = lastName;
      existing.phone = phone;
      await existing.save();
    } else {
      const newDetail = new AccountDetail({
        customerId: req.user._id,
        firstName,
        lastName,
        phone
      });
      await newDetail.save();
    }

    res.json({ message: 'Account details saved successfully' });
  } catch (err) {
    console.error('Error saving account details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
