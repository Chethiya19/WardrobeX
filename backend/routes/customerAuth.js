const express = require('express');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const customerAuth = require('../middleware/customerAuthMiddleware');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Customer already exists' });
    }

    const newCustomer = new Customer({ username, email, password });
    await newCustomer.save();

    const token = jwt.sign(
      { id: newCustomer._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send Welcome Email
    await sendEmail(
      email,
      'Welcome to WardrobeX – Style Starts Here!',
      `Hi ${username},\n\nWelcome to WardrobeX! Thank you for joining our fashion community.`,
      `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #e91e63;">👋 Hey ${username}, Welcome to <span style="color: #3f51b5;">WardrobeX</span>!</h2>
        <p>We're thrilled to have you join our fashion-forward family.</p>
        <p>Get ready to explore the latest trends, seasonal styles, and exclusive offers designed just for you.</p>
        <hr style="border: none; border-top: 1px solid #ccc;" />
        <p>🛍️ Start shopping your style now:</p>
        <a href="http://localhost:5173" style="display: inline-block; padding: 12px 20px; background-color: #3f51b5; color: white; text-decoration: none; border-radius: 4px;">Visit WardrobeX</a>
        <p style="margin-top: 30px;">Happy shopping!<br/>— The WardrobeX Team</p>
        <p style="font-size: 12px; color: #999;">If you didn’t sign up for this account, you can ignore this email.</p>
      </div>
      `
    );

    res.status(201).json({ message: 'Customer registered successfully', role: 'customer' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer || !(await customer.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: customer._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

//     await sendEmail(
//   email,
//   'Login Alert - WardrobeX',
//   `Hi ${customer.username},\n\nYou have successfully logged into your WardrobeX account.`,
//   `
//   <div style="font-family: Arial, sans-serif; color: #333;">
//     <h2 style="color: #4caf50;">👋 Hello ${customer.username},</h2>
//     <p>You’ve just logged in to your <strong>WardrobeX</strong> account.</p>
//     <p>If this was you — awesome! You can now start browsing and shopping the latest fashion trends curated just for you.</p>
//     <hr style="border: none; border-top: 1px solid #ccc;" />
//     <p>🎁 <strong>Want to pick up where you left off?</strong></p>
//     <a href="http://localhost:5173" style="display: inline-block; padding: 12px 20px; background-color: #3f51b5; color: white; text-decoration: none; border-radius: 4px;">Go to WardrobeX</a>
//     <p style="margin-top: 30px;">🛍️ Happy Shopping!<br/>— Team WardrobeX</p>
//     <p style="font-size: 12px; color: #999;">If this wasn’t you, we recommend updating your password immediately.</p>
//   </div>
//   `
// );


    res.json({ message: 'Login successful', role: 'customer' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Customer logged out successfully' });
});

// Get current customer details using auth middleware
router.get('/me', customerAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id || req.user.id).select('username email customerId');
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', customerAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const customer = await Customer.findById(req.user._id || req.user.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const isMatch = await customer.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    customer.password = newPassword; // This will be hashed in pre-save hook
    await customer.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;
