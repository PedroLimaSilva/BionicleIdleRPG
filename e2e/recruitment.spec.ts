import { test, expect } from '@playwright/test';
import { goto, INITIAL_GAME_STATE, setupGameState, hideCanvas } from './helpers';

test.describe('Recruitment Celebration', () => {
  const GAME_STATE_WITH_BUYABLE = {
    ...INITIAL_GAME_STATE,
    completedQuests: ['story_toa_arrival'],
    protodermis: 500,
  };

  test('should show celebration modal instead of alert when recruiting', async ({ page }) => {
    await setupGameState(page, GAME_STATE_WITH_BUYABLE);

    await goto(page, '/recruitment', {
      hideCanvasBeforeNav: true,
      waitUntil: 'domcontentloaded',
    });

    await page.locator('.recruitment-screen').waitFor({ state: 'visible', timeout: 10000 });
    await hideCanvas(page);

    const recruitBtn = page.locator('.elemental-btn').filter({ hasText: 'Recruit' });
    await expect(recruitBtn).toBeVisible();
    await expect(recruitBtn).not.toHaveClass(/disabled/);

    await recruitBtn.click();

    const celebration = page.locator('[data-testid="recruitment-celebration"]');
    await expect(celebration).toBeVisible({ timeout: 5000 });

    await expect(page.locator('.celebration-subtitle')).toHaveText('New Recruit');
    await expect(page.locator('.celebration-name')).toBeVisible();
    await expect(page.locator('.celebration-element-badge')).toBeVisible();

    await expect(page).toHaveScreenshot('recruitment-celebration-modal.png', {
      maxDiffPixels: 200,
    });
  });

  test('should dismiss celebration and continue to next character', async ({ page }) => {
    await setupGameState(page, {
      ...GAME_STATE_WITH_BUYABLE,
      protodermis: 2000,
    });

    await goto(page, '/recruitment', {
      hideCanvasBeforeNav: true,
      waitUntil: 'domcontentloaded',
    });

    await page.locator('.recruitment-screen').waitFor({ state: 'visible', timeout: 10000 });
    await hideCanvas(page);

    const recruitBtn = page.locator('.elemental-btn').filter({ hasText: 'Recruit' });
    await recruitBtn.click();

    const celebration = page.locator('[data-testid="recruitment-celebration"]');
    await expect(celebration).toBeVisible({ timeout: 5000 });

    const continueBtn = page.locator('.celebration-dismiss');
    await continueBtn.click();

    await expect(celebration).not.toBeVisible({ timeout: 5000 });

    await expect(page.locator('.recruitment-screen')).toBeVisible();
  });

  test('should navigate to characters when last character is recruited', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      completedQuests: ['story_toa_arrival'],
      protodermis: 500,
      recruitedCharacters: [
        { exp: 0, id: 'Toa_Kopaka' },
        { exp: 0, id: 'Toa_Pohatu' },
        { exp: 0, id: 'Toa_Onua' },
        { exp: 0, id: 'Toa_Lewa' },
        { exp: 0, id: 'Toa_Gali' },
      ],
    });

    await goto(page, '/recruitment', {
      hideCanvasBeforeNav: true,
      waitUntil: 'domcontentloaded',
    });

    await page.locator('.recruitment-screen').waitFor({ state: 'visible', timeout: 10000 });
    await hideCanvas(page);

    const recruitBtn = page.locator('.elemental-btn').filter({ hasText: 'Recruit' });
    await expect(recruitBtn).toBeVisible();
    await recruitBtn.click();

    const celebration = page.locator('[data-testid="recruitment-celebration"]');
    await expect(celebration).toBeVisible({ timeout: 5000 });

    const continueBtn = page.locator('.celebration-dismiss');
    await continueBtn.click();

    await page.waitForURL('**/characters', { timeout: 5000 });
  });

  test('should not show browser alert dialog on recruit', async ({ page }) => {
    await setupGameState(page, GAME_STATE_WITH_BUYABLE);

    let alertTriggered = false;
    page.on('dialog', () => {
      alertTriggered = true;
    });

    await goto(page, '/recruitment', {
      hideCanvasBeforeNav: true,
      waitUntil: 'domcontentloaded',
    });

    await page.locator('.recruitment-screen').waitFor({ state: 'visible', timeout: 10000 });
    await hideCanvas(page);

    const recruitBtn = page.locator('.elemental-btn').filter({ hasText: 'Recruit' });
    await recruitBtn.click();

    const celebration = page.locator('[data-testid="recruitment-celebration"]');
    await expect(celebration).toBeVisible({ timeout: 5000 });

    expect(alertTriggered).toBe(false);
  });
});
