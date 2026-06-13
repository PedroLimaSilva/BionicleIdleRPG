/**
 * Warm quarry HDRI (Poly Haven, CC0) — local copy avoids runtime fetches.
 * @see https://polyhaven.com/a/quarry_01
 *
 * Used for image-based lighting in the battle arena. Omit `background` on `<Environment>`
 * to skip the visible skybox while keeping reflections and ambient light from the HDR.
 */
export const DESERT_ENVIRONMENT_PROPS = {
  files: 'quarry_01_1k.hdr',
  path: `${import.meta.env.BASE_URL}hdri/`,
} as const;

/** Relative path from repo root — optional Blender world environment reference. */
export const DESERT_HDRI_FILE = 'public/hdri/quarry_01_1k.hdr';
