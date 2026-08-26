import { test, expect } from '@playwright/test';
import {
  disableCSSAnimations,
  goto,
  INITIAL_GAME_STATE,
  navigateToModelPreview,
  setupGameState,
  waitForCharacterModelReady,
  waitForCharacterModelScene,
  CHARACTER_MODEL_SCREENSHOT,
  characterModelScreenshotTarget,
} from '../../helpers';
import { KraataPower } from '../../../src/types/Kraata';
import {
  captureCharacterModelScreenshot,
  defineSerialCharacterModelSuite,
} from './serialCharacterModelSuite';

const recruited = (ids: readonly string[]) => ids.map((id) => ({ exp: 0, id }));

test.describe('Character Model Rendering', () => {
  test.describe('Matoran Character switching', () => {
    test.beforeEach(async ({ page }) => {
      await setupGameState(page, {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [
          ...INITIAL_GAME_STATE.recruitedCharacters,
          { exp: 0, id: 'Hahli' },
          { exp: 0, id: 'Takua' },
        ],
      });

      const modelReady = waitForCharacterModelReady(page, { urlIncludes: 'Takua' });
      await goto(page, '/test/model/characters/Takua');
      await disableCSSAnimations(page);
      await waitForCharacterModelScene(page, modelReady);
    });

    test('should render matoran character detail page', async ({ page }) => {
      await expect(characterModelScreenshotTarget(page)).toHaveScreenshot(
        CHARACTER_MODEL_SCREENSHOT
      );
    });

    test('should render correct matoran character detail after switching to another character', async ({
      page,
    }) => {
      const modelReady = waitForCharacterModelReady(page, { urlIncludes: 'Hahli' });
      await navigateToModelPreview(page, 'Hahli');
      await waitForCharacterModelScene(page, modelReady);

      await expect(characterModelScreenshotTarget(page)).toHaveScreenshot(
        CHARACTER_MODEL_SCREENSHOT
      );
    });
  });

  defineSerialCharacterModelSuite({
    buildGameState: (ids) => ({
      ...INITIAL_GAME_STATE,
      recruitedCharacters: recruited(ids),
    }),
    characterIds: [
      'Toa_Gali',
      'Toa_Kopaka',
      'Toa_Lewa',
      'Toa_Onua',
      'Toa_Pohatu',
      'Toa_Tahu',
      'Toa_Gali_Nuva',
      'Toa_Kopaka_Nuva',
      'Toa_Lewa_Nuva',
      'Toa_Onua_Nuva',
      'Toa_Pohatu_Nuva',
      'Toa_Tahu_Nuva',
      'Takanuva',
    ],
    suiteName: 'Toa Characters',
  });

  test.describe('Mask color overrides', () => {
    test('should render Toa Tahu with gold mask when Kini-Nui quests completed', async ({
      page,
    }) => {
      await captureCharacterModelScreenshot(page, 'Toa_Tahu', {
        ...INITIAL_GAME_STATE,
        completedQuests: ['maskhunt_final_collection', 'mnog_kini_nui_arrival'],
        recruitedCharacters: [{ exp: 0, id: 'Toa_Tahu' }],
      });
    });

    test('should render Toa Tahu Nuva with grey mask when nuva symbols sequestered', async ({
      page,
    }) => {
      await captureCharacterModelScreenshot(page, 'Toa_Tahu_Nuva', {
        ...INITIAL_GAME_STATE,
        completedQuests: ['bohrok_kal_reconstruction', 'bohrok_kal_stolen_symbols'],
        recruitedCharacters: [{ exp: 0, id: 'Toa_Tahu_Nuva' }],
      });
    });

    test('should render Toa Tahu Nuva with infected mask after fighting poison rahkshi', async ({
      page,
    }) => {
      await captureCharacterModelScreenshot(page, 'Toa_Tahu_Nuva', {
        ...INITIAL_GAME_STATE,
        completedQuests: ['mol_fall_of_ta_koro'],
        recruitedCharacters: [{ exp: 0, id: 'Toa_Tahu_Nuva' }],
      });
    });
  });

  defineSerialCharacterModelSuite({
    buildGameState: (ids) => ({
      ...INITIAL_GAME_STATE,
      recruitedCharacters: recruited(ids),
    }),
    characterIds: ['Matau', 'Nuhrii'],
    suiteName: 'Metru Matoran Characters',
  });

  defineSerialCharacterModelSuite({
    buildGameState: (ids) => ({
      ...INITIAL_GAME_STATE,
      recruitedCharacters: recruited(ids),
    }),
    characterIds: ['Toa_Lhikan', 'Toa_Matau', 'Toa_Nokama', 'Toa_Nuju'],
    suiteName: 'Toa Metru Characters',
  });

  test.describe('Rebuilt Matoran', () => {
    test('should render rebuilt matoran character detail page', async ({ page }) => {
      await captureCharacterModelScreenshot(page, 'Jaller', {
        ...INITIAL_GAME_STATE,
        recruitedCharacters: [{ exp: 0, id: 'Jaller' }],
      });
    });
  });

  defineSerialCharacterModelSuite({
    buildGameState: (ids) => ({
      ...INITIAL_GAME_STATE,
      recruitedCharacters: recruited(ids),
    }),
    characterIds: [
      'tahnok',
      'gahlok',
      'lehvak',
      'pahrak',
      'nuhvok',
      'kohrak',
      'nuhvok_kal',
      'kohrak_kal',
      'lehvak_kal',
      'pahrak_kal',
      'tahnok_kal',
      'gahlok_kal',
    ],
    suiteName: 'Bohrok Characters',
  });

  defineSerialCharacterModelSuite({
    buildGameState: (ids) => ({
      ...INITIAL_GAME_STATE,
      rahkshi: ids.map((id) => ({
        id,
        kraata: { power: id, stage: 6 },
        power: id,
        status: 'ready' as const,
      })),
    }),
    characterIds: [
      KraataPower.Disintegration,
      KraataPower.Poison,
      KraataPower.Fragmentation,
      KraataPower.Fear,
      KraataPower.Hunger,
      KraataPower.Anger,
    ],
    kind: 'rahkshi',
    suiteName: 'Rahkshi Characters',
  });
});
