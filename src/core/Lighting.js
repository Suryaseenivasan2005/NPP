import * as THREE from 'three';

/**
 * MARS-01 Cinematic Lighting Setup
 * Combines direct Martian sunlight with long shadows, ambient dust scattering, and high-tech facility accents.
 */

export class Lighting {
  constructor(scene) {
    this.scene = scene;
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

    // 3. Cool Blue Tech Accent Light (subtle sci-fi contrast from the opposite angle)
    this.coolAccent = new THREE.DirectionalLight(0x38bdf8, 0.45);
    this.coolAccent.position.set(-25, 18, -25);
    this.scene.add(this.coolAccent);

    // 4. Reactor Hall Interior Spotlights
    this.coreSpot = new THREE.SpotLight(0xffedd5, 2.5, 30, Math.PI / 3, 0.5);
    this.coreSpot.position.set(0, 14, 0);
    this.coreSpot.target.position.set(0, 2.5, 0);
    this.scene.add(this.coreSpot);
    this.scene.add(this.coreSpot.target);
  }
}
