const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const util = require('util');
const signToken = util.promisify(jwt.sign);

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'Email is already taken' });
    }

    user = new User({
      email,
      password,
    });

    await user.save();

    req.session.user = user;

    res.json({ user });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const jwToken = await signToken(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );

    req.session.user = user;

    res.json({ user, token: jwToken });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Server error');
    }
  res.status(200).json({ msg: 'Logged out successfully' });
  });
});

module.exports = router;
