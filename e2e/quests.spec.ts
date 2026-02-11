import { test, expect } from '@playwright/test';
import { enableTestMode, goto, INITIAL_GAME_STATE, setupGameState } from './helpers';

const QUESTS_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  activeQuests: [
    {
      questId: 'mnog_find_canister_beach',
      startedAt: 0,
      endsAt: 1000000,
      assignedMatoran: ['Takua'],
    },
  ],
  completedQuests: ['mnog_ga_koro_sos'],
};

test.describe('Quests Page', () => {
  test('should display initial quests page', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/quests');

    // Wait for the title to be visible instead of networkidle
    await page
      .locator('h2.quests-page__title')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });

    // Take a screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });

    await goto(page, '/quest-tree');

    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('should display quests page with active and completed quests', async ({ page }) => {
    await setupGameState(page, QUESTS_GAME_STATE);
    await goto(page, '/quests');
    // Wait for the title to be visible instead of networkidle
    await page
      .locator('h2.quests-page__title')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });

    // Take a screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });

    await goto(page, '/quest-tree');
    // wait for the page to have a p element with the text "The Arrival of the Toa"
    await page
      .locator('p:has-text("The Arrival of the Toa")')
      .waitFor({ state: 'visible', timeout: 10000 });
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});
