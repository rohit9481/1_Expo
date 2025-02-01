import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_absolute_error, mean_squared_error
from math import sqrt

# 1. Load the test dataset
test_file = "generated_household_data.csv"
test_df = pd.read_csv(test_file)

# 2. Check if 'Global_active_power' exists
if 'Global_active_power' not in test_df.columns:
    raise ValueError("The column 'Global_active_power' is missing from the test dataset.")

# 3. Extract and reshape the test data
test_data = test_df['Global_active_power'].values.reshape(-1, 1)

# 4. Load the original scaler used during training
scaler = MinMaxScaler(feature_range=(0, 1))
scaler.fit(test_data)  # Fit the scaler to match training distribution
scaled_test_data = scaler.transform(test_data)

# 5. Create time-series dataset (same as training)
def create_test_sequences(data, time_step=10):
    X_test = []
    for i in range(len(data) - time_step):
        X_test.append(data[i:(i + time_step), 0])
    return np.array(X_test)

time_step = 10  # Same time step as training
X_test = create_test_sequences(scaled_test_data, time_step)

# Reshape X_test to 3D format [samples, time steps, features]
X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

# 6. Load the trained LSTM model
model = load_model("lstm_model.h5")

# 7. Make predictions
y_pred_scaled = model.predict(X_test)

# 8. Inverse transform to get actual values
y_pred = scaler.inverse_transform(y_pred_scaled)

# 9. Prepare actual values for evaluation (aligning shapes)
y_actual = test_data[time_step:]  # Actual values corresponding to predictions

# 10. Evaluate the model: MAE, MSE, RMSE
mae = mean_absolute_error(y_actual, y_pred)
mse = mean_squared_error(y_actual, y_pred)
rmse = sqrt(mse)

print(f"Mean Absolute Error (MAE): {mae:.4f}")
print(f"Mean Squared Error (MSE): {mse:.4f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")

# 11. Plot actual vs predicted values
plt.figure(figsize=(10, 6))
plt.plot(y_actual, label="Actual", color="blue")
plt.plot(y_pred, label="Predicted", color="red")
plt.title("Actual vs Predicted Global Active Power")
plt.xlabel("Time Steps")
plt.ylabel("Global Active Power")
plt.legend()
plt.show()
