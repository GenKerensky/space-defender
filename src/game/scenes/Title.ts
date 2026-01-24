import Phaser from "phaser";
import { EventBus } from "../EventBus";

export class Title extends Phaser.Scene {
  private stars: { sprite: Phaser.GameObjects.Arc; speed: number }[] = [];
  private titleText!: Phaser.GameObjects.Text;
  private subtitleText!: Phaser.GameObjects.Text;
  private startText!: Phaser.GameObjects.Text;
  private floatingAsteroids: Phaser.GameObjects.Image[] = [];
  private shipPreview!: Phaser.GameObjects.Image;
  private particles!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super("Title");
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Apply CRT shader
    this.cameras.main.setPostPipeline("CRTShader");

    // Create scrolling star field
    this.createStarField();

    // Create floating asteroids in background
    this.createFloatingAsteroids();

    // Create ambient particle dust
    this.createAmbientParticles();

    // Title with glow effect
    this.titleText = this.add.text(width / 2, height * 0.28, "SPACE DEFENDER", {
      fontFamily: "monospace",
      fontSize: "72px",
      color: "#00ffff",
      stroke: "#004444",
      strokeThickness: 4,
    });
    this.titleText.setOrigin(0.5);
    this.titleText.setDepth(10);

    // Add glow shadow behind title
    const titleGlow = this.add.text(
      width / 2,
      height * 0.28,
      "SPACE DEFENDER",
      {
        fontFamily: "monospace",
        fontSize: "72px",
        color: "#00ffff",
      },
    );
    titleGlow.setOrigin(0.5);
    titleGlow.setAlpha(0.3);
    titleGlow.setDepth(9);

