const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const verifyAdmin = require('../middleware/adminAuthMiddleware');

// ✅ Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/products/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 🔥 Keep original file name (e.g., 'Green Shirt.png')
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// Add Product (POST)
router.post('/add', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, gender, brand, price } = req.body;

    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const imageName = req.file.originalname; // or req.file.filename if you want unique names

    let sizes = [];
    if (req.body.sizes) {
      try {
        sizes = JSON.parse(req.body.sizes);
      } catch {
        return res.status(400).json({ message: 'Invalid sizes format' });
      }
    }

    const product = new Product({
      name,
      description,
      category,
      gender,
      brand,
      price,
      sizes,
      images: [imageName] // ✅ Save only name in DB
    });

    await product.save();
    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Server error while adding product' });
  }
});

// Get All Products (GET)
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Update Product (PUT)
router.put('/update/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, gender, brand, price } = req.body;

    let sizes = [];
    if (req.body.sizes) {
      try {
        sizes = JSON.parse(req.body.sizes);
      } catch {
        return res.status(400).json({ message: 'Invalid sizes format' });
      }
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.category = category ?? product.category;
    product.gender = gender ?? product.gender;
    product.brand = brand ?? product.brand;
    product.price = price ?? product.price;
    product.sizes = sizes.length > 0 ? sizes : product.sizes;

    // If new image uploaded, replace old one
    if (req.file) {
      // Optionally delete old image file here if you want
      const newImagePath = req.file.originalname; ;
      product.images = [newImagePath];
    }

    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});

// Delete Product (DELETE)
router.delete('/delete/:id', verifyAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    // Optionally delete image file from disk here if desired

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

// GET /api/admin/products/out-of-stock
router.get('/out-of-stock', async (req, res) => {
  try {
    // IMPORTANT: include _id to use in frontend for updates
    const products = await Product.find(
      { 'sizes.stock': 0 },
      {
        _id: 1,
        productId: 1,
        name: 1,
        brand: 1,
        category: 1,
        gender: 1,
        price: 1,
        images: 1,
        sizes: 1,
      }
    );

    // Filter only sizes with zero stock for each product
    const filtered = products
      .map((product) => ({
        _id: product._id,
        productId: product.productId,
        name: product.name,
        brand: product.brand,
        category: product.category,
        gender: product.gender,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        outOfStockSizes: product.sizes.filter((size) => size.stock === 0),
      }))
      .filter(p => p.outOfStockSizes.length > 0);

    res.json(filtered);
  } catch (error) {
    console.error('Error fetching out-of-stock products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Single Product by ID (GET)
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// PATCH /api/admin/products/update-stock/:id
router.patch('/update-stock/:id', verifyAdmin, async (req, res) => {
  try {
    const { sizes } = req.body; 

    if (!sizes || !Array.isArray(sizes)) {
      return res.status(400).json({ message: 'Invalid sizes format' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let updated = false;

    sizes.forEach(({ sizeLabel, stock }) => {
      const sizeToUpdate = product.sizes.find((s) => s.sizeLabel === sizeLabel);
      if (sizeToUpdate) {
        sizeToUpdate.stock = stock;
        updated = true;
      }
    });

    if (!updated) {
      return res.status(400).json({ message: 'No matching sizes found in product' });
    }

    await product.save();
    res.json({ message: 'Stock updated successfully', product });
  } catch (err) {
    console.error('Error updating stock:', err);
    res.status(500).json({ message: 'Server error while updating stock' });
  }
});

module.exports = router;