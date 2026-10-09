import * as THREE from 'three';

/**
 * MARS-01 Procedural Martian Landscape
 * Builds the red Martian surface, impact craters, boulders, and industrial facility foundations.
 */

export class MartianTerrain {
  constructor(materials) {
    this.mat = materials;
    this.group = new THREE.Group();

    this.buildTerrainSurface();
    this.buildFacilityPads();
    this.buildRocksAndBoulders();
  }

  buildTerrainSurface() {
    // Large terrain mesh with procedural height variations
    const size = 180;
    const segments = 90;
    const terrainGeo = new THREE.PlaneGeometry(size, size, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Distance from facility center (keep facility center flat)
      const distFromCenter = Math.sqrt(x * x + z * z);

      if (distFromCenter > 16) {
        // Multi-frequency hill and crater waves
        const wave1 = Math.sin(x * 0.05) * Math.cos(z * 0.05) * 3.5;
        const wave2 = Math.sin(x * 0.12 + 1.2) * Math.sin(z * 0.12) * 1.5;
        const wave3 = (Math.sin(x * 0.02) + Math.cos(z * 0.02)) * 5.0;

        // Smooth fade-in of terrain elevation
        const blend = Math.min(1.0, (distFromCenter - 16) / 25);
        pos.setY(i, (wave1 + wave2 + wave3) * blend);
      } else {
        // Flat bedrock foundation under plant
        pos.setY(i, 0);
      }
    }

    terrainGeo.computeVertexNormals();

    const terrainMesh = new THREE.Mesh(terrainGeo, this.mat.get('martianSoil'));
    terrainMesh.receiveShadow = true;
    this.group.add(terrainMesh);
  }

  buildFacilityPads() {
    // Reinforced engineered foundation pads under the nuclear facility
    const padGeo = new THREE.BoxGeometry(26, 0.4, 20);
    const padMesh = new THREE.Mesh(padGeo, this.mat.get('darkAlloy'));
    padMesh.position.set(2.0, 0.2, 0.5);
    padMesh.receiveShadow = true;
    this.group.add(padMesh);

    // Hazard yellow-black perimeter line around pad
    const borderGeo = new THREE.BoxGeometry(26.4, 0.45, 0.4);
    const border1 = new THREE.Mesh(borderGeo, this.mat.get('hazardMarking'));
    border1.position.set(2.0, 0.25, 10.5);
    this.group.add(border1);

    const border2 = border1.clone();
    border2.position.set(2.0, 0.25, -9.5);
    this.group.add(border2);
  }

  buildRocksAndBoulders() {
    // Procedural boulders scattered around the landscape
    const boulderGeo = new THREE.DodecahedronGeometry(1.0, 1);
    const boulderMat = new THREE.MeshStandardMaterial({
      color: 0x8a3014,
      roughness: 0.95,
      metalness: 0.05
    });

    const rockCount = 65;
    for (let i = 0; i < rockCount; i++) {
      // Random angle and radius outside the facility pad
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 65;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const scale = 0.5 + Math.random() * 2.2;
      const rock = new THREE.Mesh(boulderGeo, boulderMat);
      rock.position.set(x, scale * 0.6, z);
      rock.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      rock.scale.set(scale, scale * (0.6 + Math.random() * 0.6), scale);
      rock.castShadow = true;
      rock.receiveShadow = true;
      this.group.add(rock);
    }
  }
}
