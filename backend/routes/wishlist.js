const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const customerAuth = require('../middleware/customerAuthMiddleware');

// Add product to wishlist
router.post('/add/:productId', customerAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    // Check if already in wishlist
    const exists = await Wishlist.findOne({ customerId, productId });
    if (exists) return res.status(400).json({ message: 'Product already in wishlist' });

    const newItem = new Wishlist({ customerId, productId });
    await newItem.save();

    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove product from wishlist
router.delete('/remove/:productId', customerAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const customerId = req.user._id;

    await Wishlist.findOneAndDelete({ customerId, productId });

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all wishlist items for logged in customer (populate product info)
router.get('/', customerAuth, async (req, res) => {
  try {
    const customerId = req.user._id;

    const items = await Wishlist.find({ customerId }).populate('productId');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
