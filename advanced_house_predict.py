import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, VotingRegressor
from sklearn.metrics import mean_squared_error, r2_score

print("--- EstateMind 3D - Advanced Real Estate AI Training ---")

dataset_path = 'india_house_prices.csv'
if not os.path.exists(dataset_path):
    print("Generating dataset first...")
    import generate_advanced_dataset

data = pd.read_csv(dataset_path)
print(f"Loaded dataset: {data.shape[0]} rows, {data.shape[1]} columns.")

# Features & Target
target_col = 'Price_INR'
X = data.drop(columns=[target_col, 'Country', 'State'])
y = data[target_col]

# Identify categorical and numerical columns
categorical_cols = X.select_dtypes(include=['object']).columns.tolist()
numerical_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()

print(f"Categorical features ({len(categorical_cols)}): {categorical_cols}")
print(f"Numerical features ({len(numerical_cols)}): {numerical_cols}")

# Column Transformer setup
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_cols),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols)
    ]
)

# Ensemble Regressor (Random Forest + Gradient Boosting)
rf = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
gb = GradientBoostingRegressor(n_estimators=100, random_state=42)

ensemble_regressor = VotingRegressor(estimators=[('rf', rf), ('gb', gb)])

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', ensemble_regressor)
])

# Train test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\nTraining Ensemble AI Real Estate Model...")
model_pipeline.fit(X_train, y_train)

# Evaluation
y_pred = model_pipeline.predict(X_test)
r2 = r2_score(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"\nModel Evaluation Metrics:")
print(f"R2 Score: {r2:.4f}")
print(f"RMSE: Rs. {rmse:,.2f}")

# Save feature metadata along with model
model_payload = {
    'pipeline': model_pipeline,
    'categorical_cols': categorical_cols,
    'numerical_cols': numerical_cols,
    'all_feature_cols': X.columns.tolist(),
    'r2_score': r2,
    'rmse': rmse
}

joblib.dump(model_payload, 'house_model.pkl')
print("\n[+] Saved model payload to 'house_model.pkl'")
