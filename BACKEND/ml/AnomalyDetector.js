// ml/AnomalyDetector.js
const tf = require('@tensorflow/tfjs');
const EnergyData = require('../models/EnergyData');

class AnomalyDetector {
  constructor() {
    this.model = null;
    this.threshold = null;
  }

  async trainModel() {
    // Fetch historical energy data
    const data = await EnergyData.find();
    const powerData = data.map(d => d.powerConsumption);

    // Convert data to TensorFlow tensors
    const trainData = tf.tensor1d(powerData);

    // Build a simple autoencoder model
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 8, activation: 'relu', inputShape: [1] }), // Encoder
        tf.layers.dense({ units: 1, activation: 'linear' }) // Decoder
      ]
    });

    // Compile the model
    this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    // Train the model
    await this.model.fit(trainData, trainData, { epochs: 50 });

    // Calculate anomaly threshold (e.g., 20% above max historical value)
    this.threshold = trainData.max().dataSync()[0] * 1.2;

    console.log('Model trained successfully!');
  }

  detectAnomaly(power) {
    if (!this.model) throw new Error('Model is not trained yet. Call trainModel() first.');

    // Predict normal power consumption
    const prediction = this.model.predict(tf.tensor1d([power]));
    const predictedPower = prediction.dataSync()[0];

    // Calculate reconstruction error
    const error = Math.abs(power - predictedPower);

    // Flag anomaly if error exceeds threshold
    return error > this.threshold;
  }
}

module.exports = AnomalyDetector;