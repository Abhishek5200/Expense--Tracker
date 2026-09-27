const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// @route  GET /api/expenses
// Supports: search (q), category, type, date range, pagination, sorting
router.get('/', async (req, res) => {
  try {
    const {
      q,
      category,
      type,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    const filter = { user: req.user._id };

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (q) {
      filter.$text = { $search: q };
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // .lean() avoids hydrating full Mongoose documents, cutting response time
    // on list queries; combined with the user+date compound index this keeps
    // the common "recent transactions" query fast as the collection grows.
    const [items, total] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Expense.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
});

// @route  GET /api/expenses/summary
// Category-wise + monthly aggregation used to power dashboard charts
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user._id;

    const [byCategory, byMonth, totals] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userId, type: 'expense' } },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Expense.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Expense.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
    ]);

    const income = totals.find((t) => t._id === 'income')?.total || 0;
    const expense = totals.find((t) => t._id === 'expense')?.total || 0;

    res.json({ byCategory, byMonth, income, expense, balance: income - expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error building summary' });
  }
});

// @route  POST /api/expenses
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('date').optional().isISO8601().withMessage('Date must be valid'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const expense = await Expense.create({ ...req.body, user: req.user._id });
      res.status(201).json({ expense });
    } catch (err) {
      res.status(500).json({ message: 'Server error creating expense' });
    }
  }
);

// @route  GET /api/expenses/admin/all  (admin only, role-based access control demo)
router.get('/admin/all', authorize('admin'), async (req, res) => {
  try {
    const expenses = await Expense.find().populate('user', 'name email').sort({ date: -1 }).lean();
    res.json({ items: expenses, total: expenses.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching all expenses' });
  }
});

// @route  GET /api/expenses/:id
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense id' });
    }
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching expense' });
  }
});

// @route  PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense id' });
    }
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating expense' });
  }
});

// @route  DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense id' });
    }
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting expense' });
  }
});

module.exports = router;