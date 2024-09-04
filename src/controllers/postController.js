// Manages CRUD operations for posts, including creating, editing, deleting, and retrieving posts.
const Post = require('../models/Post');
const responseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');
const sanitizer = require('sanitizer');
const User = require('../models/User');

/**
 * Create a new post
 * @param {Object} req - The request object containing post information.
 * @param {Object} res - The response object.
 */
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        // Sanitize inputs
        const sanitizedTitle = sanitizer.sanitize(title);
        const sanitizedContent = sanitizer.sanitize(content);
        const authorId = req.user._id;  // Use the user's ObjectId

        const newPost = new Post({
            title: sanitizedTitle,
            content: sanitizedContent,
            author: authorId,
        });

        const savedPost = await newPost.save();

        // Push the post ID to the user's posts array
        await User.findByIdAndUpdate(authorId, { $push: { posts: savedPost._id } });

        responseFormatter.successResponse(res, 201, "Post created successfully", savedPost);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Edit an existing post
 * @param {Object} req - The request object containing updated post information.
 * @param {Object} res - The response object.
 * @param {string} postId - The ID of the post to be updated.
 */
const editPost = async (req, res, postId) => {
    try {
        const { title, content } = req.body;

        // Sanitize inputs
        const sanitizedTitle = sanitizer.sanitize(title);
        const sanitizedContent = sanitizer.sanitize(content);

        const updatedPost = await Post.findByIdAndUpdate(postId, {
            title: sanitizedTitle,
            content: sanitizedContent,
        }, { new: true });

        if (!updatedPost) {
            return responseFormatter.errorResponse(res, 404, "Post not found");
        }

        responseFormatter.successResponse(res, 200, "Post updated successfully", updatedPost);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Delete a post
 * @param {Object} res - The response object.
 * @param {string} postId - The ID of the post to be deleted.
 */
const deletePost = async (res, postId) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return responseFormatter.errorResponse(res, 404, "Post not found");
        }

        responseFormatter.successResponse(res, 200, "Post deleted successfully");
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Like/Unlike a post
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object.
 * @param {string} postId - The ID of the post to be liked/unliked.
 */
const likeUnlikePost = async (req, res, postId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return responseFormatter.errorResponse(res, 404, "Post not found");
        }

        const userId = req.user.id;
        const isLiked = post.likes.includes(userId);

        if (isLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        const message = isLiked ? "Post unliked successfully" : "Post liked successfully";
        responseFormatter.successResponse(res, 200, message);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Comment on a post
 * @param {Object} req - The request object containing comment information.
 * @param {Object} res - The response object.
 * @param {string} postId - The ID of the post to be commented on.
 */
const commentOnPost = async (req, res, postId) => {
    try {
        const { comment } = req.body;

        // Sanitize input
        const sanitizedComment = sanitizer.sanitize(comment);

        const post = await Post.findById(postId);
        if (!post) {
            return responseFormatter.errorResponse(res, 404, "Post not found");
        }

        post.comments.push({ user: req.user.id, comment: sanitizedComment });
        await post.save();

        responseFormatter.successResponse(res, 201, "Comment added successfully", post.comments);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Delete a comment from a post
 * @param {Object} req - The request object containing comment and post information.
 * @param {Object} res - The response object.
 * @param {string} postId - The ID of the post.
 * @param {string} commentId - The ID of the comment to be deleted.
 */
const deleteComment = async (req, res, postId, commentId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return responseFormatter.errorResponse(res, 404, "Post not found");
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return responseFormatter.errorResponse(res, 404, "Comment not found");
        }

        // Check if the user deleting the comment is the author of the comment or an admin
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return responseFormatter.errorResponse(res, 403, "You are not authorized to delete this comment");
        }

        // Remove the comment using splice
        post.comments = post.comments.filter(c => c._id.toString() !== commentId);

        await post.save();

        responseFormatter.successResponse(res, 200, "Comment deleted successfully");
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};


/**
 * Share a post
 * @param {Object} req - The request object containing user and post information.
 * @param {Object} res - The response object.
 * @param {string} postId - The ID of the post to be shared.
 */
const sharePost = async (req, res, postId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return responseFormatter.errorResponse(res, 404, "Post not found");
        }

        // Create a new post as a share
        const newPost = new Post({
            title: post.title,
            content: post.content,
            author: req.user.id,
            sharedPost: post._id,
        });

        const savedPost = await newPost.save();
        responseFormatter.successResponse(res, 201, "Post shared successfully", savedPost);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

module.exports = {
    createPost,
    editPost,
    deletePost,
    likeUnlikePost,
    commentOnPost,
    deleteComment,
    sharePost
};
