import { Vector3D } from "../engine/Vector3D";
import { WireframeModel, createEdges } from "../engine/WireframeModel";

/**
 * Color palette for Battle Tanks
 */
export const COLORS = {
  player: 0x00ff00,
  enemy: 0xff0000,
  obstacle: 0x00ff00, // Green instead of cyan
  terrain: 0x00aa00,
  projectile: 0xffff00,
  mountains: 0x006600,
  grid: 0x004400,
  // Pickup colors
  pickup_armor: 0x00ffff, // Cyan for armor pickups
  pickup_weapon: 0xffd700, // Gold for weapon pickups
  laser: 0xff4400, // Orange-red laser beam
};

/**
 * M1 Abrams-style tank wireframe model
 * Scaled so gun barrel is at player eye level (y=50)
 */
export const ENEMY_TANK: WireframeModel = {
  vertices: [
    // === HULL ===
    // Hull bottom (0-3)
    new Vector3D(-45, 0, -55), // 0: rear left
    new Vector3D(45, 0, -55), // 1: rear right
    new Vector3D(45, 0, 60), // 2: front right
    new Vector3D(-45, 0, 60), // 3: front left

    // Hull top rear (4-5)
    new Vector3D(-42, 28, -50), // 4: rear left top
    new Vector3D(42, 28, -50), // 5: rear right top

    // Hull top sides (6-7)
    new Vector3D(-42, 28, 20), // 6: left side top
    new Vector3D(42, 28, 20), // 7: right side top

    // Hull glacis plate - sloped front armor (8-11)
    new Vector3D(-40, 28, 35), // 8: glacis top left
    new Vector3D(40, 28, 35), // 9: glacis top right
    new Vector3D(-42, 15, 58), // 10: glacis bottom left
    new Vector3D(42, 15, 58), // 11: glacis bottom right

    // === TURRET ===
    // Turret base (12-15)
    new Vector3D(-30, 28, -28), // 12: turret base rear left
    new Vector3D(30, 28, -28), // 13: turret base rear right
    new Vector3D(30, 28, 25), // 14: turret base front right
    new Vector3D(-30, 28, 25), // 15: turret base front left

    // Turret bustle - rear extension (16-19)
    new Vector3D(-26, 28, -40), // 16: bustle rear left bottom
    new Vector3D(26, 28, -40), // 17: bustle rear right bottom
    new Vector3D(-26, 40, -40), // 18: bustle rear left top
    new Vector3D(26, 40, -40), // 19: bustle rear right top

    // Turret top - angular wedge (20-23)
    new Vector3D(-24, 52, -22), // 20: turret top rear left
    new Vector3D(24, 52, -22), // 21: turret top rear right
    new Vector3D(24, 52, 18), // 22: turret top front right
    new Vector3D(-24, 52, 18), // 23: turret top front left

    // Turret front slope / mantlet (24-25)
    new Vector3D(-20, 46, 30), // 24: mantlet left
    new Vector3D(20, 46, 30), // 25: mantlet right

    // === MAIN GUN ===
    // Gun barrel (26-33) - at y=50 to match crosshairs
    new Vector3D(-5, 46, 30), // 26: barrel base bottom left
    new Vector3D(5, 46, 30), // 27: barrel base bottom right
    new Vector3D(5, 52, 30), // 28: barrel base top right
    new Vector3D(-5, 52, 30), // 29: barrel base top left
    new Vector3D(-4, 47, 100), // 30: barrel end bottom left
    new Vector3D(4, 47, 100), // 31: barrel end bottom right
    new Vector3D(4, 51, 100), // 32: barrel end top right
    new Vector3D(-4, 51, 100), // 33: barrel end top left

    // === COMMANDER CUPOLA ===
    new Vector3D(-10, 52, -5), // 34: cupola left
    new Vector3D(0, 52, -10), // 35: cupola rear
    new Vector3D(0, 52, 0), // 36: cupola front
    new Vector3D(0, 60, -5), // 37: cupola top
  ],
  edges: createEdges([
    // Hull bottom
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Hull verticals
    [0, 4],
    [1, 5],
    [2, 11],
    [3, 10],
    // Hull rear
    [4, 5],
    // Hull sides
    [4, 6],
    [5, 7],
    [6, 8],
    [7, 9],
    // Glacis plate (sloped front)
    [8, 9],
    [10, 11],
    [8, 10],
    [9, 11],
    // Hull top outline
    [6, 7],
    // Turret base
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 12],
    // Turret bustle
    [16, 17],
    [18, 19],
    [16, 18],
    [17, 19],
    [12, 16],
    [13, 17],
    [18, 20],
    [19, 21],
    // Turret sides
    [12, 20],
    [13, 21],
    [14, 22],
    [15, 23],
    // Turret top
    [20, 21],
    [21, 22],
    [22, 23],
    [23, 20],
    // Turret front slope to mantlet
    [23, 24],
    [22, 25],
    [24, 25],
    // Main gun barrel
    [26, 27],
    [27, 28],
    [28, 29],
    [29, 26],
    [30, 31],
    [31, 32],
    [32, 33],
    [33, 30],
    [26, 30],
    [27, 31],
    [28, 32],
    [29, 33],
    // Commander cupola
    [34, 35],
    [35, 36],
    [36, 34],
    [34, 37],
    [35, 37],
    [36, 37],
  ]),
  color: COLORS.enemy,
};

