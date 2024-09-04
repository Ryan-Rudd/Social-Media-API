const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const authMiddleware = require('../middleware/authMiddleware');

// Get user feed (newest posts from followed users, or hottest posts from last 3 days)
router.get('/', authMiddleware, feedController.getUserFeed);

module.exports = router;