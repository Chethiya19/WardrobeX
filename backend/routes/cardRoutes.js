const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const verifyCustomer = require('../middleware/customerAuthMiddleware');

// @desc    Save card details
// @route   POST /api/cards/save
router.post('/save', verifyCustomer, async (req, res) => {
  try {
    const customerId = req.user.id;
    const { cardType, cardHolder, cardNumber, expiry, cvv } = req.body;

    const newCard = new Card({
      customerId,
      cardType,
      cardHolder,
      cardNumber,
      expiry,
      cvv
    });

    await newCard.save();
    res.status(201).json({ message: 'Card saved successfully' });
  } catch (error) {
    console.error('Save Card Error:', error);
    res.status(500).json({ message: 'Failed to save card' });
  }
});

// @desc    Get saved cards for logged-in customer
// @route   GET /api/cards/customer
router.get('/customer', verifyCustomer, async (req, res) => {
  try {
    const customerId = req.user.id;
    const cards = await Card.find({ customerId }).select('-__v');
    res.json({ cards });
  } catch (error) {
    console.error('Fetch Cards Error:', error);
    res.status(500).json({ message: 'Failed to retrieve cards' });
  }
});

module.exports = router;
