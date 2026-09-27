// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 80,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      required: true,
      default: 'expense',
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    tags: {
      type: [String],
      default: [],
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    // Placeholder for when authentication is added later.
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model('Transaction', transactionSchema);