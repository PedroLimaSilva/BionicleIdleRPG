/**
 * Warm quarry HDRI (Poly Haven, CC0) — local copy avoids runtime fetches.
 * @see https://polyhaven.com/a/quarry_01
 *
 * Pass `background` on `<Environment>` to use the HDR as a visible skybox
 * (`scene.background`) in addition to image-based lighting.
 */
export const DESERT_ENVIRONMENT_PROPS = {
  files: 'quarry_01_1k.hdr',
  path: `${import.meta.env.BASE_URL}hdri/`,
} as const;

/** Relative path from repo root — use in Blender World → HDR environment texture. */
export const DESERT_HDRI_FILE = 'public/hdri/quarry_01_1k.hdr';
