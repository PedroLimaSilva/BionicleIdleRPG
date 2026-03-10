import { test, expect } from '@playwright/test';
import {
  enableTestMode,
  goto,
  INITIAL_GAME_STATE,
  setupGameState,
  VIEWPORTS,
  waitForCharacterCards,
  disableCSSAnimations,
  hideCanvas,
} from './helpers';
import { KranaId } from '../src/types/Krana';

/**
 * Dedicated responsiveness tests - verify the app works at different screen sizes.
 * All other e2e tests run only once on Desktop; these tests explicitly exercise
 * desktop, mobile portrait, and mobile landscape viewports.
 */
test.describe('Responsiveness', () => {
  for (const [name, size] of Object.entries(VIEWPORTS)) {
    test.describe(`${name} (${size.width}x${size.height})`, () => {
      test('homepage renders correctly', async ({ page }) => {
        await enableTestMode(page);
        await page.setViewportSize(size);
        await goto(page, '/');

        await expect(page.locator('h2.quests-page__title').first()).toContainText('Ongoing Quests');
        await expect(page.locator('.nav-bar')).toBeVisible();

        await expect(page).toHaveScreenshot(`homepage-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 150,
        });
      });

      test('settings page', async ({ page }) => {
        await enableTestMode(page);
        await page.setViewportSize(size);
        await goto(page, '/settings');

        await expect(page.locator('h1').first()).toContainText('ABOUT THIS APP');

        await expect(page).toHaveScreenshot(`settings-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 150,
        });
      });

      test('recruitment page', async ({ page }) => {
        await setupGameState(page, {
          ...INITIAL_GAME_STATE,
          protodermis: 100,
          buyableCharacters: [
            {
              id: 'Toa_Tahu',
              cost: 500,
              requiredItems: [],
            },
          ],
        });
        await page.setViewportSize(size);

        await goto(page, '/recruitment', {
          hideCanvasBeforeNav: true,
          waitUntil: 'domcontentloaded',
        });

        await page.locator('.recruitment-screen').waitFor({ state: 'visible', timeout: 10000 });
        await hideCanvas(page);

        // Take a full page screenshot (canvas hidden - model rendering tested elsewhere)
        await expect(page).toHaveScreenshot(`recruitment-${name}.png`, {
          maxDiffPixels: 150,
          timeout: 15000,
        });
      });

      test.describe('character route', () => {
        const CHARACTER_ROUTE_GAME_STATE = {
          ...INITIAL_GAME_STATE,
          protodermis: 500,
          recruitedCharacters: [
            { id: 'Takua', exp: 0 },
            { id: 'Jala', exp: 5000 },
            { id: 'Toa_Tahu', exp: 0 },
            { id: 'Toa_Gali', exp: 0 },
            { id: 'Toa_Kopaka', exp: 0 },
          ],
          completedQuests: ['story_toa_arrival', 'bohrok_legend_of_krana'],
          collectedKrana: {
            Fire: ['Xa' as KranaId, 'Bo' as KranaId],
            Water: [],
            Air: [],
            Earth: [],
            Ice: [],
            Stone: [],
          },
        };

        test('character inventory with Matoran and Toa', async ({ page }) => {
          await setupGameState(page, CHARACTER_ROUTE_GAME_STATE);
          await page.setViewportSize(size);
          await goto(page, '/characters');

          await waitForCharacterCards(page);

          await expect(page).toHaveScreenshot(`characters-inventory-${name}.png`, {
            fullPage: true,
            maxDiffPixels: 150,
          });
        });

        test('Toa detail: stats, inventory, chronicle', async ({ page }) => {
          await setupGameState(page, CHARACTER_ROUTE_GAME_STATE);
          await page.setViewportSize(size);
          await goto(page, '/characters/Toa_Tahu', { hideCanvasBeforeNav: true });

          await page.locator('.character-detail').waitFor({ state: 'visible', timeout: 10000 });
          await hideCanvas(page);
          await disableCSSAnimations(page);

          // Stats tab (default)
          await expect(page).toHaveScreenshot(`toa-detail-stats-${name}.png`, {
            fullPage: true,
            maxDiffPixels: 150,
          });

          // Inventory tab (masks + krana)
          await page.getByRole('button', { name: 'inventory' }).click();
          await expect(page.locator('.mask-inventory-section').first()).toBeVisible();
          await expect(page.locator('.krana-collection')).toBeVisible();
          await expect(page).toHaveScreenshot(`toa-detail-inventory-${name}.png`, {
            fullPage: true,
            maxDiffPixels: 150,
          });

          // Chronicle tab
          await page.getByRole('button', { name: 'chronicle' }).click();
          await expect(page.locator('.character-chronicle')).toBeVisible();
          await expect(page).toHaveScreenshot(`toa-detail-chronicle-${name}.png`, {
            fullPage: true,
            maxDiffPixels: 150,
          });
        });
      });
    });
  }
});
