import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { Lighting } from './core/Lighting.js';
import { CameraController } from './core/CameraController.js';
import { InteractionManager } from './core/InteractionManager.js';
import { ReactorMaterials } from './reactor/ReactorMaterials.js';
import { ReactorModel } from './reactor/ReactorModel.js';
import { EnergyFlowSystem } from './reactor/EnergyFlowSystem.js';
import { MartianTerrain } from './environment/MartianTerrain.js';
import { MartianAtmosphere } from './environment/MartianAtmosphere.js';
import { FacilityArchitecture } from './environment/FacilityArchitecture.js';
import { SimulationState } from './systems/SimulationState.js';
import { AudioSystem } from './systems/AudioSystem.js';
import { GuidedTour } from './systems/GuidedTour.js';
import { UIManager } from './ui/UIManager.js';

/**
 * MARS-01 — Martian Nuclear Research Facility Entry Point
 */
class MarsApplication {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    // 1. Core Three.js Scene, Camera & Renderer
    this.sceneManager = new SceneManager(this.container);
    this.scene = this.sceneManager.scene;
    this.camera = this.sceneManager.camera;
    this.renderer = this.sceneManager.renderer;

    // 2. Cinematic Martian Lighting
    this.lighting = new Lighting(this.scene);

    // 3. State & Audio
    this.simState = new SimulationState();
    this.audioSystem = new AudioSystem();

    // 4. Materials & Models
    this.materials = new ReactorMaterials();

    // 5. Martian Environment
    this.terrain = new MartianTerrain(this.materials);
    this.scene.add(this.terrain.group);

    this.atmosphere = new MartianAtmosphere(this.scene);

    this.facility = new FacilityArchitecture(this.materials);
    this.scene.add(this.facility.group);

    // 6. Nuclear Reactor Assembly
    this.reactor = new ReactorModel(this.materials);
    this.scene.add(this.reactor.group);

    // Initial cutaway sync
    this.reactor.setCutawayState(this.simState.isCutaway);

    // 7. Dynamic Energy Flow Particle Pathways
    this.energyFlow = new EnergyFlowSystem(this.scene);

    // 8. Navigation & Interaction
    this.cameraController = new CameraController(this.camera, this.renderer.domElement);
    this.interactionManager = new InteractionManager(
      this.camera,
      this.scene,
      this.renderer.domElement,
      this.simState,
      this.audioSystem,
      this.cameraController
    );

    // 9. Guided Educational Tour
    this.guidedTour = new GuidedTour(
      this.simState,
      this.cameraController,
      this.interactionManager,
      this.audioSystem
    );

    // 10. UI & HUD Overlay Controller
    this.uiManager = new UIManager(
      this.simState,
      this.cameraController,
      this.interactionManager,
      this.guidedTour,
      this.audioSystem
    );

    // Listen for cutaway state changes to update 3D model
    this.simState.subscribe((state) => {
      this.reactor.setCutawayState(state.isCutaway);
    });

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = Math.min(0.1, this.clock.getDelta());

    // 1. Update simulation state & thermodynamic parameters
    this.simState.update(delta);

    // 2. Update camera controls & smooth transitions
    this.cameraController.update(delta);

    // 3. Update raycasting & interactive hover checks
    this.interactionManager.update(this.reactor.interactiveObjects);

    // 4. Update 3D model animations (control rods, turbine rotation, Cherenkov pulse)
    this.reactor.update(delta, this.simState);

    // 5. Update energy flow particle systems
    this.energyFlow.update(delta, this.simState);

    // 6. Update Martian dust storm particles
    this.atmosphere.update(delta);

    // 7. Update audio sound synthesis pitch
    this.audioSystem.updateTurbineRPM(this.simState.turbineRPM);

    // 8. Render Scene
    this.sceneManager.render();
  }
}

// Instantiate once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new MarsApplication();
});
