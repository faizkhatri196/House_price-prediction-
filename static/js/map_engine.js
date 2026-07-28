/* ==========================================================================
   EstateMind 3D - Leaflet Real-Time Smart Map & Location Intelligence Engine
   ========================================================================== */

class MapIntelligenceEngine {
  constructor(mapContainerId) {
    this.mapContainer = document.getElementById(mapContainerId);
    if (!this.mapContainer) return;

    this.cityCoords = {
      'Bangalore': [12.9716, 77.5946],
      'Mumbai': [19.0760, 72.8777],
      'Delhi NCR': [28.6139, 77.2090],
      'Hyderabad': [17.3850, 78.4867],
      'Pune': [18.5204, 73.8567],
      'Chennai': [13.0827, 80.2707],
      'Kolkata': [22.5726, 88.3639],
      'Ahmedabad': [23.0225, 72.5714]
    };

    const initialCoord = this.cityCoords['Bangalore'];
    this.map = L.map(mapContainerId).setView(initialCoord, 14);

    // Tile Layers
    this.tileLayers = {
      street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }),
      satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: '&copy; Esri World Imagery'
      })
    };

    this.tileLayers.street.addTo(this.map);

    // Marker Groups
    this.propertyMarker = null;
    this.poiGroup = L.layerGroup().addTo(this.map);
    this.radiusCircle = null;

    this.initPropertyMarker(initialCoord);
    this.renderPOIs(initialCoord);
  }

  initPropertyMarker(coords) {
    if (this.propertyMarker) {
      this.map.removeLayer(this.propertyMarker);
    }

    const homeIcon = L.divIcon({
      className: 'custom-home-marker',
      html: `<div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:#fff;box-shadow:0 0 15px rgba(59,130,246,0.6);border:2px solid #fff;"><i class="fas fa-home"></i></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    this.propertyMarker = L.marker(coords, { icon: homeIcon }).addTo(this.map);
    this.propertyMarker.bindPopup(`<b>Target Property</b><br>Selected Location Intelligence Center`).openPopup();

    // Radius Circle
    if (this.radiusCircle) this.map.removeLayer(this.radiusCircle);
    this.radiusCircle = L.circle(coords, {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.12,
      radius: 2000 // 2km
    }).addTo(this.map);
  }

  setCity(cityName, localityName = '') {
    const coords = this.cityCoords[cityName] || [12.9716, 77.5946];
    
    // Add small random offset for specific locality feel
    const lat = coords[0] + (Math.random() - 0.5) * 0.03;
    const lng = coords[1] + (Math.random() - 0.5) * 0.03;
    const locCoords = [lat, lng];

    this.map.flyTo(locCoords, 14, { duration: 1.5 });
    this.initPropertyMarker(locCoords);
    this.renderPOIs(locCoords);
  }

  switchTileLayer(layerName) {
    if (this.tileLayers[layerName]) {
      this.map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          this.map.removeLayer(layer);
        }
      });
      this.tileLayers[layerName].addTo(this.map);
    }
  }

  renderPOIs(centerCoords) {
    this.poiGroup.clearLayers();

    const poiCategories = [
      { type: 'school', name: 'St. Joseph Academy', icon: 'fa-graduation-cap', color: '#10b981', dist: 0.8 },
      { type: 'hospital', name: 'Manipal Hospital', icon: 'fa-hospital', color: '#f43f5e', dist: 1.4 },
      { type: 'metro', name: 'Indiranagar Metro Station', icon: 'fa-subway', color: '#3b82f6', dist: 0.5 },
      { type: 'mall', name: 'Phoenix Marketcity Mall', icon: 'fa-shopping-bag', color: '#8b5cf6', dist: 2.1 },
      { type: 'park', name: 'Cubbon Park Sector 4', icon: 'fa-tree', color: '#22c55e', dist: 1.1 },
      { type: 'ev', name: 'Tata Power EV Fast Charger', icon: 'fa-charging-station', color: '#06b6d4', dist: 0.3 },
      { type: 'police', name: 'Central Police Station', icon: 'fa-shield-alt', color: '#f59e0b', dist: 1.8 }
    ];

    poiCategories.forEach(poi => {
      const angle = Math.random() * Math.PI * 2;
      const distOffset = poi.dist * 0.009; // approximate lat/lng offset
      const pLat = centerCoords[0] + Math.cos(angle) * distOffset;
      const pLng = centerCoords[1] + Math.sin(angle) * distOffset;

      const poiIcon = L.divIcon({
        className: 'custom-poi-marker',
        html: `<div style="background:${poi.color};width:28px;height:28px;border-radius:50%;display:grid;place-items:center;color:#fff;box-shadow:0 4px 10px rgba(0,0,0,0.3);font-size:0.75rem;"><i class="fas ${poi.icon}"></i></div>`,
        iconSize: [28, 28]
      });

      const marker = L.marker([pLat, pLng], { icon: poiIcon });
      marker.bindPopup(`<b>${poi.name}</b><br>Distance: ${poi.dist} km`);
      this.poiGroup.addLayer(marker);
    });
  }
}

window.MapIntelligenceEngine = MapIntelligenceEngine;
