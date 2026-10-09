import * as THREE from 'three';

/**
 * MARS-01 Procedural Canvas Texture Generator
 * Produces crisp industrial & Martian textures offline with zero external image dependencies.
 */

export class ProceduralTextures {
  static getGlowSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(56, 189, 248, 0.85)');
    grad.addColorStop(0.6, 'rgba(2, 132, 199, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  static getMartianGroundTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base Martian oxidized iron soil color
    ctx.fillStyle = '#9b3917';
    ctx.fillRect(0, 0, 512, 512);

    // Multi-octave noise speckles & rocks
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 45;
      data[i] = Math.max(0, Math.min(255, data[i] + noise * 1.2));     // Red
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise * 0.6)); // Green
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise * 0.3)); // Blue
    }
    ctx.putImageData(imgData, 0, 0);

    // Add crater rings and rock clusters
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      const r = 3 + Math.random() * 18;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(74, 28, 18, 0.4)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx - 1, cy - 1, r * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180, 83, 40, 0.25)';
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(24, 24);
    return texture;
  }

  static getHazardStripes() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = '#eab308';
    const stripeWidth = 24;
    for (let x = -256; x < 512; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + stripeWidth, 0);
      ctx.lineTo(x + stripeWidth + 256, 256);
      ctx.lineTo(x + 256, 256);
      ctx.closePath();
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  static getMetalPlates() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#273244';
    ctx.fillRect(0, 0, 256, 256);

    // Grid panel seams
    ctx.strokeStyle = '#161e2e';
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 248, 248);
    ctx.beginPath();
    ctx.moveTo(128, 4);
    ctx.lineTo(128, 252);
    ctx.moveTo(4, 128);
    ctx.lineTo(252, 128);
    ctx.stroke();

    // Rivet dots
    ctx.fillStyle = '#64748b';
    const rivets = [14, 120, 136, 242];
    for (const rx of rivets) {
      for (const ry of rivets) {
        ctx.beginPath();
        ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }

  static getSolarRadiatorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a1426';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 2;
    for (let y = 0; y < 256; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
    for (let x = 0; x < 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 6);
    return texture;
  }
}
