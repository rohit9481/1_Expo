require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const connectDB = require('./config/db');
const authenticateToken = require('./controllers/authMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const energyRoutes = require('./routes/EnergyRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const chartRoutes = require('./routes/chartRoutes'); // Ensure this file exists

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// MQTT Client Setup
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('Connected to MQTT broker!');
  client.subscribe(['energy/smartmeter', 'energy/smartplug'], (err) => {
    if (err) console.error('MQTT subscription error:', err);
  });
});

// Load Machine Learning Model
const AnomalyDetector = require('./ml/AnomalyDetector');
const detector = new AnomalyDetector();
detector.trainModel().catch((err) => console.error('Anomaly detector training error:', err));

const EnergyData = require('./models/EnergyData'); // Ensure this model is properly defined

// Process MQTT Messages
client.on("message", async (topic, message) => {
  try {
    console.log("Received message on topic:", topic);
    const data = JSON.parse(message.toString());

    const source = topic.split('/')[1] || "unknown";
    if (!source) throw new Error("Source is missing in the MQTT topic.");

    const anomaly = await detector.detectAnomaly(data.powerConsumption);

    await EnergyData.create({ ...data, source });

    if (anomaly) {
      console.log(`🚨 Anomaly detected for ${data.deviceId}`);
      // Trigger alerts/notifications here
    }
  } catch (err) {
    console.error("MQTT processing error:", err);
  }
});

// Routes with Authentication
app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/devices', authenticateToken, deviceRoutes);
app.use('/api/challenges', authenticateToken, challengeRoutes);
app.use('/api/charts', chartRoutes);

// Test Route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected!');
  ws.on('message', (message) => console.log('Received from client:', message));
  ws.on('close', () => console.log('WebSocket client disconnected'));
});

// Handle MQTT Messages & Broadcast via WebSocket
client.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'DEVICE_UPDATE',
          data: {
            deviceId: data.deviceId,
            powerConsumption: data.powerConsumption,
            state: data.powerConsumption > 0 ? 'on' : 'off'
          }
        }));
      }
    });

    await EnergyData.create(data);
  } catch (err) {
    console.error("Message processing error:", err);
  }
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Attach WebSocket Server to Express
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
