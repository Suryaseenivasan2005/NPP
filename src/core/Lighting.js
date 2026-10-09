import * as THREE from 'three';

/**
 * MARS-01 Cinematic Lighting Setup with Dynamic Day & Night (Sol) Simulation
 * Accurately models Martian solar arcs, blue sunsets, and nocturnal facility illumination.
 */

export class Lighting {
  constructor(scene) {
    this.scene = scene;

    this.sun = null;
    this.hemiLight = null;
    this.coolAccent = null;
    this.nightMoonLight = null;
    this.coreSpot = null;

    this.buildLights();
  }

  buildLights() {
    // 1. Martian Sun (Directional Light casting deep shadows)
    this.sun = new THREE.DirectionalLight(0xffecd1, 2.2);
    this.sun.position.set(38, 42, 28);
    this.sun.castShadow = true;

    this.sun.shadow.mapSize.width = 2048;
    this.sun.shadow.mapSize.height = 2048;
    this.sun.shadow.camera.near = 5;
    this.sun.shadow.camera.far = 140;

    const shadowExtent = 28;
    this.sun.shadow.camera.left = -shadowExtent;
    this.sun.shadow.camera.right = shadowExtent;
    this.sun.shadow.camera.top = shadowExtent;
    this.sun.shadow.camera.bottom = -shadowExtent;
    this.sun.shadow.bias = -0.0005;

    this.scene.add(this.sun);

    // 2. Martian Atmospheric Hemisphere Fill Light
    this.hemiLight = new THREE.HemisphereLight(0xd95a2b, 0x2e0e07, 0.95);
    this.scene.add(this.hemiLight);

    // 3. Cool Blue Tech Accent Light
    this.coolAccent = new THREE.DirectionalLight(0x38bdf8, 0.45);
    this.coolAccent.position.set(-25, 18, -25);
    this.scene.add(this.coolAccent);

    // 4. Night Starlight & Phobos Moonlight (Active at night)
    this.nightMoonLight = new THREE.DirectionalLight(0x38bdf8, 0.0);
    this.nightMoonLight.position.set(-30, 40, -40);
    this.scene.add(this.nightMoonLight);

    // 5. Reactor Hall Interior Spotlights
    this.coreSpot = new THREE.SpotLight(0xffedd5, 2.5, 30, Math.PI / 3, 0.5);
    this.coreSpot.position.set(0, 14, 0);
    this.coreSpot.target.position.set(0, 2.5, 0);
    this.scene.add(this.coreSpot);
    this.scene.add(this.coreSpot.target);
  }

  update(solTime) {
    // Sol angle: 6h is Sunrise (theta = 0), 12h is Noon (theta = pi/2), 18h is Sunset (theta = pi), 0h is Midnight (3pi/2)
    const solAngle = ((solTime - 6.0) / 24.0) * Math.PI * 2;
    const sinAngle = Math.sin(solAngle);
    const cosAngle = Math.cos(solAngle);

    // Sun trajectory
    const sunX = cosAngle * 48.0;
    const sunY = sinAngle * 44.0;
    const sunZ = Math.sin(solAngle * 0.5) * 16.0 + 20.0;

    this.sun.position.set(sunX, Math.max(-10, sunY), sunZ);

    if (sinAngle > 0.05) {
      // Daytime / Twilight
      const sunElevation = sinAngle; // 0 to 1
      this.sun.intensity = THREE.MathUtils.lerp(0.3, 2.4, sunElevation);

      if (sunElevation < 0.28) {
        // Dawn or Sunset: Famous Martian Blue Twilight scattering
        this.sun.color.setHex(0x93c5fd); // Pale cyan-blue sun
        this.hemiLight.color.setHex(0xb45309); // Dusky amber sky
        this.hemiLight.groundColor.setHex(0x1e1b4b);
        this.hemiLight.intensity = THREE.MathUtils.lerp(0.3, 0.7, sunElevation / 0.28);
      } else {
        // High Sun: Warm peach/butterscotch
        this.sun.color.setHex(0xffecd1);
        this.hemiLight.color.setHex(0xd95a2b); // Salmon orange
        this.hemiLight.groundColor.setHex(0x2e0e07);
        this.hemiLight.intensity = 0.95;
      }

      this.nightMoonLight.intensity = 0.0;
      this.coolAccent.intensity = 0.45;
    } else {
      // Night (Sun below horizon)
      this.sun.intensity = 0.0;
      this.hemiLight.color.setHex(0x0f172a); // Deep midnight slate
      this.hemiLight.groundColor.setHex(0x020617);
      this.hemiLight.intensity = 0.2;

      // Phobos moonlight takes over
      this.nightMoonLight.intensity = 0.35;
      this.coolAccent.intensity = 0.15;
    }
  }
}
