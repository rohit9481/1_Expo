import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense, Dropout
from sklearn.model_selection import train_test_split
from math import sqrt
from keras.callbacks import EarlyStopping
from keras.models import load_model

# 1. Load the dataset
file_path = 'household_power_consumption.txt'
df = pd.read_csv(file_path, sep=';', parse_dates=[[0, 1]], infer_datetime_format=True, na_values=['?'])

# Check for any missing values
df = df.dropna()

# 2. Preprocessing
data = df['Global_active_power'].values.reshape(-1, 1)

# Scaling the data (important for LSTM models)
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

# 3. Create time-series dataset for LSTM
def create_dataset(data, time_step=1):
    X, y = [], []
    for i in range(len(data)-time_step-1):
        X.append(data[i:(i+time_step), 0])
        y.append(data[i + time_step, 0])
    return np.array(X), np.array(y)

# Define the number of previous time steps to use to predict the next value
time_step = 10
X, y = create_dataset(scaled_data, time_step)

# Reshape X to be 3D for LSTM: [samples, time steps, features]
X = X.reshape(X.shape[0], X.shape[1], 1)

# 4. Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

# 5. Build the LSTM model with Dropout to reduce overfitting
model = Sequential()
model.add(LSTM(units=50, return_sequences=False, input_shape=(X_train.shape[1], 1)))
model.add(Dropout(0.2))  # Add Dropout layer with 20% dropout rate
model.add(Dense(units=1))  # Output layer with 1 neuron for regression

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')

# 6. Early Stopping to prevent overfitting
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# 7. Train the model with validation data and Early Stopping
model.fit(X_train, y_train, epochs=50, batch_size=32, verbose=1, validation_data=(X_test, y_test), callbacks=[early_stopping])

# 8. Save the model to a file
model.save('lstm_model.h5')

# 9. Make predictions
y_pred_scaled = model.predict(X_test)
y_pred = scaler.inverse_transform(y_pred_scaled)  # Rescale back to original values
y_test_rescaled = scaler.inverse_transform(y_test.reshape(-1, 1))  # Rescale test set

# 10. Evaluate the model: MAE, MSE, RMSE
mae = mean_absolute_error(y_test_rescaled, y_pred)
mse = mean_squared_error(y_test_rescaled, y_pred)
rmse = sqrt(mse)

# Print the results
print(f'Mean Absolute Error (MAE): {mae:.4f}')
print(f'Mean Squared Error (MSE): {mse:.4f}')
print(f'Root Mean Squared Error (RMSE): {rmse:.4f}')

# 11. Plot actual vs predicted values
plt.figure(figsize=(10, 6))
plt.plot(y_test_rescaled, label='Actual')
plt.plot(y_pred, label='Predicted')
plt.title('Actual vs Predicted Global Active Power')
plt.xlabel('Time')
plt.ylabel('Global Active Power')
plt.legend()
plt.show()
