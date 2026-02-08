import { test, expect } from '@playwright/test';
import {
  goto,
  INITIAL_GAME_STATE,
  setupGameState,
  waitForCanvas,
  waitForCharacterCards,
} from '../helpers';

test.describe('Character Detail Page', () => {
  test.describe('Matoran Character', () => {
    test.beforeEach(async ({ page }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [
          ...INITIAL_GAME_STATE.recruitedCharacters,
          { id: 'Takua', exp: 0 },
          { id: 'Jala', exp: 0 },
        ],
      });

      await goto(page, '/characters/Takua');
      await waitForCanvas(page);
    });
    test('should render matoran character detail page', async ({ page }) => {
      // Take screenshot of the entire page including 3D scene
      await expect(page).toHaveScreenshot({
        fullPage: true,
        // Moderate tolerance for WebGL rendering differences
        maxDiffPixels: 300,
        threshold: 0.2,
      });
    });

    test('should render correct matoran character detail after switching to another character', async ({
      page,
    }) => {
      // find the nav item that ends with "Characters"
      const charactersNavItem = page
        .locator('nav a')
        .filter({ hasText: /Characters$/ });
      await charactersNavItem.click();
      await waitForCharacterCards(page);
      await expect(page).toHaveScreenshot({
        fullPage: true,
        // Moderate tolerance for WebGL rendering differences
        maxDiffPixels: 300,
        threshold: 0.2,
      });

      const jalaLink = page.locator('a').filter({ hasText: 'Jala' });
      await jalaLink.click();
      await expect(page).toHaveURL(new RegExp(`/characters/Jala`));
      await waitForCanvas(page);

      await expect(page).toHaveScreenshot({
        fullPage: true,
        // Moderate tolerance for WebGL rendering differences
        maxDiffPixels: 300,
        threshold: 0.2,
      });
    });

    test('should render tasks tab', async ({ page }) => {
      await page.locator('text=Tasks').click();
      await expect(page).toHaveScreenshot({
        fullPage: true,
        // Moderate tolerance for WebGL rendering differences
        maxDiffPixels: 300,
        threshold: 0.2,
      });
    });
  });

  test.describe('Toa Characters', () => {
    [
      'Toa_Gali',
      'Toa_Kopaka',
      'Toa_Lewa',
      'Toa_Onua',
      'Toa_Pohatu',
      'Toa_Tahu',
    ].forEach((characterId) => {
      test(`should render ${characterId} character detail page`, async ({
        page,
      }) => {
        await setupGameState(page, {
          ...INITIAL_GAME_STATE,
          recruitedCharacters: [
            {
              id: characterId,
              exp: 0,
            },
          ],
        });
        await goto(page, `/characters/${characterId}`);
        await waitForCanvas(page);

        // Take screenshot of the entire page including 3D scene
        await expect(page).toHaveScreenshot({
          fullPage: true,
          timeout: 15000,
          // Moderate tolerance for WebGL rendering differences
          maxDiffPixels: 300,
          threshold: 0.2,
        });
      });
    });
  });
});
