class UserClassifier {
    static async classifyUser(userId) {
      const user = await User.findById(userId).populate('energyData');
      const weeklyAvg = user.energyData.slice(-7).reduce((a,b) => a + b.powerConsumption, 0)/7;
      
      let userType = 'disengaged';
      if(weeklyAvg < 15) userType = 'green_advocate';
      else if(weeklyAvg < 30) userType = 'home_focused';
      
      await User.findByIdAndUpdate(userId, { userType });
      return userType;
    }
  }