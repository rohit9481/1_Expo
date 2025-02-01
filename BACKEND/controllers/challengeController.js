const Challenge = require('../models/Challenge');

// Create a new challenge
const createChallenge = async (req, res) => {
  const { name, targetConsumption, rewardPoints, startDate, endDate } = req.body;
  try {
    const challenge = new Challenge({ name, targetConsumption, rewardPoints, startDate, endDate });
    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Join a challenge
const joinChallenge = async (req, res) => {
  const { challengeId, userId } = req.body;
  try {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    challenge.participants.push({ userId });
    await challenge.save();
    res.status(200).json(challenge);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fetch all challenges
const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// challengeController.js
const checkChallengeProgress = async (challengeId) => {
  const challenge = await Challenge.findById(challengeId);
  const participants = challenge.participants.map(p => p.userId);
  
  const consumptionData = await EnergyData.aggregate([
    { $match: { userId: { $in: participants } } },
    { $group: { 
      _id: "$userId", 
      total: { $sum: "$powerConsumption" },
      avg: { $avg: "$powerConsumption" }
    }}
  ]);

  for (const user of consumptionData) {
    if(user.total < challenge.targetConsumption) {
      await User.findByIdAndUpdate(user._id, {
        $inc: { points: challenge.rewardPoints },
        $push: { achievements: { 
          title: `Completed ${challenge.name}`,
          points: challenge.rewardPoints
        }}
      });
    }
  }
};

module.exports = { createChallenge, joinChallenge, getChallenges };