import { test, expect } from '@playwright/test';
import { enableTestMode, goto } from '../helpers';

test.describe('Battle Selector', () => {
  test('should display battle selector page', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/battle');

    await page
      .locator('.page-container')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });

    // Give time for battle UI to render
    await page.waitForTimeout(1000);

    // Take a screenshot
    await expect(page).toHaveScreenshot();
  });
});
