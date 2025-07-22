const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  cardType: String,         // 'visa' or 'mastercard'
  cardHolder: String,
  cardNumber: String,       // last 4 digits visible to frontend
  expiry: String,           // MM/YY
  cvv: String,              // optional, avoid saving in production
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Card', cardSchema);
