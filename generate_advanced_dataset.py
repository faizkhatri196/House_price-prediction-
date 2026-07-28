import pandas as pd
import numpy as np
import os

print("--- EstateMind 3D - Generating All-India Real Estate Dataset ---")

np.random.seed(42)
n_samples = 4000

india_geography = {
  'Maharashtra': {
    'Mumbai': ['Bandra West', 'Andheri East', 'Juhu', 'Powai', 'Thane West', 'Lower Parel', 'Worli', 'Dharavi Village'],
    'Pune': ['Baner', 'Wakad', 'Kharadi', 'Koregaon Park', 'Viman Nagar', 'Hinjewadi', 'Hadapsar', 'Mulshi Village'],
    'Nagpur': ['Dharampeth', 'Manewada', 'Civil Lines', 'Besa', 'Hingna Village'],
    'Nashik': ['College Road', 'Indira Nagar', 'Panchavati', 'Pathardi Phata', 'Trimbak Village']
  },
  'Karnataka': {
    'Bangalore': ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Electronic City', 'Yelahanka', 'Sarjapur Road', 'Devanahalli Village'],
    'Mysore': ['Gokulam', 'Vijayanagar', 'JP Nagar', 'Hebbal', 'Yelwal Village'],
    'Hubli-Dharwad': ['Vidyanagar', 'Gokul Road', 'Navanagar', 'Rayapur Village'],
    'Mangalore': ['Bejai', 'Kadri', 'Surathkal', 'Ullal Village']
  },
  'Delhi NCR': {
    'Delhi': ['Vasant Kunj', 'Saket', 'Dwarka Sector 10', 'Connaught Place', 'Chhatarpur Village'],
    'Gurugram': ['DLF Phase 5', 'Golf Course Road', 'Sector 57', 'Cyber City', 'Sohna Village'],
    'Noida': ['Sector 62', 'Sector 150', 'Greater Noida West', 'Yamuna Expressway Village'],
    'Faridabad': ['Sector 15', 'Sector 81', 'Surajkund', 'Ballabhgarh Village']
  },
  'Telangana': {
    'Hyderabad': ['Gachibowli', 'HITECH City', 'Jubilee Hills', 'Banjara Hills', 'Kondapur', 'Tellapur', 'Shamshabad Village'],
    'Warangal': ['Hanamkonda', 'Kazipet', 'Subedari', 'Mamnoor Village']
  },
  'Tamil Nadu': {
    'Chennai': ['Velachery', 'O M R', 'Anna Nagar', 'Adyar', 'T Nagar', 'ECR', 'Sholinganallur', 'Mahabalipuram Village'],
    'Coimbatore': ['RS Puram', 'Peelamedu', 'Gandhipuram', 'Saravanampatti', 'Thudiyalur Village'],
    'Madurai': ['Anna Nagar', 'KK Nagar', 'SS Colony', 'Avaniapuram Village']
  },
  'Gujarat': {
    'Ahmedabad': ['Bodakdev', 'SG Highway', 'Prahlad Nagar', 'Satellite', 'Bopal', 'Vastrapur', 'Sanand Village'],
    'Surat': ['Vesu', 'Adajan', 'Piplod', 'Ghod Dod Road', 'Hazira Village'],
    'Vadodara': ['Alkapuri', 'Gotri', 'Vasna Road', 'Bhayli Village']
  },
  'West Bengal': {
    'Kolkata': ['Salt Lake', 'New Town', 'Ballygunge', 'Rajarhat', 'Alipore', 'Park Street', 'Sonarpur Village'],
    'Howrah': ['Shibpur', 'Bally', 'Santragachi', 'Domjur Village']
  },
  'Uttar Pradesh': {
    'Lucknow': ['Gomti Nagar', 'Hazratganj', 'Mahanagar', 'Aliganj', 'Chinhat Village'],
    'Varanasi': ['Sigra', 'Lanka', 'Cantonment', 'Sarnath Village'],
    'Kanpur': ['Civil Lines', 'Swaroop Nagar', 'Kidwai Nagar', 'Bithoor Village']
  },
  'Rajasthan': {
    'Jaipur': ['Malviya Nagar', 'Vaishali Nagar', 'C-Scheme', 'Raja Park', 'Sanganer Village'],
    'Udaipur': ['Fatehpura', 'Hiran Magri', 'Sukher', 'Bhuwana Village']
  },
  'Kerala': {
    'Kochi': ['Kakkanad', 'Marine Drive', 'Edappally', 'Vyttila', 'Kumbalangi Village'],
    'Thiruvananthapuram': ['Kazhakkoottam', 'Kowdiar', 'Vellayambalam', 'Kovalam Village']
  },
  'Punjab & Chandigarh': {
    'Chandigarh': ['Sector 17', 'Sector 35', 'Sector 8', 'Manimajra Village'],
    'Ludhiana': ['Sarabha Nagar', 'Model Town', 'BRS Nagar', 'Sahnewal Village'],
    'Amritsar': ['Ranjit Avenue', 'Mall Road', 'GT Road', 'Verka Village']
  }
}

