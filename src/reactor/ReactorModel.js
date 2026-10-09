import * as THREE from 'three';

/**
 * MARS-01 Reactor 3D Model Assembly
 * Assembles a detailed, scientifically coherent Pressurized Water Small Modular Reactor (SMR).
 * Procedurally constructed using Three.js geometries with cutaway capability.
 */

export class ReactorModel {
  constructor(materials) {
    this.mat = materials;
    this.group = new THREE.Group();
    this.interactiveObjects = [];

    // References to animated sub-elements
    this.controlRodsGroup = null;
    this.turbineRotorGroup = null;
    this.cherenkovPoolMesh = null;
    this.containmentDomeHalf = null;
    this.vesselCutawayShell = null;

    this.buildAssembly();
  }

  buildAssembly() {
    this.buildBiologicalShield();
    this.buildReactorVessel();
    this.buildFuelCore();
    this.buildControlRods();
    this.buildCoolantCircuit();
    this.buildSteamGenerator();
    this.buildTurbineAndGenerator();
    this.buildContainmentDome();
    this.buildControlRoom();
  }

  // Helper to register interactive components for Raycasting
  registerInteractive(mesh, componentId) {
    mesh.userData.componentId = componentId;
    mesh.userData.originalMaterial = mesh.material;
    this.interactiveObjects.push(mesh);
    // Also traverse if group
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.userData.componentId = componentId;
        child.userData.originalMaterial = child.material;
        this.interactiveObjects.push(child);
      }
    });
  }

  buildBiologicalShield() {
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(0, 0, 0);

    // Thick concrete biological shield cylinder surrounding the reactor cavity
    const shieldGeo = new THREE.CylinderGeometry(3.0, 3.2, 5.5, 32, 1, true, 0, Math.PI * 1.5);
    const shieldMesh = new THREE.Mesh(shieldGeo, this.mat.get('biologicalShield'));
    shieldMesh.position.y = 2.75;
    shieldMesh.castShadow = true;
    shieldMesh.receiveShadow = true;
    shieldGroup.add(shieldMesh);

    // Lower cavity concrete foundation
    const foundationGeo = new THREE.CylinderGeometry(3.4, 3.6, 1.2, 32);
    const foundation = new THREE.Mesh(foundationGeo, this.mat.get('biologicalShield'));
    foundation.position.y = 0.6;
    foundation.receiveShadow = true;
    shieldGroup.add(foundation);

    // Hazard ring marking on floor
    const hazardGeo = new THREE.RingGeometry(3.2, 3.8, 32);
    const hazardMesh = new THREE.Mesh(hazardGeo, this.mat.get('hazardMarking'));
    hazardMesh.rotation.x = -Math.PI / 2;
    hazardMesh.position.y = 1.21;
    hazardMesh.receiveShadow = true;
    shieldGroup.add(hazardMesh);

    // Maintenance catwalk walkway ring
    const walkwayGeo = new THREE.TorusGeometry(3.1, 0.25, 8, 32);
    const walkway = new THREE.Mesh(walkwayGeo, this.mat.get('darkAlloy'));
    walkway.rotation.x = Math.PI / 2;
    walkway.position.y = 4.8;
    shieldGroup.add(walkway);

    this.registerInteractive(shieldGroup, 'shielding');
    this.group.add(shieldGroup);
  }

  buildReactorVessel() {
    const vesselGroup = new THREE.Group();
    vesselGroup.position.set(0, 1.2, 0);

    // RPV Main Body Cylinder
    const bodyGeo = new THREE.CylinderGeometry(1.4, 1.4, 4.2, 32, 1, false, 0, Math.PI * 2);
    const bodyMesh = new THREE.Mesh(bodyGeo, this.mat.get('vesselShell'));
    bodyMesh.position.y = 2.2;
    bodyMesh.castShadow = true;
    vesselGroup.add(bodyMesh);

    // Cutaway shell (shown/hidden or swapped for transparent material during cutaway mode)
    this.vesselCutawayShell = bodyMesh;

    // Bottom hemispherical head
    const bottomGeo = new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bottomMesh = new THREE.Mesh(bottomGeo, this.mat.get('vesselShell'));
    bottomMesh.position.y = 0.1;
    vesselGroup.add(bottomMesh);

    // Top vessel closure head flange
    const flangeGeo = new THREE.CylinderGeometry(1.65, 1.65, 0.35, 32);
    const flangeMesh = new THREE.Mesh(flangeGeo, this.mat.get('darkAlloy'));
    flangeMesh.position.y = 4.3;
    vesselGroup.add(flangeMesh);

    // Flange high-tensile studs/bolts
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const boltGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.45, 8);
      const bolt = new THREE.Mesh(boltGeo, this.mat.get('chromeSteel'));
      bolt.position.set(Math.cos(angle) * 1.52, 4.45, Math.sin(angle) * 1.52);
      vesselGroup.add(bolt);
    }

    // Upper vessel dome
    const domeGeo = new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, this.mat.get('vesselShell'));
    domeMesh.position.y = 4.45;
    vesselGroup.add(domeMesh);

    // Hot leg outlet nozzle (to steam gen)
    const nozzleOutGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const nozzleOut = new THREE.Mesh(nozzleOutGeo, this.mat.get('hotLegPipe'));
    nozzleOut.rotation.z = Math.PI / 2;
    nozzleOut.position.set(1.5, 3.2, 0);
    vesselGroup.add(nozzleOut);

    // Cold leg inlet nozzle (returning from pump)
    const nozzleInGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16);
    const nozzleIn = new THREE.Mesh(nozzleInGeo, this.mat.get('coldLegPipe'));
    nozzleIn.rotation.z = Math.PI / 2;
    nozzleIn.position.set(1.5, 1.8, 0);
    vesselGroup.add(nozzleIn);

    this.registerInteractive(vesselGroup, 'vessel');
    this.group.add(vesselGroup);
  }

  buildFuelCore() {
    const fuelGroup = new THREE.Group();
    fuelGroup.position.set(0, 1.6, 0);

    // Cherenkov Radiation Pool cylinder inside vessel
    const poolGeo = new THREE.CylinderGeometry(1.25, 1.25, 2.6, 24);
    this.cherenkovPoolMesh = new THREE.Mesh(poolGeo, this.mat.get('cherenkovPool'));
    this.cherenkovPoolMesh.position.y = 1.3;
    fuelGroup.add(this.cherenkovPoolMesh);

    // Core Support Lower Grid Plate
    const gridGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.15, 24);
    const lowerGrid = new THREE.Mesh(gridGeo, this.mat.get('darkAlloy'));
    lowerGrid.position.y = 0.1;
    fuelGroup.add(lowerGrid);

    // Array of Fuel Pin Bundles (Hexagonal/square lattice)
    const fuelPinGeo = new THREE.CylinderGeometry(0.045, 0.045, 2.0, 12);
    const bundleRows = [-0.65, -0.4, -0.15, 0.15, 0.4, 0.65];

    bundleRows.forEach((x) => {
      bundleRows.forEach((z) => {
        // Keep within core radius
        if (x * x + z * z < 0.65) {
          const pin = new THREE.Mesh(fuelPinGeo, this.mat.get('fuelPins'));
          pin.position.set(x, 1.2, z);
          fuelGroup.add(pin);
        }
      });
    });

    // Core upper guide plate
    const upperGrid = new THREE.Mesh(gridGeo, this.mat.get('darkAlloy'));
    upperGrid.position.y = 2.3;
    fuelGroup.add(upperGrid);

    // Inner core glowing point light (simulating intense Cherenkov blue luminescence)
    const cherenkovLight = new THREE.PointLight(0x0284c7, 3.5, 6, 2);
    cherenkovLight.position.set(0, 1.3, 0);
    fuelGroup.add(cherenkovLight);
    this.cherenkovLight = cherenkovLight;

    this.registerInteractive(fuelGroup, 'fuel');
    this.group.add(fuelGroup);
  }

  buildControlRods() {
    this.controlRodsGroup = new THREE.Group();
    this.controlRodsGroup.position.set(0, 3.8, 0);

    // Upper Actuator drive housings on vessel head
    const rodCoords = [
      { x: 0, z: 0 },
      { x: 0.35, z: 0.35 },
      { x: -0.35, z: 0.35 },
      { x: 0.35, z: -0.35 },
      { x: -0.35, z: -0.35 }
    ];

    const housingGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.8, 16);
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 12);

    rodCoords.forEach((coord) => {
      // Actuator housing (fixed to vessel head)
      const housing = new THREE.Mesh(housingGeo, this.mat.get('darkAlloy'));
      housing.position.set(coord.x, 2.4, coord.z);
      this.controlRodsGroup.add(housing);

      // Warning top indicator LED
      const ledGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const led = new THREE.Mesh(ledGeo, this.mat.get('warningLightAmber'));
      led.position.set(coord.x, 3.35, coord.z);
      this.controlRodsGroup.add(led);

      // Sliding Absorber Rod
      const rod = new THREE.Mesh(rodGeo, this.mat.get('controlRods'));
      rod.position.set(coord.x, 0.8, coord.z);
      this.controlRodsGroup.add(rod);
    });

    // Connecting spider gantry
    const spiderGeo = new THREE.BoxGeometry(0.9, 0.1, 0.9);
    const spider = new THREE.Mesh(spiderGeo, this.mat.get('controlRods'));
    spider.position.y = 1.9;
    this.controlRodsGroup.add(spider);

    this.registerInteractive(this.controlRodsGroup, 'control_rods');
    this.group.add(this.controlRodsGroup);
  }

  buildCoolantCircuit() {
    const circuitGroup = new THREE.Group();

    // Hot Leg Pipe (Curves from RPV upper nozzle to Steam Generator lower inlet)
    const hotCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.7, 4.4, 0),
      new THREE.Vector3(2.6, 4.4, 0),
      new THREE.Vector3(3.2, 3.8, 0),
      new THREE.Vector3(3.6, 2.5, 0)
    ]);
    const hotPipeGeo = new THREE.TubeGeometry(hotCurve, 32, 0.22, 16, false);
    const hotPipe = new THREE.Mesh(hotPipeGeo, this.mat.get('hotLegPipe'));
    circuitGroup.add(hotPipe);

    // Steam Generator exit back through pump to Cold Leg
    const coldCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.6, 1.8, 0),
      new THREE.Vector3(3.0, 1.8, 0),
      new THREE.Vector3(2.5, 1.8, 0),
      new THREE.Vector3(1.7, 3.0, 0)
    ]);
    const coldPipeGeo = new THREE.TubeGeometry(coldCurve, 32, 0.22, 16, false);
    const coldPipe = new THREE.Mesh(coldPipeGeo, this.mat.get('coldLegPipe'));
    circuitGroup.add(coldPipe);

    // Primary Coolant Pump (RCP) Motor & Volute
    const pumpGroup = new THREE.Group();
    pumpGroup.position.set(2.6, 1.8, 0);

    // Pump spherical casing
    const voluteGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const volute = new THREE.Mesh(voluteGeo, this.mat.get('darkAlloy'));
    pumpGroup.add(volute);

    // Heavy electric motor housing
    const motorGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.1, 16);
    const motor = new THREE.Mesh(motorGeo, this.mat.get('coldLegPipe'));
    motor.position.y = 0.9;
    pumpGroup.add(motor);

    circuitGroup.add(pumpGroup);

    // Pressurizer Tank (maintains primary 15.5 MPa)
    const przGroup = new THREE.Group();
    przGroup.position.set(1.8, 4.2, -1.5);

    const przBodyGeo = new THREE.CylinderGeometry(0.45, 0.45, 2.4, 16);
    const przBody = new THREE.Mesh(przBodyGeo, this.mat.get('vesselShell'));
    przGroup.add(przBody);

    const przCapGeo = new THREE.SphereGeometry(0.45, 16, 8);
    const przTop = new THREE.Mesh(przCapGeo, this.mat.get('vesselShell'));
    przTop.position.y = 1.2;
    przGroup.add(przTop);

    // Surge line connecting pressurizer to hot leg
    const surgeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.8, 3.0, -1.5),
      new THREE.Vector3(1.8, 3.0, -0.6),
      new THREE.Vector3(2.2, 4.2, 0)
    ]);
    const surgeGeo = new THREE.TubeGeometry(surgeCurve, 20, 0.08, 10, false);
    const surgeMesh = new THREE.Mesh(surgeGeo, this.mat.get('hotLegPipe'));
    circuitGroup.add(surgeMesh);

    circuitGroup.add(przGroup);

    this.registerInteractive(circuitGroup, 'coolant');
    this.group.add(circuitGroup);
  }

  buildSteamGenerator() {
    const sgGroup = new THREE.Group();
    sgGroup.position.set(4.5, 1.2, 0);

    // Main SG Vessel Cylinder
    const sgBodyGeo = new THREE.CylinderGeometry(1.1, 1.1, 4.8, 32);
    const sgBody = new THREE.Mesh(sgBodyGeo, this.mat.get('steamGenShell'));
    sgBody.position.y = 2.6;
    sgBody.castShadow = true;
    sgGroup.add(sgBody);

    // SG Top Steam Dome
    const sgTopGeo = new THREE.SphereGeometry(1.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const sgTop = new THREE.Mesh(sgTopGeo, this.mat.get('steamGenShell'));
    sgTop.position.y = 5.0;
    sgGroup.add(sgTop);

    // Secondary steam outlet pipe at top heading toward turbine hall
    const steamOutletCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 5.8, 0),
      new THREE.Vector3(0.8, 5.8, 0),
      new THREE.Vector3(1.8, 5.2, 0),
      new THREE.Vector3(2.8, 3.8, 0)
    ]);
    const steamPipeGeo = new THREE.TubeGeometry(steamOutletCurve, 32, 0.24, 16, false);
    const steamPipe = new THREE.Mesh(steamPipeGeo, this.mat.get('steamPipe'));
    sgGroup.add(steamPipe);

    // Internal Inconel U-Tubes (visible in cutaway)
    const uTubeGroup = new THREE.Group();
    uTubeGroup.position.set(0, 1.5, 0);
    for (let i = 0; i < 4; i++) {
      const radius = 0.25 + i * 0.18;
      const height = 1.8 + i * 0.3;
      const uCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-radius, 0, 0),
        new THREE.Vector3(-radius, height, 0),
        new THREE.Vector3(0, height + radius * 0.6, 0),
        new THREE.Vector3(radius, height, 0),
        new THREE.Vector3(radius, 0, 0)
      ]);
      const uGeo = new THREE.TubeGeometry(uCurve, 24, 0.04, 8, false);
      const uMesh = new THREE.Mesh(uGeo, this.mat.get('chromeSteel'));
      uTubeGroup.add(uMesh);
    }
    sgGroup.add(uTubeGroup);

    this.registerInteractive(sgGroup, 'steam_gen');
    this.group.add(sgGroup);
  }

  buildTurbineAndGenerator() {
    const turboGroup = new THREE.Group();
    turboGroup.position.set(8.5, 1.2, 0);

    // High Pressure Turbine Casing
    const hpCasingGeo = new THREE.CylinderGeometry(0.8, 1.1, 2.0, 24);
    const hpCasing = new THREE.Mesh(hpCasingGeo, this.mat.get('turbineCasing'));
    hpCasing.rotation.z = Math.PI / 2;
    hpCasing.position.set(-1.0, 1.2, 0);
    hpCasing.castShadow = true;
    turboGroup.add(hpCasing);

    // Low Pressure Turbine Casing
    const lpCasingGeo = new THREE.CylinderGeometry(1.2, 1.4, 2.4, 24);
    const lpCasing = new THREE.Mesh(lpCasingGeo, this.mat.get('turbineCasing'));
    lpCasing.rotation.z = Math.PI / 2;
    lpCasing.position.set(1.2, 1.2, 0);
    lpCasing.castShadow = true;
    turboGroup.add(lpCasing);

    // Central Spinning Driveshaft & Blades
    this.turbineRotorGroup = new THREE.Group();
    this.turbineRotorGroup.position.set(0, 1.2, 0);

    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 6.2, 16);
    const shaft = new THREE.Mesh(shaftGeo, this.mat.get('chromeSteel'));
    shaft.rotation.z = Math.PI / 2;
    shaft.position.x = 1.0;
    this.turbineRotorGroup.add(shaft);

    // Multi-stage turbine blade discs
    for (let stage = 0; stage < 8; stage++) {
      const discGeo = new THREE.CylinderGeometry(0.3 + stage * 0.08, 0.3 + stage * 0.08, 0.08, 16);
      const disc = new THREE.Mesh(discGeo, this.mat.get('turbineRotor'));
      disc.rotation.z = Math.PI / 2;
      disc.position.x = -1.6 + stage * 0.45;
      this.turbineRotorGroup.add(disc);
    }
    turboGroup.add(this.turbineRotorGroup);

    // Electrical Generator Unit (Synchronous 18.5 MWe)
    const genGroup = new THREE.Group();
    genGroup.position.set(3.8, 1.2, 0);

    const genCasingGeo = new THREE.BoxGeometry(2.4, 1.8, 1.8);
    const genCasing = new THREE.Mesh(genCasingGeo, this.mat.get('generatorStator'));
    genCasing.castShadow = true;
    genGroup.add(genCasing);

    // Stator copper coils inspection rings
    for (let i = -0.8; i <= 0.8; i += 0.4) {
      const coilRingGeo = new THREE.TorusGeometry(0.95, 0.06, 8, 24);
      const coilRing = new THREE.Mesh(coilRingGeo, this.mat.get('turbineRotor'));
      coilRing.rotation.y = Math.PI / 2;
      coilRing.position.x = i;
      genGroup.add(coilRing);
    }

    // Heavy Electrical Output Busbars heading to transformers
    const busbarGeo = new THREE.BoxGeometry(0.18, 1.4, 0.18);
    for (let b = -0.4; b <= 0.4; b += 0.4) {
      const busbar = new THREE.Mesh(busbarGeo, this.mat.get('coldLegPipe'));
      busbar.position.set(b, 1.5, 0.8);
      genGroup.add(busbar);
    }

    // Heavy concrete foundation bed
    const bedGeo = new THREE.BoxGeometry(7.5, 0.8, 3.2);
    const bed = new THREE.Mesh(bedGeo, this.mat.get('regolithConcrete'));
    bed.position.set(1.2, 0.4, 0);
    bed.receiveShadow = true;
    turboGroup.add(bed);

    turboGroup.add(genGroup);

    this.registerInteractive(turboGroup, 'turbine');
    this.group.add(turboGroup);
  }

  buildContainmentDome() {
    // Outer Geodesic Containment Dome
    const domeGroup = new THREE.Group();
    domeGroup.position.set(0, 0, 0);

    // Geodesic reinforced dome over the reactor hall
    const domeRadius = 7.2;
    const domeGeo = new THREE.SphereGeometry(
      domeRadius,
      32,
      20,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

    // We make two halves: one rear half (static) and one front half (movable / cutaway)
    const rearHalfGeo = new THREE.SphereGeometry(
      domeRadius,
      32,
      20,
      Math.PI,
      Math.PI,
      0,
      Math.PI / 2
    );
    const rearDome = new THREE.Mesh(rearHalfGeo, this.mat.get('darkAlloy'));
    rearDome.castShadow = true;
    rearDome.receiveShadow = true;
    domeGroup.add(rearDome);

    const frontHalfGeo = new THREE.SphereGeometry(
      domeRadius,
      32,
      20,
      0,
      Math.PI,
      0,
      Math.PI / 2
    );
    this.containmentDomeHalf = new THREE.Mesh(frontHalfGeo, this.mat.get('darkAlloy'));
    this.containmentDomeHalf.castShadow = true;
    this.containmentDomeHalf.receiveShadow = true;
    domeGroup.add(this.containmentDomeHalf);

    // Structural reinforcing ribs on the dome
    for (let i = 0; i < 8; i++) {
      const ribAngle = (i / 8) * Math.PI * 2;
      const ribGeo = new THREE.TorusGeometry(domeRadius, 0.15, 6, 24, Math.PI / 2);
      const rib = new THREE.Mesh(ribGeo, this.mat.get('chromeSteel'));
      rib.rotation.y = ribAngle;
      rib.rotation.z = Math.PI / 2;
      domeGroup.add(rib);
    }

    // Top atmospheric beacon tower
    const towerGeo = new THREE.CylinderGeometry(0.12, 0.18, 3.2, 8);
    const tower = new THREE.Mesh(towerGeo, this.mat.get('chromeSteel'));
    tower.position.y = domeRadius + 1.6;
    domeGroup.add(tower);

    // Warning flashing beacon light
    const beaconLightGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const beaconLight = new THREE.Mesh(beaconLightGeo, this.mat.get('warningLightAmber'));
    beaconLight.position.y = domeRadius + 3.2;
    domeGroup.add(beaconLight);
    this.beaconLight = beaconLight;

    this.registerInteractive(domeGroup, 'shielding');
    this.group.add(domeGroup);
  }

  buildControlRoom() {
    const crGroup = new THREE.Group();
    crGroup.position.set(-8.5, 0, 2.5);

    // Habitat pressurized module cylinder
    const habGeo = new THREE.CylinderGeometry(2.4, 2.4, 4.2, 24);
    const hab = new THREE.Mesh(habGeo, this.mat.get('habitatShell'));
    hab.rotation.z = Math.PI / 2;
    hab.position.y = 2.4;
    hab.castShadow = true;
    crGroup.add(hab);

    // End observation dome windows
    const windowDomeGeo = new THREE.SphereGeometry(2.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const winMesh = new THREE.Mesh(windowDomeGeo, this.mat.get('cutawayGlass'));
    winMesh.rotation.z = -Math.PI / 2;
    winMesh.position.set(2.1, 2.4, 0);
    crGroup.add(winMesh);

    // Interior SCADA console desk and glowing telemetry screens
    const consoleGeo = new THREE.BoxGeometry(2.2, 0.8, 1.2);
    const consoleMesh = new THREE.Mesh(consoleGeo, this.mat.get('darkAlloy'));
    consoleMesh.position.set(0.6, 1.6, 0);
    crGroup.add(consoleMesh);

    const screenGeo = new THREE.PlaneGeometry(1.4, 0.6);
    const screenMesh = new THREE.Mesh(screenGeo, this.mat.get('screenGlow'));
    screenMesh.rotation.y = -Math.PI / 2;
    screenMesh.position.set(1.4, 2.3, 0);
    crGroup.add(screenMesh);

    // High-gain communication dish towards Earth
    const dishMastGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5, 8);
    const mast = new THREE.Mesh(dishMastGeo, this.mat.get('chromeSteel'));
    mast.position.set(-0.8, 5.2, 0);
    crGroup.add(mast);

    const dishGeo = new THREE.SphereGeometry(1.1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeo, this.mat.get('chromeSteel'));
    dish.position.set(-0.8, 6.4, 0);
    dish.rotation.x = -Math.PI / 4;
    dish.rotation.y = Math.PI / 6;
    crGroup.add(dish);

    // Airlock corridor connecting control room to main containment hall
    const tunnelCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.1, 2.0, 0),
      new THREE.Vector3(4.5, 2.0, -1.0),
      new THREE.Vector3(6.5, 2.0, -2.0)
    ]);
    const tunnelGeo = new THREE.TubeGeometry(tunnelCurve, 20, 0.9, 16, false);
    const tunnel = new THREE.Mesh(tunnelGeo, this.mat.get('habitatShell'));
    crGroup.add(tunnel);

    this.registerInteractive(crGroup, 'control_room');
    this.group.add(crGroup);
  }

  setCutawayState(isOpen) {
    if (this.containmentDomeHalf) {
      // In cutaway, slide or hide the front dome shell
      this.containmentDomeHalf.visible = !isOpen;
    }
    if (this.vesselCutawayShell) {
      // Toggle vessel between solid steel and transparent diagnostic cutaway
      this.vesselCutawayShell.material = isOpen
        ? this.mat.get('cutawayGlass')
        : this.mat.get('vesselShell');
    }
  }

  update(delta, simState) {
    // 1. Animate Control Rod height based on simState.controlRodInsertion (0% to 100%)
    if (this.controlRodsGroup) {
      // 0% insertion = fully raised (y = 4.4), 100% insertion = fully lowered (y = 3.2)
      const targetY = 4.4 - (simState.controlRodInsertion / 100.0) * 1.2;
      this.controlRodsGroup.position.y = THREE.MathUtils.lerp(
        this.controlRodsGroup.position.y,
        targetY,
        delta * 3.0
      );
    }

    // 2. Animate Turbine Rotor rotation (speed tied to RPM)
    if (this.turbineRotorGroup) {
      const rotSpeed = (simState.turbineRPM / 60) * Math.PI * 2 * 0.05;
      this.turbineRotorGroup.rotation.x += rotSpeed * delta;
    }

    // 3. Cherenkov pool glow pulsation (faster/brighter when high thermal power)
    if (this.cherenkovPoolMesh && this.cherenkovLight) {
      const powerRatio = simState.thermalMWth / 50.0;
      const pulse = 1.0 + Math.sin(Date.now() * 0.003 * powerRatio) * 0.15;
      this.cherenkovPoolMesh.material.emissiveIntensity = 0.45 * pulse * powerRatio;
      this.cherenkovLight.intensity = 3.5 * pulse * powerRatio;
    }

    // 4. Flashing warning beacon
    if (this.beaconLight) {
      const flash = (Math.sin(Date.now() * 0.005) + 1.0) * 0.5;
      this.beaconLight.material.color.setHex(flash > 0.6 ? 0xf59e0b : 0x451a03);
    }
  }
}
