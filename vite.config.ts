import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { watch } from 'vite-plugin-watch';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/BionicleIdleRPG/',
  plugins: [
    react(),
    VitePWA({
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: 'BionicleIdleRpg',
        short_name: 'Bionicle',
        description: 'BionicleIdleRpg',
        theme_color: '#2d2d2d',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,glb}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 5242880,
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
    watch({
      pattern: 'src/data/quests/**/*',
      command: 'tsx scripts/generate-quest-graph.ts',
    }),
  ],
});
