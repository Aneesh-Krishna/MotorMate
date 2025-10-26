const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// @route   POST api/expenses
// @desc    Create an expense
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { vehicle, date, type, cost, notes } = req.body;
    const newExpense = new Expense({
      user: req.userId,
      vehicle,
      date,
      type,
      cost,
      notes,
    });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/expenses
// @desc    Get all user expenses with filtering
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { vehicle, from, to } = req.query;
    const query = { user: req.userId };
    if (vehicle) {
      query.vehicle = vehicle;
    }
    if (from && to) {
      query.date = { $gte: new Date(from), $lte: new Date(to) };
    } else if (from) {
      query.date = { $gte: new Date(from) };
    } else if (to) {
      query.date = { $lte: new Date(to) };
    }

    const expenses = await Expense.find(query).populate('vehicle');
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
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
    if (expense.user.toString() !== req.userId) {
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
router.put('/:id', auth, async (req, res) => {
  const { vehicle, date, type, cost, notes } = req.body;

  // Build expense object
  const expenseFields = {};
  if (vehicle) expenseFields.vehicle = vehicle;
  if (date) expenseFields.date = date;
  if (type) expenseFields.type = type;
  if (cost) expenseFields.cost = cost;
  if (notes) expenseFields.notes = notes;

  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Check user
    if (expense.user.toString() !== req.userId) {
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
router.delete('/:id', auth, async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Check user
    if (expense.user.toString() !== req.userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndRemove(req.params.id);

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
