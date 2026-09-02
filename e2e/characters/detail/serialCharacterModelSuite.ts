import { expect, test, type Browser, type Page } from '@playwright/test';
import type { PartialGameState } from '../../../src/types/GameState';
import {
  CHARACTER_MODEL_SCREENSHOT,
  INITIAL_GAME_STATE,
  characterModelScreenshotTarget,
  openCharacterModelPreview,
  setupGameState,
  waitForCharacterModelReady,
  type ModelPreviewKind,
} from '../../helpers';

type SerialCharacterModelSuiteOptions = {
  suiteName: string;
  characterIds: readonly string[];
  buildGameState: (characterIds: readonly string[]) => PartialGameState;
  kind?: ModelPreviewKind;
};

/**
 * One cold app boot per suite, then client-side model preview navigation between characters.
 * Keeps individual test titles (and snapshot names) unchanged.
 */
export function defineSerialCharacterModelSuite({
  buildGameState,
  characterIds,
  kind = 'characters',
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
        const modelReady = waitForCharacterModelReady(page, { urlIncludes: characterId });

        await openCharacterModelPreview(page, characterId, modelReady, {
          coldStart: index === 0,
          kind,
        });

        await expect(characterModelScreenshotTarget(page)).toHaveScreenshot(
          CHARACTER_MODEL_SCREENSHOT
        );
      });
    });
  });
}

/** Full reload per test — different game state or one-off characters. */
export async function captureCharacterModelScreenshot(
  page: Page,
  characterId: string,
  gameState: PartialGameState,
  options?: { kind?: ModelPreviewKind }
): Promise<void> {
  await setupGameState(page, gameState);
  const modelReady = waitForCharacterModelReady(page, { urlIncludes: characterId });
  const kind = options?.kind ?? 'characters';

  await openCharacterModelPreview(page, characterId, modelReady, {
    coldStart: true,
    kind,
  });

  await expect(characterModelScreenshotTarget(page)).toHaveScreenshot(CHARACTER_MODEL_SCREENSHOT);
}

export { INITIAL_GAME_STATE };
