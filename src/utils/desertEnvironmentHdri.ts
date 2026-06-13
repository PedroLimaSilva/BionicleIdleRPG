/**
 * Warm quarry HDRI (Poly Haven, CC0) — reserved for future arena skybox / IBL.
 * @see https://polyhaven.com/a/quarry_01
 *
 * Not currently used in the battle arena (background left blank while ground art is in progress).
 * Pass `background` on `<Environment>` when re-enabling a visible skybox.
 */
export const DESERT_ENVIRONMENT_PROPS = {
  files: 'quarry_01_1k.hdr',
  path: `${import.meta.env.BASE_URL}hdri/`,
} as const;

/** Relative path from repo root — optional Blender world environment reference. */
export const DESERT_HDRI_FILE = 'public/hdri/quarry_01_1k.hdr';