/**
 * Pyramid obstacle
 */
export const PYRAMID: WireframeModel = {
  vertices: [
    new Vector3D(-30, 0, -30),
    new Vector3D(30, 0, -30),
    new Vector3D(30, 0, 30),
    new Vector3D(-30, 0, 30),
    new Vector3D(0, 60, 0),
  ],
  edges: createEdges([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [0, 4],
    [1, 4],
    [2, 4],
    [3, 4],
  ]),
  color: COLORS.obstacle,
};

/**
 * Cube obstacle
 */
export const CUBE: WireframeModel = {
  vertices: [
    new Vector3D(-25, 0, -25),
    new Vector3D(25, 0, -25),
    new Vector3D(25, 0, 25),
    new Vector3D(-25, 0, 25),
    new Vector3D(-25, 50, -25),
    new Vector3D(25, 50, -25),
    new Vector3D(25, 50, 25),
    new Vector3D(-25, 50, 25),
  ],
  edges: createEdges([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
  ]),
  color: COLORS.obstacle,
};

/**
 * Player Projectile (yellow)
 */
export const PROJECTILE: WireframeModel = {
  vertices: [
    new Vector3D(0, 0, -8),
    new Vector3D(-2, 0, 0),
    new Vector3D(2, 0, 0),
    new Vector3D(0, 2, 0),
    new Vector3D(0, -2, 0),
    new Vector3D(0, 0, 12),
  ],
  edges: createEdges([
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 3],
    [3, 2],
    [2, 4],
    [4, 1],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
  ]),
  color: COLORS.projectile,
};

/**
 * Enemy Projectile (red)
 */
export const ENEMY_PROJECTILE: WireframeModel = {
  vertices: [
    new Vector3D(0, 0, -8),
    new Vector3D(-2, 0, 0),
    new Vector3D(2, 0, 0),
    new Vector3D(0, 2, 0),
    new Vector3D(0, -2, 0),
    new Vector3D(0, 0, 12),
  ],
  edges: createEdges([
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 3],
    [3, 2],
    [2, 4],
    [4, 1],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5],
  ]),
  color: COLORS.enemy,
};

/**
 * Shield pickup - hexagonal shield shape (cyan)
 */
export const SHIELD_PICKUP: WireframeModel = {
  vertices: [
    // Hexagonal shield outline
    new Vector3D(0, 45, 0), // 0: top point
    new Vector3D(-18, 35, 0), // 1: upper left
    new Vector3D(-22, 20, 0), // 2: mid left
    new Vector3D(-18, 5, 0), // 3: lower left
    new Vector3D(0, 0, 0), // 4: bottom point
    new Vector3D(18, 5, 0), // 5: lower right
    new Vector3D(22, 20, 0), // 6: mid right
    new Vector3D(18, 35, 0), // 7: upper right
    // Inner cross detail
    new Vector3D(0, 35, 0), // 8: inner top
    new Vector3D(0, 10, 0), // 9: inner bottom
    new Vector3D(-12, 22, 0), // 10: inner left
    new Vector3D(12, 22, 0), // 11: inner right
  ],
  edges: createEdges([
    // Outer shield
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 0],
    // Inner cross
    [8, 9],
    [10, 11],
  ]),
  color: COLORS.pickup_armor,
};

/**
 * Laser pickup - stylized ray gun shape (gold)
 */
export const LASER_PICKUP: WireframeModel = {
  vertices: [
    // Handle/grip (0-3)
    new Vector3D(-6, 0, -8),
    new Vector3D(6, 0, -8),
    new Vector3D(6, 12, -8),
    new Vector3D(-6, 12, -8),
    // Body housing (4-7)
    new Vector3D(-10, 12, -12),
    new Vector3D(10, 12, -12),
    new Vector3D(10, 24, -8),
    new Vector3D(-10, 24, -8),
    // Barrel base (8-11)
    new Vector3D(-5, 16, -8),
    new Vector3D(5, 16, -8),
    new Vector3D(5, 22, 25),
    new Vector3D(-5, 22, 25),
    // Emitter tip flared (12-15)
    new Vector3D(-8, 14, 25),
    new Vector3D(8, 14, 25),
    new Vector3D(8, 24, 32),
    new Vector3D(-8, 24, 32),
  ],
  edges: createEdges([
    // Handle
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
    // Body
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4],
    // Connect handle to body
    [2, 4],
    [3, 7],
    [2, 5],
    [3, 4],
    // Barrel
    [8, 9],
    [9, 10],
    [10, 11],
    [11, 8],
    // Emitter
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 12],
    // Connect barrel to emitter
    [10, 14],
    [11, 15],
    [10, 13],
    [11, 12],
  ]),
  color: COLORS.pickup_weapon,
};
