const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const customerAuth = require('../middleware/customerAuthMiddleware');

// GET /api/address/view
router.get('/view', customerAuth, async (req, res) => {
  try {
    const address = await Address.findOne({ customerId: req.user._id });
    res.json(address || {});
  } catch (err) {
    console.error('Error fetching address:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/address/save (Create new or update if already exists)
router.post('/save', customerAuth, async (req, res) => {
  try {
    const { street, city, district, province, zipcode, landmark } = req.body;

    let address = await Address.findOne({ customerId: req.user._id });

    if (address) {
      // Update existing
      address.street = street;
      address.city = city;
      address.district = district;
      address.province = province;
      address.zipcode = zipcode;
      address.landmark = landmark;
      await address.save();
      res.json({ message: 'Address updated successfully' });
    } else {
      // Create new
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
      res.json({ message: 'Address created successfully' });
    }
  } catch (err) {
    console.error('Error saving address:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/address/update (Update explicitly)
router.put('/update', customerAuth, async (req, res) => {
  try {
    const { street, city, district, province, zipcode, landmark } = req.body;

    const updated = await Address.findOneAndUpdate(
      { customerId: req.user._id },
      { street, city, district, province, zipcode, landmark },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address updated successfully', updated });
  } catch (err) {
    console.error('Error updating address:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
