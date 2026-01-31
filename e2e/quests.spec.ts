import { test, expect } from '@playwright/test';
import { gotoWithTestMode } from './helpers';

test.describe('Quests Page', () => {
  test('should display quests page', async ({ page }) => {
    await gotoWithTestMode(page, '/quests');

    // Wait for the title to be visible instead of networkidle
    await page.locator('h2.quests-page__title').first().waitFor({ state: 'visible', timeout: 10000 });

    // Take a screenshot
    await expect(page).toHaveScreenshot('quests-page.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});

