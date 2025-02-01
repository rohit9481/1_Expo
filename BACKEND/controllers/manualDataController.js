const EnergyData = require('../models/EnergyData');
const Device = require('../models/Device');

const manualDataController = {
  // Add manual reading
  addReading: async (req, res) => {
    try {
      const { deviceId, reading, timestamp, billImage } = req.body;
      const userId = req.user.id;

      // Validate reading
      if (reading < 0) {
        return res.status(400).json({ message: 'Invalid reading value' });
      }

      // Create energy data entry
      const energyData = new EnergyData({
        deviceId,
        userId,
        powerConsumption: reading,
        timestamp: timestamp || new Date(),
        source: 'manual',
        billImage // Optional: URL to uploaded bill image
      });

      await energyData.save();

      res.status(201).json(energyData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Bulk upload from utility bill
  bulkUpload: async (req, res) => {
    try {
      const { readings } = req.body;
      const userId = req.user.id;

      const formattedReadings = readings.map(reading => ({
        userId,
        powerConsumption: reading.value,
        timestamp: reading.date,
        source: 'bill',
        deviceId: 'main_meter'
      }));

      await EnergyData.insertMany(formattedReadings);

      res.status(201).json({ message: 'Bulk upload successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = manualDataController;