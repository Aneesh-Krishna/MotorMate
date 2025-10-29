const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  mileage: Number,
  model: { type: String, required: true },
  name: { type: String, required: true },
  purchaseDate: { type: String, required: true },
  registrationNo: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String, required: true },
  color: { type: String  },
  fuelType: { type: String },
  insuranceExpiry: { type: String },
  odometer: Number, // optional
  tankCapacity: { type: Number, default: null }, // Tank capacity in litres
  isActive: { type: Boolean, default: true } // Vehicle active status
});
module.exports = mongoose.model('Vehicle', vehicleSchema);
