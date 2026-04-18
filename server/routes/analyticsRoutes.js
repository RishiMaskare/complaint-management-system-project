const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// All analytics routes are protected and admin-only
router.get('/', authMiddleware, adminMiddleware, getAnalytics);

module.exports = router;