    // Pulsing glow animation
    this.tweens.add({
      targets: titleGlow,
      alpha: 0.1,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Subtle title float
    this.tweens.add({
      targets: [this.titleText, titleGlow],
      y: height * 0.28 + 8,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // Subtitle
    this.subtitleText = this.add.text(
      width / 2,
      height * 0.38,
      "DEFEND THE GALAXY FROM ASTEROID THREATS",
      {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#888888",
      },
    );
    this.subtitleText.setOrigin(0.5);
    this.subtitleText.setDepth(10);

    // Ship preview flying across
    this.shipPreview = this.add.image(width / 2, height * 0.55, "ship");
    this.shipPreview.setScale(2);
    this.shipPreview.setDepth(10);
    this.shipPreview.setRotation(-Math.PI / 2);

    // Ship engine glow
    const shipGlow = this.add.graphics();
    shipGlow.fillStyle(0x00ffff, 0.3);
    shipGlow.fillCircle(0, 0, 30);
    shipGlow.setDepth(9);

    // Animate ship glow following ship
    this.tweens.add({
      targets: this.shipPreview,
      y: height * 0.55 + 10,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        shipGlow.setPosition(this.shipPreview.x, this.shipPreview.y);
      },
    });

    // Ship engine particles
    const engineParticles = this.add.particles(0, 0, "flame", {
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 400,
      blendMode: "ADD",
      frequency: 30,
      angle: { min: 80, max: 100 },
      follow: this.shipPreview,
      followOffset: { x: 0, y: 20 },
    });
    engineParticles.setDepth(8);

    // Controls info
    const controlsY = height * 0.7;
    const controlsText = [
      "WASD - MOVE",
      "MOUSE - AIM",
      "CLICK - FIRE",
      "Q - SWITCH WEAPON",
    ];

    controlsText.forEach((text, i) => {
      const control = this.add.text(width / 2, controlsY + i * 24, text, {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#666666",
      });
      control.setOrigin(0.5);
      control.setDepth(10);
    });

    // Start prompt
    this.startText = this.add.text(
      width / 2,
      height * 0.88,
      "[ CLICK ANYWHERE TO START ]",
      {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#ffff00",
      },
    );
    this.startText.setOrigin(0.5);
    this.startText.setDepth(10);

    // Blinking start text
    this.tweens.add({
      targets: this.startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // High score display (if exists)
    const highScore = localStorage.getItem("spaceDefenderHighScore");
    if (highScore) {
      const highScoreText = this.add.text(
        width / 2,
        height * 0.95,
        `HIGH SCORE: ${highScore}`,
        {
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#ff8800",
        },
      );
      highScoreText.setOrigin(0.5);
      highScoreText.setDepth(10);
    }

    // Version/credits
    const versionText = this.add.text(10, height - 20, "v1.0", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#333333",
    });
    versionText.setDepth(10);

    // Click to start
    this.input.once("pointerdown", () => {
      this.cameras.main.fade(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start("Game");
      });
    });

    // Fade in
    this.cameras.main.fadeIn(1000);

    // Emit event for React bridge
    EventBus.emit("current-scene-ready", this);
  }

  private createStarField(): void {
    const { width, height } = this.cameras.main;

    // Create multiple layers of stars with different speeds
    const layers = [
      {
        count: 80,
        sizeMin: 0.5,
        sizeMax: 1,
        speedMin: 20,
        speedMax: 40,
        color: 0x444444,
      },
      {
        count: 50,
        sizeMin: 1,
        sizeMax: 2,
        speedMin: 40,
        speedMax: 80,
        color: 0x666666,
      },
      {
        count: 30,
        sizeMin: 1.5,
        sizeMax: 2.5,
        speedMin: 80,
        speedMax: 120,
        color: 0x888888,
      },
      {
        count: 15,
        sizeMin: 2,
        sizeMax: 3,
        speedMin: 120,
        speedMax: 180,
        color: 0xaaaaaa,
      },
    ];

    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const x = Phaser.Math.Between(0, width);
        const y = Phaser.Math.Between(0, height);
        const size = Phaser.Math.FloatBetween(layer.sizeMin, layer.sizeMax);
        const speed = Phaser.Math.Between(layer.speedMin, layer.speedMax);

        // Occasionally tint stars different colors
        let color = layer.color;
        const colorRoll = Math.random();
        if (colorRoll < 0.05)
          color = 0x8888ff; // Blue
        else if (colorRoll < 0.1)
          color = 0xff8888; // Red
        else if (colorRoll < 0.12) color = 0xffff88; // Yellow

        const star = this.add.circle(x, y, size, color);
        star.setDepth(0);

        this.stars.push({ sprite: star, speed });
      }
    });
  }

  private createFloatingAsteroids(): void {
    const { width, height } = this.cameras.main;

    // Create several floating asteroids
    for (let i = 0; i < 8; i++) {
      const textureIndex = Phaser.Math.Between(0, 4);
      const asteroid = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        `asteroid_${textureIndex}`,
      );

      const scale = Phaser.Math.FloatBetween(0.3, 0.8);
      asteroid.setScale(scale);
      asteroid.setAlpha(0.4);
      asteroid.setDepth(1);

      // Store velocity data
      asteroid.setData("vx", Phaser.Math.FloatBetween(-30, 30));
      asteroid.setData("vy", Phaser.Math.FloatBetween(20, 60));
      asteroid.setData("rotation", Phaser.Math.FloatBetween(-0.5, 0.5));

      this.floatingAsteroids.push(asteroid);
    }
  }

  private createAmbientParticles(): void {
    const { width } = this.cameras.main;

    // Subtle space dust
    this.particles = this.add.particles(width / 2, 0, "particle", {
      x: { min: -width / 2, max: width / 2 },
      y: 0,
      speedY: { min: 20, max: 50 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 0.3, end: 0 },
      lifespan: { min: 4000, max: 8000 },
      frequency: 200,
      blendMode: "ADD",
    });
    this.particles.setDepth(2);
  }

  update(_time: number, delta: number): void {
    const { width, height } = this.cameras.main;
    const dt = delta / 1000;

    // Scroll stars downward
    this.stars.forEach(({ sprite, speed }) => {
      sprite.y += speed * dt;

      // Wrap around
      if (sprite.y > height + 10) {
        sprite.y = -10;
        sprite.x = Phaser.Math.Between(0, width);
      }
    });

    // Move floating asteroids
    this.floatingAsteroids.forEach((asteroid) => {
      const vx = asteroid.getData("vx") as number;
      const vy = asteroid.getData("vy") as number;
      const rot = asteroid.getData("rotation") as number;

      asteroid.x += vx * dt;
      asteroid.y += vy * dt;
      asteroid.rotation += rot * dt;

      // Wrap around
      if (asteroid.y > height + 50) {
        asteroid.y = -50;
        asteroid.x = Phaser.Math.Between(0, width);
      }
      if (asteroid.x < -50) asteroid.x = width + 50;
      if (asteroid.x > width + 50) asteroid.x = -50;
    });
  }
}
