import pandas as pd
import numpy as np

# Set random seed for reproducibility
np.random.seed(42)

# Parameters
n_samples = 5000

# Indian Cities
cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad']
area_types = ['Premium', 'Standard', 'Budget']

data = {
    'City': np.random.choice(cities, n_samples),
    'Area_Type': np.random.choice(area_types, n_samples, p=[0.2, 0.5, 0.3]),
    'Size_sqft': np.random.randint(500, 5000, n_samples),
    'Bedrooms': np.random.randint(1, 6, n_samples),
    'Kitchens': np.random.randint(1, 4, n_samples),
    'Bathrooms': np.random.randint(1, 6, n_samples),
    'Age_years': np.random.randint(0, 50, n_samples)
}

df = pd.DataFrame(data)

# Ensure logical consistency:
df['Bathrooms'] = df.apply(lambda row: min(row['Bathrooms'], row['Bedrooms'] + 1), axis=1)
df['Kitchens'] = df.apply(lambda row: min(row['Kitchens'], 2), axis=1)

# Price Calculation Logic (Mock Formula targeting INR)
base_sqft_price = {
    'Mumbai': 15000, 'Delhi': 10000, 'Bangalore': 8000, 
    'Chennai': 6000, 'Hyderabad': 5500, 'Pune': 6500, 
    'Kolkata': 4500, 'Ahmedabad': 4000
}

area_multiplier = {'Premium': 1.8, 'Standard': 1.0, 'Budget': 0.7}

prices = []
for idx, row in df.iterrows():
    base = base_sqft_price[row['City']] * area_multiplier[row['Area_Type']]
    price = row['Size_sqft'] * base
    
    # Add value for extra rooms
    price += (row['Bedrooms'] * 500000)
    price += (row['Kitchens'] * 300000)
    price += (row['Bathrooms'] * 200000)
    
    # Depreciation for age (max 50%)
    depreciation = min((row['Age_years'] * 0.01), 0.5) * price
    price -= depreciation
    
    # Introduce some noise (randomness)
    noise = np.random.uniform(0.9, 1.1)
    price *= noise
    
    prices.append(round(price, 2))

df['Price_INR'] = prices

df.to_csv('india_house_prices.csv', index=False)
print("Dataset 'india_house_prices.csv' successfully generated with 5000 records.")
