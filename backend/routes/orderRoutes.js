const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const customerAuth = require('../middleware/customerAuthMiddleware');

// Place a new order
router.post('/place', customerAuth, async (req, res) => {
  try {
    const customerId = req.user._id;

    const cart = await Cart.findOne({ customerId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // ✅ Reduce stock before placing order
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) continue;

      const sizeEntry = product.sizes.find(s => s.sizeLabel === item.size);
      if (!sizeEntry) {
        return res.status(400).json({ message: `Size ${item.size} not found for ${product.name}` });
      }

      if (sizeEntry.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name} - ${item.size}` });
      }

      sizeEntry.stock -= item.quantity;
      await product.save(); // Save the updated stock
    }

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      size: item.size,
      quantity: item.quantity,
    }));

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity,
      0
    );

    const newOrder = new Order({
      customerId,
      items: orderItems,
      totalAmount,
    });

    await newOrder.save();

    // Clear the cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// Get orders for the logged-in customer
router.get('/', customerAuth, async (req, res) => {
  try {
    const customerId = req.user._id;

    const orders = await Order.find({ customerId })
      .populate('items.productId')
      .sort({ placedAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Optional: Get a specific order by ID
router.get('/:id', customerAuth, async (req, res) => {
  try {
    const customerId = req.user._id;
    const orderId = req.params.id;

    const order = await Order.findOne({ _id: orderId, customerId }).populate('items.productId');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

module.exports = router;
