import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Function to generate synthetic user data with a minimum of num_samples
def generate_user_data(start_date, end_date, num_samples):
    # Generate a date range with 10-minute intervals from start_date to end_date
    date_rng = pd.date_range(start=start_date, end=end_date, freq='10T')
    
    # Ensure we have at least num_samples, so we might extend the range if necessary
    if len(date_rng) < num_samples:
        # Extend the date range by appending more intervals
        extra_minutes = (num_samples - len(date_rng)) * 10
        end_date = end_date + timedelta(minutes=extra_minutes)
        date_rng = pd.date_range(start=start_date, end=end_date, freq='10T')
    
    # Generate random data for each feature
    np.random.seed(42)  # Set seed for reproducibility
    
    appliances = np.random.normal(60, 10, size=num_samples)  # Random energy consumption for Appliances
    lights = np.random.normal(30, 5, size=num_samples)  # Random energy consumption for Lights
    T1 = np.random.normal(20, 2, size=num_samples)  # Temperature in kitchen area
    RH_1 = np.random.uniform(40, 50, size=num_samples)  # Humidity in kitchen area
    T2 = np.random.normal(19, 2, size=num_samples)  # Temperature in living room area
    RH_2 = np.random.uniform(40, 50, size=num_samples)  # Humidity in living room area
    T3 = np.random.normal(19, 2, size=num_samples)  # Temperature in laundry room area
    RH_3 = np.random.uniform(40, 50, size=num_samples)  # Humidity in laundry room area
    T4 = np.random.normal(19, 2, size=num_samples)  # Temperature in office room
    RH_4 = np.random.uniform(40, 50, size=num_samples)  # Humidity in office room
    T5 = np.random.normal(19, 2, size=num_samples)  # Temperature in bathroom
    RH_5 = np.random.uniform(40, 50, size=num_samples)  # Humidity in bathroom
    T6 = np.random.normal(18, 3, size=num_samples)  # Temperature outside (north side)
    RH_6 = np.random.uniform(40, 50, size=num_samples)  # Humidity outside (north side)
    T7 = np.random.normal(20, 2, size=num_samples)  # Temperature in ironing room
    RH_7 = np.random.uniform(40, 50, size=num_samples)  # Humidity in ironing room
    T8 = np.random.normal(18, 2, size=num_samples)  # Temperature in teenager room 2
    RH_8 = np.random.uniform(40, 50, size=num_samples)  # Humidity in teenager room 2
    T9 = np.random.normal(20, 2, size=num_samples)  # Temperature in parents room
    RH_9 = np.random.uniform(40, 50, size=num_samples)  # Humidity in parents room
    T_out = np.random.normal(15, 5, size=num_samples)  # Temperature outside
    Press_mm_hg = np.random.normal(730, 5, size=num_samples)  # Pressure
    RH_out = np.random.uniform(40, 80, size=num_samples)  # Humidity outside
    Windspeed = np.random.uniform(0, 5, size=num_samples)  # Wind speed
    Visibility = np.random.uniform(5, 10, size=num_samples)  # Visibility
    Tdewpoint = np.random.normal(10, 3, size=num_samples)  # Dewpoint
    rv1 = np.random.normal(1, 0.1, size=num_samples)  # Random variable 1
    rv2 = np.random.normal(1, 0.1, size=num_samples)  # Random variable 2
    
    # Create DataFrame
    data = pd.DataFrame({
        'date': date_rng[:num_samples],  # Adjust length to match num_samples
        'Appliances': appliances,
        'lights': lights,
        'T1': T1,
        'RH_1': RH_1,
        'T2': T2,
        'RH_2': RH_2,
        'T3': T3,
        'RH_3': RH_3,
        'T4': T4,
        'RH_4': RH_4,
        'T5': T5,
        'RH_5': RH_5,
        'T6': T6,
        'RH_6': RH_6,
        'T7': T7,
        'RH_7': RH_7,
        'T8': T8,
        'RH_8': RH_8,
        'T9': T9,
        'RH_9': RH_9,
        'T_out': T_out,
        'Press_mm_hg': Press_mm_hg,
        'RH_out': RH_out,
        'Windspeed': Windspeed,
        'Visibility': Visibility,
        'Tdewpoint': Tdewpoint,
        'rv1': rv1,
        'rv2': rv2
    })
    
    return data

# Generate synthetic user data for at least 100 samples
start_date = datetime(2016, 1, 11, 17, 0)  # Start at 2016-01-11 17:00:00
end_date = datetime(2016, 1, 11, 17, 50)   # End at 2016-01-11 17:50:00 (within an hour)
num_samples = 100  # Set num_samples to 100

user_data = generate_user_data(start_date, end_date, num_samples)

# Save the generated data to a CSV file
user_data.to_csv('generated_user_data.csv', index=False)

# Display a preview of the generated data
print(user_data.head())
