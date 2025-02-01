const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true, required: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Device', deviceSchema);