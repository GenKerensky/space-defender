import { Vector3D } from "../engine/Vector3D";
import { WireframeRenderer } from "../engine/WireframeRenderer";
import { ENEMY_TANK } from "../models/models";

/**
 * Enemy tank - stationary target (2 hits to destroy)
 */
export class EnemyTank {
  position: Vector3D;
  rotation: number;
  private health = 2;
  private alive = true;

  readonly collisionRadius = 60;
  readonly points = 250;
  readonly type = "tank" as const;

  constructor(position: Vector3D, rotation = 0) {
    this.position = position.clone();
    this.rotation = rotation;
  }

  update(_delta: number): void {
    // Enemy tanks are stationary in V1
    // Could add movement AI later
  }

  render(renderer: WireframeRenderer, screenW: number, screenH: number): void {
    if (!this.alive) return;
    renderer.render(ENEMY_TANK, this.position, this.rotation, screenW, screenH);
  }

  takeDamage(amount = 1): void {
    this.health -= amount;
    if (this.health <= 0) {
      this.alive = false;
    }
  }

  isDead(): boolean {
    return !this.alive;
  }

  isAlive(): boolean {
    return this.alive;
  }

  getPosition(): Vector3D {
    return this.position.clone();
  }

  getHealth(): number {
    return this.health;
  }

  /**
   * Get collision center (raised to mid-height for projectile hits)
   */
  getCollisionCenter(): Vector3D {
    return new Vector3D(this.position.x, 50, this.position.z);
  }
}
