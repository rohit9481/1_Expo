import pandas as pd
import numpy as np

# Function to generate synthetic test data
def generate_test_data(rows=100):
    np.random.seed(42)  # For reproducibility
    
    # Generate datetime values
    date_rng = pd.date_range(start='2025-01-01', periods=rows, freq='H')
    
    # Generate synthetic values within reasonable ranges
    data = {
        'Date_Time': date_rng,
        'Global_active_power': np.random.uniform(0.5, 6, rows),  # kW
        'Global_reactive_power': np.random.uniform(0.05, 1, rows),  # kVar
        'Voltage': np.random.uniform(220, 250, rows),  # Volts
        'Global_intensity': np.random.uniform(1, 30, rows),  # Amps
        'Sub_metering_1': np.random.randint(0, 10, rows),  # kWh
        'Sub_metering_2': np.random.randint(0, 10, rows),  # kWh
        'Sub_metering_3': np.random.randint(0, 10, rows)  # kWh
    }
    
    df = pd.DataFrame(data)
    
    return df

# Generate and save the test dataset
test_df = generate_test_data(100)
test_df.to_csv("generated_household_data.csv", index=False)

# Display the first few rows
print(test_df.head())
