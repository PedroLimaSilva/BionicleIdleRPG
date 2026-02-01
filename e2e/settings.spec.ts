import { test, expect } from '@playwright/test';
import { enableTestMode, goto } from './helpers';

test.describe('Settings', () => {
  test('Should display about text and settings', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/settings');

    // Wait for the page to load
    await expect(page.locator('h1').first()).toContainText('ABOUT THIS APP');

    // Take a screenshot for visual regression
    await expect(page).toHaveScreenshot({
      fullPage: true,
    });
  });
});
