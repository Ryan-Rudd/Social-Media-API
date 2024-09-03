const express = require('express'); 
const router = express.Router();
const rateLimit = require('express-rate-limit');
const responseFormatter = require('../utils/responseFormatter');

const authController = require('../controllers/authController');

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        message: 'Too many registration attempts, please try again later.',
        error: 'Please try again later'
    }
});


const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        success: false,
        message: 'Too many login attempts, please try again later.',
        error: 'Please try again later'
    }
});

router.post('/register', registerLimiter, function(req, res)
{
    const { name, username, password, email } = req.body;
    authController.registerUser(res, name, username, password, email);
})

router.post('/login', loginLimiter, function(req, res)
{
    const { username, password } = req.body;
    authController.loginUser(res, username, password);
})
module.exports = router