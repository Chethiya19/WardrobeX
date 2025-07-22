const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyAdmin = require('../middleware/adminAuthMiddleware');

// GET all orders with nested populate (admin only)
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'customerId',
        select: 'customerId username email',
        populate: {
          path: 'accountDetail',
          model: 'AccountDetail',
          select: 'firstName lastName'
        }
      })
      .populate('items.productId', 'name price images')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET order by ID with details (admin only)
router.get('/orders/:orderId', verifyAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate({
        path: 'customerId',
        select: 'customerId username email',
        populate: {
          path: 'accountDetail',
          model: 'AccountDetail',
          select: 'firstName lastName phone'
        }
      })
      .populate('items.productId', 'name price images');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    console.error('Failed to fetch order details:', err);
    res.status(500).json({ message: 'Failed to fetch order details' });
  }
});

// UPDATE order status (admin only)
router.put('/orders/:orderId/status', verifyAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    console.error('Failed to update order status:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
