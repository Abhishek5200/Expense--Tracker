const mongoose = require('mongoose');

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Health & Fitness',
  'Shopping',
  'Education',
  'Travel',
  'Other',
];

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, enum: CATEGORIES, default: 'Other' },
    type: { type: String, enum: ['expense', 'income'], default: 'expense' },
    date: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true, maxlength: 500 },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'],
      default: 'Other',
    },
  },
  { timestamps: true }
);

// Compound indexes to speed up the most common query patterns
// (list by user sorted by date, filter by user+category, and text search on title)
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });
ExpenseSchema.index({ user: 1, type: 1 });
ExpenseSchema.index({ title: 'text', notes: 'text' });

module.exports = mongoose.model('Expense', ExpenseSchema);
module.exports.CATEGORIES = CATEGORIES;