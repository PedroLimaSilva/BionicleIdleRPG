import { Page, TestInfo } from '@playwright/test';
import { PartialGameState } from '../src/types/GameState';
import { CURRENT_GAME_STATE_VERSION } from '../src/data/gameState';
import type { E2ePwaBannerState } from '../src/utils/testMode';

import { GAME_DB_NAME } from '../src/services/gameDatabase';

const E2E_FORCE_GAME_STATE_IMPORT_KEY = 'E2E_FORCE_GAME_STATE_IMPORT';

type TestModeOptions = {
  pwaBanner?: E2ePwaBannerState;
};

export const INITIAL_GAME_STATE: PartialGameState = {
  activeQuests: [],
  collectedKrana: {},
  completedQuests: [],
  customCharacters: [],
  kraataCollection: {},
  protodermis: 0,
  protodermisCap: 2000,
  rahkshi: [],
  recruitedCharacters: [],
  version: CURRENT_GAME_STATE_VERSION,
};

/**
 * Enable test mode by setting localStorage flags.
 * This should be called before navigation to ensure test mode is active.
 * Also dismisses the telemetry consent prompt so it doesn't block tests.
 */
export async function enableTestMode(page: Page, options?: TestModeOptions) {
  await page.addInitScript(() => {
    localStorage.setItem('TEST_MODE', 'true');
    localStorage.setItem('TELEMETRY_ENABLED', 'false');
  });

  if (options?.pwaBanner) {
    await page.addInitScript((banner: E2ePwaBannerState) => {
      localStorage.setItem('E2E_PWA_BANNER', banner);
    }, options.pwaBanner);
  }
}

/**
 * Injects CSS to hide the 3D canvas before any page loads.
 * Call before goto() to avoid WebGL initialization blocking navigation timeouts.
 */
export async function addCanvasHidingInitScript(page: Page) {
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.id = 'e2e-hide-canvas';
    style.textContent = `#canvas-mount canvas, canvas { display: none !important; }`;
    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.documentElement.prepend(style);
    }
  });
}

/**
 * Creates a game state and stores it in localStorage to be loaded by the game.
 * Also enables test mode and dismisses the telemetry consent prompt.
 */
export async function setupGameState(
  page: Page,
  gameState: PartialGameState,
  options?: TestModeOptions
) {
  await page.addInitScript((state: PartialGameState) => {
    localStorage.setItem('GAME_STATE', JSON.stringify(state));
    localStorage.setItem('TEST_MODE', 'true');
    localStorage.setItem('TELEMETRY_ENABLED', 'false');
    localStorage.setItem(E2E_FORCE_GAME_STATE_IMPORT_KEY, 'true');
  }, gameState);

  if (options?.pwaBanner) {
    await page.addInitScript((banner: E2ePwaBannerState) => {
      localStorage.setItem('E2E_PWA_BANNER', banner);
    }, options.pwaBanner);
  }
}

/**
 * Reads the assembled game save from IndexedDB split stores (Phase B persistence).
 */
export async function readPersistedGameState(page: Page): Promise<PartialGameState> {
  return page.evaluate(
    async ({ dbName }) => {
      function openDb(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(dbName);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result);
        });
      }

      function readAll<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
          const tx = db.transaction(storeName, 'readonly');
          const request = tx.objectStore(storeName).getAll();
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result as T[]);
        });
      }

      const db = await openDb();
      const gameRows = await readAll<{ key: string; value: unknown }>(db, 'game');
      if (gameRows.length === 0) {
        db.close();
        return {};
      }

      const fields = Object.fromEntries(gameRows.map((row) => [row.key, row.value]));
      const recruitedCharacters = await readAll<Record<string, unknown>>(db, 'recruited');
      const customCharacters = await readAll<Record<string, unknown>>(db, 'customCharacters');
      db.close();

      return {
        activeQuests: fields.activeQuests,
        collectedKrana: fields.collectedKrana,
        completedQuests: fields.completedQuests,
        customCharacters,
        kraataCollection: fields.kraataCollection,
        protodermis: fields.protodermis,
        protodermisCap: fields.protodermisCap,
        rahkshi: fields.rahkshi,
        recruitedCharacters,
        version: fields.version,
      };
    },
    { dbName: GAME_DB_NAME }
  );
}

export type GotoOptions = {
  /** Use 'domcontentloaded' to avoid waiting for heavy assets (WebGL, 3D models). Default: 'load' */
  waitUntil?: 'load' | 'domcontentloaded';
  /** Inject script to hide canvas before nav - speeds up pages with 3D scene */
  hideCanvasBeforeNav?: boolean;
};

/**
 * Navigate to a path
 * Constructs full URL with base path /BionicleIdleRPG/ to match React Router basename
 *
 * Note: Test mode is enabled via localStorage (set by setupGameState or enableTestMode)
 */
export async function goto(page: Page, path: string, options?: GotoOptions) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = '/BionicleIdleRPG';
  const fullPath = `${basePath}${normalizedPath}`;

  if (options?.hideCanvasBeforeNav) {
    await addCanvasHidingInitScript(page);
  }

  await page.goto(fullPath, {
    waitUntil: options?.waitUntil ?? 'load',
  });
}

