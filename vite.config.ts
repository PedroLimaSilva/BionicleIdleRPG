import { VitePWA, type IconResource } from 'vite-plugin-pwa';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { watch } from 'vite-plugin-watch';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

let commitHash = 'unknown';
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch {
  console.warn('Failed to get git commit hash, using "unknown"');
}
const appVersion = `${pkg.version}+${commitHash}`;

// Extended icon type supporting newer manifest spec fields (color_scheme, design)
// not yet in vite-plugin-pwa's types
interface ExtendedIconResource {
  src: string;
  sizes?: string;
  type?: string;
  purpose?: string;
  /** W3C color_scheme for dark/light mode icon variants */
  color_scheme?: 'light' | 'dark';
  /** Apple liquid glass design for iOS 26+ / macOS Tahoe */
  design?: 'liquid-glass';
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    base: '/BionicleIdleRPG/',
    build: {
      rollupOptions: {
        external: ['tools'],
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
      __POSTHOG_HOST__: JSON.stringify(env.VITE_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'),
      __POSTHOG_KEY__: JSON.stringify(env.VITE_PUBLIC_POSTHOG_KEY ?? ''),
    },
    plugins: [
      react(),
      VitePWA({
        devOptions: {
          enabled: false,
          navigateFallback: 'index.html',
          suppressWarnings: true,
          type: 'module',
        },

        filename: 'sw.ts',

        includeAssets: ['favicon-32-light.png', 'favicon-32-dark.png', 'apple-touch-icon.png'],

        injectManifest: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,glb,woff2,ttf,wasm}'],
          maximumFileSizeToCacheInBytes: 10485760,
        },

        injectRegister: false,
        manifest: {
          background_color: '#ffffff',
          description: 'BionicleIdleRpg',
          icons: [
            {
              purpose: 'any maskable',
              sizes: '192x192',
              src: 'pwa-192.png',
              type: 'image/png',
            },
            {
              purpose: 'any maskable',
              sizes: '512x512',
              src: 'pwa-512.png',
              type: 'image/png',
            },
            // Default SVG (silver glyph, transparent; tab favicon also uses prefers-color-scheme in the SVG)
            {
              purpose: 'any',
              sizes: 'any',
              src: 'ThreeVirtues-default.svg',
              type: 'image/svg+xml',
            },
            {
              color_scheme: 'light',
              purpose: 'any',
              sizes: 'any',
              src: 'ThreeVirtues-light.svg',
              type: 'image/svg+xml',
            },
            {
              color_scheme: 'dark',
              purpose: 'any',
              sizes: 'any',
              src: 'ThreeVirtues-dark.svg',
              type: 'image/svg+xml',
            },
            // Monochrome icon for adaptive/tinted icon rendering
            {
              purpose: 'monochrome',
              sizes: 'any',
              src: 'ThreeVirtues-monochrome.svg',
              type: 'image/svg+xml',
            },
            // Liquid glass icon for iOS 26+ / macOS Tahoe
            // The system applies the translucent glass effect over the glyph
            {
              design: 'liquid-glass',
              purpose: 'any',
              sizes: 'any',
              src: 'ThreeVirtues-monochrome.svg',
              type: 'image/svg+xml',
            },
          ] satisfies ExtendedIconResource[] as unknown as IconResource[],
          name: 'BionicleIdleRpg',
          short_name: 'Bionicle',
          theme_color: '#ffffff',
          // Extended manifest fields for dark mode theming
          ...({ dark_background_color: '#2d2d2d', dark_theme_color: '#2d2d2d' } as Record<
            string,
            string
          >),
        },
        // Icons are produced by `yarn make-pwa-icons` (scripts/make-pwa-icons.mts), not vite-pwa assets.
        pwaAssets: {
          disabled: true,
        },
        srcDir: 'src',

        strategies: 'injectManifest',
      }),
      watch({
        command: 'tsx tools/generate-quest-graph.ts',
        pattern: 'src/data/quests/**/*',
      }),
    ],
  };
});
