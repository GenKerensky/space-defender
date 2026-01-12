import Phaser from "phaser";

export class Missile extends Phaser.Physics.Arcade.Sprite {
  private lifespan: number = 3000;
  private spawnTime: number = 0;
  private speed: number = 250;
  private turnRate: number = 0.03;
  private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private hasExploded: boolean = false;
  private onAutoDetonate?: (missile: Missile) => void;

  constructor(scene: Phaser.Scene, x: number, y: number, aimAngle: number) {
    super(scene, x, y, "missile");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Sprite points right by default, so rotation = aimAngle
    this.setRotation(aimAngle);

    // Create smoke trail
    this.trailEmitter = scene.add.particles(x, y, "missile_trail", {
      speed: { min: 20, max: 50 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: { min: 300, max: 500 },
      blendMode: "ADD",
      frequency: 20,
      quantity: 1,
      emitting: false,
    });
  }

  fire(): void {
    this.spawnTime = this.scene.time.now;
    // Rotation directly equals the travel angle
    this.setVelocity(
      Math.cos(this.rotation) * this.speed,
      Math.sin(this.rotation) * this.speed,
    );
    this.trailEmitter.emitting = true;
  }

  setOnAutoDetonate(callback: (missile: Missile) => void): void {
    this.onAutoDetonate = callback;
  }

  update(): void {
    if (this.hasExploded) return;

    // Check lifespan - auto-detonate after 3 seconds
    if (this.scene.time.now - this.spawnTime > this.lifespan) {
      if (this.onAutoDetonate) {
        this.onAutoDetonate(this);
      } else {
        this.explode();
      }
      return;
    }

    // Track mouse cursor
    const pointer = this.scene.input.activePointer;
    const targetAngle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      pointer.worldX,
      pointer.worldY,
    );

    // Current velocity angle
    const currentAngle = Math.atan2(
      this.body?.velocity.y ?? 0,
      this.body?.velocity.x ?? 0,
    );

    // Smoothly rotate toward target
    let angleDiff = targetAngle - currentAngle;

    // Normalize angle difference to -PI to PI
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

    const newAngle = currentAngle + angleDiff * this.turnRate;

    this.setVelocity(
      Math.cos(newAngle) * this.speed,
      Math.sin(newAngle) * this.speed,
    );
    this.setRotation(newAngle);

    // Update trail position
    this.trailEmitter.setPosition(this.x, this.y);

    // Screen wrap
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    if (this.x < 0) this.x = width;
    else if (this.x > width) this.x = 0;

    if (this.y < 0) this.y = height;
    else if (this.y > height) this.y = 0;
  }

  explode(): { x: number; y: number; radius: number } | null {
    if (this.hasExploded) return null;

    this.hasExploded = true;
    const explosionData = { x: this.x, y: this.y, radius: 50 };

    this.trailEmitter.emitting = false;
    this.trailEmitter.destroy();
    this.destroy();

    return explosionData;
  }

  destroy(fromScene?: boolean): void {
    if (this.trailEmitter && !this.hasExploded) {
      this.trailEmitter.destroy();
    }
    super.destroy(fromScene);
  }
}
