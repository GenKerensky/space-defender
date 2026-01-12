# Asteroids Clone - Development Checklist

## Setup
- [x] Clone Bun template from phaserjs/template-bun
- [x] Install dependencies
- [x] Verify dev server runs (build passes)

## Core Game Objects
- [x] Create Ship class with mouse-aim rotation
- [x] Create Asteroid class with size variants
- [x] Create Bullet class with lifespan
- [x] Implement screen wrapping for all objects

## Scenes
- [x] Boot scene - asset loading (procedural graphics)
- [x] Game scene - main gameplay loop
- [x] GameOver scene - score display & restart

## Gameplay Systems
- [x] Player input (mouse aim + keyboard movement)
- [x] Shooting mechanics
- [x] Asteroid spawning & wave system
- [x] Collision detection (bullet↔asteroid, ship↔asteroid)
- [x] Asteroid splitting on destruction
- [x] Score tracking
- [x] Lives system with respawn invulnerability

## Polish
- [x] HUD (score, lives, wave)
- [x] Visual effects (explosions/particles)
- [x] Game over handling
- [x] Wave transitions

## Testing
- [ ] Verify all controls work
- [ ] Test collision edge cases
- [ ] Confirm wave progression
- [ ] Check screen wrap at all edges

---

## How to Run

```bash
# Install dependencies
pnpm install

# Dev server
pnpm dev

# Production build
pnpm build
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
