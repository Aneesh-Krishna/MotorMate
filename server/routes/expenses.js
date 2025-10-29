const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// @route   POST api/expenses
// @desc    Create an expense
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {

    const {
      vehicle,
      date,
      type,
      amount,
      odometer,
      notes,
      meta,
      description,
      status,
      // Fuel-specific fields
      fuelPricePerLitre,
      fuelLitres,
      odometerBefore,
      odometerAfter,
      vehicleId,
    } = req.body;

    // Calculate mileage if it's a fuel expense and we have the required data
    let calculatedMileage = null;
    if (type === 'fuel' && odometerBefore && odometerAfter) {
      const distance = odometerAfter - odometerBefore;
      if (distance > 0 && fuelLitres > 0) {
        calculatedMileage = Math.round((distance / fuelLitres) * 100) / 100; // Round to 2 decimal places
        console.log('📊 Calculated mileage:', calculatedMileage, 'km/l');
      }
    }

    const newExpense = new Expense({
      user: req?.body?.userId,
      vehicle,
      date,
      type,
      amount,
      odometer,
      notes,
      meta,
      description,
      status: status || 'pending',
      fuelPricePerLitre,
      fuelLitres,
      odometerBefore,
      odometerAfter,
      calculatedMileage,
      vehicleId,
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error('❌ Error saving expense:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/expenses
// @desc    Get all user expenses with filtering
// @access  Private
router.post('/all', auth, async (req, res) => {
  try {

    const { vehicle, from, to } = req?.query;
    const query = { user: req?.body?.userId };
    if (vehicle) {
      query.vehicle = vehicle;
    }
    // if (vehicleId) {
    //   query.vehicleId = vehicleId;
    // }

    const expenses = await Expense.find(query).populate('vehicle');
    res.json(expenses);
  } catch (err) {
    console.error('❌ Error fetching expenses:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/expenses/:id
// @desc    Get expense by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('vehicle');
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    // Check user
    if (expense.user.toString() !== req?.body?.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/expenses/:id
// @desc    Update an expense
// @access  Private
router.post('/edit/:id', auth, async (req, res) => {
  const {
    vehicle,
    date,
    type,
    amount,
    odometer,
    notes,
    meta,
    description,
    status,
    // Fuel-specific fields
    fuelPricePerLitre,
    fuelLitres,
    odometerBefore,
    odometerAfter
  } = req.body;

  // Build expense object
  const expenseFields = {};
  if (vehicle) expenseFields.vehicle = vehicle;
  if (date) expenseFields.date = date;
  if (type) expenseFields.type = type;
  if (amount !== undefined) expenseFields.amount = amount;
  if (odometer !== undefined) expenseFields.odometer = odometer;
  if (notes !== undefined) expenseFields.notes = notes;
  if (meta !== undefined) expenseFields.meta = meta;
  if (description !== undefined) expenseFields.description = description;
  if (status !== undefined) expenseFields.status = status;
  if (fuelPricePerLitre !== undefined) expenseFields.fuelPricePerLitre = fuelPricePerLitre;
  if (fuelLitres !== undefined) expenseFields.fuelLitres = fuelLitres;
  if (odometerBefore !== undefined) expenseFields.odometerBefore = odometerBefore;
  if (odometerAfter !== undefined) expenseFields.odometerAfter = odometerAfter;

  // Recalculate mileage if it's a fuel expense and we have the required data
  if (type === 'fuel' && odometerBefore && odometerAfter && fuelLitres) {
    const distance = odometerAfter - odometerBefore;
    if (distance > 0 && fuelLitres > 0) {
      expenseFields.calculatedMileage = Math.round((distance / fuelLitres) * 100) / 100;
    }
  }

  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Check user
    if (expense.user.toString() !== req?.body?.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.post('/delete/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Check user
    if (expense.user.toString() !== req?.body?.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Expense not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
