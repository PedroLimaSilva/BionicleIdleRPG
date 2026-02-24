import { test, expect } from '@playwright/test';
import {
  disableCSSAnimations,
  goto,
  INITIAL_GAME_STATE,
  setupGameState,
  waitForCanvas,
  waitForCharacterCards,
} from '../../helpers';

test.describe('Character Model Rendering', () => {
  test.describe('Matoran Character switching', () => {
    test.beforeEach(async ({ page }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [
          ...INITIAL_GAME_STATE.recruitedCharacters,
          { id: 'Takua', exp: 0 },
          { id: 'Hali', exp: 0 },
        ],
      });

      await goto(page, '/characters/Takua');
      await disableCSSAnimations(page);
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
      const charactersNavItem = page.locator('nav a').filter({ hasText: /Characters$/ });
      await charactersNavItem.click();
      await waitForCharacterCards(page);
      await expect(page).toHaveScreenshot({
        fullPage: true,
        // Moderate tolerance for WebGL rendering differences
        maxDiffPixels: 300,
        threshold: 0.2,
      });

      const jalaLink = page.locator('a').filter({ hasText: 'Hali' });
      await jalaLink.click();
      await expect(page).toHaveURL(new RegExp(`/characters/Hali`));
      await disableCSSAnimations(page);
      await waitForCanvas(page);

      await expect(page).toHaveScreenshot({
        fullPage: true,
        // Moderate tolerance for WebGL rendering differences
        maxDiffPixels: 300,
        threshold: 0.2,
      });
    });
  });

  test.describe('Toa Characters', () => {
    ['Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu', 'Toa_Tahu'].forEach(
      (characterId) => {
        test(`should render ${characterId} character detail page`, async ({ page }) => {
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
          await disableCSSAnimations(page);
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
      }
    );

    [
      'Toa_Gali_Nuva',
      'Toa_Kopaka_Nuva',
      'Toa_Lewa_Nuva',
      'Toa_Onua_Nuva',
      'Toa_Pohatu_Nuva',
      'Toa_Tahu_Nuva',
    ].forEach((characterId) => {
      test(`should render ${characterId} character detail page`, async ({ page }) => {
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
        await disableCSSAnimations(page);
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

  test.describe('Mask color overrides', () => {
    test('should render Toa Tahu with gold mask when Kini-Nui quests completed', async ({
      page,
    }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [{ id: 'Toa_Tahu', exp: 0 }],
        completedQuests: ['mnog_kini_nui_arrival'],
      });
      await goto(page, '/characters/Toa_Tahu');
      await disableCSSAnimations(page);
      await waitForCanvas(page);

      await expect(page).toHaveScreenshot({
        fullPage: true,
        timeout: 15000,
        maxDiffPixels: 300,
        threshold: 0.2,
      });
    });

    test('should render Toa Tahu Nuva with grey mask when nuva symbols sequestered', async ({
      page,
    }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [{ id: 'Toa_Tahu_Nuva', exp: 0 }],
        completedQuests: ['bohrok_kal_reconstruction', 'bohrok_kal_stolen_symbols'],
      });
      await goto(page, '/characters/Toa_Tahu_Nuva');
      await disableCSSAnimations(page);
      await waitForCanvas(page);

      await expect(page).toHaveScreenshot({
        fullPage: true,
        timeout: 15000,
        maxDiffPixels: 300,
        threshold: 0.2,
      });
    });
  });

  test.describe('Bohrok Characters', () => {
    ['tahnok', 'gahlok', 'lehvak', 'pahrak', 'nuhvok', 'kohrak'].forEach((characterId) => {
      test(`should render ${characterId} character detail page`, async ({ page }) => {
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
        await disableCSSAnimations(page);
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
    ['tahnok_kal', 'gahlok_kal', 'lehvak_kal', 'pahrak_kal', 'nuhvok_kal', 'kohrak_kal'].forEach(
      (characterId) => {
        test(`should render ${characterId} character detail page`, async ({ page }) => {
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
          await disableCSSAnimations(page);
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
      }
    );
  });
});
