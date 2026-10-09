import * as THREE from 'three';
import { REACTOR_COMPONENTS } from '../data/componentsData.js';

/**
 * MARS-01 Raycasting & Interaction Manager
 * Handles pointer raycasting, hover highlights, HUD crosshair reticle status, and click selection.
 */

export class InteractionManager {
  constructor(camera, scene, domElement, simState, audioSystem, cameraController) {
    this.camera = camera;
    this.scene = scene;
    this.domElement = domElement;
    this.simState = simState;
    this.audio = audioSystem;
    this.cameraController = cameraController;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1000, -1000);

    this.hoveredObject = null;
    this.hoveredComponentId = null;
    this.selectedComponentId = null;

    // Highlight clone material
    this.highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true
    });

    // Subscribed listeners
    this.onHoverChange = null;
    this.onSelectComponent = null;

    this.initEvents();
  }

  initEvents() {
    this.domElement.addEventListener('mousemove', (e) => {
      const rect = this.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    this.domElement.addEventListener('click', (e) => {
      // If drag occurred, don't trigger click selection
      if (this.cameraController.isTransitioning) return;
      this.handleClick();
    });
  }

  update(interactiveObjects) {
    if (!interactiveObjects || interactiveObjects.length === 0) return;

    // In FPS walk mode, raycast from center screen
    if (this.simState.cameraMode === 'walk') {
      this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    } else {
      this.raycaster.setFromCamera(this.mouse, this.camera);
    }

    const intersects = this.raycaster.intersectObjects(interactiveObjects, true);

    let foundMesh = null;
    let foundCompId = null;

    for (const hit of intersects) {
      if (hit.object.userData && hit.object.userData.componentId) {
        foundMesh = hit.object;
        foundCompId = hit.object.userData.componentId;
        break;
      }
    }

    if (foundCompId !== this.hoveredComponentId) {
      this.hoveredComponentId = foundCompId;
      this.hoveredObject = foundMesh;

      if (foundCompId) {
        this.domElement.style.cursor = 'pointer';
        if (this.audio) this.audio.playClick();
      } else {
        this.domElement.style.cursor = 'default';
      }

      if (this.onHoverChange) {
        this.onHoverChange(foundCompId ? REACTOR_COMPONENTS[foundCompId] : null);
      }
    }
  }

  handleClick() {
    if (this.hoveredComponentId) {
      const comp = REACTOR_COMPONENTS[this.hoveredComponentId];
      if (comp) {
        this.selectComponent(this.hoveredComponentId);
      }
    }
  }

  selectComponent(componentId) {
    const comp = REACTOR_COMPONENTS[componentId];
    if (!comp) return;

    this.selectedComponentId = componentId;
    this.simState.selectComponent(componentId);

    if (this.audio) {
      this.audio.playChime(true);
      if (componentId === 'fuel') this.audio.playGeiger();
    }

    // Auto-open cutaway if inspecting internal reactor components
    if (['vessel', 'fuel', 'control_rods', 'coolant', 'steam_gen', 'turbine'].includes(componentId)) {
      this.simState.setCutaway(true);
    }

    // Smoothly focus camera on component
    if (comp.cameraPosition && comp.cameraTarget) {
      this.cameraController.setMode('orbit');
      this.cameraController.transitionTo(comp.cameraPosition, comp.cameraTarget, 1.2);
    }

    if (this.onSelectComponent) {
      this.onSelectComponent(comp);
    }
  }
}
