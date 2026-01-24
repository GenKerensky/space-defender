import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload(): void {
    // Create ship graphic (triangle) - cyan color
    const shipGraphics = this.make.graphics({ x: 0, y: 0 });
    shipGraphics.fillStyle(0x00ffff);
    shipGraphics.beginPath();
    shipGraphics.moveTo(16, 0);
    shipGraphics.lineTo(32, 32);
    shipGraphics.lineTo(16, 24);
    shipGraphics.lineTo(0, 32);
    shipGraphics.closePath();
    shipGraphics.fillPath();
    shipGraphics.generateTexture("ship", 32, 32);
    shipGraphics.destroy();

    // Create multiple asteroid variants with different shapes
    for (let variant = 0; variant < 5; variant++) {
      const asteroidGraphics = this.make.graphics({ x: 0, y: 0 });
      asteroidGraphics.fillStyle(0x888888);
      asteroidGraphics.lineStyle(2, 0xffffff);
      asteroidGraphics.beginPath();

      const points = Phaser.Math.Between(7, 12);
      const baseRadius = 28;

      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // More dramatic variation for jagged shapes
        const r = baseRadius + Phaser.Math.Between(-12, 10);
        const px = 32 + Math.cos(angle) * r;
        const py = 32 + Math.sin(angle) * r;
        if (i === 0) {
          asteroidGraphics.moveTo(px, py);
        } else {
          asteroidGraphics.lineTo(px, py);
        }
      }

      asteroidGraphics.closePath();
      asteroidGraphics.fillPath();
      asteroidGraphics.strokePath();
      asteroidGraphics.generateTexture(`asteroid_${variant}`, 64, 64);
      asteroidGraphics.destroy();
    }

    // Create bullet graphic (green blaster bolt)
    const bulletGraphics = this.make.graphics({ x: 0, y: 0 });
    // Outer glow
    bulletGraphics.fillStyle(0x00ff00);
    bulletGraphics.fillEllipse(8, 4, 14, 6);
    // Inner bright core
    bulletGraphics.fillStyle(0x88ff88);
    bulletGraphics.fillEllipse(8, 4, 10, 4);
    bulletGraphics.fillStyle(0xccffcc);
    bulletGraphics.fillEllipse(8, 4, 6, 3);
    bulletGraphics.generateTexture("bullet", 16, 8);
    bulletGraphics.destroy();

    // Create bullet trail particle
    const trailGraphics = this.make.graphics({ x: 0, y: 0 });
    trailGraphics.fillStyle(0x00ff00);
    trailGraphics.fillCircle(3, 3, 3);
    trailGraphics.generateTexture("bullet_trail", 6, 6);
    trailGraphics.destroy();

    // Create particle graphic
    const particleGraphics = this.make.graphics({ x: 0, y: 0 });
    particleGraphics.fillStyle(0xffffff);
    particleGraphics.fillCircle(2, 2, 2);
    particleGraphics.generateTexture("particle", 4, 4);
    particleGraphics.destroy();

    // Create flame particle for rocket thrust (elongated teardrop shape)
    const flameGraphics = this.make.graphics({ x: 0, y: 0 });
    // Outer orange glow
    flameGraphics.fillStyle(0xff4400);
    flameGraphics.fillEllipse(8, 4, 16, 6);
    // Inner yellow-white core
    flameGraphics.fillStyle(0xffaa00);
    flameGraphics.fillEllipse(6, 4, 10, 4);
    flameGraphics.fillStyle(0xffffcc);
    flameGraphics.fillEllipse(4, 4, 6, 3);
    flameGraphics.generateTexture("flame", 16, 8);
    flameGraphics.destroy();

    // Blaster weapon icon (green bolt)
    const blasterIcon = this.make.graphics({ x: 0, y: 0 });
    blasterIcon.fillStyle(0x00ff00);
    blasterIcon.fillEllipse(20, 10, 32, 12);
    blasterIcon.fillStyle(0x88ff88);
    blasterIcon.fillEllipse(20, 10, 24, 8);
    blasterIcon.fillStyle(0xccffcc);
    blasterIcon.fillEllipse(20, 10, 14, 5);
    blasterIcon.generateTexture("blaster_icon", 40, 20);
    blasterIcon.destroy();

    // Laser weapon icon (red beam)
    const laserIcon = this.make.graphics({ x: 0, y: 0 });
    laserIcon.fillStyle(0xff0000, 0.5);
    laserIcon.fillRect(0, 6, 40, 8);
    laserIcon.fillStyle(0xff3333, 0.8);
    laserIcon.fillRect(0, 8, 40, 4);
    laserIcon.fillStyle(0xff6666);
    laserIcon.fillRect(0, 9, 40, 2);
    laserIcon.fillStyle(0xffffff);
    laserIcon.fillRect(0, 9, 40, 1);
    laserIcon.generateTexture("laser_icon", 40, 20);
    laserIcon.destroy();

    // Missile projectile (pointed rocket shape)
    const missileGraphics = this.make.graphics({ x: 0, y: 0 });
    // Body
    missileGraphics.fillStyle(0xff8800);
    missileGraphics.fillRect(4, 6, 12, 8);
    // Nose cone
    missileGraphics.fillStyle(0xffaa00);
    missileGraphics.fillTriangle(16, 6, 16, 14, 22, 10);
    // Fins
    missileGraphics.fillStyle(0xff6600);
    missileGraphics.fillTriangle(4, 6, 4, 2, 8, 6);
    missileGraphics.fillTriangle(4, 14, 4, 18, 8, 14);
    // Exhaust
    missileGraphics.fillStyle(0xffff00);
    missileGraphics.fillRect(0, 8, 4, 4);
    missileGraphics.generateTexture("missile", 24, 20);
    missileGraphics.destroy();

    // Missile trail particle
    const missileTrail = this.make.graphics({ x: 0, y: 0 });
    missileTrail.fillStyle(0xff6600);
    missileTrail.fillCircle(4, 4, 4);
    missileTrail.fillStyle(0xffaa00);
    missileTrail.fillCircle(4, 4, 2);
    missileTrail.generateTexture("missile_trail", 8, 8);
    missileTrail.destroy();

    // Missile weapon icon
    const missileIcon = this.make.graphics({ x: 0, y: 0 });
    // Body
    missileIcon.fillStyle(0xff8800);
    missileIcon.fillRect(8, 6, 20, 8);
    // Nose
    missileIcon.fillStyle(0xffaa00);
    missileIcon.fillTriangle(28, 6, 28, 14, 38, 10);
    // Fins
    missileIcon.fillStyle(0xff6600);
    missileIcon.fillTriangle(8, 6, 8, 0, 14, 6);
    missileIcon.fillTriangle(8, 14, 8, 20, 14, 14);
    // Exhaust
    missileIcon.fillStyle(0xffff00);
    missileIcon.fillRect(2, 7, 6, 6);
    missileIcon.generateTexture("missile_icon", 40, 20);
    missileIcon.destroy();
  }

  create(): void {
    // Emit event for React bridge
    EventBus.emit("current-scene-ready", this);

    this.scene.start("Title");
  }
}
