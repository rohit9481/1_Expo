// routes/chartRoutes.js
const express = require('express');
const router = express.Router();
const chartController = require('../controllers/chartController');
const auth = require('../controllers/authMiddleware');

router.get('/realtime', auth, chartController.getRealTimeData);
router.get('/daily', auth, chartController.getDailyConsumption);
router.get('/devices', auth, chartController.getDeviceConsumption);

module.exports = router;