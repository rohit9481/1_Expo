const EnergyData = require('../models/EnergyData');
const tf = require('@tensorflow/tfjs');

const generateReport = async (req, res) => {
  try {
    const data = await EnergyData.find();
    const powerData = data.map(d => d.powerConsumption);

    // Use TensorFlow.js to analyze data
    const tensorData = tf.tensor1d(powerData);
    const mean = tensorData.mean().dataSync()[0];
    const max = tensorData.max().dataSync()[0];
    const min = tensorData.min().dataSync()[0];

    // Gamification insights
    const totalPoints = data.reduce((sum, entry) => sum + entry.points, 0);
    const topUser = await EnergyData.aggregate([
      { $group: { _id: "$userId", totalPoints: { $sum: "$points" } } },
      { $sort: { totalPoints: -1 } },
      { $limit: 1 }
    ]);

    res.json({
      meanConsumption: mean,
      maxConsumption: max,
      minConsumption: min,
      totalPointsEarned: totalPoints,
      topUser: topUser.length > 0 ? topUser[0] : null,
      insights: "Your energy usage is higher during peak hours."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { generateReport };