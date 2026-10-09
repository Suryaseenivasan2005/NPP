import * as THREE from 'three';

/**
 * MARS-01 Industrial Facility Architecture
 * Models the external Mars infrastructure: radiative heat rejection arrays,
 * storage spheres, pipe trestles, rover, and communication masts.
 */

export class FacilityArchitecture {
  constructor(materials) {
    this.mat = materials;
    this.group = new THREE.Group();

    this.buildRadiatorArrays();
    this.buildStorageSpheres();
    this.buildPipeTrestles();
    this.buildMartianRover();
    this.buildPerimeterTowers();
  }

  buildRadiatorArrays() {
    // Martian closed-loop radiative cooling panel bank
    const radiatorGroup = new THREE.Group();
    radiatorGroup.position.set(12.0, 0, -8.0);

    const panelCount = 5;
    for (let i = 0; i < panelCount; i++) {
      const zOffset = i * 3.2;

      // Vertical radiator fin array
      const panelGeo = new THREE.BoxGeometry(0.3, 6.5, 2.6);
      const panel = new THREE.Mesh(panelGeo, this.mat.get('radiatorPanels'));
      panel.position.set(0, 3.4, zOffset);
      panel.castShadow = true;
      radiatorGroup.add(panel);

      // Support truss legs
      const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
      const leg1 = new THREE.Mesh(legGeo, this.mat.get('chromeSteel'));
      leg1.position.set(-0.3, 0.6, zOffset - 0.8);
      radiatorGroup.add(leg1);

      const leg2 = leg1.clone();
      leg2.position.set(0.3, 0.6, zOffset + 0.8);
      radiatorGroup.add(leg2);

      // Ammonia heat pipe manifold header
      const pipeGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.8, 12);
      const pipe = new THREE.Mesh(pipeGeo, this.mat.get('coldLegPipe'));
      pipe.rotation.x = Math.PI / 2;
      pipe.position.set(0, 6.7, zOffset);
      radiatorGroup.add(pipe);
    }

