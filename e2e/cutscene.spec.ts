import { test, expect } from '@playwright/test';
import { goto, INITIAL_GAME_STATE, setupGameState, VIEWPORTS } from './helpers';

const COMPLETED_QUEST_WITH_CUTSCENE = {
  ...INITIAL_GAME_STATE,
  completedQuests: ['mnog_ga_koro_sos'],
};

async function openDialogueCutscene(page: import('@playwright/test').Page) {
  await setupGameState(page, COMPLETED_QUEST_WITH_CUTSCENE);
  await goto(page, '/quests', { hideCanvasBeforeNav: true });
  await page.locator('h2.quests-page__title').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.quests-page__item-title:has-text("A call for help")').click();
  await page.locator('button:has-text("Replay Cutscene")').click();
  await page
    .locator('.visual-novel-cutscene__speaker-name')
    .waitFor({ state: 'visible', timeout: 5000 });
}

async function openVideoCutscene(page: import('@playwright/test').Page) {
  await setupGameState(page, {
    ...INITIAL_GAME_STATE,
    completedQuests: ['story_toa_arrival'],
  });
  await goto(page, '/quests', { hideCanvasBeforeNav: true });
  await page.locator('h2.quests-page__title').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.quests-page__item-title:has-text("The Arrival of the Toa")').click();
  await page.locator('button:has-text("Replay Cutscene")').click();
  await page
    .locator('.visual-novel-cutscene__video-wrapper iframe')
    .waitFor({ state: 'visible', timeout: 5000 });
  await page.locator('.visual-novel-cutscene__video-wrapper iframe').evaluate((el) => {
    (el as HTMLIFrameElement).src = 'about:blank';
  });
}

test.describe('Visual Novel Cutscene', () => {
  // TODO: Test portraits
  test.skip('should display dialogue cutscene via Replay button on completed quest', async ({
    page,
  }) => {
    await openDialogueCutscene(page);
    await expect(page.locator('.visual-novel-cutscene__speaker-name')).toContainText('Maku');
    await expect(page.locator('.visual-novel-cutscene__text')).toContainText('Ga-Koro');
    await expect(page).toHaveScreenshot('cutscene-dialogue-left.png', {
      maxDiffPixels: 200,
    });
    await page.locator('.visual-novel-cutscene__advance').click();
    await expect(page.locator('.visual-novel-cutscene__speaker-name')).toContainText('Takua');
    await expect(page).toHaveScreenshot('cutscene-dialogue-right.png', {
      maxDiffPixels: 200,
    });
  });
});

test.describe('Visual Novel Cutscene - Responsiveness', () => {
  for (const [name, size] of Object.entries(VIEWPORTS)) {
    test.describe(`${name} (${size.width}x${size.height})`, () => {
      test('dialogue cutscene renders correctly', async ({ page }) => {
        await page.setViewportSize(size);
        await openDialogueCutscene(page);
        await expect(page.locator('.visual-novel-cutscene__speaker-name')).toContainText('Maku');
        await expect(page).toHaveScreenshot(`cutscene-dialogue-${name}-left.png`, {
          maxDiffPixels: 200,
        });
        await page.locator('.visual-novel-cutscene__advance').click();

        await page.locator('.visual-novel-cutscene__advance').click();
        await expect(page.locator('.visual-novel-cutscene__speaker-name')).toContainText('Takua');
        await expect(page).toHaveScreenshot(`cutscene-dialogue-${name}-right.png`, {
          maxDiffPixels: 200,
        });
      });

      test('video-only cutscene renders correctly', async ({ page }) => {
        await page.setViewportSize(size);
        await openVideoCutscene(page);
        await expect(page).toHaveScreenshot(`cutscene-video-${name}.png`, {
          maxDiffPixels: 200,
        });
      });
    });
  }
});
