// Main entry point of the application. Initializes the server and connects to the database.

const express = require('express');
const router = express.Router();

// Connect to the MongoDB database
const db = require('./config/db');

// Logger function 
const logger = require('./utils/logger');

// Configure API
const configs = require('./config/index')

const entry = () => {
    db.connectDB().then(() => {
        logger.info('Connected to Mongo server');
    });
}

// Registers each module as an entry point
const init = (app) => {
    // AUTHENTICATION ROUTER
    app.use(`${configs.versioning_segment}/auth`, require('./routes/authRoutes'))
}

module.exports = { entry, init }