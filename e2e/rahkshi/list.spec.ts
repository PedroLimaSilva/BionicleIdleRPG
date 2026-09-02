import { test, expect } from '@playwright/test';
import { goto, INITIAL_GAME_STATE, setupGameState } from '../helpers';

const RAHKSHI_INVENTORY_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  kraataCollection: {
    KraataAccuracy: { 1: 20 },
    KraataChainLightning: { 1: 1 },
    KraataDisintegration: { 1: 5 },
    KraataElectricity: { 1: 1 },
  },
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
