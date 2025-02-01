const mqtt = require("mqtt");

// Connect to MQTT broker
const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  console.log("Connected to MQTT broker!");
  startSimulation(); // Start simulation only after connecting
});

client.on("error", (err) => {
  console.error("MQTT error:", err);
});

const appliances = ["fridge", "ac", "lights", "tv", "heater"];

const calculatePower = (deviceId) => {
  const powerValues = {
    fridge: () => (Math.random() * 100 + 100).toFixed(2),
    ac: () => (Math.random() * 400 + 800).toFixed(2),
    lights: () => 20,
    tv: () => (Math.random() * 50 + 50).toFixed(2),
    heater: () => (Math.random() * 1000 + 500).toFixed(2),
  };
  return powerValues[deviceId] ? powerValues[deviceId]() : 0;
};

const simulateSmartPlug = () => {
  const deviceId = appliances[Math.floor(Math.random() * appliances.length)];
  const normalValue = parseFloat(calculatePower(deviceId));
  const powerConsumption = Math.random() > 0.9 ? 5000 : normalValue;
  const data = { deviceId, powerConsumption, userId: "user-1" };

  client.publish("energy/data", JSON.stringify(data), (err) => {
    if (err) console.error("Publish error:", err);
    else console.log(`Published: ${deviceId} - ${powerConsumption}W`);
  });
};

// Start simulation after connecting to the broker
const startSimulation = () => {
  setInterval(simulateSmartPlug, 5000);
};
