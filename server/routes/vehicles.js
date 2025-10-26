const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');

// @route   POST api/vehicles
// @desc    Create a vehicle
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { make, model, year, vin } = req.body;
    const newVehicle = new Vehicle({
      user: req.userId,
      make,
      model,
      year,
      vin,
    });
    const vehicle = await newVehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/vehicles
// @desc    Get all user vehicles
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.userId });
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
router.put('/:id', auth, async (req, res) => {
  const { make, model, year, vin } = req.body;

  // Build vehicle object
  const vehicleFields = {};
  if (make) vehicleFields.make = make;
  if (model) vehicleFields.model = model;
  if (year) vehicleFields.year = year;
  if (vin) vehicleFields.vin = vin;

  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });

    // Check user
    if (vehicle.user.toString() !== req.userId) {
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
router.delete('/:id', auth, async (req, res) => {
  try {
    let vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ msg: 'Vehicle not found' });

    // Check user
    if (vehicle.user.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Vehicle.findByIdAndRemove(req.params.id);

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
