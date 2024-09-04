const Post = require('../models/Post');
const User = require('../models/User');
const responseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const moment = require('moment'); // For date manipulation

/**
 * Get the user's feed
 * - Retrieves the newest posts from people the user follows.
 * - If the user doesn't follow anyone, retrieves the hottest posts from the last 3 days.
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object.
 */
const getUserFeed = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('following');
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }

        const following = user.following;

        let feedPosts;
        if (following.length > 0) {
            feedPosts = await Post.find({
                author: { $in: following }
            })
            .sort({ createdAt: -1 }) 
            .limit(50);
        } else {
            const threeDaysAgo = moment().subtract(3, 'days').toDate();

            feedPosts = await Post.find({
                createdAt: { $gte: threeDaysAgo }
            })
            .sort({ likes: -1 })
            .limit(50);
        }

        responseFormatter.successResponse(res, 200, "Feed retrieved successfully", feedPosts);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

module.exports = {
    getUserFeed,
};
