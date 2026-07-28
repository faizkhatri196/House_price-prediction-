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

    // Weather Particle System
    this.weatherParticles = null;
    this.currentWeather = 'clear';

    // AAA PBR Materials Palette
    this.materials = {
      wallConcrete: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.05 }),
      wallAccentWood: new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.6, metalness: 0.1 }),
      wallStone: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8, metalness: 0.05 }),
      wallBrickRed: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.85 }),
      wallFuturisticMetallic: new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 }),
      roofTile: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2 }),
      roofRedTile: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6, metalness: 0.1 }),
      roofGrassGreen: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 }),
      glassTinted: new THREE.MeshPhysicalMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.45, roughness: 0.05, transmission: 0.85, thickness: 0.5 }),
      woodDecking: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7, metalness: 0.05 }),
      lawnGrass: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 }),
      waterPool: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.08, metalness: 0.35, transparent: true, opacity: 0.85 }),
      drivewayAsphalt: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, metalness: 0.05 }),
      solarCells: new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.15 }),
      neonStrip: new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 1.5 })
    };

    this.houseGroup = new THREE.Group();
    this.scene.add(this.houseGroup);

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

    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const ground = new THREE.Mesh(groundGeo, this.materials.lawnGrass);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

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

    if (styleName === 'Traditional') {
      // Sloped Red Tile Roof & Stone Masonry Walls
      const g = new THREE.Mesh(new THREE.BoxGeometry(16, 4.5, 14), this.materials.wallStone);
      g.position.set(0, 2.25, 0);
      g.castShadow = true;
      this.houseGroup.add(g);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(12.5, 4.5, 4), this.materials.roofRedTile);
      roof.position.set(0, 6.75, 0);
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      this.houseGroup.add(roof);

    } else if (styleName === 'Japanese') {
      // Pagoda Tier Roof & Shoji Timber Frames
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(15, 3.8, 13), this.materials.wallAccentWood);
      b1.position.set(0, 1.9, 0);
      this.houseGroup.add(b1);

      const b2 = new THREE.Mesh(new THREE.BoxGeometry(12, 3.5, 10), this.materials.wallConcrete);
      b2.position.set(0, 5.55, 0);
      this.houseGroup.add(b2);

      const r1 = new THREE.Mesh(new THREE.BoxGeometry(17, 0.5, 15), this.materials.roofTile);
      r1.position.set(0, 3.8, 0);
      this.houseGroup.add(r1);

      const r2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.6, 12), this.materials.roofTile);
      r2.position.set(0, 7.3, 0);
      this.houseGroup.add(r2);

    } else if (styleName === 'Minimalist') {
      // Clean Geometric Monolithic Box
      const box = new THREE.Mesh(new THREE.BoxGeometry(16, 6, 12), this.materials.wallConcrete);
      box.position.set(0, 3, 0);
      box.castShadow = true;
      this.houseGroup.add(box);

      const ribbonGlass = new THREE.Mesh(new THREE.BoxGeometry(14, 1.8, 0.2), this.materials.glassTinted);
      ribbonGlass.position.set(0, 4, 6.1);
      this.houseGroup.add(ribbonGlass);

    } else if (styleName === 'Scandinavian') {
      // Steep Pine Gable Roof Structure
      const body = new THREE.Mesh(new THREE.BoxGeometry(14, 5, 12), this.materials.wallAccentWood);
      body.position.set(0, 2.5, 0);
      this.houseGroup.add(body);

      const roof = new THREE.Mesh(new THREE.ConeGeometry(11, 6, 4), this.materials.roofTile);
      roof.position.set(0, 8, 0);
      roof.rotation.y = Math.PI / 4;
      this.houseGroup.add(roof);

    } else if (styleName === 'Indian Modern') {
      // Courtyard Layout with Jali Accent Screens
      const body = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 14), this.materials.wallBrickRed);
      body.position.set(0, 2.5, 0);
      this.houseGroup.add(body);

      const top = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 10), this.materials.wallConcrete);
      top.position.set(0, 7, 0);
      this.houseGroup.add(top);

      const pergola = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 12), this.materials.wallAccentWood);
      pergola.position.set(0, 9.1, 0);
      this.houseGroup.add(pergola);

    } else if (styleName === 'Eco Green') {
      // Living Green Roof & Solar Integration
      const body = new THREE.Mesh(new THREE.BoxGeometry(16, 5.5, 12), this.materials.wallConcrete);
      body.position.set(0, 2.75, 0);
      this.houseGroup.add(body);

      const greenRoof = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.6, 12.5), this.materials.roofGrassGreen);
      greenRoof.position.set(0, 5.8, 0);
      this.houseGroup.add(greenRoof);

    } else if (styleName === 'Futuristic') {
      // Curved Metallic Shell & Neon Strip Light Accent
      const body = new THREE.Mesh(new THREE.CylinderGeometry(8, 9, 6, 16), this.materials.wallFuturisticMetallic);
      body.position.set(0, 3, 0);
      this.houseGroup.add(body);

      const neon = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.15, 16, 32), this.materials.neonStrip);
      neon.rotation.x = Math.PI / 2;
      neon.position.set(0, 3, 0);
      this.houseGroup.add(neon);

    } else {
      // Default: Modern Villa (Cantilevered Glass Architecture)
      const baseFloor = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 12), this.materials.wallConcrete);
      baseFloor.position.set(0, 2.5, 0);
      baseFloor.castShadow = true;
      this.houseGroup.add(baseFloor);

      const upperFloor = new THREE.Mesh(new THREE.BoxGeometry(14, 4.5, 14), this.materials.wallAccentWood);
      upperFloor.position.set(2, 7.25, 1);
      upperFloor.castShadow = true;
      this.houseGroup.add(upperFloor);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(17, 0.6, 15), this.materials.roofTile);
      roof.position.set(2, 9.8, 1);
      this.houseGroup.add(roof);

      const glassWall = new THREE.Mesh(new THREE.BoxGeometry(10, 3.5, 0.2), this.materials.glassTinted);
      glassWall.position.set(2, 7.25, 8.1);
      this.houseGroup.add(glassWall);

      const pool = new THREE.Mesh(new THREE.BoxGeometry(9, 0.2, 14), this.materials.waterPool);
      pool.position.set(14, 0.08, 1);
      this.houseGroup.add(pool);
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
