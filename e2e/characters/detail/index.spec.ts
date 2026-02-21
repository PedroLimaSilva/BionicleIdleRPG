import { test, expect } from '@playwright/test';
import {
  disableCSSAnimations,
  goto,
  hideCanvas,
  INITIAL_GAME_STATE,
  setupGameState,
} from '../../helpers';

test.describe('Character Detail Page', () => {
  test('should render tasks tab', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Jala', exp: 0 }],
      completedQuests: [],
    });
    await goto(page, '/characters/Jala');
    await disableCSSAnimations(page);
    await hideCanvas(page);

    await page.locator('text=Tasks').click();
    await expect(page).toHaveScreenshot({
      fullPage: true,
      // Moderate tolerance for WebGL rendering differences
      maxDiffPixels: 300,
      threshold: 0.2,
    });
  });

  test.describe('Chronicle', () => {
    test('should show Chronicle tab for Matoran with chronicles', async ({ page }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [{ id: 'Jala', exp: 0 }],
        completedQuests: [],
      });
      await goto(page, '/characters/Jala');
      await disableCSSAnimations(page);
      await hideCanvas(page);

      const chronicleTab = page.getByRole('button', { name: 'chronicle' });
      await expect(chronicleTab).toBeVisible();
      await chronicleTab.click();
      await expect(page.locator('.character-chronicle')).toBeVisible();
      await expect(page.locator('.chronicle-section__title').first()).toContainText('Ta-Koro');
    });

    test('should show all entries locked when no quests completed', async ({ page }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [{ id: 'Takua', exp: 0 }],
        completedQuests: [],
      });
      await goto(page, '/characters/Takua');
      await disableCSSAnimations(page);
      await hideCanvas(page);

      await page.getByRole('button', { name: 'chronicle' }).click();

      const chronicle = page.locator('.character-chronicle');
      await expect(chronicle).toBeVisible();
      await chronicle.click();
      await expect(await page.locator('.chronicle-section__title').first().textContent()).toEqual(
        "Chronicler's Duty"
      );
      // No entries should show as unlocked (no checked checkbox)
      await expect(page.locator('.chronicle-entry__checkbox--checked')).toHaveCount(0);
    });

    test('should show unlocked entries based on completedQuests', async ({ page }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [{ id: 'Takua', exp: 0 }],
        completedQuests: ['mnog_find_canister_beach'],
      });
      await goto(page, '/characters/Takua');
      await disableCSSAnimations(page);
      await hideCanvas(page);

      await page.getByRole('button', { name: 'chronicle' }).click();

      const chronicle = page.locator('.character-chronicle');
      await expect(chronicle).toBeVisible();
      // Two Takua entries unlock with mnog_find_canister_beach
      await expect(chronicle.locator('.chronicle-entry__checkbox--checked')).toHaveCount(2);
      await expect(chronicle.locator('.chronicle-section__count').first()).toContainText('2/5');
    });

    test('should expand entry description when clicking unlocked entry', async ({ page }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [{ id: 'Toa_Tahu', exp: 0 }],
        completedQuests: ['story_toa_arrival'],
      });
      await goto(page, '/characters/Toa_Tahu');
      await disableCSSAnimations(page);
      await hideCanvas(page);

      await page.getByRole('button', { name: 'chronicle' }).click();

      const chronicle = page.locator('.character-chronicle');
      await expect(chronicle).toBeVisible();
      // Click first entry (unlocked)
      const firstUnlocked = chronicle.locator('.chronicle-entry--unlocked').first();
      await firstUnlocked.scrollIntoViewIfNeeded();
      await firstUnlocked.click();
      await expect(chronicle.locator('.chronicle-entry__description')).toBeVisible();
      await expect(chronicle.locator('.chronicle-entry__description')).toContainText(
        'Tahu emerges from his canister'
      );
      await expect(page).toHaveScreenshot({
        fullPage: true,
        // Moderate tolerance for WebGL rendering differences
        maxDiffPixels: 300,
        threshold: 0.2,
      });
    });
  });
});
