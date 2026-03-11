import { test, expect } from '@playwright/test';
import { goto, INITIAL_GAME_STATE, setupGameState } from '../helpers';

const RAHKSHI_INVENTORY_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  inventory: {
    ...INITIAL_GAME_STATE.inventory,
    KraataDisintegration: 5,
    KraataChainLightning: 1,
    KraataElectricity: 1,
    KraataAccuracy: 20,
  },
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
      exp: 20000, // High exp so job gains during E2E tests don't cause level-up
    },
    {
      id: 'Toa_Gali',
      exp: 0,
    },
  ],
};

test.describe('Rahkshi Inventory Page', () => {
  test('should display rahkshi inventory', async ({ page }) => {
    await setupGameState(page, RAHKSHI_INVENTORY_GAME_STATE);
    await goto(page, '/characters');

    await page.locator('.tab-btn').filter({ hasText: 'rahkshi' }).click();
    await expect(page.locator('.kraata-card').first()).toBeVisible();

    // Take a screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
    });
  });
});
