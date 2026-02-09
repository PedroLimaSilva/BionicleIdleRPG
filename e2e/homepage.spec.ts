import { test, expect } from '@playwright/test';
import { enableTestMode, goto } from './helpers';

test.describe('Homepage', () => {
  test('should display welcome message and activity log', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/');

    // Wait for the page to load
    await expect(page.locator('h1')).toContainText('Welcome to Mata Nui');

    // Check for activity log component
    await expect(page.locator('.activity-log')).toBeVisible();

    // Take a screenshot for visual regression
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      // Allow for slight differences in WebGL rendering
      maxDiffPixels: 100,
    });
  });
});
