const EnergyData = require('../models/EnergyData');
const redis = require('redis');
const redisClient = redis.createClient();

(async () => {
  await redisClient.connect();
})();

// Get Energy Data by User ID
const getEnergyData = async (req, res) => {
  try {
    const data = await EnergyData.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Real-Time Data (Last 10 entries)
const getRealTimeData = async (req, res) => {
  try {
    const data = await EnergyData.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Energy Data
const addEnergyData = async (req, res) => {
  try {
    const newData = new EnergyData(req.body);
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Toggle Device State
const appliances = {
  'device1': () => 500,  // Example function, define your appliances
  'device2': () => 800
};

const toggleDeviceState = async (req, res) => {
  const { deviceId, state, userId } = req.body;
  const powerConsumption = state === 'on' ? (appliances[deviceId] ? appliances[deviceId]() : 0) : 0;

  // Calculate points
  const points = powerConsumption < 1000 ? Math.floor((1000 - powerConsumption) / 10) : 0;

  const newData = new EnergyData({ deviceId, powerConsumption, state, userId, points });

  try {
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Leaderboard with Caching
const getLeaderboard = async (req, res) => {
  try {
    const cached = await redisClient.get('leaderboard');
    if (cached) return res.json(JSON.parse(cached));

    const leaderboard = await EnergyData.aggregate([
      { $group: { _id: "$userId", totalPoints: { $sum: "$points" } } },
      { $sort: { totalPoints: -1 } }
    ]);

    await redisClient.set('leaderboard', JSON.stringify(leaderboard), { EX: 60 });
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const storeEnergyData = async (data) => {
  try {
    const processedData = await DataProcessingService.processReading(data);
    const energyRecord = await EnergyData.create(processedData);
    
    // Update user classification weekly
    if(energyRecord.timestamp.getDay() === 0) { // Weekly on Sundays
      await UserClassifier.classifyUser(energyRecord.userId);
    }
    
    // Check challenges
    const activeChallenges = await Challenge.find({ 
      endDate: { $gt: new Date() } 
    });
    activeChallenges.forEach(c => checkChallengeProgress(c._id));
    
    return energyRecord;
  } catch (error) {
    console.error('Energy storage error:', error);
    throw error;
  }
};

// Function to generate synthetic user data
const generateUserData = (req, res) => {
    exec('python3 BACKEND/ml/1_Expo/GenUserApplianceData.py', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error generating user data: ${error}`);
            return res.status(500).send('Error generating user data');
        }
        res.status(200).send('User data generated successfully');
    });
};

// Function to load the LSTM model and make predictions
const makePrediction = async (req, res) => {
    try {
        const model = await tf.loadLayersModel('file://BACKEND/ml/appliances_forecast_model_final_corrected.h5');
        const inputData = req.body; // Assuming input data is sent in the request body
        const prediction = model.predict(tf.tensor(inputData));
        res.status(200).json({ prediction: prediction.arraySync() });
    } catch (error) {
        console.error(`Error making prediction: ${error}`);
        res.status(500).send('Error making prediction');
    }
};

// Export Controllers
module.exports = { 
  getEnergyData, 
  addEnergyData, 
  toggleDeviceState, 
  getLeaderboard, 
  getRealTimeData,
  generateUserData, // Add this line
  makePrediction // Add this line
};
