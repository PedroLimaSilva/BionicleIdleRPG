import { test, expect, Page } from '@playwright/test';
import {
  disableCSSAnimations,
  goto,
  hideCanvas,
  INITIAL_GAME_STATE,
  setupGameState,
  VIEWPORTS,
  waitForCharacterCards,
} from './helpers';

const CHARACTER_INVENTORY_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  completedQuests: ['story_toa_arrival'],
  recruitedCharacters: [
    { exp: 0, id: 'Takua', quest: 'mnog_find_canister_beach' },
    { exp: 0, id: 'Toa_Tahu' },
    { exp: 20000, id: 'Jala' },
    { exp: 0, id: 'Toa_Gali' },
  ],
};

async function gotoCharactersWithPwaBanner(
  page: Page,
  bannerState: 'needRefresh' | 'offlineReady'
) {
  await setupGameState(page, CHARACTER_INVENTORY_GAME_STATE, { pwaBanner: bannerState });
  await goto(page, '/characters', {
    hideCanvasBeforeNav: true,
    waitUntil: 'domcontentloaded',
  });
  await waitForCharacterCards(page);
  await hideCanvas(page);
  await expect(page.locator('.pwa-update-banner')).toBeVisible();
  await disableCSSAnimations(page);
}

test.describe('PWA Update Banner', () => {
  test.describe('Update available', () => {
    for (const [name, size] of Object.entries(VIEWPORTS)) {
      test(`${name} (${size.width}x${size.height}): renders over navigation`, async ({ page }) => {
        await page.setViewportSize(size);
        await gotoCharactersWithPwaBanner(page, 'needRefresh');

        await expect(page.locator('.pwa-update-banner')).toHaveScreenshot(
          `pwa-update-banner-need-refresh-${name}.png`,
          { maxDiffPixels: 150 }
        );
      });
    }

    test('mobile portrait: full page layout over character inventory', async ({ page }) => {
      await page.setViewportSize(VIEWPORTS.mobilePortrait);
      await gotoCharactersWithPwaBanner(page, 'needRefresh');

      await expect(page).toHaveScreenshot(
        'pwa-update-banner-need-refresh-page-mobile-portrait.png',
        {
          fullPage: true,
          maxDiffPixels: 200,
        }
      );
    });
  });

  test.describe('Offline ready', () => {
    for (const [name, size] of Object.entries(VIEWPORTS)) {
      test(`${name} (${size.width}x${size.height}): renders over navigation`, async ({ page }) => {
        await page.setViewportSize(size);
        await gotoCharactersWithPwaBanner(page, 'offlineReady');

        await expect(page.locator('.pwa-update-banner')).toHaveScreenshot(
          `pwa-update-banner-offline-ready-${name}.png`,
          { maxDiffPixels: 150 }
        );
      });
    }
  });
});
