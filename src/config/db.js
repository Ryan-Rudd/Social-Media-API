// Handles the configuration and connection logic for MongoDB using Mongoose.

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

const closeDB = async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error(`Error closing MongoDB connection: ${error.message}`);
    }
  };

module.exports = {connectDB, closeDB};
