const Athlete = require('../models/Athlete');
const User = require('../models/User');
const responseFormatter = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * Create Athlete Profile
 * - Creates a new athlete profile and links it to the user's document in the database.
 * @param {Object} req - The request object containing athlete data and user info.
 * @param {Object} res - The response object.
 */
const createAthleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;  
        const stats = req.body;  // Capture all key-value pairs as stats
        const userName = req.user.name;

        // Check if user already exists
        const user = await User.findById(userId);
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }
        if (user.athleteProfile) {
            return responseFormatter.errorResponse(res, 400, "User already has an athlete profile");
        }

        // Create a new athlete profile with the user's name and stats
        const newAthleteProfile = new Athlete({
            name: userName,
            stats,  // This will contain the dynamic key-value pairs
        });

        const savedAthleteProfile = await newAthleteProfile.save();

        // Link the athlete profile to the user's document
        user.athleteProfile = savedAthleteProfile._id;
        await user.save();

        responseFormatter.successResponse(res, 201, "Athlete profile created successfully", savedAthleteProfile);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};


/**
 * Get Athlete Profile
 * - Retrieves the athlete profile linked to the authenticated user.
 * @param {Object} req - The request object containing user info.
 * @param {Object} res - The response object.
 */
const getAthleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;  // Assume user is authenticated and req.user contains their info

        // Find the user and populate the athleteProfile field
        const user = await User.findById(userId).populate('athleteProfile');
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }
        if (!user.athleteProfile) {
            return responseFormatter.errorResponse(res, 404, "Athlete profile not found");
        }

        responseFormatter.successResponse(res, 200, "Athlete profile retrieved successfully", user.athleteProfile);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Update Athlete Profile
 * - Updates the athlete profile linked to the authenticated user.
 * @param {Object} req - The request object containing athlete data and user info.
 * @param {Object} res - The response object.
 */
const updateAthleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;  // Assume user is authenticated and req.user contains their info
        const updates = req.body;

        // Find the user and check if they have an athlete profile
        const user = await User.findById(userId);
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }
        if (!user.athleteProfile) {
            return responseFormatter.errorResponse(res, 404, "Athlete profile not found");
        }

        // Update the athlete profile
        const athleteProfile = await Athlete.findByIdAndUpdate(user.athleteProfile, updates, { new: true });
        if (!athleteProfile) {
            return responseFormatter.errorResponse(res, 404, "Athlete profile not found");
        }

        responseFormatter.successResponse(res, 200, "Athlete profile updated successfully", athleteProfile);
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

/**
 * Delete Athlete Profile
 * - Deletes the athlete profile linked to the authenticated user and removes the reference in the user document.
 * @param {Object} req - The request object containing user info.
 * @param {Object} res - The response object.
 */
const deleteAthleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;  // Assume user is authenticated and req.user contains their info

        // Find the user and check if they have an athlete profile
        const user = await User.findById(userId);
        if (!user) {
            return responseFormatter.errorResponse(res, 404, "User not found");
        }
        if (!user.athleteProfile) {
            return responseFormatter.errorResponse(res, 404, "Athlete profile not found");
        }

        // Delete the athlete profile
        await Athlete.findByIdAndDelete(user.athleteProfile);

        // Remove the reference from the user document
        user.athleteProfile = null;
        await user.save();

        responseFormatter.successResponse(res, 200, "Athlete profile deleted successfully");
    } catch (error) {
        logger.error("Server Error: " + error.message);
        responseFormatter.errorResponse(res, 500, "Server Error", error.message);
    }
};

module.exports = {
    createAthleteProfile,
    getAthleteProfile,
    updateAthleteProfile,
    deleteAthleteProfile,
};
