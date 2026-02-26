import { test, expect } from '@playwright/test';
import { goto, INITIAL_GAME_STATE, setupGameState, waitForCanvas } from '../helpers';

const RECRUITMENT_GAME_STATE = {
  ...INITIAL_GAME_STATE,
  protodermis: 100,
  buyableCharacters: [
    {
      id: 'Toa_Tahu',
      cost: 500,
      requiredItems: [],
    },
    {
      id: 'Jala',
      cost: 100,
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
  test('should display recruitment page with character visualization and requirements drawer', async ({
    page,
  }) => {
    await setupGameState(page, RECRUITMENT_GAME_STATE);

    await goto(page, '/recruitment');

    // Wait for canvas  to be present
    await waitForCanvas(page);

    // Take a full page screenshot
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixels: 150,
      timeout: 15000,
    });
  });
});
