import { test, expect } from '@playwright/test';
import {
  enableTestMode,
  goto,
  INITIAL_GAME_STATE,
  setupGameState,
  waitForCanvas,
} from '../helpers';

test.describe('Character Detail Page', () => {
  test('should render matoran character detail page', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/characters/Takua');

    // Wait for 3D canvas to be ready (animations are paused via testMode)
    await waitForCanvas(page);

    // Take screenshot of the entire page including 3D scene
    await expect(page).toHaveScreenshot({
      fullPage: true,
      // Moderate tolerance for WebGL rendering differences
      maxDiffPixels: 300,
      threshold: 0.2,
    });
  });

  test('should render toa character detail page', async ({ page }) => {
    await enableTestMode(page);
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [
        {
          id: 'Toa_Lewa',
          exp: 0,
        },
      ],
    });
    await goto(page, '/characters/Toa_Lewa');

    // Wait for 3D canvas to be ready (animations are paused via testMode)
    await waitForCanvas(page);

    // Take screenshot of the entire page including 3D scene
    await expect(page).toHaveScreenshot({
      fullPage: true,
      // Moderate tolerance for WebGL rendering differences
      maxDiffPixels: 300,
      threshold: 0.2,
    });
  });
});
