# Feature Plan: Weapon Power-Ups

## Overview
Implement a weapon system with multiple unlockable weapons. Weapons are unlocked based on score milestones and can be cycled through once unlocked.

---

## Weapons

### 1. Blaster (Default)
- **Projectile**: Green elongated bolt with particle trail
- **Behavior**: Single shot, travels until hitting asteroid or timeout
- **Cooldown**: 150ms
- **Unlock**: Available from start

### 2. Laser
- **Projectile**: Red beam, instant hit-scan
- **Behavior**: Straight line that damages ALL asteroids within 300px in front of ship
- **Cooldown**: 500ms (slower than blaster)
- **Unlock**: Score ≥ 1000
- **Visual**: Brief red line rendered from ship to max range, fades quickly

---

## Implementation Tasks

### Phase 1: Weapon System Architecture
- [ ] Create `Weapon` base class/interface
  ```typescript
  interface Weapon {
    name: string;
    cooldown: number;
    unlockScore: number;
    fire(scene: Scene, ship: Ship): void;
    getProjectileTexture(): string;
  }
  ```
- [ ] Create `WeaponManager` class to handle:
  - Current weapon selection
  - Unlocked weapons tracking
  - Weapon switching (optional: key binding)
  - Checking unlock conditions on score change

### Phase 2: Refactor Blaster
- [ ] Extract current bullet logic into `BlasterWeapon` class
- [ ] Move bullet creation from `Game.shoot()` to weapon's `fire()` method
- [ ] Keep existing `Bullet` class for blaster projectiles

### Phase 3: Implement Laser
- [ ] Create `LaserWeapon` class
- [ ] Create laser beam visual (red line graphic)
  - Render as a rectangle/line from ship position
  - 300px length in aim direction
  - Fade out animation (100-200ms)
- [ ] Implement hit detection:
  - On fire, raycast/check all asteroids
  - Calculate if asteroid center is within beam width
  - Damage all asteroids intersecting the beam
- [ ] Create laser texture for HUD display

### Phase 4: HUD Updates
- [ ] Add weapon display area (bottom right)
  - Weapon name text
  - Projectile icon/preview
- [ ] Update HUD when weapon changes
- [ ] Show unlock notification when new weapon available
- [ ] Optional: Show cooldown indicator

### Phase 5: Unlock System
- [ ] Track score in `WeaponManager`
- [ ] Check unlock conditions when score updates
- [ ] Trigger unlock notification
- [ ] Auto-switch to new weapon on unlock (optional)

---

## File Changes

| File | Changes |
|------|---------|
| `src/game/objects/Weapon.ts` | NEW - Base weapon interface |
| `src/game/objects/BlasterWeapon.ts` | NEW - Blaster implementation |
| `src/game/objects/LaserWeapon.ts` | NEW - Laser implementation |
| `src/game/objects/WeaponManager.ts` | NEW - Weapon management |
| `src/game/objects/Bullet.ts` | Minor refactor |
| `src/game/scenes/Boot.ts` | Add laser textures |
| `src/game/scenes/Game.ts` | Integrate WeaponManager, update HUD |

---

## New Textures (Boot.ts)

```typescript
// Laser beam texture (red gradient line)
// Laser icon for HUD
// Blaster icon for HUD
```

---

## HUD Layout

```
┌─────────────────────────────────────────────────────────┐
│ SCORE: 1250                                  WAVE: 3    │
│ LIVES: 3                                                │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│                                                         │
│ WASD - Move                              ┌───────────┐  │
│ MOUSE - Aim                              │ [===]     │  │
│ CLICK - Fire                             │ LASER     │  │
└─────────────────────────────────────────────────────────┘
```

---

## Future Weapons (Ideas)

| Weapon | Unlock | Description |
|--------|--------|-------------|
| Spread Shot | 2500 | 3 blaster bolts in a cone |
| Missile | 5000 | Slow, homing, big explosion |
| Plasma | 7500 | Piercing shot, goes through asteroids |

---

## Technical Notes

### Laser Hit Detection
```typescript
// Pseudocode for laser raycast
const laserStart = { x: ship.x, y: ship.y };
const laserEnd = {
  x: ship.x + Math.cos(aimAngle) * 300,
  y: ship.y + Math.sin(aimAngle) * 300
};

asteroids.forEach(asteroid => {
  if (lineIntersectsCircle(laserStart, laserEnd, asteroid.position, asteroid.radius)) {
    asteroid.takeDamage();
  }
});
```

### Weapon Switching
- Option A: Auto-switch to best weapon
- Option B: Number keys (1, 2, 3...) to select
- Option C: Q/E or scroll wheel to cycle
