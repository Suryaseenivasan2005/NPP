import { GUIDED_TOUR_STEPS } from '../data/componentsData.js';

/**
 * MARS-01 Guided Educational Tour System
 * Sequentially steps the user through the thermodynamic story of the Martian nuclear plant.
 */

export class GuidedTour {
  constructor(simState, cameraController, interactionManager, audioSystem) {
    this.simState = simState;
    this.cameraController = cameraController;
    this.interactionManager = interactionManager;
    this.audio = audioSystem;

    this.currentStep = 0;
    this.totalSteps = GUIDED_TOUR_STEPS.length;
    this.isActive = false;

    this.onTourStepChange = null;
  }

  start() {
    this.isActive = true;
    this.simState.isTouring = true;
    this.currentStep = 0;
    this.applyStep(this.currentStep);
    if (this.audio) this.audio.playChime();
  }

  stop() {
    this.isActive = false;
    this.simState.isTouring = false;
    if (this.onTourStepChange) {
      this.onTourStepChange(null);
    }
  }

  next() {
    if (!this.isActive) return;
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
      this.applyStep(this.currentStep);
    } else {
      this.stop();
    }
  }

  prev() {
    if (!this.isActive) return;
    if (this.currentStep > 0) {
      this.currentStep--;
      this.applyStep(this.currentStep);
    }
  }

  applyStep(stepIndex) {
    const step = GUIDED_TOUR_STEPS[stepIndex];
    if (!step) return;

    this.simState.tourStepIndex = stepIndex;

    // Apply cutaway toggle as configured in tour step
    this.simState.setCutaway(step.cutaway);

    // Transition camera to designated viewpoint
    this.cameraController.setMode('orbit');
    this.cameraController.transitionTo(step.cameraPos, step.focusTarget, 1.4);

    // Notify UI to render tour overlay dialog
    if (this.onTourStepChange) {
      this.onTourStepChange({
        stepIndex,
        totalSteps: this.totalSteps,
        stepData: step
      });
    }

    if (this.audio) this.audio.playClick();
  }
}
