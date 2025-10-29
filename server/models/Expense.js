const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  type: { type: String, enum: ['fuel','service','insurance', 'maintenance', 'other'], default: 'fuel' },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  odometer: Number, // optional

  // Fuel-specific fields
  fuelPricePerLitre: { type: Number, default: null }, // Rs/litre
  fuelLitres: { type: Number, default: null }, // Total litres filled
  odometerBefore: { type: Number, default: null }, // Odometer reading before fueling
  odometerAfter: { type: Number, default: null }, // Odometer reading after fueling
  calculatedMileage: { type: Number, default: null }, // Calculated km/litre

  notes: String,
  description: String,
  meta: Object,
  status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' }
});
module.exports = mongoose.model('Expense', expenseSchema);
