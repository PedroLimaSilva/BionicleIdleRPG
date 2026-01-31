import { test, expect } from '@playwright/test';
import { gotoWithTestMode } from './helpers';

test.describe('Homepage', () => {
  test('should display welcome message and activity log', async ({ page }) => {
    await gotoWithTestMode(page, '/');

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

  test('should have navigation bar', async ({ page }) => {
    await gotoWithTestMode(page, '/');

    // Wait for navbar to be visible
    const navbar = page.locator('.nav-bar, nav');
    await expect(navbar).toBeVisible();

    // Take screenshot of navbar
    await expect(navbar).toHaveScreenshot('navbar.png', {
      maxDiffPixels: 50,
    });
  });
});

