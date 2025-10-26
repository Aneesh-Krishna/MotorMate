const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String, // eg "My City Car"
  make: String,
  model: String,
  year: Number,
  registrationNumber: String,
  createdAt: { type: Date, default: Date.now },
  lastServiceAt: Date,
  odometer: Number // optional
});
module.exports = mongoose.model('Vehicle', vehicleSchema);
