const EnergyData = require('../models/EnergyData');
const mongoose = require('mongoose');

class DataProcessingService {
  static async processReading(reading) {
    try {
      // Calculate hourly average
      const hourlyAvg = await EnergyData.aggregate([
        {
          $match: {
            deviceId: reading.deviceId,
            timestamp: {
              $gte: new Date(new Date().setHours(new Date().getHours() - 1))
            }
          }
        },
        {
          $group: {
            _id: null,
            avgConsumption: { $avg: "$powerConsumption" }
          }
        }
      ]);

      // Detect anomalies (sudden spikes)
      const isAnomaly = reading.powerConsumption > (hourlyAvg[0]?.avgConsumption * 2);

      return {
        ...reading,
        isAnomaly,
        processedAt: new Date()
      };
    } catch (error) {
      console.error('Data processing error:', error);
      return reading;
    }
  }

  static async aggregateDaily(userId) {
    const dailyData = await EnergyData.aggregate([
      {
        $match: { userId: mongoose.Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: {
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" }
          },
          totalConsumption: { $sum: "$powerConsumption" },
          avgConsumption: { $avg: "$powerConsumption" },
          readings: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    return dailyData;
  }
}

module.exports = DataProcessingService;