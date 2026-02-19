import { test, expect } from '@playwright/test';
import { goto, setupGameState, INITIAL_GAME_STATE } from '../helpers';

/** Fast nav to avoid WebGL/3D load blocking - battle pages don't need canvas for these tests */
const gotoBattleSelector = (page: Parameters<typeof goto>[0]) =>
  goto(page, '/battle/selector', {
    waitUntil: 'domcontentloaded',
    hideCanvasBeforeNav: true,
  });

const TOA_WITH_EXP = [
  { id: 'Toa_Tahu', exp: 50000 },
  { id: 'Toa_Gali', exp: 50000 },
  { id: 'Toa_Kopaka', exp: 50000 },
  { id: 'Toa_Lewa', exp: 50000 },
  { id: 'Toa_Onua', exp: 50000 },
  { id: 'Toa_Pohatu', exp: 50000 },
];

test.describe('Battle Flow', () => {
  test('start battle shows team selection screen', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana'],
      recruitedCharacters: TOA_WITH_EXP,
    });
    await gotoBattleSelector(page);

    await page.locator('.encounter-list').waitFor({ state: 'visible', timeout: 10000 });

    const startButton = page.locator('.encounter button.confirm-button').first();
    await startButton.click();

    await expect(page).toHaveURL(/\/battle$/);
    await expect(page.locator('h1.title')).toContainText('Select Your Team');
    await expect(page.locator('h2')).toContainText('Preparing for:');
  });

  test('can select team and begin battle', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana'],
      recruitedCharacters: TOA_WITH_EXP,
    });
    await gotoBattleSelector(page);

    await page.locator('.encounter-list').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.encounter button.confirm-button').first().click();

    await page.locator('h1.title').waitFor({ state: 'visible', timeout: 5000 });
    const teamSelector = page.locator('.battle-prep__team-selector .character-card');
    await teamSelector.first().waitFor({ state: 'visible', timeout: 20000 });

    const selectedTeam = await page.locator('.battle-prep__selected-team .character-card');
    await teamSelector.nth(0).click();
    await expect(selectedTeam.nth(0)).toContainText('Tahu');
    await teamSelector.nth(1).click();
    await expect(selectedTeam.nth(1)).toContainText('Gali');
    await teamSelector.nth(2).click();
    await expect(selectedTeam.nth(2)).toContainText('Kopaka');

    const beginButton = page
      .locator('button.confirm-button')
      .filter({ hasText: 'Begin Battle' })
      .first();
    await expect(beginButton).toBeEnabled();
    await beginButton.click();

    const runRoundButton = page
      .locator('button.confirm-button')
      .filter({ hasText: 'Run Round' })
      .first();
    await expect(runRoundButton).toBeEnabled();

    await expect(page.locator('.battle-arena')).toBeVisible();
  });

  test('retreat returns to selector', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana'],
      recruitedCharacters: TOA_WITH_EXP,
    });
    await gotoBattleSelector(page);

    await page.locator('.encounter-list').waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('.encounter button.confirm-button').first().click();

    await page.locator('h1.title').waitFor({ state: 'visible', timeout: 5000 });

    await page.locator('button.cancel-button').filter({ hasText: 'Retreat' }).click();

    await expect(page).toHaveURL(/\/battle\/selector$/);
    await expect(page.locator('h1.title')).toContainText('Select an Encounter');
  });

  test('visible encounters filter: shows encounters when krana not collected', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana'],
      recruitedCharacters: TOA_WITH_EXP,
      collectedKrana: {},
    });
    await gotoBattleSelector(page);

    await page.locator('.encounter-list').waitFor({ state: 'visible', timeout: 10000 });
    const encounters = page.locator('.encounter');
    await expect(encounters.first()).toBeVisible();
    expect(await encounters.count()).toBeGreaterThan(0);
  });

  test('visible encounters filter: shows fewer encounters when some krana collected', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana'],
      recruitedCharacters: TOA_WITH_EXP,
      collectedKrana: {
        Fire: ['Xa', 'Bo', 'Su', 'Za'],
        Water: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Air: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Earth: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Ice: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Stone: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
      },
    });
    await gotoBattleSelector(page);

    await page.locator('.page-container').waitFor({ state: 'visible', timeout: 10000 });
    const encounters = page.locator('.encounter');
    expect(await encounters.count()).toBe(1);
  });

  test('visible encounters filter: shows no encounters when all krana collected', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana'],
      recruitedCharacters: TOA_WITH_EXP,
      collectedKrana: {
        Fire: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Water: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Air: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Earth: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Ice: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
        Stone: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
      },
    });
    await gotoBattleSelector(page);

    await page.locator('.page-container').waitFor({ state: 'visible', timeout: 10000 });
    const encounters = page.locator('.encounter');
    expect(await encounters.count()).toBe(0);
  });
});
