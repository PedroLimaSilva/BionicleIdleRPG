/**
 * Same HDRI as drei's `preset="city"` (Potsdamer Platz 1k), served from `public/hdri/`
 * via Vite's base URL so the scene does not fetch raw.githack.com at runtime.
 */
export const CITY_ENVIRONMENT_PROPS = {
  files: 'potsdamer_platz_1k.hdr',
  path: `${import.meta.env.BASE_URL}hdri/`,
} as const;
