const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const sizeSchema = new mongoose.Schema({
  sizeLabel: String,
  stock: { type: Number, default: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  productId: { type: Number, unique: true },

  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['Shirts', 'Pants', 'Frocks', 'Tops', 'Kids', 'Shoes', 'Bags', 'Accessories'],
    required: true
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Unisex'],
    required: true
  },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  sizes: [sizeSchema],
  images: [String],
});

// 👇 Apply the auto-increment plugin
productSchema.plugin(AutoIncrement, { inc_field: 'productId' });

module.exports = mongoose.model('Product', productSchema);