/**
 * Wait for the page to be fully loaded including network requests
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Check if the current test is running on a mobile device
 *
 * @param testInfo - Test info from Playwright (contains project name)
 * @returns true if running on mobile, false otherwise
 */
export function isMobile(testInfo: TestInfo): boolean {
  return testInfo.project.name.includes('Mobile');
}

/** Viewport sizes for responsiveness tests */
export const VIEWPORTS = {
  desktop: { height: 1080, width: 1920 },
  mobileLandscape: { height: 393, width: 851 },
  mobilePortrait: { height: 915, width: 412 }, // Pixel 7
} as const;

/**
 * Wait for 3D canvas to be ready
 * Note: Animations are automatically paused when TEST_MODE is enabled in localStorage
 * In CI/Docker, software WebGL is slower - allow more time for initial frame
 */
export async function waitForCanvas(page: Page, timeout = 10000) {
  await page.waitForSelector('canvas', { state: 'visible', timeout });

  const isCI = !!process.env.CI || !!process.env.PLAYWRIGHT_DOCKER;
  await page.waitForTimeout(isCI ? 6000 : 3000);
}

/**
 * Disable canvas rendering for e2e tests by hiding it.
 * Use in tests that don't need the 3D scene (e.g. Chronicle tab) to avoid WebGL wait and speed up runs.
 */
export async function hideCanvas(page: Page, canvasTimeout = 5000) {
  await page.waitForSelector('canvas', { state: 'attached', timeout: canvasTimeout }).catch(() => {
    // Canvas may not exist yet or at all; continue
  });
  await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.style.display = 'none';
    }
  });
}

/**
 * Wait for a specific console message to appear
 * Useful for waiting for models/animations to load
 */
export async function waitForConsoleMessage(
  page: Page,
  message: string,
  timeout = 10000
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout waiting for console message: "${message}"`));
    }, timeout);

    const handler = (msg: { text: () => string }) => {
      if (msg.text().includes(message)) {
        clearTimeout(timeoutId);
        page.off('console', handler);
        resolve();
      }
    };

    page.on('console', handler);
  });
}

/** In CI/Docker, software WebGL loads models slower — align with Playwright expect timeout (30s). */
const modelLoadTimeout = process.env.CI || process.env.PLAYWRIGHT_DOCKER ? 30_000 : 10_000;

/**
 * Wait for model animations to be loaded and paused (in test mode)
 * This ensures 3D models are fully loaded before taking screenshots
 *
 * IMPORTANT: This must be called BEFORE navigating to the page, as it sets up
 * a console listener that needs to be active when the model loads.
 *
 * @example
 * await setupGameState(page, gameState); // This enables test mode
 * const modelLoadPromise = waitForModelLoad(page);
 * await goto(page, '/recruitment');
 * await modelLoadPromise;
 */
export function waitForModelLoad(page: Page, timeout = modelLoadTimeout): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      page.off('console', handler);
      reject(new Error(`Timeout waiting for model to load after ${timeout}ms`));
    }, timeout);

    const handler = (msg: { text: () => string }) => {
      if (msg.text().includes('[TEST_MODE] animation loaded')) {
        clearTimeout(timeoutId);
        page.off('console', handler);
        resolve();
      }
    };

    page.on('console', handler);
  });
}

/**
 * Wait until the character model is fully ready for screenshots in test mode.
 * Kit-based characters emit multiple `[TEST_MODE] model ready` events (idle pose,
 * then kit attach); this settles after the last signal so weathered kit materials
 * are applied before capture. Fails after `timeout` ms if the model never becomes ready.
 */
export function waitForCharacterModelReady(page: Page, timeout = modelLoadTimeout): Promise<void> {
  return new Promise((resolve, reject) => {
    let settleId: ReturnType<typeof setTimeout> | undefined;

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`Timeout waiting for model to load after ${timeout}ms`));
    }, timeout);

    const cleanup = () => {
      clearTimeout(timeoutId);
      if (settleId) clearTimeout(settleId);
      page.off('console', handler);
    };

    const handler = (msg: { text: () => string }) => {
      if (!msg.text().includes('[TEST_MODE] model ready')) return;
      if (settleId) clearTimeout(settleId);
      settleId = setTimeout(() => {
        cleanup();
        resolve();
      }, 250);
    };

    page.on('console', handler);
  });
}

/**
 * Disable CSS animations and transitions for consistent screenshots
 */
export async function disableCSSAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
}

/**
 * Wait for character avatars to load
 */
export async function waitForAvatars(page: Page, timeout = 10000) {
  await page.waitForSelector('.composited-avatar, .matoran-avatar', {
    state: 'attached',
    timeout,
  });
  // Give time for images to fully render
  await page.waitForTimeout(1000);
}

/**
 * Wait for character cards to be visible
 */
export async function waitForCharacterCards(page: Page, timeout = 10000) {
  await page.waitForSelector('.character-card, .matoran-card', {
    state: 'visible',
    timeout,
  });
  await page.waitForTimeout(500);
}

/**
 * Standard screenshot options for UI elements
 */
export const SCREENSHOT_OPTIONS = {
  standard: {
    maxDiffPixels: 100,
  },
  webgl: {
    maxDiffPixels: 500,
    threshold: 0.3,
  },
  withImages: {
    maxDiffPixels: 200,
  },
};
