const User = require('../models/User');
const responseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const mongoose = require('mongoose');
const sanitizer = require('sanitizer');
const Post = require('../models/Post'); // Assuming you have a Post model

/**
 * Get User Profile
 * @param {Object} res - The response object.
 * @param {string} userId - The ID of the user whose profile is being retrieved.
 */
const getUserProfile = async (res, userId) => {
    try {
        const user = await User.findById(userId).select('-password -sessionToken');
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }
        responseFormatter.successResponse(res, 200, "User profile retrieved successfully", user);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Update User Profile
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object.
 * @param {string} userId - The ID of the user whose profile is being updated.
 * @param {Object} updates - The updates to be applied to the user's profile.
 */
const updateUserProfile = async (req, res, userId, updates) => {
    try {
        if (!req.user) {
            return responseFormatter.errorResponse(res, 401, 'User not authenticated');
        }

        // Check if the logged-in user is the same as the user being updated
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return responseFormatter.errorResponse(res, 403, "You are not authorized to update this profile");
        }

        const sanitizedUpdates = {};
        for (const key in updates) {
            sanitizedUpdates[key] = sanitizer.sanitize(updates[key]);
        }

        const user = await User.findByIdAndUpdate(userId, sanitizedUpdates, { new: true }).select('-password -sessionToken');
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }
        responseFormatter.successResponse(res, 200, "User profile updated successfully", user);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Follow/Unfollow Users
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object.
 * @param {string} userId - The ID of the user who wants to follow/unfollow.
 * @param {string} targetUserId - The ID of the user to be followed/unfollowed.
 */
const followUnfollowUser = async (req, res, userId, targetUserId) => {
    try {
        // Check if the logged-in user is the same as the user performing the follow/unfollow
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return responseFormatter.errorResponse(res, 403, "You are not authorized to follow/unfollow for this user");
        }

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!user || !targetUser) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }

        const isFollowing = user.following.includes(targetUserId);
        if (isFollowing) {
            // Unfollow
            user.following.pull(targetUserId);
            targetUser.followers.pull(userId);
        } else {
            // Follow
            user.following.push(targetUserId);
            targetUser.followers.push(userId);
        }

        await user.save();
        await targetUser.save();

        const message = isFollowing ? "User unfollowed successfully" : "User followed successfully";
        responseFormatter.successResponse(res, 200, message);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * List Followers/Following
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object.
 * @param {string} userId - The ID of the user whose followers/following are being listed.
 */
const listFollowersFollowing = async (req, res, userId, listType) => {
    try {
        // Check if the logged-in user is the same as the user whose followers/following are being listed


        const user = await User.findById(userId).populate(listType, 'username name avatar');
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }

        const result = listType === 'followers' ? user.followers : user.following;
        responseFormatter.successResponse(res, 200, `${listType.charAt(0).toUpperCase() + listType.slice(1)} list retrieved successfully`, result);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Get Notifications
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object.
 * @param {string} userId - The ID of the user whose notifications are being retrieved.
 */
const getNotifications = async (req, res, userId) => {
    try {
        // Check if the logged-in user is the same as the user whose notifications are being retrieved
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return responseFormatter.errorResponse(res, 403, "You are not authorized to view these notifications");
        }

        const user = await User.findById(userId).populate('notifications');
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }

        responseFormatter.successResponse(res, 200, "Notifications retrieved successfully", user.notifications);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Mark Notifications as Read/Unread
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object.
 * @param {string} userId - The ID of the user whose notifications are being marked.
 * @param {Array} notificationIds - The IDs of the notifications to be marked.
 * @param {boolean} isRead - Whether to mark notifications as read or unread.
 */
const markNotifications = async (req, res, userId, notificationIds, isRead) => {
    try {
        // Check if the logged-in user is the same as the user whose notifications are being marked
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return responseFormatter.errorResponse(res, 403, "You are not authorized to update these notifications");
        }

        const user = await User.findById(userId);
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }

        user.notifications.forEach(notification => {
            if (notificationIds.includes(notification._id.toString())) {
                notification.isRead = isRead;
            }
        });

        await user.save();
        responseFormatter.successResponse(res, 200, `Notifications marked as ${isRead ? 'read' : 'unread'} successfully`);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Manage User Preferences
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object.
 * @param {string} userId - The ID of the user whose preferences are being managed.
 * @param {Object} preferences - The preferences to be updated.
 */
const manageUserPreferences = async (req, res, userId, preferences) => {
    try {
        // Check if the logged-in user is the same as the user whose preferences are being updated
        if (req.user.id !== userId && req.user.role !== 'admin') {
            return responseFormatter.errorResponse(res, 403, "You are not authorized to update these preferences");
        }

        const user = await User.findByIdAndUpdate(userId, { preferences }, { new: true }).select('-password -sessionToken');
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }

        responseFormatter.successResponse(res, 200, "User preferences updated successfully", user);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Get User's Posts
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response
 *  object.
 * @param {string} userId - The ID of the user whose posts are being retrieved.
 */
const getUserPosts = async (req, res, userId) => {
    try {
        // Find the user to ensure they exist
        const user = await User.findById(userId);
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }

        // Find all posts by the user
        const posts = await Post.find({ author: userId });

        responseFormatter.successResponse(res, 200, "User posts retrieved successfully", posts);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    followUnfollowUser,
    listFollowersFollowing,
    getNotifications,
    markNotifications,
    manageUserPreferences,
    getUserPosts
};
