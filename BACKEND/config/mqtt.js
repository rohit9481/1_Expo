// config/mqtt.js
const mqtt = require('mqtt');

const mqttConfig = {
  url: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
  options: {
    clientId: `energy_monitor_${Math.random().toString(16).slice(3)}`,
    clean: true
  }
};

const client = mqtt.connect(mqttConfig.url, mqttConfig.options);

module.exports = client;