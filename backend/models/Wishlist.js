const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  productId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
},);

// To prevent duplicate entries for the same customer-product pair
wishlistSchema.index({ customerId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
