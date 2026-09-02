/**
 * Battle arena layout — camera framing and combat spawn slots.
 *
 * `DEFAULT_ARENA_LAYOUT` is shared by arenas that do not need bespoke spawn
 * geometry; each `ArenaDefinition` may override it. See
 * `docs/ARENA_ENVIRONMENTS.md` for the arena system docs.
 */
import type { ArenaLayout } from './arenas/types';

/** Margin multiplier so combatants are not clipped at the viewport edge. */
export const ARENA_MARGIN = 1;

/** Shared default layout (desert and any arena without custom geometry). */
export const DEFAULT_ARENA_LAYOUT: ArenaLayout = {
  boxSize: 3,
  cameraLandscape: [0.75, 0.5, 0.75],
  cameraPortrait: [0.35, 0.8, 1.2],
  center: [0, 0, 0],
  enemy: [
    [0, 0, -0.5],
    [-0.5, 0, -0.75],
    [0.5, 0, -0.75],
  ],
  team: [
    [-0.7, 0, 0.78],
    [0, 0, 0.46],
    [0.7, 0, 0.78],
  ],
};

/** Full stage diameter used for camera framing (default arena). */
export const ARENA_DIAMETER = DEFAULT_ARENA_LAYOUT.boxSize;

/** Alias kept for camera framing math in `ArenaFraming`. */
export const ARENA_BOX_SIZE = ARENA_DIAMETER;

/** Arena center — camera look-at target (default arena). */
export const ARENA_CENTER = DEFAULT_ARENA_LAYOUT.center;

/** Team (Toa) spawn slots — +Z is toward the camera in the default portrait view. */
export const TEAM_POSITIONS = DEFAULT_ARENA_LAYOUT.team;

/** Enemy spawn slots — −Z is away from the camera. */
export const ENEMY_POSITIONS = DEFAULT_ARENA_LAYOUT.enemy;
