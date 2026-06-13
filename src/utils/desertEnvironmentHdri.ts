/**
 * Warm quarry HDRI (Poly Haven, CC0) — local copy avoids runtime fetches.
 * @see https://polyhaven.com/a/quarry_01
 */
export const DESERT_ENVIRONMENT_PROPS = {
  files: 'quarry_01_1k.hdr',
  path: `${import.meta.env.BASE_URL}hdri/`,
} as const;
