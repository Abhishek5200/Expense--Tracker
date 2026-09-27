const { authorize } = require('./auth');

// Reuses the project's existing role-checking middleware.
// Authentication is handled separately with protect.
module.exports = authorize('admin');
