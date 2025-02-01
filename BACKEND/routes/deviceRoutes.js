const express = require('express');
const { registerDevice, getDevices } = require('../controllers/deviceController');

const router = express.Router();

// Device Routes
router.post('/', registerDevice); // Register a new device
router.get('/', getDevices); // Fetch all devices

module.exports = router;