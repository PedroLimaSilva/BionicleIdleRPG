import { test, expect } from '@playwright/test';
import { enableTestMode, goto } from './helpers';

test.describe('Type Effectiveness', () => {
  test('should display type effectiveness table with screenshot', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/type-effectiveness');

    await page.locator('.page-container').first().waitFor({ state: 'visible', timeout: 10000 });

    await expect(page.locator('h1').first()).toContainText('Type Effectiveness');
    await expect(page.locator('.type-effectiveness__table')).toBeVisible();

    await expect(page).toHaveScreenshot('type-effectiveness.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });
});
