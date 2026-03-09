import { test, expect } from '@playwright/test';
import { enableTestMode, goto, INITIAL_GAME_STATE, setupGameState } from '../helpers';

const ALL_KRANA_COLLECTED = {
  Fire: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
  Water: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
  Air: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
  Earth: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
  Ice: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
  Stone: ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'],
};

test.describe('Battle Nav Item', () => {
  test('should display battle nav item and battle page when encounters are available', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana'],
    });
    await goto(page, '/battle');

    await page.locator('.page-container').first().waitFor({ state: 'visible', timeout: 10000 });

    await expect(page.locator('nav a[href*="/battle"]')).toBeVisible();
    await expect(page).toHaveScreenshot({});
  });

  test('should display battle nav item and direct player to complete quests when no encounters available', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana'],
      collectedKrana: ALL_KRANA_COLLECTED,
    });
    await goto(page, '/');

    await page.locator('.nav-bar').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('nav a[href*="/battle"]')).toBeVisible();

    await page.locator('nav a[href*="/battle"]').click();
    await page.locator('.page-container').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.getByText('Complete quests to unlock encounters.')).toBeVisible();
  });

  test('should display battle nav item and direct player to complete quests after Bohrok Kal are defeated', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['bohrok_legend_of_krana', 'bohrok_kal_final_confrontation'],
      collectedKrana: ALL_KRANA_COLLECTED,
    });
    await goto(page, '/');

    await page.locator('.nav-bar').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('nav a[href*="/battle"]')).toBeVisible();

    await page.locator('nav a[href*="/battle"]').click();
    await page.locator('.page-container').waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.getByText('Complete quests to unlock encounters.')).toBeVisible();
  });
});

test.describe('Battle Selector', () => {
  test('should display battle selector page', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/battle');

    await page.locator('.page-container').first().waitFor({ state: 'visible', timeout: 10000 });

    await expect(page).toHaveScreenshot();
  });
});
