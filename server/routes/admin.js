const express = require('express');
const User = require('../models/User');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

// Every admin route requires a valid login and admin role.
router.use(protect, adminOnly);

// GET /api/admin/overview
router.get('/overview', async (req, res) => {
  try {
    const [totalUsers, totals] = await Promise.all([
      User.countDocuments(),
      Expense.aggregate([
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    const totalIncome =
      totals.find((item) => item._id === 'income')?.total || 0;

    const totalExpense =
      totals.find((item) => item._id === 'expense')?.total || 0;

    res.json({
      totalUsers,
      totalIncome,
      totalExpense,
    });
  } catch (err) {
    console.error('ADMIN OVERVIEW ERROR:', err);
    res.status(500).json({
      message: 'Unable to load admin overview',
    });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const counts = await Expense.aggregate([
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      counts.map((item) => [String(item._id), item.count])
    );

    const result = users.map((user) => ({
      ...user,
      transactionCount: countMap.get(String(user._id)) || 0,
    }));

    res.json({ users: result });
  } catch (err) {
    console.error('ADMIN USERS ERROR:', err);
    res.status(500).json({
      message: 'Unable to load users',
    });
  }
});

// GET /api/admin/users/:id/expenses
router.get('/users/:id/expenses', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name email role createdAt')
      .lean();

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const expenses = await Expense.find({
      user: req.params.id,
    })
      .sort({ date: -1 })
      .limit(100)
      .lean();

    res.json({
      user,
      expenses,
    });
  } catch (err) {
    console.error('ADMIN USER EXPENSES ERROR:', err);
    res.status(500).json({
      message: 'Unable to load user transactions',
    });
  }
});

module.exports = router;
