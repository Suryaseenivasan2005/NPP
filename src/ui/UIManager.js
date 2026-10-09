import { REACTOR_COMPONENTS, ENERGY_FLOW_STAGES } from '../data/componentsData.js';
import { getComponentSVG } from './SVGDiagrams.js';

/**
 * MARS-01 Scientific HUD & UI Controller
 * Manages the startup screen, telemetry HUD, component dossier drawer,
 * demonstration control panel, guided tour dialog, and shortcut help.
 */

export class UIManager {
  constructor(simState, cameraController, interactionManager, guidedTour, audioSystem) {
    this.simState = simState;
    this.cameraController = cameraController;
    this.interactionManager = interactionManager;
    this.guidedTour = guidedTour;
    this.audio = audioSystem;

    // Cache DOM elements
    this.splashOverlay = document.getElementById('splash-overlay');
    this.hudRoot = document.getElementById('hud-root');
    this.dossierPanel = document.getElementById('dossier-panel');
    this.demoPanel = document.getElementById('demo-panel');
    this.tourPanel = document.getElementById('tour-panel');
    this.helpModal = document.getElementById('help-modal');
    this.crosshairBadge = document.getElementById('crosshair-badge');

    // Telemetry values
    this.telemetryThermal = document.getElementById('val-thermal');
    this.telemetryElectric = document.getElementById('val-electric');
    this.telemetryTemp = document.getElementById('val-temp');
    this.telemetrySteam = document.getElementById('val-steam');
    this.telemetryRpm = document.getElementById('val-rpm');
    this.scramBtn = document.getElementById('btn-scram');

    this.bindEvents();
    this.bindSimulationListeners();
  }

