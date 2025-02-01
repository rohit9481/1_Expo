const EnergyData = require('../models/EnergyData');
const DataProcessingService = require('../services/dataProcessingService');

const chartController = {
  // Get data for real-time chart
  getRealTimeData: async (req, res) => {
    try {
      const userId = req.user.id;
      const lastHourData = await EnergyData.find({
        userId,
        timestamp: { $gte: new Date(Date.now() - 3600000) }
      })
      .sort({ timestamp: 1 });

      res.json(lastHourData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get daily consumption chart data
  getDailyConsumption: async (req, res) => {
    try {
      const userId = req.user.id;
      const dailyData = await DataProcessingService.aggregateDaily(userId);
      res.json(dailyData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get device-wise consumption
  getDeviceConsumption: async (req, res) => {
    try {
      const userId = req.user.id;
      const deviceData = await EnergyData.aggregate([
        {
          $match: { userId: mongoose.Types.ObjectId(userId) }
        },
        {
          $group: {
            _id: "$deviceId",
            totalConsumption: { $sum: "$powerConsumption" },
            avgConsumption: { $avg: "$powerConsumption" }
          }
        }
      ]);

      res.json(deviceData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = chartController;