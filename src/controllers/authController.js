// Manages user authentication, including registration, login, and logout.
const User = require('../models/User');
const responseFormatter = require('../utils/responseFormatter');
const database = require('../config/db');
const mongoose = require('mongoose');
const pwValidate = require('../validators/passValidator');
const usernameValidate = require('../validators/usernameValidator');
const sanitizer = require('sanitizer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
require('dotenv').config()

/**
 * Registers a new user.
 * @param {string} name - The name of the new user.
 * @param {string} username - The username for the new user.
 * @param {string} password - The password for the new user.
 * @param {string} email - The email for the new user.
*/
const registerUser = async(res, name, username, password, email) => {

    name = sanitizer.sanitize(name);
    username = sanitizer.sanitize(username);
    email = sanitizer.sanitize(email);
    password = sanitizer.sanitize(password);

    let usernameValidation = await usernameValidate(username);
    if (usernameValidation.length > 0) {
        return responseFormatter.errorResponse(res, 400, "Invalid Username", usernameValidation[0].message);
    }

    let passwordValidation = await pwValidate(password);
    if (passwordValidation.length > 0) {
        return responseFormatter.errorResponse(res, 400, "Invalid Password", passwordValidation);
    }

    logger.info("Posting register: Creating new user: @" + username);
    try {
        database.connectDB();

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return responseFormatter.errorResponse(res, 400, "Username already exists", "Duplicate Username");
        }

        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return responseFormatter.errorResponse(res, 400, "Email already exists", "Duplicate Email");
        }

        const newUser = new User({
            name,
            username,
            password,
            email
        });

        await newUser.save();
        responseFormatter.successResponse(res, 201, "User created successfully", 
            {
                slug: `/@${newUser.username}`,
                username: newUser.username
            }
        );
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
}

/**
 * Logs in a user.
 * @param {Object} res - The response object.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
*/
const loginUser = async(res, username, password) => {

    username = sanitizer.sanitize(username);
    password = sanitizer.sanitize(password);

    logger.info("Posting login: Attempting to log in user: @" + username);

    try {
        database.connectDB();

        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return responseFormatter.errorResponse(res, 400, "Invalid Username or Password", "Authentication failed");
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return responseFormatter.errorResponse(res, 400, "Invalid Username or Password", "Authentication failed");
        }

        const payload = {
            user: {
                id: user._id,
                username: user.username
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            async (err, token) => {
                if (err) throw err;
                
                // Save the session token in the user's record
                user.sessionToken = token;
                await user.save();

                responseFormatter.successResponse(res, 200, "Login successful", { token });
            }
        );
        
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
}

/**
 * Logs out a user by deleting their session token.
 * @param {Object} res - The response object.
 * @param {string} username - The username of the user.
*/
const logoutUser = async(res, username) => {
    username = sanitizer.sanitize(username);

    logger.info("Posting logout: Attempting to log out user: @" + username);

    try {
        database.connectDB();

        const user = await User.findOne({ username });
        if (!user) {
            return responseFormatter.errorResponse(res, 400, "User not found", "Logout failed");
        }

        // Remove the session token
        user.sessionToken = null;
        await user.save();

        responseFormatter.successResponse(res, 200, "Logout successful", "User session deleted");
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
}

/**
 * Sends a password reset link to the user's email.
 * @param {Object} res - The response object.
 * @param {string} email - The email of the user requesting password reset.
 */
const requestPasswordReset = async (res, email) => {
    email = sanitizer.sanitize(email);

    logger.info("Posting password reset request: " + email);

    try {
        database.connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found", "No account registered with that email");
        }

        const payload = {
            user: {
                id: user._id,
                username: user.username,
            }
        };

        // Generate reset token
        const resetToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Save the reset token in user's record
        user.resetToken = resetToken;
        await user.save();

        // Send email (assuming you have a mailer utility)
        const resetUrl = `${process.env.CLIENT_URL}/password-reset/${resetToken}`;
        // mailer.sendResetEmail(user.email, resetUrl); // Uncomment and use mailer service

        responseFormatter.successResponse(res, 200, "Password reset link sent to email", "Check your inbox for the reset link");
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
}



/**
 * Resets the user's password using the reset token.
 * @param {Object} res - The response object.
 * @param {string} token - The password reset token.
 * @param {string} newPassword - The new password for the user.
 */
const resetPassword = async (res, token, newPassword) => {

    newPassword = sanitizer.sanitize(newPassword);

    try {
        database.connectDB();

        // Verify reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.user.id, resetToken: token });
        if (!user) {
            return responseFormatter.errorResponse(res, 400, "Invalid or expired token", "Password reset failed");
        }

        // Validate new password
        let passwordValidation = await pwValidate(newPassword);
        if (passwordValidation.length > 0) {
            return responseFormatter.errorResponse(res, 400, "Invalid Password", passwordValidation);
        }

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token
        user.resetToken = null;
        await user.save();

        responseFormatter.successResponse(res, 200, "Password reset successful", "You can now log in with your new password");
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
}

module.exports = { requestPasswordReset, resetPassword };




module.exports = { registerUser, loginUser, logoutUser };
