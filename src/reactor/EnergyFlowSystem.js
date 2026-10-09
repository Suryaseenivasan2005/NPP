import * as THREE from 'three';
import { ProceduralTextures } from './ProceduralTextures.js';

/**
 * MARS-01 Animated Energy Flow & Particle System
 * Conceptually visualizes the 5-stage thermodynamic conversion:
 * 1. Fission thermal release
 * 2. Primary coolant heat transfer
 * 3. Steam generation
 * 4. Turbine kinetic rotation
 * 5. Electrical power distribution
 */

export class EnergyFlowSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.glowTexture = ProceduralTextures.getGlowSprite();

    // Spline pathways
    this.createPathways();

    // Particle Systems
    this.primaryParticles = null;
    this.steamParticles = null;
    this.electricalParticles = null;
    this.fissionParticles = null;

    this.buildParticleSystems();
  }

  createPathways() {
    // Primary Loop closed circuit
    this.primaryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.5, 0),        // In core
      new THREE.Vector3(1.5, 4.4, 0),      // Out hot leg
      new THREE.Vector3(2.6, 4.4, 0),
      new THREE.Vector3(3.6, 3.8, 0),      // Entering steam gen
      new THREE.Vector3(4.5, 2.5, 0),      // Inside U-tubes
      new THREE.Vector3(3.6, 1.8, 0),      // Leaving steam gen
      new THREE.Vector3(2.6, 1.8, 0),      // In coolant pump
      new THREE.Vector3(1.5, 3.0, 0),      // Cold leg return
      new THREE.Vector3(0, 1.6, 0)         // Back into core bottom
    ], true);

    // Secondary Steam circuit (Steam Gen top -> Turbine -> Radiator loop)
    this.steamCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(4.5, 5.2, 0),      // Steam gen top
      new THREE.Vector3(5.5, 5.8, 0),      // Steam pipe arch
      new THREE.Vector3(7.2, 4.8, 0),
      new THREE.Vector3(8.5, 2.4, 0),      // High pressure turbine
      new THREE.Vector3(9.8, 2.4, 0),      // Low pressure turbine
      new THREE.Vector3(10.5, 1.4, 0),     // Exhaust to condenser
      new THREE.Vector3(7.5, 0.8, 0),      // Returning condensate
      new THREE.Vector3(4.5, 1.4, 0)       // Back to steam gen bottom
    ], true);

    // Electrical output busbar circuit (Generator -> Grid lines)
    this.electricCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(12.3, 2.4, 0),
      new THREE.Vector3(12.3, 3.8, 0.8),
      new THREE.Vector3(13.5, 4.5, 1.5),
      new THREE.Vector3(15.0, 4.5, 2.5),
      new THREE.Vector3(17.0, 3.5, 4.0)
    ]);
  }

  buildParticleSystems() {
    // 1. Primary Loop Particles (Hot orange / cold cyan)
    const pCount = 140;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);
    this.primaryOffsets = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      this.primaryOffsets[i] = i / pCount;
      const pt = this.primaryCurve.getPointAt(this.primaryOffsets[i]);
      pPositions[i * 3] = pt.x;
      pPositions[i * 3 + 1] = pt.y;
      pPositions[i * 3 + 2] = pt.z;

      // Color: hot orange for t < 0.5, cold cyan for t >= 0.5
      if (this.primaryOffsets[i] < 0.5) {
        pColors[i * 3] = 1.0;
        pColors[i * 3 + 1] = 0.45;
        pColors[i * 3 + 2] = 0.1;
      } else {
        pColors[i * 3] = 0.1;
        pColors[i * 3 + 1] = 0.8;
        pColors[i * 3 + 2] = 0.95;
      }
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.35,
      map: this.glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false
    });
    this.primaryParticles = new THREE.Points(pGeo, pMat);
    this.group.add(this.primaryParticles);

    // 2. Secondary Steam Particles (Bright cyan/white vapor)
    const sCount = 120;
    const sGeo = new THREE.BufferGeometry();
    const sPositions = new Float32Array(sCount * 3);
    this.steamOffsets = new Float32Array(sCount);

    for (let i = 0; i < sCount; i++) {
      this.steamOffsets[i] = i / sCount;
      const pt = this.steamCurve.getPointAt(this.steamOffsets[i]);
      sPositions[i * 3] = pt.x;
      sPositions[i * 3 + 1] = pt.y;
      sPositions[i * 3 + 2] = pt.z;
    }
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPositions, 3));

    const sMat = new THREE.PointsMaterial({
      size: 0.38,
      map: this.glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: 0x38bdf8,
      depthWrite: false
    });
    this.steamParticles = new THREE.Points(sGeo, sMat);
    this.group.add(this.steamParticles);

    // 3. Electrical Energy Pulses (Vibrant yellow/gold)
    const eCount = 60;
    const eGeo = new THREE.BufferGeometry();
    const ePositions = new Float32Array(eCount * 3);
    this.electricOffsets = new Float32Array(eCount);

    for (let i = 0; i < eCount; i++) {
      this.electricOffsets[i] = i / eCount;
      const pt = this.electricCurve.getPointAt(this.electricOffsets[i]);
      ePositions[i * 3] = pt.x;
      ePositions[i * 3 + 1] = pt.y;
      ePositions[i * 3 + 2] = pt.z;
    }
    eGeo.setAttribute('position', new THREE.BufferAttribute(ePositions, 3));

    const eMat = new THREE.PointsMaterial({
      size: 0.42,
      map: this.glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: 0xfde047,
      depthWrite: false
    });
    this.electricalParticles = new THREE.Points(eGeo, eMat);
    this.group.add(this.electricalParticles);

    // 4. Core Fission Sparkles (Pulsing around reactor core)
    const fCount = 80;
    const fGeo = new THREE.BufferGeometry();
    const fPositions = new Float32Array(fCount * 3);
    this.fissionVelocities = [];

    for (let i = 0; i < fCount; i++) {
      fPositions[i * 3] = (Math.random() - 0.5) * 1.6;
      fPositions[i * 3 + 1] = 1.6 + Math.random() * 2.0;
      fPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
      this.fissionVelocities.push({
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.4
      });
    }
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPositions, 3));

    const fMat = new THREE.PointsMaterial({
      size: 0.28,
      map: this.glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      color: 0x38bdf8,
      depthWrite: false
    });
    this.fissionParticles = new THREE.Points(fGeo, fMat);
    this.group.add(this.fissionParticles);
  }

  update(delta, simState) {
    // Flow speed scales with thermal power and demo speed
    const flowMultiplier = (simState.thermalMWth / 50.0) * (simState.isDemonstrating ? simState.demoSpeed : 1.0);

    // 1. Update Primary Loop
    if (this.primaryParticles) {
      const posAttr = this.primaryParticles.geometry.attributes.position;
      const count = this.primaryOffsets.length;
      const speed = delta * 0.22 * flowMultiplier;

      for (let i = 0; i < count; i++) {
        this.primaryOffsets[i] = (this.primaryOffsets[i] + speed) % 1.0;
        const pt = this.primaryCurve.getPointAt(this.primaryOffsets[i]);
        posAttr.setXYZ(i, pt.x, pt.y, pt.z);
      }
      posAttr.needsUpdate = true;
    }

    // 2. Update Secondary Steam Loop
    if (this.steamParticles) {
      const posAttr = this.steamParticles.geometry.attributes.position;
      const count = this.steamOffsets.length;
      const speed = delta * 0.35 * flowMultiplier;

      for (let i = 0; i < count; i++) {
        this.steamOffsets[i] = (this.steamOffsets[i] + speed) % 1.0;
        const pt = this.steamCurve.getPointAt(this.steamOffsets[i]);
        posAttr.setXYZ(i, pt.x, pt.y, pt.z);
      }
      posAttr.needsUpdate = true;
    }

    // 3. Update Electrical Busbars
    if (this.electricalParticles) {
      const posAttr = this.electricalParticles.geometry.attributes.position;
      const count = this.electricOffsets.length;
      const speed = delta * 0.4 * flowMultiplier;

      for (let i = 0; i < count; i++) {
        this.electricOffsets[i] = (this.electricOffsets[i] + speed) % 1.0;
        const pt = this.electricCurve.getPointAt(this.electricOffsets[i]);
        posAttr.setXYZ(i, pt.x, pt.y, pt.z);
      }
      posAttr.needsUpdate = true;
    }

    // 4. Update Core Fission Sparkles
    if (this.fissionParticles) {
      const posAttr = this.fissionParticles.geometry.attributes.position;
      const count = posAttr.count;

      for (let i = 0; i < count; i++) {
        let x = posAttr.getX(i) + this.fissionVelocities[i].x * delta * flowMultiplier;
        let y = posAttr.getY(i) + this.fissionVelocities[i].y * delta * flowMultiplier;
        let z = posAttr.getZ(i) + this.fissionVelocities[i].z * delta * flowMultiplier;

        // Reset if drifted beyond core radius
        if (x * x + z * z > 0.8 || y < 1.4 || y > 3.8) {
          x = (Math.random() - 0.5) * 0.8;
          y = 1.6 + Math.random() * 1.8;
          z = (Math.random() - 0.5) * 0.8;
        }

        posAttr.setXYZ(i, x, y, z);
      }
      posAttr.needsUpdate = true;
    }

    // Demonstration Stage Emphasis
    if (simState.isDemonstrating) {
      const stage = simState.demonstrationStage;
      // Pulse brightness of the corresponding stage
      const pulse = 0.7 + Math.sin(Date.now() * 0.008) * 0.3;

      if (this.fissionParticles) {
        this.fissionParticles.material.size = stage === 0 ? 0.42 * pulse : 0.2;
        this.fissionParticles.material.opacity = stage === 0 ? 1.0 : 0.4;
      }
      if (this.primaryParticles) {
        this.primaryParticles.material.size = (stage === 1 || stage === 2) ? 0.48 * pulse : 0.25;
      }
      if (this.steamParticles) {
        this.steamParticles.material.size = (stage === 2 || stage === 3) ? 0.52 * pulse : 0.25;
      }
      if (this.electricalParticles) {
        this.electricalParticles.material.size = stage === 4 ? 0.55 * pulse : 0.25;
      }
    } else {
      // Normal nominal sizing
      if (this.fissionParticles) this.fissionParticles.material.size = 0.28;
      if (this.primaryParticles) this.primaryParticles.material.size = 0.35;
      if (this.steamParticles) this.steamParticles.material.size = 0.38;
      if (this.electricalParticles) this.electricalParticles.material.size = 0.42;
    }
  }
}
