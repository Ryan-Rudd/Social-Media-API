// Main entry point of the application. Initializes the server and connects to the database.

const express = require('express');
const app = express();

// Connect to the MongoDB database
const db = require('./config/db');

// Logger function 
const logger = require('./utils/logger');

const entry = () => {
    db.connectDB().then(()=>
    {
        logger.info('Connected to Mongo server');
    })
}

module.exports = { entry }