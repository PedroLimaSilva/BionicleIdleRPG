import { test, expect } from '@playwright/test';
import {
  enableTestMode,
  goto,
  INITIAL_GAME_STATE,
  setupGameState,
} from '../helpers';

test.describe('Battle Nav Item', () => {
  test('should display battle nav item if quest requirements are met', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['mnog_return_to_shore'],
    });
    await goto(page, '/battle');

    await page
      .locator('.page-container')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });

    await expect(page).toHaveScreenshot({});
  });
});

test.describe('Battle Selector', () => {
  test('should display battle selector page', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/battle');

    await page
      .locator('.page-container')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });

    await expect(page).toHaveScreenshot();
  });
});
