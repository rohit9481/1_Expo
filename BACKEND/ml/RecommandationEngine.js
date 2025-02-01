// ml/RecommendationEngine.js
class RecommendationEngine {
    async generateRecommendations(userId) {
      const user = await User.findById(userId);
      const recentData = await EnergyData.find({ userId })
        .sort({ timestamp: -1 })
        .limit(100);
  
      const recommendations = [];
  
      // Device-specific recommendations
      if (this.detectHighConsumption(recentData)) {
        recommendations.push({
          type: 'device_optimization',
          message: 'Consider upgrading to energy-efficient appliances'
        });
      }
  
      // Behavior-based recommendations
      if (user.userType === 'green_advocate') {
        recommendations.push({
          type: 'environmental_impact',
          message: 'Your current carbon footprint reduction equals planting 5 trees!'
        });
      }
  
      return recommendations;
    }
  }