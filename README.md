# Space Defender

A retro-style arcade space shooter built with Phaser 3 and TypeScript. Defend the galaxy from endless waves of asteroids using an arsenal of upgradeable weapons.

![Space Defender](screenshot.png)

## Features

- **Classic Asteroids Gameplay** — Destroy asteroids that split into smaller pieces
- **Mouse Aiming** — Precise aiming with WASD movement for fluid twin-stick style controls
- **3 Weapon Types**:
  - **Blaster** — Fast-firing green plasma bolts (starting weapon)
  - **Laser** — Instant red beam that cuts through asteroids (unlocks at 1000 pts)
  - **Missile** — Homing projectiles that track your cursor and explode on impact (unlocks at 2000 pts)
- **CRT Shader Effect** — Authentic retro visuals with scanlines, screen curvature, chromatic aberration, and bloom
- **Procedural Graphics** — All sprites generated at runtime, no external assets needed
- **Cheat Mode** — For testing (press C to toggle)

## Controls

| Key | Action |
|-----|--------|
| W | Thrust forward |
| S | Thrust backward |
| A | Strafe left |
| D | Strafe right |
| Mouse | Aim |
| Click | Fire weapon |
| Q | Cycle weapons |
| C | Toggle cheat mode |
| ESC | Return to title (game over screen) |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd asteroids-clone

# Install dependencies
bun install
```

### Development

```bash
# Start development server with hot reload
bun run dev
```

The game runs at `http://localhost:8080` by default.

### Production Build

```bash
# Create optimized production build
bun run build
```

Output is generated in the `dist/` folder.

### Linting & Formatting

```bash
# Run ESLint
bun run lint

# Format code with Prettier
bun run format
```

## Project Structure

```
asteroids-clone/
├── src/
│   ├── main.ts                 # Application entry point
│   └── game/
│       ├── main.ts             # Phaser game configuration
│       ├── objects/            # Game object classes
│       │   ├── Ship.ts         # Player ship with movement & aiming
│       │   ├── Asteroid.ts     # Asteroid with splitting behavior
│       │   ├── Bullet.ts       # Blaster projectile
│       │   ├── Missile.ts      # Homing missile projectile
│       │   ├── Weapon.ts       # Weapon interface
│       │   ├── BlasterWeapon.ts
│       │   ├── LaserWeapon.ts
│       │   ├── MissileWeapon.ts
│       │   └── WeaponManager.ts # Weapon switching & unlocking
│       ├── scenes/
│       │   ├── Boot.ts         # Asset generation (procedural textures)
│       │   ├── Title.ts        # Title screen with scrolling stars
│       │   ├── Game.ts         # Main gameplay scene
│       │   └── GameOver.ts     # Game over & high score display
│       ├── shaders/
│       │   └── CRTShader.ts    # WebGL post-processing shader
│       └── utils/
│           └── wrap.ts         # Screen wrapping utility
├── public/
│   ├── style.css               # Global styles
│   └── favicon.png
├── vite/
│   ├── config.dev.mjs          # Vite dev config
│   └── config.prod.mjs         # Vite production config
├── index.html                  # HTML entry point
├── package.json
├── tsconfig.json
└── eslint.config.js
```

## Tech Stack

- **[Phaser 3.90](https://phaser.io/)** — HTML5 game framework
- **[TypeScript 5.7](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Vite 6](https://vitejs.dev/)** — Fast build tool with HMR
- **WebGL** — Custom CRT post-processing shader

## Game Design

### Scoring

| Asteroid Size | Points |
|---------------|--------|
| Large | 20 |
| Medium | 50 |
| Small | 100 |

### Weapon Unlocks

| Weapon | Unlock Score | Cooldown |
|--------|--------------|----------|
| Blaster | 0 (starting) | 200ms |
| Laser | 1000 | 500ms |
| Missile | 2000 | 800ms |

### Waves

Each wave spawns `3 + wave_number` large asteroids. Asteroids spawn away from the player's position.
