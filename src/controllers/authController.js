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

        // Find the user by username and select the password field
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
            (err, token) => {
                if (err) throw err;
                responseFormatter.successResponse(res, 200, "Login successful", { token });
            }
        );
        
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
}


module.exports = { registerUser, loginUser};
