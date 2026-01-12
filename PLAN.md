# Asteroids Clone - Development Plan

## Overview
A browser-based Asteroids clone built with Phaser 3 and Bun, featuring mouse-based aiming.

## Tech Stack
- **Runtime**: Bun
- **Framework**: Phaser 3
- **Template**: phaserjs/template-bun

## Game Mechanics

### Player Ship
- Rotates to follow mouse cursor
- WASD/Arrow keys for thrust movement
- Left-click to fire bullets
- Wraps around screen edges
- 3 lives, invulnerability on respawn

### Asteroids
- 3 sizes: large → medium → small
- Large splits into 2 medium, medium into 2 small
- Random velocities and rotation
- Wrap around screen edges

### Bullets
- Fire toward mouse cursor
- Limited lifespan (despawn after ~2 seconds)
- Destroy asteroids on contact

### Scoring
- Large asteroid: 20 pts
- Medium asteroid: 50 pts
- Small asteroid: 100 pts

### Waves
- Start with 4 large asteroids
- Each wave adds +1 asteroid
- Brief pause between waves

## File Structure
```
asteroids-clone/
├── src/
│   ├── main.ts           # Game config & entry
│   ├── scenes/
│   │   ├── Boot.ts       # Asset loading
│   │   ├── Game.ts       # Main gameplay
│   │   └── GameOver.ts   # End screen
│   ├── objects/
│   │   ├── Ship.ts       # Player ship class
│   │   ├── Asteroid.ts   # Asteroid class
│   │   └── Bullet.ts     # Bullet class
│   └── utils/
│       └── wrap.ts       # Screen wrap helper
├── public/
│   └── assets/           # Generated/placeholder graphics
├── PLAN.md
├── CHECKLIST.md
└── package.json
```

## Controls
| Input | Action |
|-------|--------|
| Mouse | Aim ship |
| Left Click | Fire |
| W | Thrust forward |
| S | Thrust backward |
| A | Strafe left |
| D | Strafe right |
