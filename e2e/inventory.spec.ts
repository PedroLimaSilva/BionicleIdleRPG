import { test, expect } from '@playwright/test';
import { gotoWithTestMode } from './helpers';

test.describe('Inventory Page', () => {
  test('should display inventory page', async ({ page }) => {
    await gotoWithTestMode(page, '/inventory');

    // Wait for the inventory grid to be visible instead of networkidle
    await page.locator('.inventory-grid, .page-container').first().waitFor({ state: 'visible', timeout: 10000 });

    // Take a screenshot
    await expect(page).toHaveScreenshot('inventory-page.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});

