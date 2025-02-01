# Import necessary libraries
import pandas as pd
import numpy as np
import joblib
from tensorflow.keras.models import load_model
from sklearn.metrics import mean_absolute_error, mean_squared_error
import matplotlib.pyplot as plt

# Step 1: Load the test dataset
test_data = pd.read_csv("generated_user_data.csv")

# Step 2: Convert the 'date' column to datetime
test_data['date'] = pd.to_datetime(test_data['date'])

# Step 3: Feature Engineering (Same as the training data preprocessing)
test_data['hour'] = test_data['date'].dt.hour
test_data['day_of_week'] = test_data['date'].dt.dayofweek
test_data['month'] = test_data['date'].dt.month
test_data['is_weekend'] = test_data['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)  # Weekend feature

# Add lag features for Appliances and important variables (same as training data)
test_data['Appliances_lag1'] = test_data['Appliances'].shift(1)
test_data['T_out_lag1'] = test_data['T_out'].shift(1)
test_data['RH_out_lag1'] = test_data['RH_out'].shift(1)

# Drop rows with NaN values created by lag features
test_data = test_data.dropna()

# Step 4: Drop the original 'date' column
test_data = test_data.drop(columns=['date'])

# Step 5: Separate features and target
selected_features = ['T1', 'RH_1', 'T_out', 'RH_out', 'hour', 'day_of_week', 'Appliances_lag1', 'T_out_lag1', 'RH_out_lag1']
X_test = test_data[selected_features]  # Features
y_test = test_data['Appliances']  # Target

# Step 6: Load the scaler
scaler = joblib.load("scaler.save")

# Step 7: Normalize/Scale the features
X_test_scaled = scaler.transform(X_test)

# Step 8: Prepare data for LSTM (create sequences)
def create_sequences(data, target, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length, :])  # All features
        y.append(target[i+seq_length])     # Target (Appliances)
    return np.array(X), np.array(y)

seq_length = 10  # Use the past 10 time steps to predict the next
X_test_seq, y_test_seq = create_sequences(X_test_scaled, y_test.values, seq_length)

# Debugging the shape of X_test_seq
print(f"Shape of X_test_seq: {X_test_seq.shape}")

# Step 9: Load the LSTM model
model = load_model("appliances_forecast_model_final_corrected.h5")

# Step 10: Make predictions with the LSTM model
y_pred = model.predict(X_test_seq)

# Step 11: Calculate residuals
residuals = y_test_seq - y_pred.flatten()

# Step 12: Load the XGBoost residual model
xgb_residual = joblib.load("xgb_residual_model.save")

# Step 13: Correct the LSTM predictions using the XGBoost residual model
y_pred_corrected = y_pred.flatten() + xgb_residual.predict(X_test_seq.reshape(X_test_seq.shape[0], -1))

# Step 14: Evaluate the corrected model
mae_corrected = mean_absolute_error(y_test_seq, y_pred_corrected)
rmse_corrected = np.sqrt(mean_squared_error(y_test_seq, y_pred_corrected))
print(f"Corrected MAE: {mae_corrected}")
print(f"Corrected RMSE: {rmse_corrected}")

# Step 15: Visualize the results
plt.figure(figsize=(10, 6))
plt.plot(y_test_seq, label='Actual', color='blue')
plt.plot(y_pred_corrected, label='Corrected Predicted', color='red')
plt.title("Actual vs Corrected Predicted Appliances Energy Consumption")
plt.xlabel("Time Steps")
plt.ylabel("Energy Consumption (Wh)")
plt.legend()
plt.show()
