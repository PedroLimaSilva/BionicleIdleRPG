import { Page, Locator, TestInfo } from '@playwright/test';
import { PartialGameState } from '../src/types/GameState';
import { CURRENT_GAME_STATE_VERSION } from '../src/data/gameState';

export const INITIAL_GAME_STATE: PartialGameState = {
  version: CURRENT_GAME_STATE_VERSION,
  widgets: 0,
  widgetCap: 2000,
  inventory: {},
  recruitedCharacters: [],
  buyableCharacters: [],
  activeQuests: [],
  completedQuests: [],
};

/**
 * Enable test mode by setting localStorage flag
 * This should be called before navigation to ensure test mode is active
 */
export async function enableTestMode(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('TEST_MODE', 'true');
  });
}

/**
 * Creates a game state and stores it in localStorage to be loaded by the game
 * Also enables test mode automatically
 */
export async function setupGameState(page: Page, gameState: PartialGameState) {
  await page.addInitScript((state) => {
    localStorage.setItem('GAME_STATE', JSON.stringify(state));
    localStorage.setItem('TEST_MODE', 'true');
  }, gameState);
}

/**
 * Navigate to a path
 * Constructs full URL with base path /BionicleIdleRPG/ to match React Router basename
 *
 * Note: Test mode is enabled via localStorage (set by setupGameState or enableTestMode)
 */
export async function goto(page: Page, path: string) {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // Construct full URL with base path
  const basePath = '/BionicleIdleRPG';
  const fullPath = `${basePath}${normalizedPath}`;

  await page.goto(fullPath);
}

/**
 * Wait for the page to be fully loaded including network requests
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

/**
 * Hover an element based on device type
 * Mobile: tap, Desktop: hover
 *
 * @param locator - The element to interact with
 * @param testInfo - Test info from Playwright (contains project name)
 *
 * @example
 * await deviceHover(page.locator('.item').first(), testInfo);
 */
export async function deviceHover(locator: Locator, testInfo: TestInfo) {
  if (testInfo.project.name.includes('Mobile')) {
    await locator.tap();
  } else {
    await locator.hover();
  }
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

/**
 * Wait for 3D canvas to be ready
 * Note: Animations are automatically paused when TEST_MODE is enabled in localStorage
 */
export async function waitForCanvas(page: Page, timeout = 10000) {
  await page.waitForSelector('canvas', { timeout, state: 'visible' });

  // Give WebGL time to render initial frame
  await page.waitForTimeout(3000);
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
export function waitForModelLoad(page: Page, timeout = 10000): Promise<void> {
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
    timeout,
    state: 'attached',
  });
  // Give time for images to fully render
  await page.waitForTimeout(1000);
}

/**
 * Wait for character cards to be visible
 */
export async function waitForCharacterCards(page: Page, timeout = 10000) {
  await page.waitForSelector('.character-card, .matoran-card', {
    timeout,
    state: 'visible',
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
  withImages: {
    maxDiffPixels: 200,
  },
  webgl: {
    maxDiffPixels: 500,
    threshold: 0.3,
  },
};
