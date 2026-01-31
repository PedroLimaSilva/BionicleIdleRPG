import { test, expect } from '@playwright/test';
import { gotoWithTestMode, waitForCanvas } from './helpers';

test.describe('3D Character Scene', () => {
  test('should render 3D character scene on character detail page', async ({ page }) => {
    await gotoWithTestMode(page, '/characters');

    // Wait for character cards to be visible instead of networkidle
    const characterCard = page.locator('.character-card, .matoran-card').first();
    await characterCard.waitFor({ state: 'visible', timeout: 10000 });

    // Click on the first character card
    await characterCard.click();

    // Wait for navigation to character detail page (testMode will be preserved)
    await page.waitForURL(/\/characters\/.+/, { timeout: 10000 });

    // Wait for 3D canvas to be ready (animations are paused via testMode)
    await waitForCanvas(page);

    // Take screenshot of the entire page including 3D scene
    await expect(page).toHaveScreenshot('character-detail-3d.png', {
      fullPage: true,
      // Moderate tolerance for WebGL rendering differences
      maxDiffPixels: 300,
      threshold: 0.2,
    });
  });

  test('should have canvas element mounted', async ({ page }) => {
    await gotoWithTestMode(page, '/');

    // Check that canvas mount point exists
    const canvasMount = page.locator('#canvas-mount');
    await expect(canvasMount).toBeAttached();
  });
});

