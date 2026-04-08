import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset,
  // Raster assets (ICO/PNG): use a fixed-fill SVG; Sharp does not apply prefers-color-scheme from ThreeVirtues-default.svg.
  images: ['public/ThreeVirtues-light.svg'],
});
