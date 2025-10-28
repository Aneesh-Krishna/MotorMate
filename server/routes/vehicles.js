const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

// @route   POST api/vehicles
// @desc    Create a vehicle
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { color, fuelType, insuranceExpiry, make, mileage, model, name, purchaseDate, registrationNo, year, vin, odometer } = req.body;
    const newVehicle = new Vehicle({
      user: req?.body?.user,
      make,
      mileage,
      model,
      name,
      purchaseDate,
      registrationNo,
      year,
      vin,
      color,
      fuelType,
      insuranceExpiry,
      odometer,
    });
    const vehicle = await newVehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/vehicles/all
// @desc    Get all user vehicles
// @access  Private
router.post('/all', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req?.body?.userId });
    res.json(vehicles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    // Check user
    if (vehicle.user.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/vehicles/:id
// @desc    Update a vehicle
// @access  Private
router.post('/:id', auth, async (req, res) => {
  const { color, fuelType, insuranceExpiry, make, mileage, model, name, purchaseDate, registrationNo, year, vin, odometer } = req.body;

  // Build vehicle object
  const vehicleFields = {};
  if (color) vehicleFields.color = color;
  if (fuelType) vehicleFields.fuelType = fuelType;
  if (insuranceExpiry) vehicleFields.insuranceExpiry = insuranceExpiry;
  if (mileage) vehicleFields.mileage = mileage;
  if (name) vehicleFields.name = name;
  if (purchaseDate) vehicleFields.purchaseDate = purchaseDate;
  if (registrationNo) vehicleFields.registrationNo = registrationNo;
  if (odometer) vehicleFields.odometer = odometer;
  if (make) vehicleFields.make = make;
  if (model) vehicleFields.model = model;
  if (year) vehicleFields.year = year;
  if (vin) vehicleFields.vin = vin;

  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });

    // Check user
    if (vehicle.user.toString() !== req?.body?.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: vehicleFields },
      { new: true }
    );

    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/vehicles/:id
// @desc    Delete a vehicle
// @access  Private
router.post('/:id', auth, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });

    // Check user
    if (vehicle.user.toString() !== req?.body?.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Vehicle removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Vehicle not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
