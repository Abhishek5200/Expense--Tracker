// routes/transactions.js
const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// POST /api/transactions — create a new transaction
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date, tags, recurring } = req.body;
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      tags,
      recurring,
    });
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/transactions — list all transactions (optional filters)
// Supports optional query params: ?type=expense&category=Dining
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions/:id — get a single transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: 'Invalid transaction id' });
  }
});

// PUT /api/transactions/:id — update a transaction
router.put('/:id', async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Transaction not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/transactions/:id — remove a transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted', id: req.params.id });
  } catch (err) {
    res.status(400).json({ error: 'Invalid transaction id' });
  }
});

module.exports = router;