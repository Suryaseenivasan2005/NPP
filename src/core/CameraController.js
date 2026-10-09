import * as THREE from 'three';

/**
 * MARS-01 Dual Camera Controller
 * Supports:
 * 1. Orbit & Inspect Mode: Smooth orbital inspection with target tracking and smooth transitions.
 * 2. Walk / First-Person Mode: WASD walking + mouse look with sensible facility boundaries.
 */

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.mode = 'orbit'; // 'orbit' or 'walk'

    // Orbit parameters
    this.target = new THREE.Vector3(2.5, 3.2, 0);
    this.currentPosition = camera.position.clone();
    this.spherical = new THREE.Spherical();
    this.spherical.setFromVector3(this.currentPosition.clone().sub(this.target));

    this.targetRadius = this.spherical.radius;
    this.minRadius = 3.0;
    this.maxRadius = 65.0;

    this.minPolarAngle = 0.1;
    this.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below ground

    // Interaction flags
    this.isMouseDown = false;
    this.mouseButton = 0; // 0: left, 2: right
    this.previousMousePosition = { x: 0, y: 0 };

    // Smooth transition state
    this.isTransitioning = false;
    this.transitionStartPos = new THREE.Vector3();
    this.transitionEndPos = new THREE.Vector3();
    this.transitionStartTarget = new THREE.Vector3();
    this.transitionEndTarget = new THREE.Vector3();
    this.transitionProgress = 1;
    this.transitionDuration = 1.0;

    // First-person walk state
    this.walkPosition = new THREE.Vector3(0, 1.8, 14);
    this.walkYaw = 0;
    this.walkPitch = 0;
    this.walkSpeed = 6.0;
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    this.initEventListeners();
  }

  initEventListeners() {
    // Mouse buttons
    this.domElement.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.mouseButton = e.button;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };

      if (this.mode === 'orbit') {
        if (this.mouseButton === 0) {
          // Left click: Orbit rotate
          this.spherical.theta -= deltaX * 0.006;
          this.spherical.phi -= deltaY * 0.006;
          this.spherical.phi = Math.max(
            this.minPolarAngle,
            Math.min(this.maxPolarAngle, this.spherical.phi)
          );
        } else if (this.mouseButton === 2) {
          // Right click: Pan target
          const panSpeed = 0.015 * (this.spherical.radius / 15);
          const right = new THREE.Vector3();
          this.camera.getWorldDirection(right);
          right.cross(this.camera.up).normalize();

          this.target.addScaledVector(right, -deltaX * panSpeed);
          this.target.y += deltaY * panSpeed;
          this.target.y = Math.max(0.5, Math.min(10, this.target.y));
        }
      } else if (this.mode === 'walk') {
        // First person look
        this.walkYaw -= deltaX * 0.004;
        this.walkPitch -= deltaY * 0.004;
        this.walkPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.walkPitch));
      }
    });

    // Zoom (Wheel)
    this.domElement.addEventListener(
      'wheel',
      (e) => {
        if (this.mode === 'orbit') {
          e.preventDefault();
          this.spherical.radius += e.deltaY * 0.025;
          this.spherical.radius = Math.max(
            this.minRadius,
            Math.min(this.maxRadius, this.spherical.radius)
          );
        }
      },
      { passive: false }
    );

    // Prevent context menu on right click
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

    // WASD Walking keys
    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = true;
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = false;
          break;
      }
    });
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;

    if (mode === 'walk') {
      // Initialize walk position near camera or entrance
      this.walkPosition.set(this.camera.position.x, 1.8, this.camera.position.z);
      this.walkYaw = Math.atan2(
        this.target.x - this.camera.position.x,
        this.target.z - this.camera.position.z
      );
      this.walkPitch = 0;
    } else {
      // Sync orbit spherical from current camera position
      this.target.set(0, 2.5, 0);
      this.spherical.setFromVector3(this.camera.position.clone().sub(this.target));
    }
  }

  transitionTo(endPos, endTarget, duration = 1.2) {
    this.isTransitioning = true;
    this.transitionStartPos.copy(this.camera.position);
    this.transitionEndPos.set(endPos.x, endPos.y, endPos.z);

    this.transitionStartTarget.copy(this.target);
    this.transitionEndTarget.set(endTarget.x, endTarget.y, endTarget.z);

    this.transitionProgress = 0;
    this.transitionDuration = duration;
  }

  resetOverview() {
    this.transitionTo({ x: 16, y: 12, z: 22 }, { x: 2.5, y: 3.2, z: 0 }, 1.4);
  }

  update(delta) {
    if (this.isTransitioning) {
      this.transitionProgress += delta / this.transitionDuration;
      const t = Math.min(1.0, this.transitionProgress);

      // Smooth step easing
      const ease = t * t * (3 - 2 * t);

      this.camera.position.lerpVectors(this.transitionStartPos, this.transitionEndPos, ease);
      this.target.lerpVectors(this.transitionStartTarget, this.transitionEndTarget, ease);
      this.camera.lookAt(this.target);

      if (this.transitionProgress >= 1.0) {
        this.isTransitioning = false;
        this.spherical.setFromVector3(this.camera.position.clone().sub(this.target));
      }
      return;
    }

    if (this.mode === 'orbit') {
      // Smooth spherical orbit update
      const offset = new THREE.Vector3().setFromSpherical(this.spherical);
      this.camera.position.copy(this.target).add(offset);
      this.camera.lookAt(this.target);
    } else if (this.mode === 'walk') {
      // WASD First person movement
      const forward = new THREE.Vector3(Math.sin(this.walkYaw), 0, Math.cos(this.walkYaw)).negate();
      const right = new THREE.Vector3(Math.cos(this.walkYaw), 0, -Math.sin(this.walkYaw));

      const moveDir = new THREE.Vector3();
      if (this.keys.forward) moveDir.add(forward);
      if (this.keys.backward) moveDir.sub(forward);
      if (this.keys.right) moveDir.add(right);
      if (this.keys.left) moveDir.sub(right);

      if (moveDir.lengthSq() > 0) {
        moveDir.normalize();
        this.walkPosition.addScaledVector(moveDir, this.walkSpeed * delta);

        // Facility walk boundaries (-24 to 24 in X and Z)
        this.walkPosition.x = Math.max(-24, Math.min(24, this.walkPosition.x));
        this.walkPosition.z = Math.max(-24, Math.min(24, this.walkPosition.z));
      }

      this.camera.position.copy(this.walkPosition);

      // Calculate look direction from yaw and pitch
      const lookTarget = new THREE.Vector3(
        this.walkPosition.x - Math.sin(this.walkYaw) * Math.cos(this.walkPitch),
        this.walkPosition.y + Math.sin(this.walkPitch),
        this.walkPosition.z - Math.cos(this.walkYaw) * Math.cos(this.walkPitch)
      );
      this.camera.lookAt(lookTarget);
    }
  }
}
