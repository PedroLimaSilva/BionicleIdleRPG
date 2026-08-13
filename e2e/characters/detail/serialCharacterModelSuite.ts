import { expect, test, type Browser, type Page } from '@playwright/test';
import type { PartialGameState } from '../../../src/types/GameState';
import {
  CHARACTER_MODEL_SCREENSHOT,
  INITIAL_GAME_STATE,
  characterModelScreenshotTarget,
  openCharacterModelDetail,
  setupGameState,
  waitForCharacterModelReady,
  type CharacterInventoryTab,
} from '../../helpers';

type SerialCharacterModelSuiteOptions = {
  suiteName: string;
  characterIds: readonly string[];
  buildGameState: (characterIds: readonly string[]) => PartialGameState;
  inventoryTab?: CharacterInventoryTab;
  pathPrefix?: string;
};

/**
 * One cold app boot per suite, then client-side inventory navigation between characters.
 * Keeps individual test titles (and snapshot names) unchanged.
 */
export function defineSerialCharacterModelSuite({
  buildGameState,
  characterIds,
  inventoryTab,
  pathPrefix = '/characters',
  suiteName,
}: SerialCharacterModelSuiteOptions): void {
  test.describe(suiteName, () => {
    test.describe.configure({ mode: 'serial' });

    let page: Page;

    test.beforeAll(async ({ browser }: { browser: Browser }) => {
      page = await browser.newPage();
      await setupGameState(page, buildGameState(characterIds));
    });

    test.afterAll(async () => {
      await page?.close();
    });

    characterIds.forEach((characterId, index) => {
      test(`should render ${characterId} character detail page`, async () => {
        const modelReady = waitForCharacterModelReady(page);

        await openCharacterModelDetail(page, characterId, modelReady, {
          coldStart: index === 0,
          inventoryTab,
          pathPrefix,
        });

        await expect(characterModelScreenshotTarget(page)).toHaveScreenshot(CHARACTER_MODEL_SCREENSHOT);
      });
    });
  });
}

/** Full reload per test — different game state or one-off characters. */
export async function captureCharacterModelScreenshot(
  page: Page,
  characterId: string,
  gameState: PartialGameState,
  options?: { pathPrefix?: string }
): Promise<void> {
  await setupGameState(page, gameState);
  const modelReady = waitForCharacterModelReady(page);
  const pathPrefix = options?.pathPrefix ?? '/characters';

  await openCharacterModelDetail(page, characterId, modelReady, {
    coldStart: true,
    pathPrefix,
  });

  await expect(characterModelScreenshotTarget(page)).toHaveScreenshot(CHARACTER_MODEL_SCREENSHOT);
}

export { INITIAL_GAME_STATE };