    this.group.add(radiatorGroup);
  }

  buildStorageSpheres() {
    // Cryogenic and reserve demineralized water spherical tanks
    const tankGroup = new THREE.Group();
    tankGroup.position.set(-11.0, 0, -6.5);

    const tankPositions = [
      { x: 0, z: 0, r: 2.2 },
      { x: 3.8, z: 1.2, r: 1.8 },
      { x: -3.5, z: 1.0, r: 1.6 }
    ];

    tankPositions.forEach((tp) => {
      // Tank sphere
      const sphereGeo = new THREE.SphereGeometry(tp.r, 24, 16);
      const sphere = new THREE.Mesh(sphereGeo, this.mat.get('darkAlloy'));
      sphere.position.set(tp.x, tp.r + 1.2, tp.z);
      sphere.castShadow = true;
      tankGroup.add(sphere);

      // Support tripod legs
      for (let leg = 0; leg < 4; leg++) {
        const angle = (leg / 4) * Math.PI * 2;
        const legMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.12, 1.8, 8),
          this.mat.get('chromeSteel')
        );
        legMesh.position.set(
          tp.x + Math.cos(angle) * (tp.r * 0.75),
          0.9,
          tp.z + Math.sin(angle) * (tp.r * 0.75)
        );
        tankGroup.add(legMesh);
      }
    });

    this.group.add(tankGroup);
  }

  buildPipeTrestles() {
    // High-pressure pipe bridge between containment and balance-of-plant
    const trestleGroup = new THREE.Group();

    for (let x = 6.0; x <= 12.0; x += 3.0) {
      // A-frame structural support
      const frameGeo = new THREE.CylinderGeometry(0.1, 0.1, 4.5, 8);
      const frame1 = new THREE.Mesh(frameGeo, this.mat.get('chromeSteel'));
      frame1.position.set(x, 2.25, -3.5);
      frame1.rotation.z = 0.15;
      trestleGroup.add(frame1);

      const frame2 = new THREE.Mesh(frameGeo, this.mat.get('chromeSteel'));
      frame2.position.set(x, 2.25, -4.5);
      frame2.rotation.z = -0.15;
      trestleGroup.add(frame2);

      // Crossbar
      const barGeo = new THREE.BoxGeometry(0.2, 0.2, 1.4);
      const bar = new THREE.Mesh(barGeo, this.mat.get('chromeSteel'));
      bar.position.set(x, 4.2, -4.0);
      trestleGroup.add(bar);
    }

    // Long pipe runs through the trestle
    const pipe1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 8.0, 16),
      this.mat.get('steamPipe')
    );
    pipe1.rotation.z = Math.PI / 2;
    pipe1.position.set(9.0, 4.4, -3.8);
    trestleGroup.add(pipe1);

    const pipe2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 8.0, 16),
      this.mat.get('coldLegPipe')
    );
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(9.0, 4.4, -4.2);
    trestleGroup.add(pipe2);

    this.group.add(trestleGroup);
  }

  buildMartianRover() {
    // 6-wheeled robotic logistics rover parked outside the facility
    const roverGroup = new THREE.Group();
    roverGroup.position.set(-6.5, 0.2, 7.5);
    roverGroup.rotation.y = Math.PI / 5;

    // Chassis body
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.8, 1.4);
    const body = new THREE.Mesh(bodyGeo, this.mat.get('habitatShell'));
    body.position.y = 0.9;
    body.castShadow = true;
    roverGroup.add(body);

    // Rover 6 rugged wheels
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 16);
    wheelGeo.rotateZ(Math.PI / 2);

    const wheelPositions = [
      { x: -1.0, z: 0.9 },
      { x: 0, z: 0.9 },
      { x: 1.0, z: 0.9 },
      { x: -1.0, z: -0.9 },
      { x: 0, z: -0.9 },
      { x: 1.0, z: -0.9 }
    ];

    wheelPositions.forEach((wp) => {
      const wheel = new THREE.Mesh(wheelGeo, this.mat.get('darkAlloy'));
      wheel.position.set(wp.x, 0.38, wp.z);
      wheel.castShadow = true;
      roverGroup.add(wheel);
    });

    // Sensor mast / camera head
    const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8);
    const mast = new THREE.Mesh(mastGeo, this.mat.get('chromeSteel'));
    mast.position.set(0.9, 1.6, 0.4);
    roverGroup.add(mast);

    const headGeo = new THREE.BoxGeometry(0.3, 0.2, 0.2);
    const head = new THREE.Mesh(headGeo, this.mat.get('darkAlloy'));
    head.position.set(0.9, 2.1, 0.4);
    roverGroup.add(head);

    this.group.add(roverGroup);
  }

  buildPerimeterTowers() {
    // Perimeter floodlight & beacon towers
    const towerCoords = [
      { x: -14, z: 12 },
      { x: 16, z: 12 },
      { x: 16, z: -12 },
      { x: -14, z: -12 }
    ];

    this.floodlights = [];

    towerCoords.forEach((tc) => {
      const pylonGeo = new THREE.CylinderGeometry(0.15, 0.35, 9.0, 8);
      const pylon = new THREE.Mesh(pylonGeo, this.mat.get('darkAlloy'));
      pylon.position.set(tc.x, 4.5, tc.z);
      this.group.add(pylon);

      // Amber warning light on top
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 8, 8),
        this.mat.get('warningLightAmber')
      );
      beacon.position.set(tc.x, 9.2, tc.z);
      this.group.add(beacon);

      // Downward floodlight
      const floodlight = new THREE.SpotLight(0xffedd5, 0.2, 26, Math.PI / 4, 0.4);
      floodlight.position.set(tc.x, 8.8, tc.z);
      floodlight.target.position.set(tc.x * 0.5, 0, tc.z * 0.5);
      this.group.add(floodlight);
      this.group.add(floodlight.target);

      this.floodlights.push(floodlight);
    });
  }

  update(solTime) {
    // Sol angle: sinAngle <= 0.15 indicates dusk/night
    const solAngle = ((solTime - 6.0) / 24.0) * Math.PI * 2;
    const isNight = Math.sin(solAngle) <= 0.15;

    // Modulate floodlight intensity: bright at night, dim/off during midday
    const targetIntensity = isNight ? 2.5 : 0.15;
    for (const fl of this.floodlights) {
      fl.intensity = THREE.MathUtils.lerp(fl.intensity, targetIntensity, 0.1);
    }
  }
}
