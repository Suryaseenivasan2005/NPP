import * as THREE from 'three';
import { ProceduralTextures } from '../reactor/ProceduralTextures.js';

/**
 * MARS-01 Atmospheric Sky & Environmental Dust Storm
 * Features dynamic Day/Night sky dome, starry night field, Phobos/Deimos orbits, and drifting dust particles.
 */

export class MartianAtmosphere {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.glowTexture = ProceduralTextures.getGlowSprite();

    // Sky Dome Mesh
    this.skyMesh = null;
    this.skyPositions = null;
    this.skyColors = null;

    // Starfield Mesh
    this.starfield = null;

    // Moons
    this.phobos = null;
    this.deimos = null;

    this.buildSkyDome();
    this.buildStarfield();
    this.buildDistantMountains();
    this.buildMoons();
    this.buildDustParticles();
  }

  buildSkyDome() {
    const skyGeo = new THREE.SphereGeometry(140, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const count = skyGeo.attributes.position.count;
    this.skyPositions = skyGeo.attributes.position;
    this.skyColors = new Float32Array(count * 3);

    skyGeo.setAttribute('color', new THREE.BufferAttribute(this.skyColors, 3));

    const skyMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
      fog: false
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.group.add(this.skyMesh);

    // Initial daytime color populate
    this.updateSkyColors(12.0);
  }

  buildStarfield() {
    // 1,200 twinkling stars visible during Martian night
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Upper hemisphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0); // uniform sphere
      const r = 136;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.max(8, Math.abs(r * Math.cos(phi))); // keep above horizon
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      sizes[i] = 0.2 + Math.random() * 0.45;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.starMat = new THREE.PointsMaterial({
      size: 0.35,
      map: this.glowTexture,
      transparent: true,
      opacity: 0.0, // starts invisible during day
      blending: THREE.AdditiveBlending,
      color: 0xffffff,
      depthWrite: false
    });

    this.starfield = new THREE.Points(starGeo, this.starMat);
    this.group.add(this.starfield);
  }

  buildDistantMountains() {
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
    // Phobos (larger, irregular Martian moon orbiting rapidly)
    const phobosGeo = new THREE.DodecahedronGeometry(2.4, 2);
    const phobosMat = new THREE.MeshStandardMaterial({
      color: 0xdfd9d5,
      roughness: 0.9,
      metalness: 0.1
    });
    this.phobos = new THREE.Mesh(phobosGeo, phobosMat);
    this.phobos.position.set(65, 80, -75);
    this.group.add(this.phobos);

    // Deimos (smaller, distant faint moon)
    const deimosGeo = new THREE.DodecahedronGeometry(1.0, 1);
    const deimosMat = new THREE.MeshStandardMaterial({
      color: 0xbbbbbb,
      roughness: 0.9
    });
    this.deimos = new THREE.Mesh(deimosGeo, deimosMat);
    this.deimos.position.set(-80, 95, -60);
    this.group.add(this.deimos);
  }

  buildDustParticles() {
    this.dustCount = 600;
    const dustGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.dustCount * 3);
    this.dustSpeeds = [];

    for (let i = 0; i < this.dustCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 1] = 0.5 + Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 110;

      this.dustSpeeds.push({
        x: 1.5 + Math.random() * 2.5,
        y: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.8
      });
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.dustMat = new THREE.PointsMaterial({
      size: 0.22,
      map: this.glowTexture,
      transparent: true,
      opacity: 0.45,
      color: 0xdf6e40,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.dustParticles = new THREE.Points(dustGeo, this.dustMat);
    this.group.add(this.dustParticles);
  }

  updateSkyColors(solTime) {
    if (!this.skyMesh) return;

    // Sol angle calculation
    const solAngle = ((solTime - 6.0) / 24.0) * Math.PI * 2;
    const sinAngle = Math.sin(solAngle); // > 0 is day, <= 0 is night

    let zenithColor = new THREE.Color();
    let horizonColor = new THREE.Color();
    let fogColor = new THREE.Color();

    if (sinAngle > 0.25) {
      // 1. High Martian Day
      zenithColor.setHex(0x38120b);  // Deep burnt sienna
      horizonColor.setHex(0xd95a2b); // Vibrant dusty salmon orange
      fogColor.setHex(0x7c2d12);
    } else if (sinAngle > 0.0) {
      // 2. Martian Twilight / Blue Sunset
      const t = sinAngle / 0.25; // 0 (horizon) to 1 (day)
      const sunsetZenith = new THREE.Color(0x1a0f2e);  // Dusky twilight purple
      const sunsetHorizon = new THREE.Color(0x2563eb).lerp(new THREE.Color(0xf97316), t); // Blue sunset halo
      zenithColor.copy(sunsetZenith).lerp(new THREE.Color(0x38120b), t);
      horizonColor.copy(sunsetHorizon);
      fogColor.setHex(0x3b1d28);
    } else {
      // 3. Martian Night
      zenithColor.setHex(0x02040a);  // Deep indigo space
      horizonColor.setHex(0x0a1120); // Dark nocturnal horizon
      fogColor.setHex(0x080d18);
    }

    const count = this.skyPositions.count;
    for (let i = 0; i < count; i++) {
      const y = this.skyPositions.getY(i);
      const factor = Math.min(1.0, y / 120);
      const c = horizonColor.clone().lerp(zenithColor, factor);
      this.skyColors[i * 3] = c.r;
      this.skyColors[i * 3 + 1] = c.g;
      this.skyColors[i * 3 + 2] = c.b;
    }

    this.skyMesh.geometry.attributes.color.needsUpdate = true;

    // Update scene fog
    if (this.scene.fog) {
      this.scene.fog.color.copy(fogColor);
    }

    // Starfield fade-in at night
    if (this.starMat) {
      if (sinAngle <= 0.05) {
        // Deep night: full stars with subtle twinkling
        const twinkle = 0.85 + Math.sin(Date.now() * 0.002) * 0.15;
        this.starMat.opacity = THREE.MathUtils.lerp(
          this.starMat.opacity,
          Math.min(1.0, (-sinAngle + 0.3) * 1.5) * twinkle,
          0.1
        );
      } else {
        // Daytime: stars hidden
        this.starMat.opacity = THREE.MathUtils.lerp(this.starMat.opacity, 0.0, 0.15);
      }
    }
  }

  update(delta, solTime = 12.0) {
    // 1. Update Sky Colors & Starfield based on Sol Time
    this.updateSkyColors(solTime);

    // 2. Orbit Phobos across the Martian sky (~3.1 orbits per Martian sol)
    if (this.phobos) {
      const phobosAngle = (solTime * 3.14 * (Math.PI / 12.0));
      this.phobos.position.x = Math.cos(phobosAngle) * 95;
      this.phobos.position.y = Math.max(10, Math.sin(phobosAngle) * 65 + 35);
      this.phobos.position.z = Math.sin(phobosAngle) * 95;
    }

    // 3. Move drifting dust storm particles
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < this.dustCount; i++) {
        let x = pos.getX(i) + this.dustSpeeds[i].x * delta;
        let y = pos.getY(i) + this.dustSpeeds[i].y * delta;
        let z = pos.getZ(i) + this.dustSpeeds[i].z * delta;

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
