# 🚀 EstateMind 3D — Cloud Deployment Guide (Render & Netlify)

This repository is pre-configured for 1-click cloud deployment on **Render** (Full-Stack Python/Flask server + ML Model) and **Netlify** / **Vercel**.

---

## 1. Deploying to Render (Recommended for Full-Stack AI & ML Model)

Render hosts the Flask Python backend server, loads `house_model.pkl`, serves REST API endpoints (`/api/predict`, `/api/ai/chat`), and renders the glassmorphic frontend UI.

### Option A: 1-Click Render Blueprint Deployment
1. Push this repository to GitHub/GitLab.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Blueprint**.
3. Connect your repository. Render will automatically detect `render.yaml` and configure:
   - **Environment**: Python 3.11+
   - **Build Command**: `pip install -r requirements.txt && python generate_advanced_dataset.py && python advanced_house_predict.py`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 4`
4. Add environment variables if desired:
   - `GROQ_API_KEY`: Your Groq API key for Llama-3 70B AI Chat.
   - `GEMINI_API_KEY`: Your Gemini API key.
5. Click **Apply**. Render will build and launch your full-stack platform live!

### Option B: Manual Web Service Deployment on Render
1. Click **New +** -> **Web Service** on Render.
2. Connect your GitHub repository.
3. Set **Runtime** to `Python 3`.
4. Set **Build Command**: `pip install -r requirements.txt && python generate_advanced_dataset.py && python advanced_house_predict.py`
5. Set **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`
6. Click **Create Web Service**.

---

## 2. Deploying to Netlify / Vercel

If you deploy to Netlify or Vercel:
- **Netlify**: Connect repository, set build directory to `templates` with static assets, or use Netlify Serverless functions.
- `netlify.toml` and `Procfile` are already included in the root directory.

---

## 📁 Repository Structure Overview

```
.
├── app.py                      # Flask REST API server (Predictions, Geography, Chat, 3D floorplan)
├── advanced_house_predict.py   # Ensemble ML pipeline (Random Forest + Gradient Boosting)
├── generate_advanced_dataset.py# All-India 50+ feature dataset generator (States, Cities, Villages)
├── house_model.pkl             # Trained model payload
├── india_house_prices.csv      # Real estate dataset
├── Procfile                    # Render / Heroku production WSGI runner
├── render.yaml                 # Render Blueprint automated config
├── netlify.toml                # Netlify deployment settings
├── requirements.txt            # Python dependencies (Flask, Gunicorn, Scikit-Learn, Pandas)
├── templates/
│   └── index.html              # Futuristic Glassmorphic UI & SPA layout
└── static/
    ├── css/styles.css          # Responsive 60 FPS mobile & desktop CSS design system
    └── js/
        ├── three_engine.js     # AAA Photo-realistic Three.js 3D WebGL Engine
        ├── map_engine.js       # Leaflet.js Real-time Smart Map & POI Intelligence
        ├── dashboard.js        # Chart.js Investment Forecasts & Mortgage Calculator
        ├── floorplan_engine.js # 2D Interactive Vastu Floor Plan Canvas
        └── ai_assistant.js     # AI Copilot Real Estate Assistant Widget
```
