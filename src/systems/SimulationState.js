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

    // Martian Day / Night (Sol) Simulation State
    this.solTime = 14.5; // Martian Solar Time (0.0 to 24.0 hours, 14.5 = 14:30 afternoon)
    this.solDay = 142; // Sol counter
    this.solAutoCycle = true; // Automatically advance time
    this.solCycleSpeed = 0.08; // Base hours per second (~5 minutes per 24h sol)
    this.solSpeedMultiplier = 1.0; // 1x, 5x, 20x
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

  // Sol Day/Night Simulation Controls
  setSolTime(hours) {
    this.solTime = (hours + 24) % 24;
    this.notify();
  }

  toggleSolCycle() {
    this.solAutoCycle = !this.solAutoCycle;
    this.notify();
  }

  setSolSpeedMultiplier(mult) {
    this.solSpeedMultiplier = mult;
    this.notify();
  }

  setSolPreset(preset) {
    switch (preset) {
      case 'dawn':
        this.solTime = 6.0;
        break;
      case 'noon':
        this.solTime = 12.0;
        break;
      case 'sunset':
        this.solTime = 18.2;
        break;
      case 'midnight':
        this.solTime = 0.0;
        break;
    }
    this.notify();
  }

  cycleNextSolPreset() {
    if (this.solTime >= 4 && this.solTime < 9) {
      this.setSolPreset('noon');
    } else if (this.solTime >= 9 && this.solTime < 16) {
      this.setSolPreset('sunset');
    } else if (this.solTime >= 16 && this.solTime < 22) {
      this.setSolPreset('midnight');
    } else {
      this.setSolPreset('dawn');
    }
  }

  getSolPhaseInfo() {
    const t = this.solTime;
    let phase = 'day';
    let label = 'Midday Sunlight';

    if (t >= 5.0 && t < 7.2) {
      phase = 'sunrise';
      label = 'Blue Dawn Sunrise';
    } else if (t >= 7.2 && t < 17.0) {
      phase = 'day';
      label = 'Martian Day';
    } else if (t >= 17.0 && t < 19.5) {
      phase = 'sunset';
      label = 'Blue Twilight Sunset';
    } else {
      phase = 'night';
      label = 'Martian Starry Night';
    }

    const hours = Math.floor(t);
    const minutes = Math.floor((t - hours) * 60);
    const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} MST`;

    return {
      phase,
      label,
      timeString,
      solDay: this.solDay,
      solTime: t
    };
  }

  update(delta) {
    // 1. Advance Martian Sol Day / Night Cycle
    if (this.solAutoCycle) {
      const prevTime = this.solTime;
      this.solTime = (this.solTime + delta * this.solCycleSpeed * this.solSpeedMultiplier) % 24.0;
      // If wrapped around midnight, advance sol counter
      if (prevTime > 23.0 && this.solTime < 1.0) {
        this.solDay++;
      }
    }

    // 2. If in demo auto-play mode, advance stages
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
