import { test, expect } from '@playwright/test';
import {
  enableTestMode,
  goto,
  INITIAL_GAME_STATE,
  setupGameState,
  deviceHover,
} from './helpers';

const INVENTORY_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  inventory: {
    Charcoal: 10,
    AquaFilter: 5,
    LightStone: 3,
  },
};

test.describe('Inventory Page', () => {
  test('should display empty inventory page', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/inventory');

    await page
      .locator('.inventory-grid, .page-container')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });

    // Take a screenshot
    await expect(page).toHaveScreenshot('inventory-page-empty.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('should display inventory page', async ({ page }, testInfo) => {
    await setupGameState(page, INVENTORY_GAME_STATE);
    await goto(page, '/inventory');

    await page
      .locator('.inventory-grid, .page-container')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });

    const firstItem = page.locator('.inventory-item').first();

    // Mobile: tap, Desktop: hover
    await deviceHover(firstItem, testInfo);

    // Take a screenshot
    await expect(page).toHaveScreenshot('inventory-page.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});
