// models/Achievement.js
const achievementSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    reward: { type: Number, required: true }
  });
  
  // controllers/gamificationController.js
  const updateUserAchievements = async (userId, energyData) => {
    const user = await User.findById(userId);
    // Check for achievements
    if (energyData.powerConsumption < user.preferences.savingGoals) {
      await User.findByIdAndUpdate(userId, {
        $push: { achievements: { type: 'energy_saver' } },
        $inc: { points: 100 }
      });
    }
  };