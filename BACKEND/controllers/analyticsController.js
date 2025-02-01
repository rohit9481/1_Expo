// controllers/analyticsController.js
const generateUserInsights = async (userId) => {
    const data = await EnergyData.find({ userId });
    
    // Daily consumption patterns
    const dailyPatterns = await EnergyData.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: { $dayOfWeek: "$timestamp" },
        avgConsumption: { $avg: "$powerConsumption" }
      }}
    ]);
  
    // Peak usage times
    const peakUsage = await EnergyData.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: { $hour: "$timestamp" },
        avgConsumption: { $avg: "$powerConsumption" }
      }},
      { $sort: { avgConsumption: -1 } },
      { $limit: 3 }
    ]);
  
    return { dailyPatterns, peakUsage };
  };