import { test, expect } from '@playwright/test';
import {
  gotoWithTestMode,
  INITIAL_GAME_STATE,
  setupGameState,
  waitForModelLoad,
} from '../helpers';

const RECRUITMENT_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  buyableCharacters: [
    {
      id: 'Toa_Tahu',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Jala',
      cost: 500,
      requiredItems: [],
    },
    {
      id: 'Toa_Gali',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Maku',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Toa_Kopaka',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Lumi',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Toa_Lewa',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Kongu',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Toa_Onua',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Nuparu',
      cost: 100,
      requiredItems: [],
    },
    {
      id: 'Toa_Pohatu',
      cost: 100,
      requiredItems: [],
    },
  ],
};

test.describe('Recruitment Page', () => {
  test('should display recruitment page with character list', async ({
    page,
  }) => {
    await setupGameState(page, RECRUITMENT_GAME_STATE);

    // Set up listener for model load BEFORE navigation
    const modelLoadPromise = waitForModelLoad(page);

    await gotoWithTestMode(page, '/recruitment');

    // Wait for page to be fully loaded and ready
    // Wait for character cards to be in the DOM
    await page
      .locator('.card')
      .first()
      .waitFor({ state: 'visible', timeout: 10000 });

    // Wait for canvas to be present
    await page.waitForSelector('canvas', { state: 'visible', timeout: 10000 });

    // Wait for the 3D model to be loaded and paused
    await modelLoadPromise;

    // Take a full page screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
      timeout: 15000,
    });
  });
});
