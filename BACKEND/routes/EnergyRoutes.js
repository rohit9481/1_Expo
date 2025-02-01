const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energyController');

// Existing routes...

router.get('/data', energyController.getEnergyData);

// Route to generate synthetic user data
router.post('/generate-user-data', energyController.generateUserData);

// Route to make predictions
router.post('/predict', energyController.makePrediction);

module.exports = router;
