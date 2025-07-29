const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const customerAuth = require('../middleware/customerAuthMiddleware');

// GET all addresses of logged-in customer
router.get('/view', customerAuth, async (req, res) => {
  try {
    // Find all addresses where customerId matches logged-in user's ID
    const addresses = await Address.find({ customerId: req.user._id });

    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add new address for logged-in customer
router.post('/add', customerAuth, async (req, res) => {
  try {
    const { street, city, district, province, zipcode, landmark } = req.body;

    const newAddress = new Address({
      customerId: req.user._id,
      street,
      city,
      district,
      province,
      zipcode,
      landmark,
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address created successfully', address: newAddress });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update address by ID
router.put('/update/:id', customerAuth, async (req, res) => {
  try {
    const { street, city, district, province, zipcode, landmark } = req.body;

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, customerId: req.user._id },
      { street, city, district, province, zipcode, landmark },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found or not authorized' });
    }

    res.json({ message: 'Address updated successfully', address: updatedAddress });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE address by ID
router.delete('/delete/:id', customerAuth, async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndDelete({
      _id: req.params.id,
      customerId: req.user._id,
    });

    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found or not authorized' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
