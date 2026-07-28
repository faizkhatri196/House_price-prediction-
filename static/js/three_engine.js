/* ==========================================================================
   EstateMind 3D - AAA Photo-Realistic WebGL Architectural 3D Engine
   ========================================================================== */

class ThreeHouseEngine {
  constructor(canvasId) {
    this.container = document.getElementById(canvasId);
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    
    this.container.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.02;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 75;

    // Advanced Lighting Setup
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    this.sunLight.position.set(30, 45, 25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 150;
    this.sunLight.shadow.camera.left = -30;
    this.sunLight.shadow.camera.right = 30;
    this.sunLight.shadow.camera.top = 30;
    this.sunLight.shadow.camera.bottom = -30;
    this.sunLight.shadow.bias = -0.0002;
    this.scene.add(this.sunLight);

    // Warm Interior Accent Light
    this.interiorLight = new THREE.PointLight(0xfeb2b2, 1.2, 15);
    this.interiorLight.position.set(0, 4, 0);
    this.scene.add(this.interiorLight);

    // Weather Particle System
    this.weatherParticles = null;
    this.currentWeather = 'clear';

    // AAA PBR Materials Palette
    this.materials = {
      wallConcrete: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.05 }),
      wallAccentWood: new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6, metalness: 0.1 }),
      wallStone: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, metalness: 0.05 }),
      roofTile: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2 }),
      roofRedTile: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6, metalness: 0.1 }),
      glassTinted: new THREE.MeshPhysicalMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.45, roughness: 0.05, transmission: 0.85, thickness: 0.5 }),
      frameMetal: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 }),
      woodDecking: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7, metalness: 0.05 }),
      lawnGrass: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 }),
      waterPool: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.08, metalness: 0.35, transparent: true, opacity: 0.85 }),
      drivewayAsphalt: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, metalness: 0.05 }),
      solarCells: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.15 })
    };

    this.houseGroup = new THREE.Group();
    this.scene.add(this.houseGroup);
    this.waterTime = 0;

    // Initial Camera Position
    this.camera.position.set(24, 18, 28);
    this.controls.target.set(0, 4, 0);
    this.controls.update();

    this.initEnvironment();
    this.buildHouseStyle('Modern');

    window.addEventListener('resize', () => this.onWindowResize());
    this.animate();
  }

  initEnvironment() {
    this.scene.background = new THREE.Color(0x0f172a);
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.007);

    // Ground Plane Lawn
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const ground = new THREE.Mesh(groundGeo, this.materials.lawnGrass);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Driveway & Pavement
    const driveGeo = new THREE.PlaneGeometry(10, 24);
    const driveway = new THREE.Mesh(driveGeo, this.materials.drivewayAsphalt);
    driveway.rotation.x = -Math.PI / 2;
    driveway.position.set(0, 0.02, 14);
    driveway.receiveShadow = true;
    this.scene.add(driveway);
  }

  clearHouse() {
    while (this.houseGroup.children.length > 0) {
      const obj = this.houseGroup.children[0];
      this.houseGroup.remove(obj);
    }
  }

  buildHouseStyle(styleName = 'Modern') {
    this.clearHouse();

    if (styleName === 'Traditional' || styleName === 'Indian Modern') {
      // Sloped Tile Roof & Courtyard Pillar Architecture
      const groundFloorGeo = new THREE.BoxGeometry(16, 4.5, 14);
      const groundFloor = new THREE.Mesh(groundFloorGeo, this.materials.wallStone);
      groundFloor.position.set(0, 2.25, 0);
      groundFloor.castShadow = true;
      groundFloor.receiveShadow = true;
      this.houseGroup.add(groundFloor);

      const firstFloorGeo = new THREE.BoxGeometry(14, 4, 12);
      const firstFloor = new THREE.Mesh(firstFloorGeo, this.materials.wallConcrete);
      firstFloor.position.set(0, 6.5, 0);
      firstFloor.castShadow = true;
      this.houseGroup.add(firstFloor);

      // Sloped Roof
      const roofGeo = new THREE.ConeGeometry(12.5, 4.5, 4);
      const roof = new THREE.Mesh(roofGeo, this.materials.roofRedTile);
      roof.position.set(0, 10.75, 0);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      this.houseGroup.add(roof);

      // Wooden Pillars Porch
      for (let x of [-6, 6]) {
        const pillarGeo = new THREE.CylinderGeometry(0.3, 0.3, 4.5);
        const pillar = new THREE.Mesh(pillarGeo, this.materials.wallAccentWood);
        pillar.position.set(x, 2.25, 7.5);
        pillar.castShadow = true;
        this.houseGroup.add(pillar);
      }

    } else if (styleName === 'Japanese') {
      // Pagoda Tier Roof & Shoji Wooden Frames
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(15, 3.8, 13), this.materials.wallAccentWood);
      b1.position.set(0, 1.9, 0);
      b1.castShadow = true;
      this.houseGroup.add(b1);

      const b2 = new THREE.Mesh(new THREE.BoxGeometry(12, 3.5, 10), this.materials.wallConcrete);
      b2.position.set(0, 5.55, 0);
      b2.castShadow = true;
      this.houseGroup.add(b2);

      // Tier 1 Roof
      const r1 = new THREE.Mesh(new THREE.BoxGeometry(17, 0.5, 15), this.materials.roofTile);
      r1.position.set(0, 3.8, 0);
      this.houseGroup.add(r1);

      // Tier 2 Roof
      const r2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 12), this.materials.roofTile);
      r2.position.set(0, 7.3, 0);
      this.houseGroup.add(r2);

    } else {
      // Modern / Luxury Villa (Cantilever Glass Architecture)
      const baseFloorGeo = new THREE.BoxGeometry(16, 5, 12);
      const baseFloor = new THREE.Mesh(baseFloorGeo, this.materials.wallConcrete);
      baseFloor.position.set(0, 2.5, 0);
      baseFloor.castShadow = true;
      baseFloor.receiveShadow = true;
      this.houseGroup.add(baseFloor);

      // Cantilevered Upper Level
      const upperFloorGeo = new THREE.BoxGeometry(14, 4.5, 14);
      const upperFloor = new THREE.Mesh(upperFloorGeo, this.materials.wallAccentWood);
      upperFloor.position.set(2, 7.25, 1);
      upperFloor.castShadow = true;
      upperFloor.receiveShadow = true;
      this.houseGroup.add(upperFloor);

      // Flat Roof with Parapet
      const roofGeo = new THREE.BoxGeometry(17, 0.6, 15);
      const roof = new THREE.Mesh(roofGeo, this.materials.roofTile);
      roof.position.set(2, 9.8, 1);
      roof.castShadow = true;
      this.houseGroup.add(roof);

      // Panoramic Curtain Glass Wall
      const glassWallGeo = new THREE.BoxGeometry(10, 3.5, 0.2);
      const glassWall = new THREE.Mesh(glassWallGeo, this.materials.glassTinted);
      glassWall.position.set(2, 7.25, 8.1);
      this.houseGroup.add(glassWall);

      // Glass Railing Balcony
      const balconyFloor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 4), this.materials.woodDecking);
      balconyFloor.position.set(-2, 5, 8);
      this.houseGroup.add(balconyFloor);

      // Swimming Pool & Deck
      const poolGeo = new THREE.BoxGeometry(9, 0.2, 14);
      const pool = new THREE.Mesh(poolGeo, this.materials.waterPool);
      pool.position.set(14, 0.08, 1);
      this.houseGroup.add(pool);

      const deckGeo = new THREE.BoxGeometry(11, 0.15, 16);
      const deck = new THREE.Mesh(deckGeo, this.materials.woodDecking);
      deck.position.set(14, 0.03, 1);
      deck.receiveShadow = true;
      this.houseGroup.add(deck);

      // Solar Array Roof Installation
      const solarGeo = new THREE.BoxGeometry(10, 0.1, 7);
      const solar = new THREE.Mesh(solarGeo, this.materials.solarCells);
      solar.position.set(2, 10.2, 1);
      this.houseGroup.add(solar);
    }
  }

  setWallColor(hexColor) {
    this.materials.wallConcrete.color.set(hexColor);
  }

  setAccentColor(hexColor) {
    this.materials.wallAccentWood.color.set(hexColor);
  }

  setRoofColor(hexColor) {
    this.materials.roofTile.color.set(hexColor);
    this.materials.roofRedTile.color.set(hexColor);
  }

  setCameraMode(mode) {
    if (mode === 'orbit') {
      this.camera.position.set(24, 18, 28);
      this.controls.target.set(0, 4, 0);
    } else if (mode === 'drone') {
      this.camera.position.set(0, 50, 2);
      this.controls.target.set(0, 0, 0);
    } else if (mode === 'walkthrough') {
      this.camera.position.set(0, 2.2, 15);
      this.controls.target.set(0, 2.2, 0);
    }
    this.controls.update();
  }

  setEnvironmentLighting(timeOfDay) {
    if (timeOfDay === 'day') {
      this.sunLight.intensity = 1.4;
      this.ambientLight.intensity = 0.65;
      this.scene.background.setHex(0x38bdf8);
      this.scene.fog.color.setHex(0x38bdf8);
    } else if (timeOfDay === 'sunset') {
      this.sunLight.intensity = 0.95;
      this.sunLight.color.setHex(0xf97316);
      this.ambientLight.intensity = 0.45;
      this.scene.background.setHex(0xc2410c);
      this.scene.fog.color.setHex(0xc2410c);
    } else if (timeOfDay === 'night') {
      this.sunLight.intensity = 0.12;
      this.ambientLight.intensity = 0.22;
      this.scene.background.setHex(0x070a13);
      this.scene.fog.color.setHex(0x070a13);
    }
  }

  setWeather(type) {
    this.currentWeather = type;
    if (this.weatherParticles) {
      this.scene.remove(this.weatherParticles);
      this.weatherParticles = null;
    }

    if (type === 'rain' || type === 'snow') {
      const count = type === 'rain' ? 1500 : 900;
      const geo = new THREE.BufferGeometry();
      const pos = [];

      for (let i = 0; i < count; i++) {
        pos.push(
          (Math.random() - 0.5) * 70,
          Math.random() * 45,
          (Math.random() - 0.5) * 70
        );
      }

      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: type === 'rain' ? 0x93c5fd : 0xffffff,
        size: type === 'rain' ? 0.35 : 0.65,
        transparent: true,
        opacity: 0.75
      });

      this.weatherParticles = new THREE.Points(geo, mat);
      this.scene.add(this.weatherParticles);
    }
  }

  animateWeather() {
    if (!this.weatherParticles) return;
    const positions = this.weatherParticles.geometry.attributes.position.array;
    const speed = this.currentWeather === 'rain' ? 0.9 : 0.25;

    for (let i = 1; i < positions.length; i += 3) {
      positions[i] -= speed;
      if (positions[i] < 0) positions[i] = 45;
    }
    this.weatherParticles.geometry.attributes.position.needsUpdate = true;
  }

  onWindowResize() {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.animateWeather();
    this.renderer.render(this.scene, this.camera);
  }
}

window.ThreeHouseEngine = ThreeHouseEngine;
