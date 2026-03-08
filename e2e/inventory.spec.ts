import { test, expect } from '@playwright/test';
import { enableTestMode, goto } from './helpers';

test.describe('Inventory Page (removed)', () => {
  test('navigating to /inventory should show 404', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/inventory');

    await page.locator('.page-container').first().waitFor({ state: 'visible', timeout: 10000 });

    await expect(page.locator('h1')).toHaveText('404 - Not Found');
  });
});
