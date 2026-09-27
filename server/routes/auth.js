const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @route  POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ message: 'An account with this email already exists' });
      }

      // First registered user becomes admin; everyone else is a standard user
      const userCount = await User.countDocuments();
      const role = userCount === 0 ? 'admin' : 'user';

      const user = await User.create({ name, email, password, role });
      const token = signToken(user);

      res.status(201).json({ user, token });
   } catch (err) {
  console.error('REGISTRATION ERROR:', err);
  res.status(500).json({ message: 'Server error during registration' });
}
  }
);

// @route  POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = signToken(user);
      res.json({ user, token });
    } catch (err) {
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// @route  GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// @route  PUT /api/auth/me
router.put('/me', protect, async (req, res) => {
  try {
    const { name, monthlyBudget } = req.body;
    if (name !== undefined) req.user.name = name;
    if (monthlyBudget !== undefined) req.user.monthlyBudget = monthlyBudget;
    await req.user.save();
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

module.exports = router;