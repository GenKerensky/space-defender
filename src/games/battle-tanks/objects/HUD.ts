import Phaser from "phaser";
import { TankDamageState, getDamageColor } from "./TankHealth";
import { Vector3D } from "../engine/Vector3D";

/**
 * HUD elements: crosshairs, horizon line, score, armor, radar, ammo
 */
export class HUD {
  private scene: Phaser.Scene;
  private graphics: Phaser.GameObjects.Graphics;

  // Top left - Score and Wave
  private scoreText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;

  // Top right - Speed and position
  private speedText!: Phaser.GameObjects.Text;
  private positionText!: Phaser.GameObjects.Text;

  // Bottom left - Armor
  private armorGraphics!: Phaser.GameObjects.Graphics;
  private armorLabel!: Phaser.GameObjects.Text;

  // Bottom center - Radar
  private radarGraphics!: Phaser.GameObjects.Graphics;

  // Bottom right - Ammo and reload
  private ammoText!: Phaser.GameObjects.Text;
  private reloadText!: Phaser.GameObjects.Text;
  private reloadBar!: Phaser.GameObjects.Graphics;

  private crosshairColor = 0x00ff00;
  private horizonColor = 0x004400;
  private fontFamily: string;
  private margin = 30;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(100);

    this.fontFamily =
      (scene.registry.get("fontFamily") as string) || "Orbitron, monospace";

