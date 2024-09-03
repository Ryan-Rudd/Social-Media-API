const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Define rate limits for certain routes if needed
const updateProfileLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit to 10 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many update attempts, please try again later.',
        error: 'Please try again later',
    },
});

// Apply authMiddleware to all routes that require authentication
router.use(authMiddleware);

// Define the routes

// Get User Profile
router.get('/:userId', (req, res) => {
    const { userId } = req.params;
    userController.getUserProfile(res, userId);
});

// Update User Profile
router.put('/:userId/update', updateProfileLimiter, (req, res) => {
    const { userId } = req.params;
    const updates = req.body;
    userController.updateUserProfile(req, res, userId, updates);
});

// Follow/Unfollow Users
router.post('/:userId/follow', (req, res) => {
    const { userId } = req.params;
    const { targetUserId } = req.body; // ID of the user to follow/unfollow
    userController.followUnfollowUser(req, res, userId, targetUserId);
});

// List Followers/Following
router.get('/:userId/:listType(followers|following)', (req, res) => {
    const { userId, listType } = req.params;
    userController.listFollowersFollowing(req, res, userId, listType);
});

// Get Notifications
router.get('/:userId/notifications', (req, res) => {
    const { userId } = req.params;
    userController.getNotifications(req, res, userId);
});

// Mark Notifications as Read/Unread
router.post('/:userId/notifications/mark', (req, res) => {
    const { userId } = req.params;
    const { notificationIds, isRead } = req.body;
    userController.markNotifications(req, res, userId, notificationIds, isRead);
});

// Manage User Preferences
router.put('/:userId/preferences', (req, res) => {
    const { userId } = req.params;
    const preferences = req.body;
    userController.manageUserPreferences(req, res, userId, preferences);
});

module.exports = router;
