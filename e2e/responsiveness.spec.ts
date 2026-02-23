import { test, expect } from '@playwright/test';
import {
  enableTestMode,
  goto,
  INITIAL_GAME_STATE,
  setupGameState,
  VIEWPORTS,
  viewportAwareHover,
  waitForCharacterCards,
} from './helpers';

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

        await expect(page.locator('h1')).toContainText('Welcome to Mata Nui');
        await expect(page.locator('.activity-log')).toBeVisible();
        await expect(page.locator('.nav-bar')).toBeVisible();

        await expect(page).toHaveScreenshot(`homepage-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 150,
        });
      });

      test('navigation works across key pages', async ({ page }) => {
        await enableTestMode(page);
        await page.setViewportSize(size);

        const routes = ['/', '/recruitment', '/characters', '/inventory', '/quests'];
        for (const route of routes) {
          await goto(page, route);
          await page.locator('.page-container, .activity-log, .nav-bar').first().waitFor({
            state: 'visible',
            timeout: 10000,
          });
        }
        // Final screenshot of quests page
        await expect(page).toHaveScreenshot(`quests-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 150,
        });
      });

      test('inventory page with items', async ({ page }) => {
        await setupGameState(page, {
          ...INITIAL_GAME_STATE,
          inventory: { Charcoal: 10, AquaFilter: 5 },
        });
        await page.setViewportSize(size);
        await goto(page, '/inventory');

        await page
          .locator('.inventory-grid, .page-container')
          .first()
          .waitFor({ state: 'visible', timeout: 10000 });

        const firstItem = page.locator('.inventory-item').first();
        await viewportAwareHover(firstItem, size.width);

        await expect(page).toHaveScreenshot(`inventory-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 150,
        });
      });

      test('character page renders', async ({ page }) => {
        await setupGameState(page, {
          ...INITIAL_GAME_STATE,
          recruitedCharacters: [{ id: 'Takua', exp: 0 }],
        });
        await page.setViewportSize(size);
        await goto(page, '/characters');

        await waitForCharacterCards(page);
        await expect(page.locator('.character-card, .matoran-card').first()).toBeVisible();

        await expect(page).toHaveScreenshot(`characters-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 150,
        });
      });
    });
  }
});
