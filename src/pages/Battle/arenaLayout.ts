/**
 * Battle arena layout — camera framing and combat spawn slots.
 * See `docs/ARENA_ENVIRONMENTS.md` for Blender export and arena system docs.
 */

/** Full stage diameter used for camera framing. */
export const ARENA_DIAMETER = 3;

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
