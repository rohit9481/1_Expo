const tf = require('@tensorflow/tfjs'); // TensorFlow.js for loading the model
const { exec } = require('child_process');

// Function to generate synthetic user data
const generateUserData = () => {
    return new Promise((resolve, reject) => {
        exec('python3 BACKEND/ml/1_Expo/GenUserApplianceData.py', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating user data: ${error}`);
                return reject('Error generating user data');
            }
            resolve('User data generated successfully');
        });
    });
};

// Function to load the LSTM model and make predictions
const makePrediction = async (inputData) => {
    try {
        const model = await tf.loadLayersModel('file://BACKEND/ml/appliances_forecast_model_final_corrected.h5');
        const prediction = model.predict(tf.tensor(inputData));
        return prediction.arraySync();
    } catch (error) {
        console.error(`Error making prediction: ${error}`);
        throw new Error('Error making prediction');
    }
};

module.exports = {
    generateUserData,
    makePrediction
};
