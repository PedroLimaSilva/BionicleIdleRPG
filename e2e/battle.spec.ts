import { test, expect } from '@playwright/test';
import { gotoWithTestMode } from './helpers';

test.describe('Battle Pages', () => {
  test('should display battle selector page', async ({ page }) => {
    await gotoWithTestMode(page, '/battle/selector');

    // Wait for the encounter list to be visible instead of networkidle
    await page.locator('.encounter-list, h1.title').first().waitFor({ state: 'visible', timeout: 10000 });

    // Take a screenshot
    await expect(page).toHaveScreenshot('battle-selector.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('should display battle page', async ({ page }) => {
    await gotoWithTestMode(page, '/battle');

    // Wait for the page container to be visible instead of networkidle
    await page.locator('.page-container').first().waitFor({ state: 'visible', timeout: 10000 });

    // Give time for battle UI to render
    await page.waitForTimeout(1000);

    // Take a screenshot
    await expect(page).toHaveScreenshot('battle-page.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});

