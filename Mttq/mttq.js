const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker!');
  client.subscribe('energy/data', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to energy/data topic');
    }
  });
});

client.on('message', (topic, message) => {
  if (topic === 'energy/data') {
    const data = JSON.parse(message.toString());
    console.log('Received data:', data);
    // Handle the received data (e.g., update UI, store in database, etc.)
  }
});