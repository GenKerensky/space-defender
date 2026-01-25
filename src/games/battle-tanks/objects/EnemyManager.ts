import { Vector3D } from "../engine/Vector3D";
import { WireframeRenderer } from "../engine/WireframeRenderer";
import { Turret } from "./Turret";
import { EnemyTank } from "./EnemyTank";

export type Enemy = Turret | EnemyTank;

/**
 * Manages all enemies in the game
 */
export class EnemyManager {
  private enemies: Enemy[] = [];

  /**
   * Spawn a turret at the given position
   */
  spawnTurret(position: Vector3D, rotation = 0): Turret {
    const turret = new Turret(position, rotation);
    this.enemies.push(turret);
    return turret;
  }

  /**
   * Spawn an enemy tank at the given position
   */
  spawnTank(position: Vector3D, rotation = 0): EnemyTank {
    const tank = new EnemyTank(position, rotation);
    this.enemies.push(tank);
    return tank;
  }

  /**
   * Update all enemies
   */
  update(delta: number): void {
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }

    // Remove dead enemies
    this.enemies = this.enemies.filter((e) => e.isAlive());
  }

  /**
   * Render all enemies
   */
  render(renderer: WireframeRenderer, screenW: number, screenH: number): void {
    for (const enemy of this.enemies) {
      enemy.render(renderer, screenW, screenH);
    }
  }

  /**
   * Get all enemies
   */
  getEnemies(): Enemy[] {
    return this.enemies;
  }

  /**
   * Get all enemy positions (for radar)
   */
  getEnemyPositions(): Vector3D[] {
    return this.enemies.map((e) => e.position.clone());
  }

  /**
   * Get count of living enemies
   */
  getEnemyCount(): number {
    return this.enemies.length;
  }

  /**
   * Check if all enemies are dead
   */
  allDead(): boolean {
    return this.enemies.length === 0;
  }

  /**
   * Clear all enemies
   */
  clear(): void {
    this.enemies = [];
  }

  /**
   * Remove a specific enemy
   */
  removeEnemy(enemy: Enemy): void {
    const index = this.enemies.indexOf(enemy);
    if (index !== -1) {
      this.enemies.splice(index, 1);
    }
  }
}
