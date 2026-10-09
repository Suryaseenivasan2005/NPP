import * as THREE from 'three';

/**
 * MARS-01 Scene & WebGL Renderer Manager
 * Manages Three.js scene graph, camera, tone mapping, shadows, and viewport resizing.
 */

export class SceneManager {
  constructor(canvasContainer) {
    this.container = canvasContainer;

    // 1. Scene
    this.scene = new THREE.Scene();
    // Atmospheric Martian fog
    this.scene.fog = new THREE.FogExp2(0x7c2d12, 0.009);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      500
    );
    this.camera.position.set(16, 12, 22);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Physically correct lighting & ACES Filmic tonemapping
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Window resize handler
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
