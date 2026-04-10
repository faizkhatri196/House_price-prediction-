import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import os

print("--- Advanced House Price Prediction Model ---")

# 1. Load the dataset
dataset_path = 'india_house_prices.csv'
if not os.path.exists(dataset_path):
    print(f"Error: Dataset not found at {dataset_path}. Please run generate_dataset.py first.")
    exit()

data = pd.read_csv(dataset_path)
print("\nDataset Info:")
print(data.info())
print("\nFirst 5 records:")
print(data.head())

# 2. Separate Features and Target
X = data.drop('Price_INR', axis=1)
y = data['Price_INR']

# 3. Define Preprocessing Steps
categorical_cols = ['City', 'Area_Type']
numerical_cols = ['Size_sqft', 'Bedrooms', 'Kitchens', 'Bathrooms', 'Age_years']

# OneHot encode categorical features, Standardize numerical features
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_cols),
        ('cat', OneHotEncoder(drop='first'), categorical_cols) # drop='first' avoids dummy variable trap
    ])

# 4. Create a modeling pipeline
# Random Forest is a powerful, non-linear model handling complex interactions well
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])

# 5. Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Train the Model
print("\nTraining Advanced Random Forest Model... Please wait...")
model_pipeline.fit(X_train, y_train)
print("Model Training Complete.")

# 7. Evaluate the Model
y_pred = model_pipeline.predict(X_test)
r2 = r2_score(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"\n--- Model Evaluation on Test Data ---")
print(f"R-squared Score: {r2:.4f} (Closer to 1 is better)")
import joblib
print(f"Root Mean Squared Error (RMSE): Rs. {rmse:,.2f}")

# Save the trained model wrapper
joblib.dump(model_pipeline, 'house_model.pkl')
print("\n[+] Model saved to 'house_model.pkl'")

# 8. Feature Importance
cat_encoder = model_pipeline.named_steps['preprocessor'].named_transformers_['cat']
cat_features = cat_encoder.get_feature_names_out(categorical_cols)
all_feature_names = numerical_cols + list(cat_features)

importances = model_pipeline.named_steps['regressor'].feature_importances_

# Sort feature importances
indices = np.argsort(importances)[::-1]
print("\n--- Top 5 Feature Importances ---")
for i in range(5):
    print(f"{all_feature_names[indices[i]]}: {importances[indices[i]]:.4f}")


# 9. Function for Interactive Prediction
def predict_house_price(city, area_type, size, bedrooms, kitchens, bathrooms, age):
    input_data = pd.DataFrame({
        'City': [city],
        'Area_Type': [area_type],
        'Size_sqft': [size],
        'Bedrooms': [bedrooms],
        'Kitchens': [kitchens],
        'Bathrooms': [bathrooms],
        'Age_years': [age]
    })
    
    prediction = model_pipeline.predict(input_data)[0]
    return prediction

# Example Prediction
print("\n--- Example Prediction ---")
sample_city = 'Bangalore'
sample_area = 'Premium'
sample_size = 1800
sample_beds = 3
sample_kitch = 1
sample_baths = 2
sample_age = 5

predicted_price = predict_house_price(sample_city, sample_area, sample_size, sample_beds, sample_kitch, sample_baths, sample_age)
print(f"Predicted Price for {sample_beds} BHK, {sample_size} sqft in {sample_city} ({sample_area} area): Rs. {predicted_price:,.2f}")
