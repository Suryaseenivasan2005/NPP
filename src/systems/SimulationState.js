/**
 * MARS-01 Simulation State Store
 * Manages live reactor parameters, demonstration playback, cutaway toggles, and UI subscribers.
 */

export class SimulationState {
  constructor() {
    this.listeners = new Set();

    // Nominal base values
    this.baseThermalMWth = 50.0;
    this.controlRodInsertion = 25.0; // 0% = full power, 100% = fully dampened / SCRAM
    this.scramActive = false;

    // Derived dynamic telemetry
    this.thermalMWth = 50.0;
    this.electricalMWe = 18.5;
    this.primaryTempHot = 315.2;
    this.primaryTempCold = 275.4;
    this.steamPressureMPa = 6.5;
    this.primaryPressureMPa = 15.5;
    this.turbineRPM = 3000;
    this.coolantFlowKgS = 1450;
    this.efficiencyPct = 37.0;

    // Mode flags
    this.isCutaway = true; // start in cutaway so the reactor is immediately interesting & explorable
    this.cameraMode = 'orbit'; // 'orbit' or 'walk'
    this.selectedComponentId = null;

    // Demonstration Mode state
    this.isDemonstrating = false;
    this.demonstrationStage = 0; // 0 to 4
    this.demoPlaying = false;
    this.demoSpeed = 1.0;
    this.demoTimer = 0;
    this.demoStageDuration = 7.0; // seconds per stage when auto-playing

    // Guided Tour state
    this.isTouring = false;
    this.tourStepIndex = 0;

    // Audio state
    this.audioMuted = false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Initial emit
    listener(this);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  setControlRods(percentage) {
    if (this.scramActive) return;
    this.controlRodInsertion = Math.max(0, Math.min(100, percentage));
    this.updateThermodynamics();
    this.notify();
  }

  triggerSCRAM() {
    this.scramActive = true;
    this.controlRodInsertion = 100.0;
    this.updateThermodynamics();
    this.notify();
  }

  resetSCRAM() {
    this.scramActive = false;
    this.controlRodInsertion = 25.0;
    this.updateThermodynamics();
    this.notify();
  }

  updateThermodynamics() {
    // Fission power scales inversely with rod insertion: 0% rod -> 100% power (55 MWth), 100% rod -> decay power (2.5 MWth)
    const powerFactor = Math.max(0.05, 1.0 - (this.controlRodInsertion / 100.0) * 0.95);
    this.thermalMWth = Number((this.baseThermalMWth * powerFactor * 1.1).toFixed(1));
    this.electricalMWe = Number((this.thermalMWth * 0.37).toFixed(1));
    this.primaryTempHot = Number((270 + 45 * powerFactor).toFixed(1));
    this.primaryTempCold = Number((250 + 25 * powerFactor).toFixed(1));
    this.steamPressureMPa = Number((4.0 + 2.5 * powerFactor).toFixed(2));
    this.turbineRPM = Math.round(1200 + 1800 * powerFactor);
    this.coolantFlowKgS = Math.round(800 + 650 * powerFactor);
  }

  setCutaway(open) {
    this.isCutaway = open;
    this.notify();
  }

  toggleCutaway() {
    this.setCutaway(!this.isCutaway);
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
    this.notify();
  }

  selectComponent(id) {
    this.selectedComponentId = id;
    this.notify();
  }

  // Demonstration mode controls
  startDemonstration() {
    this.isDemonstrating = true;
    this.demoPlaying = true;
    this.demonstrationStage = 0;
    this.demoTimer = 0;
    this.notify();
  }

  stopDemonstration() {
    this.isDemonstrating = false;
    this.demoPlaying = false;
    this.notify();
  }

  toggleDemoPlay() {
    this.demoPlaying = !this.demoPlaying;
    this.notify();
  }

  nextDemoStage() {
    this.demonstrationStage = (this.demonstrationStage + 1) % 5;
    this.demoTimer = 0;
    this.notify();
  }

  prevDemoStage() {
    this.demonstrationStage = (this.demonstrationStage - 1 + 5) % 5;
    this.demoTimer = 0;
    this.notify();
  }

  setDemoStage(stageIndex) {
    this.demonstrationStage = Math.max(0, Math.min(4, stageIndex));
    this.demoTimer = 0;
    this.notify();
  }

  setDemoSpeed(speed) {
    this.demoSpeed = speed;
    this.notify();
  }

  update(delta) {
    // If in demo auto-play mode, advance stages
    if (this.isDemonstrating && this.demoPlaying) {
      this.demoTimer += delta * this.demoSpeed;
      if (this.demoTimer >= this.demoStageDuration) {
        this.demoTimer = 0;
        this.nextDemoStage();
      }
    }

    // Natural small micro-fluctuations in telemetry to feel authentic
    if (!this.scramActive) {
      const wobble = (Math.random() - 0.5) * 0.04;
      this.primaryTempHot = Number((this.primaryTempHot + wobble).toFixed(1));
      this.turbineRPM = Math.round(this.turbineRPM + (Math.random() - 0.5) * 4);
    }
  }
}
