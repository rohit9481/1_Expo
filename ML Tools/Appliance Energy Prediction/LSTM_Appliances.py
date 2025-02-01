# Import necessary libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.regularizers import l1_l2
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from xgboost import XGBRegressor
import joblib  # For saving the scaler and XGBoost model

# Step 1: Load the dataset
data = pd.read_csv("energydata_complete.csv")

# Step 2: Convert the 'date' column to datetime
data['date'] = pd.to_datetime(data['date'])

# Step 3: Feature Engineering
# Extract temporal features
data['hour'] = data['date'].dt.hour
data['day_of_week'] = data['date'].dt.dayofweek
data['month'] = data['date'].dt.month
data['is_weekend'] = data['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)  # Weekend feature

# Add lag features for Appliances and important variables
data['Appliances_lag1'] = data['Appliances'].shift(1)
data['T_out_lag1'] = data['T_out'].shift(1)
data['RH_out_lag1'] = data['RH_out'].shift(1)

# Drop rows with NaN values created by lag features
data = data.dropna()

# Step 4: Drop the original 'date' column
data = data.drop(columns=['date'])

# Step 5: Handle missing values (if any)
print("Missing values in each column:")
print(data.isnull().sum())
data = data.fillna(method='ffill')  # Forward fill missing values

# Step 6: Separate features and target
# Select only the most important features
selected_features = ['T1', 'RH_1', 'T_out', 'RH_out', 'hour', 'day_of_week', 'Appliances_lag1', 'T_out_lag1', 'RH_out_lag1']
X = data[selected_features]  # Features
y = data['Appliances']  # Target

# Step 7: Normalize/Scale the features
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Save the scaler object
joblib.dump(scaler, "scaler.save")
print("Scaler saved as 'scaler.save'")

# Step 8: Split the data into training and testing sets
train_size = int(len(data) * 0.8)  # 80% training, 20% testing
X_train, X_test = X_scaled[:train_size], X_scaled[train_size:]
y_train, y_test = y[:train_size].values, y[train_size:].values  # Convert to NumPy arrays

# Step 9: Prepare data for LSTM (create sequences)
def create_sequences(data, target, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length, :])  # All features
        y.append(target[i+seq_length])     # Target (Appliances)
    return np.array(X), np.array(y)

seq_length = 10  # Use the past 10 time steps to predict the next
X_train_seq, y_train_seq = create_sequences(X_train, y_train, seq_length)
X_test_seq, y_test_seq = create_sequences(X_test, y_test, seq_length)

# Step 10: Define the LSTM model
model = Sequential()
model.add(LSTM(30, activation='tanh', input_shape=(X_train_seq.shape[1], X_train_seq.shape[2]), kernel_regularizer=l1_l2(l1=0.01, l2=0.01)))  # Reduced LSTM units
model.add(Dropout(0.5))  # Increased dropout rate to 0.5
model.add(Dense(1))  # Output layer for predicting Appliances
model.compile(optimizer=Adam(learning_rate=0.0005), loss='mean_squared_error')  # Reduced learning rate

# Step 11: Train the model with early stopping
early_stopping = EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True)  # Increased patience
history = model.fit(X_train_seq, y_train_seq, epochs=50, validation_data=(X_test_seq, y_test_seq), callbacks=[early_stopping], verbose=1)

# Step 12: Make predictions
y_pred = model.predict(X_test_seq)

# Step 13: Error Correction
# Calculate residuals
residuals = y_test_seq - y_pred.flatten()

# Train an XGBoost model to predict residuals
xgb_residual = XGBRegressor(learning_rate=0.05, n_estimators=200, max_depth=5)  # Hyperparameters for XGBoost
xgb_residual.fit(X_test_seq.reshape(X_test_seq.shape[0], -1), residuals)

# Save the XGBoost residual model
joblib.dump(xgb_residual, "xgb_residual_model.save")
print("XGBoost residual model saved as 'xgb_residual_model.save'")

# Correct the LSTM predictions
y_pred_corrected = y_pred.flatten() + xgb_residual.predict(X_test_seq.reshape(X_test_seq.shape[0], -1))

# Step 14: Evaluate the model
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

# Step 16: Save the model
model.save("appliances_forecast_model_final_corrected.h5")
print("Final corrected model saved as 'appliances_forecast_model_final_corrected.h5'")
