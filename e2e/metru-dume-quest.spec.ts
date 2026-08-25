import { test, expect } from '@playwright/test';
import { goto, INITIAL_GAME_STATE, setupGameState } from './helpers';

const METRU_PREREQ_QUESTS = [
  'mol_rediscovery_of_metru_nui',
  'story_metru_nui_saga_begin',
  'metru_toa_stones_for_new_generation',
] as const;

const METRU_DUME_QUEST_ID = 'metru_vakama_dume_and_the_great_temple';
const METRU_DUME_QUEST_NAME = 'The Turaga’s Visit';
const VAKAMA_LEVEL_26_EXP = 12500;

const BASE_STATE = {
  ...INITIAL_GAME_STATE,
  completedQuests: [...METRU_PREREQ_QUESTS],
  recruitedCharacters: [{ exp: VAKAMA_LEVEL_26_EXP, id: 'Vakama' }],
  protodermis: 10000,
};

async function advanceCutscene(page: import('@playwright/test').Page) {
  await page.locator('.visual-novel-cutscene__advance').click();
}

test('Metru Dume quest is available after prerequisites', async ({ page }) => {
  await setupGameState(page, BASE_STATE);
  await goto(page, '/quests', { hideCanvasBeforeNav: true });
  await page.locator('h2.quests-page__title').first().waitFor({ state: 'visible', timeout: 10000 });
  await expect(
    page.locator(`.available-quests__item-title:has-text("${METRU_DUME_QUEST_NAME}")`)
  ).toBeVisible();
});

test('Metru Dume cutscene replays with Turaga Dume dialogue', async ({ page }) => {
  await setupGameState(page, {
    ...BASE_STATE,
    completedQuests: [...METRU_PREREQ_QUESTS, METRU_DUME_QUEST_ID],
  });
  await goto(page, '/quests', { hideCanvasBeforeNav: true });
  await page.locator('h2.quests-page__title').first().waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('.quests-page__section-title:has-text("Metru Nui")').click();
  await page.locator(`.quests-page__item-title:has-text("${METRU_DUME_QUEST_NAME}")`).click();
  await page.locator('button:has-text("Replay Cutscene")').click();

  await expect(page.locator('.visual-novel-cutscene__text')).toContainText('Ga-Metru');

  for (let i = 0; i < 3; i += 1) {
    await advanceCutscene(page);
  }

  await expect(page.locator('.visual-novel-cutscene__speaker-name')).toContainText('Turaga Dume');
  await expect(page.locator('.visual-novel-cutscene__text')).toContainText('Vahki');

  for (let i = 0; i < 25; i += 1) {
    const text = await page.locator('.visual-novel-cutscene__text').textContent();
    if (text?.includes('Great Temple')) break;
    await advanceCutscene(page);
  }

  await expect(page.locator('.visual-novel-cutscene__text')).toContainText('Great Temple');
});
