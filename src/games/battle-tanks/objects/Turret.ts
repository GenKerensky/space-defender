import { Vector3D } from "../engine/Vector3D";
import { WireframeModel, createEdges } from "../engine/WireframeModel";
import { WireframeRenderer } from "../engine/WireframeRenderer";
import { COLORS } from "../models/models";

/**
 * Turret wireframe model - stationary gun emplacement (tall enough to hit)
 */
const TURRET_MODEL: WireframeModel = {
  vertices: [
    // Base
    new Vector3D(-18, 0, -18),
    new Vector3D(18, 0, -18),
    new Vector3D(18, 0, 18),
    new Vector3D(-18, 0, 18),
    // Mid section
    new Vector3D(-15, 40, -15),
    new Vector3D(15, 40, -15),
    new Vector3D(15, 40, 15),
    new Vector3D(-15, 40, 15),
    // Top dome
    new Vector3D(-10, 70, -10),
    new Vector3D(10, 70, -10),
    new Vector3D(10, 70, 10),
    new Vector3D(-10, 70, 10),
    // Cannon
    new Vector3D(-5, 55, 10),
    new Vector3D(5, 55, 10),
    new Vector3D(5, 55, 40),
    new Vector3D(-5, 55, 40),
  ],
  edges: createEdges([
    // Base
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Mid
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    // Base to mid
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    // Top dome
    [8, 9],
    [9, 10],
    [10, 11],
    [11, 8],
    // Mid to top
    [4, 8],
    [5, 9],
    [6, 10],
    [7, 11],
    // Cannon
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 12],
  ]),
  color: COLORS.enemy,
};

/**
 * Stationary turret enemy - 1 hit to destroy
 */
export class Turret {
  position: Vector3D;
  rotation: number;
  private health = 1;
  private alive = true;

  readonly collisionRadius = 35;
  readonly points = 100;
  readonly type = "turret" as const;

  constructor(position: Vector3D, rotation = 0) {
    this.position = position.clone();
    this.rotation = rotation;
  }

  update(_delta: number): void {
    // Turrets are stationary, no update needed
    // Could add rotation tracking player later
  }

  render(renderer: WireframeRenderer, screenW: number, screenH: number): void {
    if (!this.alive) return;
    renderer.render(
      TURRET_MODEL,
      this.position,
      this.rotation,
      screenW,
      screenH,
    );
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

  /**
   * Get collision center (raised to mid-height for projectile hits)
   */
  getCollisionCenter(): Vector3D {
    return new Vector3D(this.position.x, 50, this.position.z);
  }
}
