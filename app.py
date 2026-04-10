import os
from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load the trained model
model_path = 'house_model.pkl'
if os.path.exists(model_path):
    model = joblib.load(model_path)
    print("Model loaded successfully.")
else:
    print("Error: Model not found. Please run advanced_house_predict.py first.")
    model = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model is not trained/loaded.'}), 500

    try:
        data = request.json
        print("Received prediction request:", data)
        
        # Create a DataFrame from the incoming request payload
        input_df = pd.DataFrame([{
            'City': data['City'],
            'Area_Type': data['Area_Type'],
            'Size_sqft': int(data['Size_sqft']),
            'Bedrooms': int(data['Bedrooms']),
            'Kitchens': int(data['Kitchens']),
            'Bathrooms': int(data['Bathrooms']),
            'Age_years': int(data['Age_years'])
        }])

        prediction = model.predict(input_df)[0]
        
        formatted_price = f"\u20B9 {prediction:,.2f}"

        return jsonify({'price': formatted_price})

    except Exception as e:
        print("Prediction Error:", e)
        return jsonify({'error': str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
