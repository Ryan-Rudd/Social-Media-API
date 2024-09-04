const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Define rate limits for certain routes if needed
const createPostLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit to 10 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many post creation attempts, please try again later.',
        error: 'Please try again later',
    },
});

// Define the routes

// Create Post
router.post('/create', authMiddleware, createPostLimiter, (req, res) => {
    const author = req.user.username;  // Extract the username from the authenticated user
    postController.createPost(req, res, author);
});


// Edit Post
router.put('/:postId/edit', authMiddleware, (req, res) => {
    const { postId } = req.params;
    const updates = req.body;
    postController.editPost(req, res, postId, updates);
});

// Delete Post
router.delete('/:postId/delete', authMiddleware, (req, res) => {
    const { postId } = req.params;
    postController.deletePost(res, postId);
});

// Like/Unlike Post
router.post('/:postId/like', authMiddleware, (req, res) => {
    const { postId } = req.params;
    postController.likeUnlikePost(req, res, postId);
});

// Comment on Post
router.post('/:postId/comments', authMiddleware, (req, res) => {
    const { postId } = req.params;
    postController.commentOnPost(req, res, postId);
});

// Delete Comment
router.delete('/:postId/comments/:commentId/delete', authMiddleware, (req, res) => {
    const { postId, commentId } = req.params;
    postController.deleteComment(req, res, postId, commentId);
});

// Share Post
router.post('/:postId/share', authMiddleware, (req, res) => {
    const { postId } = req.params;
    postController.sharePost(req, res, postId);
});

module.exports = router;
