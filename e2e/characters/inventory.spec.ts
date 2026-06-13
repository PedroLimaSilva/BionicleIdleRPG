import { test, expect } from '@playwright/test';
import { goto, INITIAL_GAME_STATE, setupGameState, waitForCharacterCards } from '../helpers';

const CHARACTER_INVENTORY_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  completedQuests: ['story_toa_arrival'], // unlocks Toa (including Toa_Lewa) for recruitment
  recruitedCharacters: [
    {
      exp: 20000, // High exp so job gains during E2E tests don't cause level-up
      id: 'Jala',
    },
    {
      exp: 0,
      id: 'Takua',
      quest: 'mnog_find_canister_beach',
    },
    {
      exp: 0,
      id: 'Toa_Gali',
    },
    {
      exp: 0,
      id: 'Toa_Tahu',
    },
  ],
};

test.describe('Character Inventory Page', () => {
  test('should display character inventory', async ({ page }) => {
    await setupGameState(page, CHARACTER_INVENTORY_GAME_STATE);
    await goto(page, '/characters');

    // Wait for character cards to be visible instead of networkidle
    await waitForCharacterCards(page);

    // Take a screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('should display character inventory with create matoran when no story recruits remain', async ({
    page,
  }) => {
    await setupGameState(page, { ...CHARACTER_INVENTORY_GAME_STATE, completedQuests: [] });
    await goto(page, '/characters');

    // Wait for character cards to be visible instead of networkidle
    await waitForCharacterCards(page);

    await expect(page.getByRole('button', { name: 'Create Matoran' })).toBeVisible();

    // Take a screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test.describe('Character Cards', () => {
    test('should display character cards with avatars', async ({ page }) => {
      await setupGameState(page, CHARACTER_INVENTORY_GAME_STATE);
      await goto(page, '/characters');

      // Wait for character cards to be visible instead of networkidle
      await waitForCharacterCards(page);

      const cards = await page.locator('.character-card').all();

      for (const card of cards) {
        // Hover over the card to trigger accent color
        await card.hover();

        await expect(page).toHaveScreenshot({
          maxDiffPixels: 150,
        });
      }

      await page.locator('.tab-btn').filter({ hasText: 'toa' }).click();
      const toaCards = await page.locator('.character-card').all();

      for (const card of toaCards) {
        // Hover over the card to trigger accent color
        await card.hover();

        await expect(page).toHaveScreenshot({
          maxDiffPixels: 150,
        });
      }
    });
  });
});
