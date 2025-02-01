const mongoose = require('mongoose');

const energyDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  powerConsumption: { type: Number, required: true },
  userId: { type: String, required: true },
  source: { type: String, enum: ['smartmeter', 'smartplug'], required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EnergyData', energyDataSchema);