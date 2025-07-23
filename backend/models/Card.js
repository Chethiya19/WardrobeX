const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  cardType: String, 
  cardHolder: String,
  cardNumber: String,
  expiry: String,
  cvv: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Card', cardSchema);
