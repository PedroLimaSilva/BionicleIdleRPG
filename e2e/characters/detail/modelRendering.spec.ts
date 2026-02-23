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
  });

  test.describe('Bohrok Kal (Battle Arena)', () => {
    const TOA_NUVA = [
      { id: 'Toa_Tahu_Nuva', exp: 50000 },
      { id: 'Toa_Gali_Nuva', exp: 50000 },
      { id: 'Toa_Kopaka_Nuva', exp: 50000 },
    ];

    ['Tahnok Kal', 'Gahlok Kal', 'Lehvak Kal', 'Pahrak Kal', 'Nuhvok Kal', 'Kohrak Kal'].forEach(
      (kalName) => {
        test(`should render ${kalName} in battle arena`, async ({ page }) => {
          await setupGameState(page, {
            ...INITIAL_GAME_STATE,
            completedQuests: ['bohrok_evolve_toa_nuva', 'bohrok_assistants', 'bohrok_kal_stolen_symbols'],
            recruitedCharacters: TOA_NUVA,
          });
          await goto(page, '/battle/selector');
          await disableCSSAnimations(page);

          await page.locator('.encounter-list').waitFor({ state: 'visible', timeout: 15000 });
          const kalEncounter = page
            .locator('.encounter')
            .filter({ has: page.locator('h2').filter({ hasText: new RegExp(`^${kalName}$`) }) })
            .first();
          await kalEncounter.locator('button.confirm-button').click();

          await expect(page).toHaveURL(/\/battle$/);
          await page.locator('.battle-prep__team-selector .character-card').first().waitFor({
            state: 'visible',
            timeout: 15000,
          });
          const teamCards = page.locator('.battle-prep__team-selector .character-card');
          await teamCards.nth(0).click();
          await teamCards.nth(1).click();
          await teamCards.nth(2).click();
          await page.locator('button.confirm-button').filter({ hasText: 'Begin Battle' }).click();

          await page.locator('.battle-arena').waitFor({ state: 'visible', timeout: 15000 });
          await waitForCanvas(page);

          await expect(page).toHaveScreenshot({
            fullPage: true,
            timeout: 15000,
            maxDiffPixels: 300,
            threshold: 0.2,
          });
        });
      }
    );
  });
});
