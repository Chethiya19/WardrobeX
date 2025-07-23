const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Utility: slugify a string (simple)
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

// ✅ Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ productId: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Get product by slugified name
router.get('/name/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const products = await Product.find();
    const product = products.find(p => slugify(p.name) === slug);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get products by category + gender (must come before individual category/gender routes)
router.get('/category/:categorySlug/gender/:genderSlug', async (req, res) => {
  try {
    const { categorySlug, genderSlug } = req.params;

    const products = await Product.find({
      category: { $regex: new RegExp(`^${categorySlug}$`, 'i') },
      gender: { $regex: new RegExp(`^${genderSlug}$`, 'i') },
    }).sort({ productId: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products by category and gender' });
  }
});

// ✅ Get products by category only
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const { categorySlug } = req.params;

    const products = await Product.find({
      category: { $regex: new RegExp(`^${categorySlug}$`, 'i') },
    }).sort({ productId: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products by category only' });
  }
});

// ✅ Get products by gender only
router.get('/gender/:genderSlug', async (req, res) => {
  try {
    const { genderSlug } = req.params;

    const products = await Product.find({
      gender: { $regex: new RegExp(`^${genderSlug}$`, 'i') }
    }).sort({ productId: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products by gender' });
  }
});

// Get products by brand only
router.get('/brand/:brandSlug', async (req, res) => {
  try {
    const { brandSlug } = req.params;

    const products = await Product.find({
      brand: { $regex: new RegExp(`^${brandSlug}$`, 'i') },
    }).sort({ productId: 1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products by brand only' });
  }
});

// Get stock info for a specific product (size-wise)
router.get('/stock/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('sizes');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const stockMap = {};
    product.sizes.forEach(sizeObj => {
      stockMap[sizeObj.sizeLabel] = sizeObj.stock;
    });

    res.json(stockMap); // e.g. { S: 10, M: 0, L: 5 }
  } catch (err) {
    console.error('Error fetching stock info:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
