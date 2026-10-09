import * as THREE from 'three';
import { ProceduralTextures } from './ProceduralTextures.js';

/**
 * MARS-01 Sci-Fi Physical Materials
 * High-fidelity PBR materials tuned for realistic industrial sci-fi lighting.
 */

export class ReactorMaterials {
  constructor() {
    this.groundTexture = ProceduralTextures.getMartianGroundTexture();
    this.metalPlatesTexture = ProceduralTextures.getMetalPlates();
    this.hazardTexture = ProceduralTextures.getHazardStripes();
    this.radiatorTexture = ProceduralTextures.getSolarRadiatorTexture();
    this.glowSpriteTexture = ProceduralTextures.getGlowSprite();

    this.materials = this.createMaterials();
  }

  createMaterials() {
    return {
      // Martian Ground
      martianSoil: new THREE.MeshStandardMaterial({
        map: this.groundTexture,
        roughness: 0.95,
        metalness: 0.05,
        color: 0xc1440e
      }),

      // Facility Exterior Concrete / Sintered Regolith
      regolithConcrete: new THREE.MeshStandardMaterial({
        color: 0x3d271d,
        roughness: 0.85,
        metalness: 0.15
      }),

      // Heavy Structural Metal
      darkAlloy: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.85,
        roughness: 0.25,
        map: this.metalPlatesTexture
      }),

      // Polished Steel
      chromeSteel: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.92,
        roughness: 0.18
      }),

      // Reactor Vessel Shell (Solid Exterior)
      vesselShell: new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.85,
        roughness: 0.3,
        map: this.metalPlatesTexture
      }),

      // Reactor Cutaway Transparent Shell
      cutawayGlass: new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.85,
        thickness: 0.5,
        transparent: true,
        opacity: 0.28,
        depthWrite: false
      }),

      // Cherenkov Water Pool
      cherenkovPool: new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        emissive: 0x0284c7,
        emissiveIntensity: 0.45,
        roughness: 0.1,
        transmission: 0.75,
        transparent: true,
        opacity: 0.65,
        depthWrite: false
      }),

      // Fuel Assemblies (UO₂ pins)
      fuelPins: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35
      }),

      // Control Rods & Actuators
      controlRods: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.8,
        roughness: 0.3,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.25
      }),

      // Primary Hot Leg Pipe
      hotLegPipe: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        metalness: 0.75,
        roughness: 0.35,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.25
      }),

      // Primary Cold Leg Pipe
      coldLegPipe: new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        metalness: 0.75,
        roughness: 0.35,
        emissive: 0x0891b2,
        emissiveIntensity: 0.2
      }),

      // Secondary Steam Pipe
      steamPipe: new THREE.MeshStandardMaterial({
        color: 0xf97316,
        metalness: 0.8,
        roughness: 0.3,
        emissive: 0xc2410c,
        emissiveIntensity: 0.3
      }),

      // Steam Generator Shell
      steamGenShell: new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.85,
        roughness: 0.25,
        map: this.metalPlatesTexture
      }),

      // Turbine Casing
      turbineCasing: new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.85,
        roughness: 0.25
      }),

      // Turbine Rotor Blades
      turbineRotor: new THREE.MeshStandardMaterial({
        color: 0xeab308,
        metalness: 0.95,
        roughness: 0.15,
        emissive: 0xca8a04,
        emissiveIntensity: 0.25
      }),

      // Generator Stator & Busbars
      generatorStator: new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.85,
        roughness: 0.3,
        emissive: 0x0369a1,
        emissiveIntensity: 0.3
      }),

      // Biological Shield Concrete
      biologicalShield: new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.8,
        metalness: 0.2
      }),

      // Hazard Warning Strips
      hazardMarking: new THREE.MeshStandardMaterial({
        map: this.hazardTexture,
        roughness: 0.6,
        metalness: 0.1
      }),

      // Radiator Panels (Mars closed cooling)
      radiatorPanels: new THREE.MeshStandardMaterial({
        map: this.radiatorTexture,
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x0284c7,
        emissiveIntensity: 0.15
      }),

      // Warning Emissive Beacon
      warningLightAmber: new THREE.MeshBasicMaterial({
        color: 0xf59e0b
      }),

      // Control Room Habitat Shell
      habitatShell: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.3,
        roughness: 0.4
      }),

      // Holographic / Screen Emissive
      screenGlow: new THREE.MeshBasicMaterial({
        color: 0x10b981
      })
    };
  }

  get(name) {
    return this.materials[name];
  }
}
