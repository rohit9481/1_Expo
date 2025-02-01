class GamificationService {
    static async getMotivators(userType) {
      const motivators = {
        green_advocate: {
          intrinsic: ['co2_savings', 'community_rank'],
          extrinsic: []
        },
        home_focused: {
          intrinsic: ['home_improvement', 'efficiency_tips'],
          extrinsic: ['appliance_rebates']
        },
        disengaged: {
          intrinsic: [],
          extrinsic: ['cashback', 'energy_credits']
        }
      };
      return motivators[userType] || motivators.disengaged;
    }
  }