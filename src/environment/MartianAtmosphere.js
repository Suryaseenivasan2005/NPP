import * as THREE from 'three';
import { ProceduralTextures } from '../reactor/ProceduralTextures.js';

/**
 * MARS-01 Atmospheric Sky & Environmental Dust Storm
 * Features Martian reddish sky gradient, distant crater ridges, Phobos/Deimos moons, and drifting dust particles.
 */

export class MartianAtmosphere {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.glowTexture = ProceduralTextures.getGlowSprite();

    this.buildSkyDome();
    this.buildDistantMountains();
    this.buildMoons();
    this.buildDustParticles();
  }

  buildSkyDome() {
    // Large hemisphere sky dome with vertex colors representing atmospheric scattering
    const skyGeo = new THREE.SphereGeometry(140, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const count = skyGeo.attributes.position.count;
    const colors = new Float32Array(count * 3);
    const pos = skyGeo.attributes.position;

    // Zenith: darker deep ochre/brown (#451b14), Horizon: bright dusty salmon orange (#bf542c)
    const zenithColor = new THREE.Color(0x38120b);
    const horizonColor = new THREE.Color(0xd95a2b);

    for (let i = 0; i < count; i++) {
      const y = pos.getY(i);
      const factor = Math.min(1.0, y / 120);
      const c = horizonColor.clone().lerp(zenithColor, factor);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    skyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const skyMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      fog: false
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(skyMesh);
  }

  buildDistantMountains() {
    // Ring of jagged mountain ridges around the perimeter horizon
    const mountainRadius = 120;
    const segments = 48;
    const mountainGroup = new THREE.Group();

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * mountainRadius;
      const z = Math.sin(angle) * mountainRadius;
      const height = 14 + Math.sin(i * 0.8) * 8 + Math.cos(i * 1.7) * 5;
      const width = 16 + Math.random() * 10;

      const peakGeo = new THREE.ConeGeometry(width, height, 5);
      const peakMat = new THREE.MeshStandardMaterial({
        color: 0x6e2510,
        roughness: 0.95,
        metalness: 0.05
      });
      const peak = new THREE.Mesh(peakGeo, peakMat);
      peak.position.set(x, height * 0.45, z);
      peak.rotation.y = Math.random() * Math.PI;
      mountainGroup.add(peak);
    }
    this.group.add(mountainGroup);
  }

  buildMoons() {
    // Phobos (larger, irregular Martian moon)
    const phobosGeo = new THREE.DodecahedronGeometry(2.4, 2);
    const phobosMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const phobos = new THREE.Mesh(phobosGeo, phobosMat);
    phobos.position.set(65, 80, -75);
    this.group.add(phobos);

    // Deimos (smaller, distant faint moon)
    const deimosGeo = new THREE.DodecahedronGeometry(1.0, 1);
    const deimosMat = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    const deimos = new THREE.Mesh(deimosGeo, deimosMat);
    deimos.position.set(-80, 95, -60);
    this.group.add(deimos);
  }

  buildDustParticles() {
    // Thousands of drifting dust particles creating Martian atmospheric storm ambiance
    this.dustCount = 600;
    const dustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.dustCount * 3);
    this.dustSpeeds = [];

    for (let i = 0; i < this.dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 1] = 0.5 + Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 110;

      this.dustSpeeds.push({
        x: 1.5 + Math.random() * 2.5,  // Martian wind blowing east
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.8
      });
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.22,
      map: this.glowTexture,
      transparent: true,
      opacity: 0.45,
      color: 0xdf6e40,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.dustParticles = new THREE.Points(dustGeo, dustMat);
    this.group.add(this.dustParticles);
  }

  update(delta) {
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < this.dustCount; i++) {
        let x = pos.getX(i) + this.dustSpeeds[i].x * delta;
        let y = pos.getY(i) + this.dustSpeeds[i].y * delta;
        let z = pos.getZ(i) + this.dustSpeeds[i].z * delta;

        // Wrap around boundaries
        if (x > 55) x = -55;
        if (y < 0.5) y = 25;
        if (y > 25) y = 0.5;
        if (z > 55) z = -55;
        if (z < -55) z = 55;

        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
    }
  }
}
