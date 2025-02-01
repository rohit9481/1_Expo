const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetConsumption: { type: Number, required: true },
  rewardPoints: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  participants: [{ userId: String }]
});

module.exports = mongoose.model('Challenge', challengeSchema);