  bindEvents() {
    // 1. Splash Screen Buttons
    document.getElementById('btn-splash-explore')?.addEventListener('click', () => {
      this.audio.resume();
      this.audio.playChime();
      this.hideSplashScreen();
    });

    document.getElementById('btn-splash-tour')?.addEventListener('click', () => {
      this.audio.resume();
      this.hideSplashScreen();
      this.guidedTour.start();
    });

    // 2. HUD Top Bar Actions
    document.getElementById('btn-toggle-cutaway')?.addEventListener('click', () => {
      this.audio.playClick();
      this.simState.toggleCutaway();
    });

    document.getElementById('btn-toggle-camera')?.addEventListener('click', () => {
      this.audio.playClick();
      const newMode = this.simState.cameraMode === 'orbit' ? 'walk' : 'orbit';
      this.simState.setCameraMode(newMode);
      this.cameraController.setMode(newMode);
    });

    document.getElementById('btn-reset-view')?.addEventListener('click', () => {
      this.audio.playClick();
      this.simState.selectComponent(null);
      this.cameraController.resetOverview();
      this.closeDossier();
    });

    document.getElementById('btn-open-demo')?.addEventListener('click', () => {
      this.audio.playChime();
      this.simState.startDemonstration();
    });

    document.getElementById('btn-open-tour')?.addEventListener('click', () => {
      this.guidedTour.start();
    });

    document.getElementById('btn-audio-mute')?.addEventListener('click', (e) => {
      const isMuted = this.audio.toggleMute();
      e.currentTarget.classList.toggle('active', isMuted);
      e.currentTarget.title = isMuted ? 'Unmute Audio' : 'Mute Audio';
    });

    document.getElementById('btn-help')?.addEventListener('click', () => {
      this.audio.playClick();
      this.helpModal.classList.toggle('hidden');
    });

    document.getElementById('btn-close-help')?.addEventListener('click', () => {
      this.audio.playClick();
      this.helpModal.classList.add('hidden');
    });

    // 3. SCRAM Emergency Control
    this.scramBtn?.addEventListener('click', () => {
      if (!this.simState.scramActive) {
        this.audio.playAlarm();
        this.simState.triggerSCRAM();
      } else {
        this.audio.playChime();
        this.simState.resetSCRAM();
      }
    });

    // 4. Dossier Close
    document.getElementById('btn-close-dossier')?.addEventListener('click', () => {
      this.audio.playClick();
      this.closeDossier();
    });

    // 5. Quick Component Selector dropdown / pill buttons
    const compPills = document.querySelectorAll('.comp-pill');
    compPills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        const compId = e.currentTarget.dataset.component;
        if (compId) {
          this.interactionManager.selectComponent(compId);
        }
      });
    });

    // 6. Demonstration Mode Bar Controls
    document.getElementById('demo-btn-prev')?.addEventListener('click', () => {
      this.audio.playClick();
      this.simState.prevDemoStage();
    });

    document.getElementById('demo-btn-play')?.addEventListener('click', () => {
      this.audio.playClick();
      this.simState.toggleDemoPlay();
    });

    document.getElementById('demo-btn-next')?.addEventListener('click', () => {
      this.audio.playClick();
      this.simState.nextDemoStage();
    });

    document.getElementById('demo-btn-speed')?.addEventListener('click', () => {
      this.audio.playClick();
      const speeds = [0.5, 1.0, 2.0];
      const curIdx = speeds.indexOf(this.simState.demoSpeed);
      const nextSpeed = speeds[(curIdx + 1) % speeds.length];
      this.simState.setDemoSpeed(nextSpeed);
      document.getElementById('demo-btn-speed').textContent = `${nextSpeed}x`;
    });

    document.getElementById('demo-btn-close')?.addEventListener('click', () => {
      this.audio.playClick();
      this.simState.stopDemonstration();
    });

    // 7. Guided Tour Dialog Controls
    document.getElementById('tour-btn-prev')?.addEventListener('click', () => {
      this.guidedTour.prev();
    });

    document.getElementById('tour-btn-next')?.addEventListener('click', () => {
      this.guidedTour.next();
    });

    document.getElementById('tour-btn-skip')?.addEventListener('click', () => {
      this.guidedTour.stop();
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      switch (e.code) {
        case 'KeyC':
          this.simState.toggleCutaway();
          break;
        case 'KeyV':
          const newMode = this.simState.cameraMode === 'orbit' ? 'walk' : 'orbit';
          this.simState.setCameraMode(newMode);
          this.cameraController.setMode(newMode);
          break;
        case 'KeyR':
          this.simState.selectComponent(null);
          this.cameraController.resetOverview();
          this.closeDossier();
          break;
        case 'KeyD':
          if (this.simState.isDemonstrating) {
            this.simState.stopDemonstration();
          } else {
            this.simState.startDemonstration();
          }
          break;
        case 'KeyT':
          if (!this.simState.isTouring) this.guidedTour.start();
          break;
        case 'Escape':
          this.closeDossier();
          this.helpModal.classList.add('hidden');
          if (this.simState.isTouring) this.guidedTour.stop();
          break;
      }
    });

    // Hover tooltip linking
    this.interactionManager.onHoverChange = (component) => {
      if (component) {
        this.crosshairBadge.textContent = component.designation;
        this.crosshairBadge.classList.add('visible');
      } else {
        this.crosshairBadge.classList.remove('visible');
      }
    };

    // Component selected callback
    this.interactionManager.onSelectComponent = (component) => {
      this.openDossier(component);
    };

    // Tour step change callback
    this.guidedTour.onTourStepChange = (tourData) => {
      if (!tourData) {
        this.tourPanel.classList.add('hidden');
        return;
      }
      this.tourPanel.classList.remove('hidden');
      const step = tourData.stepData;
      document.getElementById('tour-step-badge').textContent = `STEP ${tourData.stepIndex + 1} OF ${tourData.totalSteps}`;
      document.getElementById('tour-step-title').textContent = step.title;
      document.getElementById('tour-step-narration').textContent = step.narration;

      document.getElementById('tour-btn-prev').disabled = tourData.stepIndex === 0;
      document.getElementById('tour-btn-next').textContent =
        tourData.stepIndex === tourData.totalSteps - 1 ? 'Finish Tour' : 'Next Step →';
    };
  }

  bindSimulationListeners() {
    this.simState.subscribe((state) => {
      // 1. Update Telemetry displays
      if (this.telemetryThermal) this.telemetryThermal.textContent = `${state.thermalMWth} MWth`;
      if (this.telemetryElectric) this.telemetryElectric.textContent = `${state.electricalMWe} MWe`;
      if (this.telemetryTemp) this.telemetryTemp.textContent = `${state.primaryTempHot} °C`;
      if (this.telemetrySteam) this.telemetrySteam.textContent = `${state.steamPressureMPa} MPa`;
      if (this.telemetryRpm) this.telemetryRpm.textContent = `${state.turbineRPM} RPM`;

      // SCRAM Button styling
      if (this.scramBtn) {
        if (state.scramActive) {
          this.scramBtn.textContent = 'SCRAM RESET';
          this.scramBtn.classList.add('scram-tripped');
        } else {
          this.scramBtn.textContent = 'SCRAM';
          this.scramBtn.classList.remove('scram-tripped');
        }
      }

      // Cutaway Toggle Button indicator
      const cutawayBtn = document.getElementById('btn-toggle-cutaway');
      if (cutawayBtn) {
        cutawayBtn.classList.toggle('active', state.isCutaway);
        cutawayBtn.textContent = state.isCutaway ? 'Cutaway: ON' : 'Cutaway: OFF';
      }

      // Camera Mode indicator
      const camBtn = document.getElementById('btn-toggle-camera');
      if (camBtn) {
        camBtn.textContent = state.cameraMode === 'walk' ? 'Mode: Walk' : 'Mode: Orbit';
      }

      // 2. Demonstration Panel Visibility & State
      if (state.isDemonstrating) {
        this.demoPanel.classList.remove('hidden');
        this.renderDemoStage(state.demonstrationStage, state.demoPlaying);
      } else {
        this.demoPanel.classList.add('hidden');
      }

      // Highlight active component pill
      const compPills = document.querySelectorAll('.comp-pill');
      compPills.forEach((pill) => {
        pill.classList.toggle('active', pill.dataset.component === state.selectedComponentId);
      });
    });
  }

  hideSplashScreen() {
    this.splashOverlay.classList.add('fade-out');
    setTimeout(() => {
      this.splashOverlay.style.display = 'none';
      this.hudRoot.classList.remove('hidden');
    }, 600);
  }

  openDossier(component) {
    this.dossierPanel.classList.remove('hidden');

    document.getElementById('dossier-designation').textContent = component.designation;
    document.getElementById('dossier-title').textContent = component.name;
    document.getElementById('dossier-desc').textContent = component.shortDesc;
    document.getElementById('dossier-role').textContent = component.systemRole;
    document.getElementById('dossier-mechanism').textContent = component.mechanism;
    document.getElementById('dossier-fact').textContent = component.fact;

    // Render interactive SVG diagram
    const svgContainer = document.getElementById('dossier-svg-slot');
    if (svgContainer) {
      svgContainer.innerHTML = getComponentSVG(component.id);
    }

    // Render specs table
    const specsList = document.getElementById('dossier-specs');
    if (specsList && component.specs) {
      specsList.innerHTML = Object.entries(component.specs)
        .map(
          ([k, v]) => `
          <div class="spec-row">
            <span class="spec-label">${k}</span>
            <span class="spec-val">${v}</span>
          </div>
        `
        )
        .join('');
    }

    // Interactive Action Controls inside dossier (e.g. for control rods)
    const actionSlot = document.getElementById('dossier-action-slot');
    if (actionSlot) {
      if (component.id === 'control_rods') {
        actionSlot.innerHTML = `
          <div class="dossier-interactive-control">
            <label>Absorber Rod Insertion Depth: <span id="rod-depth-val">${this.simState.controlRodInsertion}%</span></label>
            <input type="range" id="rod-slider" min="0" max="100" value="${this.simState.controlRodInsertion}" />
            <small>Raising rods increases core reactivity & electrical output; lowering absorbs neutrons.</small>
          </div>
        `;
        const slider = document.getElementById('rod-slider');
        slider?.addEventListener('input', (e) => {
          const val = Number(e.target.value);
          document.getElementById('rod-depth-val').textContent = `${val}%`;
          this.simState.setControlRods(val);
        });
      } else {
        actionSlot.innerHTML = '';
      }
    }
  }

  closeDossier() {
    this.dossierPanel.classList.add('hidden');
    this.simState.selectComponent(null);
  }

  renderDemoStage(stageIndex, isPlaying) {
    const stage = ENERGY_FLOW_STAGES[stageIndex];
    if (!stage) return;

    document.getElementById('demo-stage-num').textContent = `STAGE ${stage.step} OF 5`;
    document.getElementById('demo-stage-title').textContent = stage.title;
    document.getElementById('demo-stage-desc').textContent = stage.description;
    document.getElementById('demo-stage-energy').textContent = stage.energyForm;

    // Play/Pause icon button text
    const playBtn = document.getElementById('demo-btn-play');
    if (playBtn) playBtn.textContent = isPlaying ? 'Pause ⏸' : 'Play ▶';

    // Step indicators
    const dots = document.querySelectorAll('.demo-step-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === stageIndex);
    });
  }
}
