// Main entry point of the application. Initializes the server and connects to the database.

const express = require('express');
const router = express.Router();
const db = require('./config/db');
const logger = require('./utils/logger');
const configs = require('./config/index')

const entry = () => {
    db.connectDB().then(() => {
        logger.info('Connected to Mongo server');
    });
}

const init = (app) => {
    app.use(`${configs.versioning_segment}/auth`, require('./routes/authRoutes'))
    app.use(`${configs.versioning_segment}/users`, require('./routes/userRoutes'))
    app.use(`${configs.versioning_segment}/posts`, require('./routes/postRoutes'))
}

module.exports = { entry, init }