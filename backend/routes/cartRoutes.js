const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const customerAuth = require('../middleware/customerAuthMiddleware');
const mongoose = require('mongoose');

// Add to cart
router.post('/add', customerAuth, async (req, res) => {
  const { productId, size, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    let cart = await Cart.findOne({ customerId: req.user._id });

    if (!cart) {
      cart = new Cart({ customerId: req.user._id, items: [] });
    }

    // Check if product + size already exists in cart
    const existingItem = cart.items.find(item =>
      item.productId.equals(productId) && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, size, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Added to cart successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// Get cart items for logged in user
router.get('/', customerAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.user._id }).populate('items.productId');

    if (!cart) {
      return res.json([]);
    }

    res.json(cart.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Remove an item from cart by productId and size
router.delete('/remove/:id', customerAuth, async (req, res) => {
  const productId = req.params.id;
  const { size } = req.query;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  try {
    const customerId = req.user._id;

    const cart = await Cart.findOne({ customerId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // Filter out the item with matching productId and size
    cart.items = cart.items.filter(item => {
      return !(item.productId.equals(productId) && item.size === size);
    });

    await cart.save();

    res.json({ message: 'Item removed successfully', cart });
  } catch (err) {
    console.error('Error removing item from cart:', err);
    res.status(500).json({ message: 'Server error removing item' });
  }
});

module.exports = router;