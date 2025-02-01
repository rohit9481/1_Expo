const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  userType: {
    type: String,
    enum: ['green_advocate', 'home_focused', 'disengaged'],
    required: true
  },
  points: { type: Number, default: 0 },
  achievements: [{
    title: String,
    description: String,
    earnedAt: Date
  }],
  preferences: {
    temperaturePreference: Number,
    savingGoals: Number,
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);