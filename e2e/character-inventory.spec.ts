import { test, expect } from '@playwright/test';
import { MatoranJob } from '../src/types/Jobs';
import {
  gotoWithTestMode,
  INITIAL_GAME_STATE,
  setupGameState,
  waitForCharacterCards,
} from './helpers';

const CHARACTER_INVENTORY_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  buyableCharacters: [
    {
      id: 'Toa_Lewa',
      cost: 100,
      requiredItems: [],
    },
  ],
  recruitedCharacters: [
    {
      id: 'Takua',
      exp: 0,
      quest: 'mnog_find_canister_beach',
    },
    {
      id: 'Toa_Tahu',
      exp: 0,
    },
    {
      id: 'Jala',
      exp: 0,
      assignment: {
        job: MatoranJob.CharcoalMaker,
        expRatePerSecond: 1.5,
        assignedAt: Date.now(),
      },
    },
    {
      id: 'Toa_Gali',
      exp: 0,
    },
  ],
};

test.describe('Character Inventory Page', () => {
  test('should display character inventory', async ({ page }) => {
    await setupGameState(page, CHARACTER_INVENTORY_GAME_STATE);
    await gotoWithTestMode(page, '/characters');

    // Wait for character cards to be visible instead of networkidle
    await waitForCharacterCards(page);

    // Take a screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('should display character inventory without recruit button', async ({
    page,
  }) => {
    CHARACTER_INVENTORY_GAME_STATE.buyableCharacters = [];
    await setupGameState(page, CHARACTER_INVENTORY_GAME_STATE);
    await gotoWithTestMode(page, '/characters');

    // Wait for character cards to be visible instead of networkidle
    await waitForCharacterCards(page);

    // Take a screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test.describe('Character Cards', () => {
    // Skip test if not on Desktop
    test('should display character cards with avatars', async ({
      browser,
      page,
    }) => {
      if (browser.browserType().name() !== 'webkit') {
        test.skip();
      }
      await setupGameState(page, CHARACTER_INVENTORY_GAME_STATE);
      await gotoWithTestMode(page, '/characters');

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
    });
  });
});
