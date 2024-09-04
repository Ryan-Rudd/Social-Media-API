const mongoose = require('mongoose');

// Define the schema for an athlete profile with flexible stats
const athleteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    stats: {
        type: Map,  // Use a Map to store key-value pairs
        of: mongoose.Schema.Types.Mixed,  // Allows any type (number, string, etc.)
        required: true  // Ensure stats are provided
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Update `updatedAt` before saving any changes
athleteSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the Athlete model
module.exports = mongoose.model('Athlete', athleteSchema);