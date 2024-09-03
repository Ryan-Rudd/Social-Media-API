// Manages user authentication, including registration, login, and logout.
const User = require('../models/User');
const responseFormatter = require('../utils/responseFormatter');
const database = require('../config/db');
const mongoose = require('mongoose');
const pwValidate = require('../validators/passValidator');
const usernameValidate = require('../validators/usernameValidator');

const logger = require('../utils/logger');

/**
 * Registers a new user.
 * @param {string} name - The name of the new user.
 * @param {string} username - The username for the new user.
 * @param {string} password - The password for the new user.
 * @param {string} email - The email for the new user.
*/
const registerUser = async(res, name, username, password, email) => {
    // Validate the username
    let usernameValidation = await usernameValidate(username);
    if (usernameValidation.length > 0) {
        return responseFormatter.errorResponse(res, 400, "Invalid Username", usernameValidation);
    }

    // Validate the password
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

module.exports = { registerUser };
