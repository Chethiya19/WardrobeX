const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const addressSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  province: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    required: true
  }
});

// Auto-increment plugin
addressSchema.plugin(AutoIncrement, { inc_field: 'addressId' });

module.exports = mongoose.model('Address', addressSchema);
