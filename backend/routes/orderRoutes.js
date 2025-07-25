const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const customerAuth = require('../middleware/customerAuthMiddleware');
// const sendEmail = require('../utils/sendEmail');

// Place a new order
router.post('/place', customerAuth, async (req, res) => {
  try {
    const customerId = req.user._id;

    const cart = await Cart.findOne({ customerId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Deep copy of cart items before clearing
    const orderedItems = JSON.parse(JSON.stringify(cart.items));

    // Update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.productId._id);
      if (!product) continue;

      const sizeEntry = product.sizes.find(s => {
        if (!s.sizeLabel && !item.size) return true;
        return s.sizeLabel === item.size;
      });

      if (!sizeEntry) {
        return res.status(400).json({ message: `Size ${item.size || 'N/A'} not found for ${product.name}` });
      }

      if (sizeEntry.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name} - ${item.size || 'N/A'}` });
      }

      sizeEntry.stock -= item.quantity;
      await product.save();
    }

    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      size: item.size || null,
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

    // Clear cart after backup
    cart.items = [];
    await cart.save();

    const customer = await Customer.findById(customerId);

    // Prepare Text Summary
    let textSummary = `
Product                         Size     Qty     Price
--------------------------------------------------------
`;
    for (const item of orderedItems) {
      const name = item.productId.name.padEnd(30);
      const size = item.size ? item.size.toString().padEnd(8) : '-'.padEnd(8);
      const qty = item.quantity.toString().padEnd(7);
      const price = `LKR ${(item.productId.price * item.quantity).toFixed(2)}`;
      textSummary += `${name}${size}${qty}${price}\n`;
    }

    textSummary += '--------------------------------------------------------\n';
    textSummary += `Total: LKR ${totalAmount.toFixed(2)}`;

    const plainText = `
✅ Order Confirmation
Hi ${customer.username},

Thank you for shopping at WardrobeX! Your order has been placed successfully.

🛒 Order Summary:
${textSummary}

We’ll notify you once your order is being prepared.

Thanks again!
— The WardrobeX Team

If you didn’t place this order, please contact us immediately.
`;

    // Prepare HTML Summary
    let htmlSummary = `
<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr>
      <th align="left">Product</th>
      <th align="left">Size</th>
      <th align="left">Qty</th>
      <th align="left">Price</th>
    </tr>
  </thead>
  <tbody>
`;

    for (const item of orderedItems) {
      const size = item.size ? item.size : '-';
      const price = `LKR ${(item.productId.price * item.quantity).toFixed(2)}`;
      htmlSummary += `
      <tr>
        <td>${item.productId.name}</td>
        <td>${size}</td>
        <td>${item.quantity}</td>
        <td>${price}</td>
      </tr>`;
    }

    htmlSummary += `
    <tr>
      <td colspan="3" style="padding-top: 10px;"><strong>Total:</strong></td>
      <td style="padding-top: 10px;"><strong>LKR ${totalAmount.toFixed(2)}</strong></td>
    </tr>
  </tbody>
</table>
`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">✅ Order Confirmation</h2>
        <p>Hi <strong>${customer.username}</strong>,</p>
        <p>Thank you for shopping at <strong>WardrobeX</strong>! Your order has been placed successfully.</p>

        <h4>🛒 Order Summary:</h4>
        ${htmlSummary}

        <p>We’ll notify you once your order is being prepared.</p>

        <p>Thanks again!<br/>— The WardrobeX Team</p>

        <p style="font-size: 12px; color: #999;">
          If you didn’t place this order, please contact us immediately.
        </p>
      </div>
    `;

    // await sendEmail(
    //   customer.email,
    //   '✅ Your WardrobeX Order Confirmation',
    //   plainText,
    //   htmlContent
    // );

    res.status(201).json({ message: 'Order placed and email sent successfully', order: newOrder });
  } catch (err) {
    console.error('Order placement error:', err);
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
