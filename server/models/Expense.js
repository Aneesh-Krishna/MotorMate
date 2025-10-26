const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  type: { type: String, enum: ['fuel','service','insurance','other'], default: 'fuel' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  odometer: Number, // optional
  notes: String,
  meta: Object
});
module.exports = mongoose.model('Expense', expenseSchema);
