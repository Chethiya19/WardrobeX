const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const customerSchema = new mongoose.Schema({
  customerId: { type: Number, unique: true },
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

customerSchema.plugin(AutoIncrement, { inc_field: 'customerId' });

customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

customerSchema.methods.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Virtual populate for AccountDetail (one-to-one)
customerSchema.virtual('accountDetail', {
  ref: 'AccountDetail',
  localField: '_id',
  foreignField: 'customerId',
  justOne: true,
});

customerSchema.set('toObject', { virtuals: true });
customerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Customer', customerSchema);
