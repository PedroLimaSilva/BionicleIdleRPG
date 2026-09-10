import { test, expect, Page } from '@playwright/test';
import {
  disableCSSAnimations,
  goto,
  hideCanvas,
  INITIAL_GAME_STATE,
  setupGameState,
  VIEWPORTS,
} from './helpers';

async function gotoQuestsWithInstallPrompt(page: Page) {
  await setupGameState(page, INITIAL_GAME_STATE, { pwaInstall: 'visible' });
  await goto(page, '/', {
    hideCanvasBeforeNav: true,
    waitUntil: 'domcontentloaded',
  });
  await hideCanvas(page);
  await expect(page.locator('.pwa-install-trigger')).toBeVisible();
  await disableCSSAnimations(page);
}

test.describe('PWA Install Prompt', () => {
  test.describe('Install trigger', () => {
    for (const [name, size] of Object.entries(VIEWPORTS)) {
      test(`${name} (${size.width}x${size.height}): renders trigger button`, async ({ page }) => {
        await page.setViewportSize(size);
        await gotoQuestsWithInstallPrompt(page);

        await expect(page.locator('.pwa-install-trigger')).toHaveScreenshot(
          `pwa-install-trigger-${name}.png`,
          { maxDiffPixels: 120 }
        );
      });
    }
  });

  test.describe('Install modal', () => {
    for (const [name, size] of Object.entries(VIEWPORTS)) {
      test(`${name} (${size.width}x${size.height}): opens instructions modal`, async ({ page }) => {
        await page.setViewportSize(size);
        await gotoQuestsWithInstallPrompt(page);
        await page.locator('.pwa-install-trigger').click();
        await expect(page.locator('.pwa-install-panel')).toBeVisible();

        await expect(page.locator('.pwa-install-panel')).toHaveScreenshot(
          `pwa-install-modal-${name}.png`,
          { maxDiffPixels: 150 }
        );
      });
    }

    test('mobile portrait: full page layout with modal open', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobilePortrait);
      await gotoQuestsWithInstallPrompt(page);
      await page.locator('.pwa-install-trigger').click();

      await expect(page).toHaveScreenshot('pwa-install-modal-page-mobile-portrait.png', {
        fullPage: true,
        maxDiffPixels: 200,
      });
    });
  });
});