state_price_multipliers = {
  'Maharashtra': 1.8, 'Delhi NCR': 1.6, 'Karnataka': 1.5, 'Telangana': 1.3,
  'Tamil Nadu': 1.2, 'Gujarat': 1.1, 'West Bengal': 1.0, 'Uttar Pradesh': 0.95,
  'Rajasthan': 0.9, 'Kerala': 0.9, 'Punjab & Chandigarh': 1.1
}

facing_directions = ['North', 'East', 'North-East', 'South', 'West', 'North-West', 'South-East', 'South-West']
furnishing_options = ['Unfurnished', 'Semi-Furnished', 'Fully-Furnished']
area_types = ['Super Built-up', 'Plot Area', 'Carpet Area']

data = []

for _ in range(n_samples):
    state = np.random.choice(list(india_geography.keys()))
    city = np.random.choice(list(india_geography[state].keys()))
    locality = np.random.choice(india_geography[state][city])
    
    is_village = 'Village' in locality
    area_type = 'Plot Area' if is_village else np.random.choice(area_types, p=[0.7, 0.15, 0.15])
    
    bedrooms = int(np.random.choice([1, 2, 3, 4, 5], p=[0.15, 0.35, 0.35, 0.10, 0.05]))
    
    carpet_area = int(bedrooms * np.random.uniform(350, 550) + np.random.uniform(50, 200))
    builtup_area = int(carpet_area * np.random.uniform(1.15, 1.25))
    plot_size = int(builtup_area * np.random.uniform(1.2, 1.6))
    
    bathrooms = max(1, bedrooms + np.random.choice([-1, 0, 1], p=[0.2, 0.6, 0.2]))
    balconies = int(np.random.choice([0, 1, 2, 3], p=[0.1, 0.3, 0.4, 0.2]))
    living_rooms = 1 if bedrooms <= 2 else int(np.random.choice([1, 2], p=[0.7, 0.3]))
    dining_room = 1 if bedrooms >= 2 else int(np.random.choice([0, 1], p=[0.5, 0.5]))
    kitchens = 1 if bedrooms <= 4 else int(np.random.choice([1, 2], p=[0.9, 0.1]))
    study_room = 1 if np.random.rand() > 0.65 else 0
    office_room = 1 if np.random.rand() > 0.75 else 0
    
    floors = 2 if is_village else int(np.random.choice([4, 10, 20, 30], p=[0.3, 0.3, 0.3, 0.1]))
    floor_number = int(np.random.randint(1, floors + 1))
    
    parking = int(np.random.choice([0, 1, 2, 3], p=[0.1, 0.5, 0.35, 0.05]))
    garden = 1 if (is_village or area_type == 'Plot Area' or floor_number == 1 or np.random.rand() > 0.8) else 0
    swimming_pool = 0 if is_village else (1 if np.random.rand() > 0.65 else 0)
    terrace = 1 if (floor_number == floors or np.random.rand() > 0.7) else 0
    basement = 1 if (area_type == 'Plot Area' and np.random.rand() > 0.6) else 0
    lift = 0 if is_village else (1 if floors > 3 else int(np.random.choice([0, 1], p=[0.5, 0.5])))
    
    age_years = int(np.random.randint(0, 25))
    facing = np.random.choice(facing_directions)
    furnishing = np.random.choice(furnishing_options, p=[0.3, 0.5, 0.2])
    
    smart_home = 0 if is_village else (1 if np.random.rand() > 0.6 else 0)
    solar_panels = 1 if (is_village or np.random.rand() > 0.6) else 0
    ev_charging = 1 if np.random.rand() > 0.65 else 0
    security_system = 1 if np.random.rand() > 0.4 else 0
    water_supply = 'Borewell Only' if is_village else np.random.choice(['24/7 Supply', 'Corporation + Borewell'])
    power_backup = np.random.choice(['Full', 'Partial', 'None'], p=[0.5, 0.4, 0.1])
    
    school_dist_km = round(np.random.uniform(1.5, 12.0) if is_village else np.random.uniform(0.3, 4.0), 2)
    hospital_dist_km = round(np.random.uniform(3.0, 20.0) if is_village else np.random.uniform(0.5, 6.0), 2)
    metro_dist_km = round(np.random.uniform(15.0, 50.0) if is_village else np.random.uniform(0.2, 8.0), 2)
    airport_dist_km = round(np.random.uniform(20.0, 80.0), 2)
    
    school_index = round(max(1.0, 10.0 - school_dist_km * 0.8), 1)
    hospital_index = round(max(1.0, 10.0 - hospital_dist_km * 0.5), 1)
    transit_index = round(max(1.0, 10.0 - metro_dist_km * 0.3), 1)
    safety_score = round(np.random.uniform(7.5, 9.8) if is_village else np.random.uniform(6.0, 9.2), 1)
    green_space_score = round(np.random.uniform(7.0, 9.8) if is_village else np.random.uniform(4.0, 8.5), 1)
    air_quality_index = int(np.random.uniform(25, 80) if is_village else np.random.uniform(60, 220))
    
    base_rate_per_sqft = (np.random.uniform(1800, 4500) if is_village else np.random.uniform(4500, 15000)) * state_price_multipliers[state]
    
    furnish_factor = 1.15 if furnishing == 'Fully-Furnished' else (1.06 if furnishing == 'Semi-Furnished' else 1.0)
    facing_factor = 1.08 if facing in ['North', 'East', 'North-East'] else 1.0
    age_factor = max(0.65, 1.0 - (age_years * 0.015))
    amenities_factor = 1.0 + (smart_home*0.05 + solar_panels*0.04 + ev_charging*0.04 + swimming_pool*0.06 + garden*0.04)
    locality_factor = 1.0 + (transit_index*0.02 + school_index*0.015 + safety_score*0.02)
    
    price_inr = builtup_area * base_rate_per_sqft * furnish_factor * facing_factor * age_factor * amenities_factor * locality_factor
    price_inr = round(price_inr / 10000) * 10000
    
    data.append({
        'Country': 'India',
        'State': state,
        'City': city,
        'Locality': locality,
        'Area_Type': area_type,
        'Plot_Size_sqft': plot_size,
        'Builtup_Area_sqft': builtup_area,
        'Carpet_Area_sqft': carpet_area,
        'Floors': floors,
        'Floor_Number': floor_number,
        'Bedrooms': bedrooms,
        'Bathrooms': bathrooms,
        'Balconies': balconies,
        'Living_Rooms': living_rooms,
        'Dining_Room': dining_room,
        'Kitchens': kitchens,
        'Study_Room': study_room,
        'Office_Room': office_room,
        'Parking': parking,
        'Garden': garden,
        'Swimming_Pool': swimming_pool,
        'Terrace': terrace,
        'Basement': basement,
        'Lift': lift,
        'Property_Age_years': age_years,
        'Facing_Direction': facing,
        'Furnishing': furnishing,
        'Smart_Home': smart_home,
        'Solar_Panels': solar_panels,
        'EV_Charging': ev_charging,
        'Security_System': security_system,
        'Water_Supply': water_supply,
        'Power_Backup': power_backup,
        'School_Dist_km': school_dist_km,
        'Hospital_Dist_km': hospital_dist_km,
        'Metro_Dist_km': metro_dist_km,
        'Airport_Dist_km': airport_dist_km,
        'School_Index': school_index,
        'Hospital_Index': hospital_index,
        'Transit_Index': transit_index,
        'Safety_Score': safety_score,
        'Green_Space_Score': green_space_score,
        'AQI': air_quality_index,
        'Price_INR': price_inr
    })

df = pd.DataFrame(data)
output_path = 'india_house_prices.csv'
df.to_csv(output_path, index=False)
print(f"Comprehensive All-India dataset successfully created with {len(df)} records across {len(india_geography)} states and {len(df.columns)} columns.")
