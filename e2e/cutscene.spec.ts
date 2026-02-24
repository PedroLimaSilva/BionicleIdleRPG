import { test, expect } from '@playwright/test';
import { enableTestMode, goto } from './helpers';

test.describe('Visual Novel Cutscene', () => {
  test('should display cutscene test page and render dialogue cutscene', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/cutscene-test', { hideCanvasBeforeNav: true });

    await page.locator('h1:has-text("Cutscene Visual Test")').waitFor({ state: 'visible', timeout: 10000 });

    // Click a cutscene with dialogue (mnog_canister_beach has dialogue + video)
    await page.locator('[data-testid="cutscene-mnog_canister_beach"]').click();

    // Wait for cutscene viewer to appear
    await page.locator('[data-testid="cutscene-viewer"]').waitFor({ state: 'visible', timeout: 5000 });

    // Verify dialogue UI elements
    await expect(page.locator('.visual-novel-cutscene__speaker-name')).toContainText('Takua');
    await expect(page.locator('.visual-novel-cutscene__text')).toContainText('canister');

    await expect(page).toHaveScreenshot('cutscene-dialogue.png', {
      maxDiffPixels: 200,
    });
  });

  test('should display video-only cutscene', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/cutscene-test', { hideCanvasBeforeNav: true });

    await page.locator('h1:has-text("Cutscene Visual Test")').waitFor({ state: 'visible', timeout: 10000 });

    // Click a video-only cutscene
    await page.locator('[data-testid="cutscene-story_toa_arrival"]').click();

    await page.locator('[data-testid="cutscene-viewer"]').waitFor({ state: 'visible', timeout: 5000 });

    // Verify video embed
    await expect(page.locator('.visual-novel-cutscene__video-wrapper iframe')).toBeVisible();

    await expect(page).toHaveScreenshot('cutscene-video.png', {
      maxDiffPixels: 200,
    });
  });
});
