const Device = require('../models/Device');

// Register a new device
const registerDevice = async (req, res) => {
  const { deviceId, type, location } = req.body;
  try {
    const device = new Device({ deviceId, type, location, isActive: true });
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Fetch all devices
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerDevice, getDevices };