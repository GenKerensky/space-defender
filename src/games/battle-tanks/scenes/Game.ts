import Phaser, { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { Camera3D } from "../engine/Camera3D";
import { WireframeRenderer } from "../engine/WireframeRenderer";
import { PlayerTank } from "../objects/PlayerTank";
import { GroundGrid } from "../objects/GroundGrid";
import { Mountains } from "../objects/Mountains";
import { HUD } from "../objects/HUD";
import { Starfield } from "../effects/Starfield";
import { Atmosphere } from "../effects/Atmosphere";
import { ScreenShake } from "../effects/ScreenShake";
import {
  VectorParticleSystem,
  PARTICLE_PRESETS,
} from "../objects/VectorParticles";
import { Projectile } from "../objects/Projectile";
import { EnemyManager } from "../objects/EnemyManager";
import { WaveSystem } from "../objects/WaveSystem";

export class Game extends Scene {
  private camera3d!: Camera3D;
  private wireframeRenderer!: WireframeRenderer;
  private tank!: PlayerTank;

  private starfield!: Starfield;
  private atmosphere!: Atmosphere;
  private groundGrid!: GroundGrid;
  private mountains!: Mountains;

  private particles!: VectorParticleSystem;
  private screenShake!: ScreenShake;

  private hud!: HUD;

  // Combat systems
  private projectiles: Projectile[] = [];
  private enemyManager!: EnemyManager;
  private waveSystem!: WaveSystem;

  constructor() {
    super("Game");
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x000000);
    this.cameras.main.setPostPipeline("VectorShader");

    this.atmosphere = new Atmosphere();
    this.atmosphere.create(this, 0x004400); // Green-tinted horizon glow

    this.starfield = new Starfield();
    this.starfield.create(this);

    this.camera3d = new Camera3D(400);

    this.tank = new PlayerTank(this, this.camera3d);

    this.wireframeRenderer = new WireframeRenderer(this, this.camera3d);

    this.groundGrid = new GroundGrid(this, this.camera3d);
    this.mountains = new Mountains(this);

    this.particles = new VectorParticleSystem(this);
    this.particles.setCamera(this.camera3d);
    this.screenShake = new ScreenShake(this);

    this.hud = new HUD(this);
    this.hud.draw();

    // Initialize combat systems
    this.enemyManager = new EnemyManager();
    this.waveSystem = new WaveSystem(this.enemyManager);

    // Start first wave
    this.waveSystem.startWave(this.tank.getPosition());

    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
      .on("down", () => {
        if (!this.scene.isPaused("Game")) {
          this.scene.pause("Game");
          this.scene.launch("Pause");
        }
      });

    // Fire cannon on SPACE
    this.input.keyboard
      ?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      .on("down", () => {
        this.fireProjectile();
      });

    EventBus.emit("current-scene-ready", this);
  }

  private fireProjectile(): void {
    const fireData = this.tank.fire();
    if (fireData) {
      const projectile = new Projectile(fireData.position, fireData.direction);
      this.projectiles.push(projectile);
    }
  }

  private checkCollisions(): void {
    const enemies = this.enemyManager.getEnemies();

    for (const projectile of this.projectiles) {
      if (!projectile.isAlive()) continue;

      for (const enemy of enemies) {
        if (!enemy.isAlive()) continue;

        const dist = projectile.distanceTo(enemy.getCollisionCenter());
        if (dist < enemy.collisionRadius + projectile.radius) {
          // Hit!
          enemy.takeDamage();
          projectile.destroy();

          // Spawn hit particles
          this.particles.emit(
            enemy.position.clone(),
            5,
            PARTICLE_PRESETS.sparks,
          );

          if (enemy.isDead()) {
            // Enemy destroyed
            this.tank.addScore(enemy.points);
            this.particles.emitRing(
              enemy.position.clone(),
              15,
              PARTICLE_PRESETS.explosion,
            );
            this.particles.emit(
              enemy.position.clone(),
              8,
              PARTICLE_PRESETS.debris,
            );
            this.screenShake.fire();
          }
          break; // Projectile can only hit one enemy
        }
      }
    }
  }

  update(_time: number, delta: number): void {
    const { width, height } = this.cameras.main;

    this.tank.update(delta);

    // Update projectiles
    for (const projectile of this.projectiles) {
      projectile.update(delta);
    }
    // Remove dead projectiles
    this.projectiles = this.projectiles.filter((p) => p.isAlive());

    // Update enemies
    this.enemyManager.update(delta);

    // Check collisions
    this.checkCollisions();

    // Update wave system
    this.waveSystem.update();
    if (this.waveSystem.isWaveComplete()) {
      // Start next wave
      this.waveSystem.startWave(this.tank.getPosition());
    }

    this.particles.update(delta);

    this.wireframeRenderer.clear();

    this.groundGrid.render(width, height);
    this.mountains.render(this.camera3d, width, height);

    // Render enemies
    this.enemyManager.render(this.wireframeRenderer, width, height);

    // Render projectiles
    for (const projectile of this.projectiles) {
      projectile.render(this.wireframeRenderer, width, height);
    }

    this.particles.render(width, height);

    const pos = this.tank.getPosition();
    const enemyPositions = this.enemyManager.getEnemyPositions();

    this.hud.update(
      this.tank.getVelocity(),
      pos.x,
      pos.z,
      this.tank.getScore(),
      this.tank.getDamageState(),
      this.tank.getAmmo(),
      this.tank.getReloadState(),
      enemyPositions,
      pos,
      this.tank.getRotation(),
      this.waveSystem.getWaveNumber(),
    );

    this.starfield.update(this.tank.getRotation());
  }

  shutdown(): void {
    this.starfield?.destroy();
    this.atmosphere?.destroy();
    this.groundGrid?.destroy();
    this.mountains?.destroy();
    this.particles?.destroy();
    this.wireframeRenderer?.destroy();
    this.hud?.destroy();
  }
}
