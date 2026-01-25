import Phaser from "phaser";
import { Vector3D } from "../engine/Vector3D";
import { Camera3D } from "../engine/Camera3D";
import {
  TankDamageState,
  TankSection,
  DamageLevel,
  createInitialDamageState,
} from "./TankHealth";

/**
 * Player tank with first-person camera and WASD controls
 */
export class PlayerTank {
  position: Vector3D;
  rotation: number; // Y-axis facing direction (positive = right of +Z)
  private velocity: number;
  private targetVelocity: number;
  private rotationVelocity: number;

  private camera: Camera3D;
  private scene: Phaser.Scene;

  // Movement settings
  private readonly maxSpeed = 150;
  private readonly maxReverseSpeed = 80;
  private readonly acceleration = 200;
  private readonly deceleration = 300;
  private readonly rotationSpeed = 1.5;
  private readonly eyeHeight = 50;

  // Damage state
  private damageState: TankDamageState;

  // Ammo and reload state
  private readonly maxAmmo = 10;
  private currentAmmo: number;
  private isReloading = false;
  private reloadProgress = 0;
  private readonly reloadTime = 2000; // ms
  private reloadStartTime = 0;

  // Score
  private score = 0;

  // Input keys
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene, camera: Camera3D) {
    this.scene = scene;
    this.camera = camera;
    this.position = new Vector3D(0, 0, 0);
    this.rotation = 0;
    this.velocity = 0;
    this.targetVelocity = 0;
    this.rotationVelocity = 0;

    this.damageState = createInitialDamageState();
    this.currentAmmo = this.maxAmmo;

    this.setupInput();
    this.updateCamera();
  }

  private setupInput(): void {
    if (!this.scene.input.keyboard) return;

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.wasd = {
      W: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  update(delta: number): void {
    const dt = delta / 1000;

    this.handleInput();
    this.applyMovement(dt);
    this.updateCamera();
    this.updateReload();
  }

  private handleInput(): void {
    this.targetVelocity = 0;
    this.rotationVelocity = 0;

    // Forward/backward
    if (this.cursors?.up?.isDown || this.wasd?.W?.isDown) {
      this.targetVelocity = this.maxSpeed;
    } else if (this.cursors?.down?.isDown || this.wasd?.S?.isDown) {
      this.targetVelocity = -this.maxReverseSpeed;
    }

    // Rotation: Left = turn left (negative), Right = turn right (positive)
    if (this.cursors?.left?.isDown || this.wasd?.A?.isDown) {
      this.rotationVelocity = -this.rotationSpeed;
    } else if (this.cursors?.right?.isDown || this.wasd?.D?.isDown) {
      this.rotationVelocity = this.rotationSpeed;
    }
  }

  private applyMovement(dt: number): void {
    // Smooth acceleration/deceleration
    if (this.targetVelocity !== 0) {
      if (this.velocity < this.targetVelocity) {
        this.velocity = Math.min(
          this.targetVelocity,
          this.velocity + this.acceleration * dt,
        );
      } else if (this.velocity > this.targetVelocity) {
        this.velocity = Math.max(
          this.targetVelocity,
          this.velocity - this.acceleration * dt,
        );
      }
    } else {
      if (this.velocity > 0) {
        this.velocity = Math.max(0, this.velocity - this.deceleration * dt);
      } else if (this.velocity < 0) {
        this.velocity = Math.min(0, this.velocity + this.deceleration * dt);
      }
    }

    // Apply rotation
    this.rotation += this.rotationVelocity * dt;

    // Normalize rotation to 0-2π
    while (this.rotation < 0) this.rotation += Math.PI * 2;
    while (this.rotation >= Math.PI * 2) this.rotation -= Math.PI * 2;

    // Apply movement in facing direction
    // Forward is +Z at rotation=0, rotates clockwise with positive rotation
    if (this.velocity !== 0) {
      const moveX = Math.sin(this.rotation) * this.velocity * dt;
      const moveZ = Math.cos(this.rotation) * this.velocity * dt;

      this.position.x += moveX;
      this.position.z += moveZ;
    }
  }

  private updateCamera(): void {
    this.camera.position.x = this.position.x;
    this.camera.position.y = this.eyeHeight;
    this.camera.position.z = this.position.z;
    this.camera.rotation = this.rotation;
  }

  getCamera(): Camera3D {
    return this.camera;
  }

  getPosition(): Vector3D {
    return this.position.clone();
  }

  getRotation(): number {
    return this.rotation;
  }

  getVelocity(): number {
    return this.velocity;
  }

  setPosition(x: number, z: number): void {
    this.position.x = x;
    this.position.z = z;
    this.velocity = 0;
    this.updateCamera();
  }

  setRotation(rotation: number): void {
    this.rotation = rotation;
    this.updateCamera();
  }

  // Damage methods
  takeDamage(section: TankSection): boolean {
    const current = this.damageState[section];
    if (current < DamageLevel.DESTROYED) {
      this.damageState[section] = current + 1;
    }
    return this.damageState[section] >= DamageLevel.DESTROYED;
  }

  getDamageState(): TankDamageState {
    return { ...this.damageState };
  }

  isDead(): boolean {
    return (
      this.damageState.front >= DamageLevel.DESTROYED ||
      this.damageState.rear >= DamageLevel.DESTROYED ||
      this.damageState.left >= DamageLevel.DESTROYED ||
      this.damageState.right >= DamageLevel.DESTROYED
    );
  }

  // Ammo methods
  getAmmo(): { current: number; max: number } {
    return { current: this.currentAmmo, max: this.maxAmmo };
  }

  useAmmo(): boolean {
    if (this.currentAmmo > 0 && !this.isReloading) {
      this.currentAmmo--;
      return true;
    }
    return false;
  }

  // Reload methods
  startReload(): void {
    if (!this.isReloading && this.currentAmmo < this.maxAmmo) {
      this.isReloading = true;
      this.reloadProgress = 0;
      this.reloadStartTime = this.scene.time.now;
    }
  }

  updateReload(): void {
    if (this.isReloading) {
      const elapsed = this.scene.time.now - this.reloadStartTime;
      this.reloadProgress = Math.min(1, elapsed / this.reloadTime);

      if (this.reloadProgress >= 1) {
        this.isReloading = false;
        this.currentAmmo = this.maxAmmo;
        this.reloadProgress = 0;
      }
    }
  }

  getReloadState(): { isReloading: boolean; progress: number } {
    return { isReloading: this.isReloading, progress: this.reloadProgress };
  }

  // Score methods
  getScore(): number {
    return this.score;
  }

  addScore(points: number): void {
    this.score += points;
  }

  // Fire method - returns projectile spawn info or null if can't fire
  fire(): { position: Vector3D; direction: Vector3D } | null {
    if (!this.useAmmo()) {
      return null;
    }

    // Spawn projectile at cannon position (slightly in front and above tank)
    const spawnOffset = 30; // Distance in front of tank
    const spawnHeight = this.eyeHeight; // Same as camera height

    const spawnPos = new Vector3D(
      this.position.x + Math.sin(this.rotation) * spawnOffset,
      spawnHeight,
      this.position.z + Math.cos(this.rotation) * spawnOffset,
    );

    // Direction is forward based on rotation
    const direction = new Vector3D(
      Math.sin(this.rotation),
      0,
      Math.cos(this.rotation),
    );

    // Auto-reload when empty
    if (this.currentAmmo === 0) {
      this.startReload();
    }

    return { position: spawnPos, direction };
  }
}
