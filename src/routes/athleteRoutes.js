const express = require('express');
const router = express.Router();
const athleteController = require('../controllers/athleteController');
const authMiddleware = require('../middleware/authMiddleware');

// Create athlete profile
router.post('/', authMiddleware, athleteController.createAthleteProfile);

// Get athlete profile
router.get('/', authMiddleware, athleteController.getAthleteProfile);

// Update athlete profile
router.put('/', authMiddleware, athleteController.updateAthleteProfile);

// Delete athlete profile
router.delete('/', authMiddleware, athleteController.deleteAthleteProfile);

module.exports = router;
