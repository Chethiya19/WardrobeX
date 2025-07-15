const express = require('express');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const customerAuth = require('../middleware/customerAuthMiddleware'); // ⬅️ new middleware
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
      secure: false, // true in production (HTTPS)
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

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

// ✅ Reset password
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