    this.createTextElements();
    this.createArmorDisplay();
    this.createRadar();
    this.createAmmoDisplay();
  }

  private createTextElements(): void {
    const { width } = this.scene.cameras.main;

    // Top left - Score
    this.scoreText = this.scene.add.text(this.margin, this.margin, "SCORE: 0", {
      fontFamily: this.fontFamily,
      fontSize: "24px",
      color: "#00ff00",
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(100);

    // Top left - Wave (below score)
    this.waveText = this.scene.add.text(
      this.margin,
      this.margin + 32,
      "WAVE 1",
      {
        fontFamily: this.fontFamily,
        fontSize: "20px",
        color: "#00ff00",
      },
    );
    this.waveText.setScrollFactor(0);
    this.waveText.setDepth(100);

    // Top right - Speed
    this.speedText = this.scene.add.text(
      width - this.margin,
      this.margin,
      "SPEED: 0",
      {
        fontFamily: this.fontFamily,
        fontSize: "24px",
        color: "#00ff00",
      },
    );
    this.speedText.setOrigin(1, 0);
    this.speedText.setScrollFactor(0);
    this.speedText.setDepth(100);

    // Top right - Position (below speed)
    this.positionText = this.scene.add.text(
      width - this.margin,
      this.margin + 32,
      "X: 0 Z: 0",
      {
        fontFamily: this.fontFamily,
        fontSize: "20px",
        color: "#666666",
      },
    );
    this.positionText.setOrigin(1, 0);
    this.positionText.setScrollFactor(0);
    this.positionText.setDepth(100);
  }

  private createArmorDisplay(): void {
    const { height } = this.scene.cameras.main;

    this.armorGraphics = this.scene.add.graphics();
    this.armorGraphics.setDepth(100);

    // Label above armor diagram (centered over tank)
    this.armorLabel = this.scene.add.text(
      this.margin + 50,
      height - this.margin - 140,
      "ARMOR",
      {
        fontFamily: this.fontFamily,
        fontSize: "18px",
        color: "#00ff00",
      },
    );
    this.armorLabel.setOrigin(0.5, 0);
    this.armorLabel.setScrollFactor(0);
    this.armorLabel.setDepth(100);
  }

  private createRadar(): void {
    this.radarGraphics = this.scene.add.graphics();
    this.radarGraphics.setDepth(100);
  }

  private createAmmoDisplay(): void {
    const { width, height } = this.scene.cameras.main;

    // Ammo text
    this.ammoText = this.scene.add.text(
      width - this.margin,
      height - this.margin - 60,
      "AMMO: 10",
      {
        fontFamily: this.fontFamily,
        fontSize: "22px",
        color: "#00ff00",
      },
    );
    this.ammoText.setOrigin(1, 0);
    this.ammoText.setScrollFactor(0);
    this.ammoText.setDepth(100);

    // Reload text (hidden initially)
    this.reloadText = this.scene.add.text(
      width - this.margin,
      height - this.margin - 32,
      "RELOADING",
      {
        fontFamily: this.fontFamily,
        fontSize: "16px",
        color: "#ffff00",
      },
    );
    this.reloadText.setOrigin(1, 0);
    this.reloadText.setScrollFactor(0);
    this.reloadText.setDepth(100);
    this.reloadText.setVisible(false);

    // Reload bar
    this.reloadBar = this.scene.add.graphics();
    this.reloadBar.setDepth(100);
  }

  draw(): void {
    const { width, height } = this.scene.cameras.main;

    this.graphics.clear();

    this.drawCrosshairs(width, height);
    this.drawHorizon(width, height);
  }

  private drawCrosshairs(screenW: number, screenH: number): void {
    const cx = screenW / 2;
    const cy = screenH / 2;

    this.graphics.lineStyle(2, this.crosshairColor, 1);

    // Horizontal
    this.graphics.beginPath();
    this.graphics.moveTo(cx - 30, cy);
    this.graphics.lineTo(cx - 10, cy);
    this.graphics.strokePath();

    this.graphics.beginPath();
    this.graphics.moveTo(cx + 10, cy);
    this.graphics.lineTo(cx + 30, cy);
    this.graphics.strokePath();

    // Vertical
    this.graphics.beginPath();
    this.graphics.moveTo(cx, cy - 30);
    this.graphics.lineTo(cx, cy - 10);
    this.graphics.strokePath();

    this.graphics.beginPath();
    this.graphics.moveTo(cx, cy + 10);
    this.graphics.lineTo(cx, cy + 30);
    this.graphics.strokePath();

    // Center dot
    this.graphics.fillStyle(this.crosshairColor, 1);
    this.graphics.fillCircle(cx, cy, 2);

    // Corner brackets
    const bracketSize = 8;
    const bracketOffset = 40;

    this.graphics.lineStyle(1, this.crosshairColor, 0.6);

    // Top-left
    this.graphics.beginPath();
    this.graphics.moveTo(cx - bracketOffset, cy - bracketOffset + bracketSize);
    this.graphics.lineTo(cx - bracketOffset, cy - bracketOffset);
    this.graphics.lineTo(cx - bracketOffset + bracketSize, cy - bracketOffset);
    this.graphics.strokePath();

    // Top-right
    this.graphics.beginPath();
    this.graphics.moveTo(cx + bracketOffset - bracketSize, cy - bracketOffset);
    this.graphics.lineTo(cx + bracketOffset, cy - bracketOffset);
    this.graphics.lineTo(cx + bracketOffset, cy - bracketOffset + bracketSize);
    this.graphics.strokePath();

    // Bottom-left
    this.graphics.beginPath();
    this.graphics.moveTo(cx - bracketOffset, cy + bracketOffset - bracketSize);
    this.graphics.lineTo(cx - bracketOffset, cy + bracketOffset);
    this.graphics.lineTo(cx - bracketOffset + bracketSize, cy + bracketOffset);
    this.graphics.strokePath();

    // Bottom-right
    this.graphics.beginPath();
    this.graphics.moveTo(cx + bracketOffset - bracketSize, cy + bracketOffset);
    this.graphics.lineTo(cx + bracketOffset, cy + bracketOffset);
    this.graphics.lineTo(cx + bracketOffset, cy + bracketOffset - bracketSize);
    this.graphics.strokePath();
  }

  private drawHorizon(screenW: number, screenH: number): void {
    const horizonY = screenH / 2;

    this.graphics.lineStyle(1, this.horizonColor, 0.5);
    this.graphics.beginPath();
    this.graphics.moveTo(0, horizonY);
    this.graphics.lineTo(screenW, horizonY);
    this.graphics.strokePath();

    const tickSpacing = 100;
    const tickHeight = 5;

    for (let x = tickSpacing; x < screenW; x += tickSpacing) {
      this.graphics.beginPath();
      this.graphics.moveTo(x, horizonY - tickHeight);
      this.graphics.lineTo(x, horizonY + tickHeight);
      this.graphics.strokePath();
    }
  }

  update(
    speed: number,
    posX: number,
    posZ: number,
    score: number,
    damageState: TankDamageState,
    ammo: { current: number; max: number },
    reload: { isReloading: boolean; progress: number },
    enemies: Vector3D[],
    playerPos: Vector3D,
    playerRotation: number,
    waveNumber = 1,
  ): void {
    // Update score
    this.scoreText.setText(`SCORE: ${score}`);

    // Update wave
    this.waveText.setText(`WAVE ${waveNumber}`);

    // Update speed
    const displaySpeed = Math.abs(Math.round(speed));
    this.speedText.setText(`SPEED: ${displaySpeed}`);

    if (displaySpeed > 100) {
      this.speedText.setColor("#ffff00");
    } else if (displaySpeed > 0) {
      this.speedText.setColor("#00ff00");
    } else {
      this.speedText.setColor("#666666");
    }

    // Update position
    this.positionText.setText(`X: ${Math.round(posX)} Z: ${Math.round(posZ)}`);

    // Update armor display
    this.drawArmorIndicator(damageState);

    // Update ammo
    this.updateAmmo(ammo.current, ammo.max);

    // Update reload
    this.updateReload(reload.isReloading, reload.progress);

    // Update radar
    this.drawRadar(enemies, playerPos, playerRotation);
  }

  private drawArmorIndicator(damage: TankDamageState): void {
    const { height } = this.scene.cameras.main;
    this.armorGraphics.clear();

    // Tank diagram position (bottom left, moved up for spacing)
    const baseX = this.margin + 50;
    const baseY = height - this.margin - 70;

    // Tank dimensions (larger)
    const tankW = 60;
    const tankH = 90;
    const frontH = 18;
    const rearH = 15;
    const sideW = 12;

    // Front section (trapezoidal top)
    this.armorGraphics.lineStyle(3, getDamageColor(damage.front), 1);
    this.armorGraphics.beginPath();
    this.armorGraphics.moveTo(baseX - tankW / 2 + 5, baseY - tankH / 2);
    this.armorGraphics.lineTo(baseX + tankW / 2 - 5, baseY - tankH / 2);
    this.armorGraphics.lineTo(
      baseX + tankW / 2 - sideW,
      baseY - tankH / 2 + frontH,
    );
    this.armorGraphics.lineTo(
      baseX - tankW / 2 + sideW,
      baseY - tankH / 2 + frontH,
    );
    this.armorGraphics.closePath();
    this.armorGraphics.strokePath();

    // Rear section (trapezoidal bottom)
    this.armorGraphics.lineStyle(3, getDamageColor(damage.rear), 1);
    this.armorGraphics.beginPath();
    this.armorGraphics.moveTo(
      baseX - tankW / 2 + sideW,
      baseY + tankH / 2 - rearH,
    );
    this.armorGraphics.lineTo(
      baseX + tankW / 2 - sideW,
      baseY + tankH / 2 - rearH,
    );
    this.armorGraphics.lineTo(baseX + tankW / 2 - 5, baseY + tankH / 2);
    this.armorGraphics.lineTo(baseX - tankW / 2 + 5, baseY + tankH / 2);
    this.armorGraphics.closePath();
    this.armorGraphics.strokePath();

    // Left section (rectangle)
    this.armorGraphics.lineStyle(3, getDamageColor(damage.left), 1);
    this.armorGraphics.beginPath();
    this.armorGraphics.moveTo(baseX - tankW / 2, baseY - tankH / 2 + 5);
    this.armorGraphics.lineTo(
      baseX - tankW / 2 + sideW,
      baseY - tankH / 2 + frontH,
    );
    this.armorGraphics.lineTo(
      baseX - tankW / 2 + sideW,
      baseY + tankH / 2 - rearH,
    );
    this.armorGraphics.lineTo(baseX - tankW / 2, baseY + tankH / 2 - 5);
    this.armorGraphics.closePath();
    this.armorGraphics.strokePath();

    // Right section (rectangle)
    this.armorGraphics.lineStyle(3, getDamageColor(damage.right), 1);
    this.armorGraphics.beginPath();
    this.armorGraphics.moveTo(baseX + tankW / 2, baseY - tankH / 2 + 5);
    this.armorGraphics.lineTo(
      baseX + tankW / 2 - sideW,
      baseY - tankH / 2 + frontH,
    );
    this.armorGraphics.lineTo(
      baseX + tankW / 2 - sideW,
      baseY + tankH / 2 - rearH,
    );
    this.armorGraphics.lineTo(baseX + tankW / 2, baseY + tankH / 2 - 5);
    this.armorGraphics.closePath();
    this.armorGraphics.strokePath();
  }

  private drawRadar(
    enemies: Vector3D[],
    playerPos: Vector3D,
    playerRotation: number,
  ): void {
    const { width, height } = this.scene.cameras.main;
    this.radarGraphics.clear();

    const radarRadius = 80;
    const radarX = width / 2;
    const radarY = height - this.margin - radarRadius;
    const radarRange = 2000; // World units

    // Radar background
    this.radarGraphics.fillStyle(0x001100, 0.8);
    this.radarGraphics.fillCircle(radarX, radarY, radarRadius);

    // Radar border
    this.radarGraphics.lineStyle(2, 0x00ff00, 0.8);
    this.radarGraphics.strokeCircle(radarX, radarY, radarRadius);

    // Cross lines
    this.radarGraphics.lineStyle(1, 0x004400, 0.5);
    this.radarGraphics.beginPath();
    this.radarGraphics.moveTo(radarX - radarRadius, radarY);
    this.radarGraphics.lineTo(radarX + radarRadius, radarY);
    this.radarGraphics.strokePath();
    this.radarGraphics.beginPath();
    this.radarGraphics.moveTo(radarX, radarY - radarRadius);
    this.radarGraphics.lineTo(radarX, radarY + radarRadius);
    this.radarGraphics.strokePath();

    // Range rings
    this.radarGraphics.strokeCircle(radarX, radarY, radarRadius * 0.5);

    // Player dot (center)
    this.radarGraphics.fillStyle(0x00ff00, 1);
    this.radarGraphics.fillCircle(radarX, radarY, 4);

    // Facing indicator (line pointing up = forward)
    this.radarGraphics.lineStyle(2, 0x00ff00, 1);
    this.radarGraphics.beginPath();
    this.radarGraphics.moveTo(radarX, radarY);
    this.radarGraphics.lineTo(radarX, radarY - 14);
    this.radarGraphics.strokePath();

    // Draw enemies
    for (const enemy of enemies) {
      // Calculate relative position
      const dx = enemy.x - playerPos.x;
      const dz = enemy.z - playerPos.z;

      // Rotate by player rotation (so forward is always up)
      const cos = Math.cos(playerRotation);
      const sin = Math.sin(playerRotation);
      const relX = dx * cos - dz * sin;
      const relZ = dx * sin + dz * cos;

      // Scale to radar
      const distance = Math.sqrt(relX * relX + relZ * relZ);
      let radarDist = (distance / radarRange) * radarRadius;

      // Clamp to radar edge
      if (radarDist > radarRadius - 5) {
        radarDist = radarRadius - 5;
      }

      // Calculate angle and position
      const angle = Math.atan2(relX, -relZ);
      const dotX = radarX + Math.sin(angle) * radarDist;
      const dotY = radarY + Math.cos(angle) * radarDist;

      // Draw enemy dot
      this.radarGraphics.fillStyle(0xff0000, 1);
      this.radarGraphics.fillCircle(dotX, dotY, 4);
    }
  }

  private updateAmmo(current: number, _max: number): void {
    this.ammoText.setText(`AMMO: ${current}`);

    if (current === 0) {
      this.ammoText.setColor("#ff0000");
    } else if (current < 3) {
      this.ammoText.setColor("#ffff00");
    } else {
      this.ammoText.setColor("#00ff00");
    }
  }

  private updateReload(isReloading: boolean, progress: number): void {
    const { width, height } = this.scene.cameras.main;

    this.reloadText.setVisible(isReloading);
    this.reloadBar.clear();

    if (isReloading) {
      const barWidth = 140;
      const barHeight = 12;
      const barX = width - this.margin - barWidth;
      const barY = height - this.margin - 12;

      // Background
      this.reloadBar.fillStyle(0x222222, 1);
      this.reloadBar.fillRect(barX, barY, barWidth, barHeight);

      // Progress fill
      this.reloadBar.fillStyle(0x00ff00, 1);
      this.reloadBar.fillRect(barX, barY, barWidth * progress, barHeight);

      // Border
      this.reloadBar.lineStyle(2, 0x00ff00, 0.8);
      this.reloadBar.strokeRect(barX, barY, barWidth, barHeight);
    }
  }

  destroy(): void {
    this.graphics.destroy();
    this.scoreText.destroy();
    this.waveText.destroy();
    this.speedText.destroy();
    this.positionText.destroy();
    this.armorGraphics.destroy();
    this.armorLabel.destroy();
    this.radarGraphics.destroy();
    this.ammoText.destroy();
    this.reloadText.destroy();
    this.reloadBar.destroy();
  }
}
