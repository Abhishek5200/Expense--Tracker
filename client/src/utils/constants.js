export const CATEGORIES = [
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

export const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'];

// A restrained, ledger-appropriate palette for category chart slices
export const CATEGORY_COLORS = {
  'Food & Dining': '#B8862E',
  Transportation: '#6E7F6A',
  Housing: '#1F3D36',
  Utilities: '#9C4A3C',
  Entertainment: '#D9AE5C',
  'Health & Fitness': '#4A6B5F',
  Shopping: '#7A5C3E',
  Education: '#33544A',
  Travel: '#C97B5F',
  Other: '#A6A28C',
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);