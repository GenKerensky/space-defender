import Phaser from "phaser";

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  private lifespan: number = 2000;
  private spawnTime: number = 0;
  private aimAngle: number = 0;
  private speed: number = 500;
  private trailEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number, aimAngle: number) {
    super(scene, x, y, "bullet");

    this.aimAngle = aimAngle;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Create trailing particle effect
    this.trailEmitter = scene.add.particles(x, y, "bullet_trail", {
      speed: { min: 10, max: 30 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: { min: 100, max: 200 },
      blendMode: "ADD",
      frequency: 10,
      quantity: 1,
      emitting: false,
    });
  }

  fire(): void {
    this.spawnTime = this.scene.time.now;
    this.setVelocity(
      Math.cos(this.aimAngle) * this.speed,
      Math.sin(this.aimAngle) * this.speed,
    );
    this.setRotation(this.aimAngle);
    this.trailEmitter.emitting = true;
  }

  update(): void {
    // Check lifespan
    if (this.scene.time.now - this.spawnTime > this.lifespan) {
      this.destroy();
      return;
    }

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

  destroy(fromScene?: boolean): void {
    this.trailEmitter.destroy();
    super.destroy(fromScene);
  }
}
