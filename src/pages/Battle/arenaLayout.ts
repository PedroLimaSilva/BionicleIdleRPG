/**
 * Battle arena stage layout — single source of truth for R3F scenes and Blender exports.
 *
 * ## Blender export checklist (`public/arena.glb`)
 * - **Units:** 1 Blender unit = 1 world unit here.
 * - **Origin:** arena center at (0, 0, 0); floor sits on Y = 0.
 * - **Diameter:** ground mesh should span `ARENA_DIAMETER` (3 units) on X/Z.
 * - **Root object name:** `Ground` (loaded by `ArenaGround`).
 * - **Combat zone:** keep the inner ~2.2-unit circle clear for models and animations.
 * - **Rim rocks / canyon walls:** optional in the GLB, or leave to code blockout props below.
 * - **Export:** GLB, Y-up, apply transforms, then `yarn compress public/arena.glb`.
 * - **Layout reference:** run `yarn generate:arena-blockout` → `public/arena_blockout.glb`
 *   (import into Blender to match slot markers, rocks, and canyon walls).
 * - **Sky HDRI in Blender:** `public/hdri/quarry_01_1k.hdr` (optional reference; not used in-game yet).
 * - **Background geometry:** `ARENA_BACKDROP_WALLS` are layout reference only — not rendered in-game until art lands.
 */

/** Full stage diameter used for camera framing and ground mesh bounds. */
export const ARENA_DIAMETER = 3;
export const ARENA_RADIUS = ARENA_DIAMETER / 2;

/** Alias kept for camera framing math in `ArenaFraming`. */
export const ARENA_BOX_SIZE = ARENA_DIAMETER;

/** Margin multiplier so combatants are not clipped at the viewport edge. */
export const ARENA_MARGIN = 1;

/** Arena center — camera look-at target. */
export const ARENA_CENTER: [number, number, number] = [0, 0, 0];

/** Team (Toa) spawn slots — +Z is toward the camera in the default portrait view. */
export const TEAM_POSITIONS: [number, number, number][] = [
  [-0.7, 0, 0.78],
  [0, 0, 0.46],
  [0.7, 0, 0.78],
];

/** Enemy spawn slots — −Z is away from the camera. */
export const ENEMY_POSITIONS: [number, number, number][] = [
  [0, 0, -0.5],
  [-0.5, 0, -0.75],
  [0.5, 0, -0.75],
];

/**
 * Blockout rim rocks — reference placements for Blender sculpting or in-engine placeholders.
 * Y rotation is radians; scale is uniform.
 */
export const ARENA_RIM_ROCKS = [
  { position: [1.32, 0, 0.55] as const, rotation: [0, 0.4, 0] as const, scale: 0.24 },
  { position: [1.05, 0, 1.05] as const, rotation: [0, 1.1, 0] as const, scale: 0.18 },
  { position: [0.2, 0, 1.38] as const, rotation: [0, 2.0, 0] as const, scale: 0.28 },
  { position: [-0.95, 0, 1.15] as const, rotation: [0, 2.7, 0] as const, scale: 0.2 },
  { position: [-1.35, 0, 0.15] as const, rotation: [0, 3.5, 0] as const, scale: 0.26 },
  { position: [-1.1, 0, -0.85] as const, rotation: [0, 4.2, 0] as const, scale: 0.22 },
  { position: [0.35, 0, -1.25] as const, rotation: [0, 5.1, 0] as const, scale: 0.25 },
  { position: [1.15, 0, -0.95] as const, rotation: [0, 5.8, 0] as const, scale: 0.19 },
] as const;

/** Canyon backdrop planes — distant walls framing the combat stage. */
export const ARENA_BACKDROP_WALLS = [
  { position: [-2.4, 1.1, -0.3] as const, rotation: [0, 0.55, 0] as const, size: [3.8, 2.6] as const },
  { position: [2.35, 1.0, -0.15] as const, rotation: [0, -0.5, 0] as const, size: [3.6, 2.4] as const },
  { position: [0.05, 1.25, -2.55] as const, rotation: [0, 0, 0] as const, size: [4.6, 2.8] as const },
] as const;

/** Placeholder GLB ground spans 2 units on X/Z; scale to `ARENA_DIAMETER` until the final mesh is exported. */
export const ARENA_GLB_PLACEHOLDER_DIAMETER = 2;

/**
 * Flip to `true` after `arena.glb` contains the final desert floor from Blender.
 * While `false`, the sandy blockout disc remains visible under dev layout guides.
 */
export const USE_ARENA_GLB_GROUND = false;
