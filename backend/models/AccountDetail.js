const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const accountDetailSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
});

// Auto-increment plugin
accountDetailSchema.plugin(AutoIncrement, { inc_field: 'accountId' });

module.exports = mongoose.model('AccountDetail', accountDetailSchema);
