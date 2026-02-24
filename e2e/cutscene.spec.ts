import { test, expect } from '@playwright/test';
import { goto, INITIAL_GAME_STATE, setupGameState } from './helpers';

const COMPLETED_QUEST_WITH_CUTSCENE = {
  ...INITIAL_GAME_STATE,
  completedQuests: ['mnog_ga_koro_sos'],
};

test.describe('Visual Novel Cutscene', () => {
  test('should display dialogue cutscene via Replay button on completed quest', async ({ page }) => {
    await setupGameState(page, COMPLETED_QUEST_WITH_CUTSCENE);
    await goto(page, '/quests', { hideCanvasBeforeNav: true });

    await page.locator('h2.quests-page__title').first().waitFor({ state: 'visible', timeout: 10000 });

    // Expand completed quest (click quest title to open accordion)
    await page.locator('.quests-page__item-title:has-text("A call for help")').click();

    // Click Replay Cutscene
    await page.locator('button:has-text("Replay Cutscene")').click();

    // Wait for cutscene to appear
    await page.locator('.visual-novel-cutscene__speaker-name').waitFor({ state: 'visible', timeout: 5000 });

    await expect(page.locator('.visual-novel-cutscene__speaker-name')).toContainText('Maku');
    await expect(page.locator('.visual-novel-cutscene__text')).toContainText('Ga-Koro');

    await expect(page).toHaveScreenshot('cutscene-dialogue.png', {
      maxDiffPixels: 200,
    });
  });

  test('should display video-only cutscene via Replay button', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['story_toa_arrival'],
    });
    await goto(page, '/quests', { hideCanvasBeforeNav: true });

    await page.locator('h2.quests-page__title').first().waitFor({ state: 'visible', timeout: 10000 });

    await page.locator('.quests-page__item-title:has-text("The Arrival of the Toa")').click();
    await page.locator('button:has-text("Replay Cutscene")').click();

    await page.locator('.visual-novel-cutscene__video-wrapper iframe').waitFor({ state: 'visible', timeout: 5000 });

    await expect(page).toHaveScreenshot('cutscene-video.png', {
      maxDiffPixels: 200,
    });
  });
});
