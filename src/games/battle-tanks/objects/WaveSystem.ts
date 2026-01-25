import { Vector3D } from "../engine/Vector3D";
import { EnemyManager } from "./EnemyManager";

export type WaveState = "active" | "complete" | "starting";

/**
 * Manages wave-based enemy spawning
 */
export class WaveSystem {
  private waveNumber = 0;
  private state: WaveState = "starting";
  private waveStartDelay = 2000; // ms before wave starts

  private readonly minSpawnDistance = 500;
  private readonly maxSpawnDistance = 1500;

  constructor(private enemyManager: EnemyManager) {}

  /**
   * Start a new wave
   */
  startWave(playerPosition: Vector3D): void {
    this.waveNumber++;
    this.state = "starting";

    // Spawn enemies after delay
    setTimeout(() => {
      this.spawnWaveEnemies(playerPosition);
      this.state = "active";
    }, this.waveStartDelay);
  }

  /**
   * Spawn enemies for the current wave
   */
  private spawnWaveEnemies(playerPos: Vector3D): void {
    const { turrets, tanks } = this.getWaveConfig();

    // Spawn turrets
    for (let i = 0; i < turrets; i++) {
      const pos = this.getRandomSpawnPosition(playerPos);
      const rotation = Math.random() * Math.PI * 2;
      this.enemyManager.spawnTurret(pos, rotation);
    }

    // Spawn tanks
    for (let i = 0; i < tanks; i++) {
      const pos = this.getRandomSpawnPosition(playerPos);
      const rotation = Math.random() * Math.PI * 2;
      this.enemyManager.spawnTank(pos, rotation);
    }
  }

  /**
   * Get enemy counts for current wave
   */
  private getWaveConfig(): { turrets: number; tanks: number } {
    switch (this.waveNumber) {
      case 1:
        return { turrets: 3, tanks: 0 };
      case 2:
        return { turrets: 2, tanks: 1 };
      case 3:
        return { turrets: 3, tanks: 2 };
      case 4:
        return { turrets: 4, tanks: 2 };
      case 5:
        return { turrets: 4, tanks: 3 };
      default: {
        // Scale up for later waves
        const baseTurrets = 4 + Math.floor((this.waveNumber - 5) * 0.5);
        const baseTanks = 3 + Math.floor((this.waveNumber - 5) * 0.5);
        return { turrets: baseTurrets, tanks: baseTanks };
      }
    }
  }

  /**
   * Get a random spawn position in a ring around the player
   */
  private getRandomSpawnPosition(playerPos: Vector3D): Vector3D {
    const angle = Math.random() * Math.PI * 2;
    const distance =
      this.minSpawnDistance +
      Math.random() * (this.maxSpawnDistance - this.minSpawnDistance);

    return new Vector3D(
      playerPos.x + Math.cos(angle) * distance,
      0,
      playerPos.z + Math.sin(angle) * distance,
    );
  }

  /**
   * Update wave state - check if wave is complete
   */
  update(): void {
    if (this.state === "active" && this.enemyManager.allDead()) {
      this.state = "complete";
    }
  }

  /**
   * Check if current wave is complete
   */
  isWaveComplete(): boolean {
    return this.state === "complete";
  }

  /**
   * Check if wave is currently active (enemies spawned)
   */
  isWaveActive(): boolean {
    return this.state === "active";
  }

  /**
   * Check if wave is starting (countdown)
   */
  isWaveStarting(): boolean {
    return this.state === "starting";
  }

  /**
   * Get current wave number
   */
  getWaveNumber(): number {
    return this.waveNumber;
  }

  /**
   * Get wave state
   */
  getState(): WaveState {
    return this.state;
  }

  /**
   * Reset wave system
   */
  reset(): void {
    this.waveNumber = 0;
    this.state = "starting";
    this.enemyManager.clear();
  }
}
