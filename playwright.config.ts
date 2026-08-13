import { defineConfig, devices } from '@playwright/test';
import { MODEL_TEST_VIEWPORT } from './e2e/helpers';

/**
 * Determine snapshot path suffix based on environment
 * - CI/Docker: Use 'ci-linux' suffix for Linux-based screenshots
 * - Local: Use 'local-darwin' suffix for macOS screenshots (ignored in git)
 */
const isCI = !!process.env.CI || !!process.env.PLAYWRIGHT_DOCKER;
const usePreview = !!process.env.E2E_USE_PREVIEW || !!process.env.PLAYWRIGHT_DOCKER;
const snapshotPathTemplate = isCI
  ? '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-Desktop-Chrome{ext}'
  : '{testDir}/{testFileDir}/{testFileName}-snapshots-local/{arg}-Desktop-Chrome{ext}';

const desktopChrome = {
  ...devices['Desktop Chrome'],
  viewport: { height: 1080, width: 1920 },
};

/** Software WebGL for headless model screenshots only — do not use on app/UI specs. */
const swiftShaderArgs = [
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
  '--use-gl=angle',
  '--use-angle=swiftshader-webgl',
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  expect: {
    timeout: isCI ? 180_000 : 30_000,
  },

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* UI tests run in parallel; model suites use serial in-app navigation per file. */
  fullyParallel: true,

  globalTimeout: isCI ? 45 * 60 * 1000 : undefined,

  projects: [
    {
      name: 'Desktop Chrome',
      testIgnore: '**/characters/detail/modelRendering.spec.ts',
      use: desktopChrome,
    },
    {
      name: 'models',
      testMatch: '**/characters/detail/modelRendering.spec.ts',
      timeout: isCI ? 300_000 : 60_000,
      use: {
        ...devices['Desktop Chrome'],
        viewport: MODEL_TEST_VIEWPORT,
        launchOptions: {
          args: isCI ? swiftShaderArgs : ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
        },
      },
    },
  ],

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'html' : 'list',

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Snapshot path template - different for CI vs local */
  snapshotPathTemplate,
  testDir: './e2e',

  /* Default timeout for app/UI specs */
  timeout: isCI ? 90_000 : 30_000,

  use: {
    baseURL: 'http://localhost:5173/BionicleIdleRPG',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  webServer: {
    command: usePreview ? 'yarn preview --port 5173 --host 0.0.0.0' : 'yarn dev',
    reuseExistingServer: !process.env.CI,
    timeout: isCI ? 180_000 : 120_000,
    url: 'http://localhost:5173',
  },

  /*
   * Serial workers in CI for stable snapshots (matches pre-split behaviour).
   * Models job also sets PLAYWRIGHT_MODELS_ONLY.
   */
  workers:
    process.env.PLAYWRIGHT_MODELS_ONLY || process.env.PLAYWRIGHT_DOCKER || isCI ? 1 : undefined,
});
