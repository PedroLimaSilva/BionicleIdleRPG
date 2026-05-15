import { test, expect, Page } from '@playwright/test';
import {
  disableCSSAnimations,
  goto,
  hideCanvas,
  INITIAL_GAME_STATE,
  setupGameState,
  VIEWPORTS,
} from './helpers';

/**
 * Helper: navigate to the recruitment page with a guaranteed-affordable game state and the
 * canvas hidden so screenshots are deterministic (no WebGL output).
 */
async function gotoRecruitment(page: Page, extra: Partial<typeof INITIAL_GAME_STATE> = {}) {
  await setupGameState(page, {
    ...INITIAL_GAME_STATE,
    protodermis: 5000,
    protodermisCap: 5000,
    ...extra,
  });
  await goto(page, '/recruitment', {
    hideCanvasBeforeNav: true,
    waitUntil: 'domcontentloaded',
  });
  await page.locator('.recruitment-screen').waitFor({ state: 'visible', timeout: 10000 });
  await hideCanvas(page);
  await disableCSSAnimations(page);
}

/**
 * Builds a path suitable for `goto(page, path)` that opens the app root with a `?recruit=…`
 * query param. The encoding matches the URL-safe base64 used by
 * `src/services/customCharacterShare.ts`.
 */
function buildShareUrl(payload: Record<string, unknown>): string {
  const json = JSON.stringify(payload);
  // Node's Buffer is available in the Playwright runner process.
  const b64 = Buffer.from(json, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  // `goto` prepends `/BionicleIdleRPG`, so we only need the inner path here.
  return `/?recruit=${b64}`;
}

test.describe('Custom Character', () => {
  test.describe('Recruitment "Create" slot', () => {
    for (const [name, size] of Object.entries(VIEWPORTS)) {
      test(`${name} (${size.width}x${size.height}): shows the new-matoran create slot`, async ({
        page,
      }) => {
        await page.setViewportSize(size);
        await gotoRecruitment(page);

        // The first buyable entry is always the "create" slot, which shows the Create button.
        const createBtn = page.locator('.elemental-btn').filter({ hasText: /^Create$/ });
        await expect(createBtn).toBeVisible({ timeout: 10000 });
        await expect(createBtn).not.toHaveClass(/disabled/);

        await expect(page.locator('.character-name')).toHaveText('New Matoran');
        await expect(page.locator('.requirement-list li')).toContainText('500 protodermis');

        await expect(page).toHaveScreenshot(`custom-recruitment-create-slot-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 200,
        });
      });
    }
  });

  test.describe('Character creation page', () => {
    for (const [name, size] of Object.entries(VIEWPORTS)) {
      test(`${name} (${size.width}x${size.height}): renders form layout`, async ({ page }) => {
        await setupGameState(page, {
          ...INITIAL_GAME_STATE,
          protodermis: 5000,
          protodermisCap: 5000,
        });
        await page.setViewportSize(size);
        await goto(page, '/character-create', {
          hideCanvasBeforeNav: true,
          waitUntil: 'domcontentloaded',
        });

        await page.locator('.character-creation').waitFor({ state: 'visible', timeout: 10000 });
        await hideCanvas(page);
        await disableCSSAnimations(page);

        // Form essentials are visible and reachable
        await expect(page.locator('input[type="text"]').first()).toBeVisible();
        await expect(page.locator('.chip-row .chip')).toHaveCount(8);
        await expect(page.locator('.mask-grid .mask-tile')).toHaveCount(12);
        await expect(page.locator('.part-tabs .part-tab').first()).toBeVisible();
        const confirmBtn = page.locator('.elemental-btn').filter({ hasText: /^Create / });
        await expect(confirmBtn).toBeVisible();

        await expect(page).toHaveScreenshot(`custom-creation-page-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 200,
        });
      });

      test(`${name}: customize → create flow updates the game state and lands on detail`, async ({
        page,
      }) => {
        await setupGameState(page, {
          ...INITIAL_GAME_STATE,
          protodermis: 5000,
          protodermisCap: 5000,
        });
        await page.setViewportSize(size);
        await goto(page, '/character-create', {
          hideCanvasBeforeNav: true,
          waitUntil: 'domcontentloaded',
        });

        await page.locator('.character-creation').waitFor({ state: 'visible', timeout: 10000 });
        await hideCanvas(page);
        await disableCSSAnimations(page);

        await page.locator('.field-input').fill('Toatest');
        await page.locator('.chip').filter({ hasText: 'Water' }).click();
        await page.locator('.mask-tile').nth(1).click();
        await page.locator('.part-tab').filter({ hasText: 'body' }).click();
        await page.locator('.color-swatch').first().click();

        const confirmBtn = page.locator('.elemental-btn').filter({ hasText: /^Create Toatest$/ });
        await expect(confirmBtn).toBeVisible();
        await confirmBtn.click();

        const createModal = page.getByTestId('create-matoran-confirm-modal');
        await expect(createModal).toBeVisible({ timeout: 10000 });
        await expect(createModal).toContainText('cannot change');
        await page.getByTestId('create-matoran-confirm-submit').click();

        await page.waitForURL(/\/characters\/custom_0$/, { timeout: 10000 });

        const persisted = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('GAME_STATE') ?? '{}')
        );
        expect(persisted.protodermis).toBe(4500);
        expect(persisted.customCharacters).toHaveLength(1);
        expect(persisted.customCharacters[0].id).toBe('custom_0');
        expect(persisted.customCharacters[0].name).toBe('Toatest');
        expect(persisted.customCharacters[0].element).toBe('Water');
        expect(persisted.recruitedCharacters).toContainEqual({ exp: 0, id: 'custom_0' });
      });
    }
  });

  test.describe('Shared character link', () => {
    const SHARED_BASE = {
      colors: {
        arms: '#0055BF',
        body: '#0055BF',
        eyes: '#FF0040',
        face: '#6D6E5C',
        feet: '#F2CD37',
        mask: '#0055BF',
      },
      element: 'Water',
      id: 'custom_42',
      isMaskTransparent: false,
      mask: 'Kaukau',
      name: 'Pridak',
      stage: 'Diminished',
      tags: ['Custom'],
    };

    for (const [name, size] of Object.entries(VIEWPORTS)) {
      test(`${name}: opening a share link shows the welcome dialog`, async ({ page }) => {
        await setupGameState(page, INITIAL_GAME_STATE);
        await page.setViewportSize(size);

        await goto(page, buildShareUrl(SHARED_BASE), {
          hideCanvasBeforeNav: true,
          waitUntil: 'domcontentloaded',
        });
        await hideCanvas(page);
        await disableCSSAnimations(page);

        const dialog = page.locator('[data-testid="shared-character-prompt"]');
        await expect(dialog).toBeVisible({ timeout: 10000 });
        await expect(dialog).toContainText('Pridak');
        await expect(dialog).toContainText('Water');

        await expect(page).toHaveScreenshot(`custom-share-dialog-${name}.png`, {
          maxDiffPixels: 200,
        });
      });

      test(`${name}: shared character appears in recruitment with a dismiss control`, async ({
        page,
      }) => {
        // Seed the game state with the shared character already present so we don't have to
        // chain a share-URL navigation with a follow-up goto (which would re-run the
        // setupGameState init script and wipe customCharacters out again).
        await setupGameState(page, {
          ...INITIAL_GAME_STATE,
          customCharacters: [SHARED_BASE as never],
        });
        await page.setViewportSize(size);

        await goto(page, '/recruitment', {
          hideCanvasBeforeNav: true,
          waitUntil: 'domcontentloaded',
        });
        await page.locator('.recruitment-screen').waitFor({ state: 'visible', timeout: 10000 });
        await hideCanvas(page);
        await disableCSSAnimations(page);

        // The default selection is the create slot. Advance carousel one step.
        await page.locator('.recruitment-arrow--right').click();

        await expect(page.locator('.character-name')).toHaveText('Pridak');
        const recruitBtn = page.locator('.elemental-btn').filter({ hasText: /^Recruit$/ });
        await expect(recruitBtn).toBeVisible();
        const dismissBtn = page.locator('.dismiss-custom-btn');
        await expect(dismissBtn).toBeVisible();
        await expect(page.locator('.custom-character-note')).toContainText('Shared custom matoran');

        await expect(page).toHaveScreenshot(`custom-shared-in-recruitment-${name}.png`, {
          fullPage: true,
          maxDiffPixels: 200,
        });

        // Dismiss removes the character from the buyable list and from persistence.
        await dismissBtn.click();
        await expect(page.locator('.character-name')).toHaveText('New Matoran');
        const after = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('GAME_STATE') ?? '{}')
        );
        expect(after.customCharacters).toHaveLength(0);
      });

      test(`${name}: share-URL flow seeds persistence with the shared matoran`, async ({
        page,
      }) => {
        await setupGameState(page, INITIAL_GAME_STATE);
        await page.setViewportSize(size);

        await goto(page, buildShareUrl(SHARED_BASE), {
          hideCanvasBeforeNav: true,
          waitUntil: 'domcontentloaded',
        });
        await hideCanvas(page);
        await disableCSSAnimations(page);

        const dialog = page.locator('[data-testid="shared-character-prompt"]');
        await expect(dialog).toBeVisible({ timeout: 10000 });
        await dialog.getByRole('button', { name: 'Continue' }).click();
        await expect(dialog).not.toBeVisible();

        // URL param is consumed; persistence picks up the shared character.
        await expect
          .poll(async () => page.evaluate(() => new URL(location.href).searchParams.get('recruit')))
          .toBeNull();
        const persisted = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('GAME_STATE') ?? '{}')
        );
        expect(persisted.customCharacters).toHaveLength(1);
        expect(persisted.customCharacters[0].id).toBe('custom_42');
        expect(persisted.customCharacters[0].name).toBe('Pridak');
      });

      test(`${name}: an invalid share token is ignored without crashing`, async ({ page }) => {
        await setupGameState(page, INITIAL_GAME_STATE);
        await page.setViewportSize(size);

        // Token with a non-custom id should be rejected (no dialog, no state change).
        const invalid = buildShareUrl({ ...SHARED_BASE, id: 'Jala' });
        await goto(page, invalid, {
          hideCanvasBeforeNav: true,
          waitUntil: 'domcontentloaded',
        });
        await hideCanvas(page);
        await disableCSSAnimations(page);

        const dialog = page.locator('[data-testid="shared-character-prompt"]');
        await expect(dialog).toHaveCount(0);
        const persisted = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('GAME_STATE') ?? '{}')
        );
        expect(persisted.customCharacters ?? []).toHaveLength(0);
      });

      test(`${name}: redeem share link from recruitment modal`, async ({ page }) => {
        await setupGameState(page, INITIAL_GAME_STATE);
        await page.setViewportSize(size);

        await goto(page, '/recruitment', {
          hideCanvasBeforeNav: true,
          waitUntil: 'domcontentloaded',
        });
        await page.locator('.recruitment-screen').waitFor({ state: 'visible', timeout: 10000 });
        await hideCanvas(page);
        await disableCSSAnimations(page);

        await page.getByRole('button', { name: /Redeem share link/i }).click();
        await expect(page.getByTestId('recruitment-redeem-modal')).toBeVisible();

        const pasted = `https://example.com/BionicleIdleRPG${buildShareUrl(SHARED_BASE)}`;
        await page.locator('[data-testid="recruitment-redeem-modal"] textarea').fill(pasted);

        await page.getByRole('button', { name: /Add to recruitment list/i }).click();

        const dialog = page.locator('[data-testid="shared-character-prompt"]');
        await expect(dialog).toBeVisible({ timeout: 10000 });
        await expect(dialog).toContainText('Pridak');

        await dialog.getByRole('button', { name: 'Continue' }).click();
        await expect(dialog).not.toBeVisible();

        const persisted = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('GAME_STATE') ?? '{}')
        );
        expect(persisted.customCharacters).toHaveLength(1);
        expect(persisted.customCharacters[0].id).toBe('custom_42');
      });
    }
  });
});
