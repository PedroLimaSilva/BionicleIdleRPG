import { defineConfig, devices } from '@playwright/test';

/**
 * Determine snapshot path suffix based on environment
 * - CI/Docker: Use 'ci-linux' suffix for Linux-based screenshots
 * - Local: Use 'local-darwin' suffix for macOS screenshots (ignored in git)
 */
const isCI = !!process.env.CI || !!process.env.PLAYWRIGHT_DOCKER;
const snapshotPathTemplate = isCI
  ? '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}'
  : '{testDir}/{testFileDir}/{testFileName}-snapshots-local/{arg}-{projectName}{ext}';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'html' : 'list',

  /* Snapshot path template - different for CI vs local */
  snapshotPathTemplate,

  /* Timeouts: CI/Docker are slower (no GPU, software WebGL) - use higher limits */
  timeout: isCI ? 90_000 : 30_000,
  expect: {
    timeout: isCI ? 30_000 : 5_000,
  },
  globalTimeout: isCI ? 45 * 60 * 1000 : undefined,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    /* Note: Includes /BionicleIdleRPG/ base path to match React Router basename */
    baseURL: 'http://localhost:5173/BionicleIdleRPG',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers and mobile viewports */
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: 'Mobile Chrome Portrait',
      use: {
        ...devices['Pixel 7'],
        // Portrait is default orientation
      },
    },

    {
      name: 'Mobile Chrome Landscape',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 851, height: 393 }, // Landscape dimensions for Pixel 5
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: isCI ? 180_000 : 120_000,
  },
});
