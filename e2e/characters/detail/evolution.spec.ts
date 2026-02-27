import { test, expect } from '@playwright/test';
import { disableCSSAnimations, goto, INITIAL_GAME_STATE, setupGameState } from '../../helpers';

const TOA_NUVA_QUEST = 'bohrok_evolve_toa_nuva';
const NAMING_DAY_QUEST = 'bohrok_kal_naming_day';

function expForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

const LOW_LEVEL_EXP = expForLevel(10);
const HIGH_LEVEL_EXP = expForLevel(51);

test.describe('Character Evolution - Toa Mata to Toa Nuva', () => {
  test('shows disabled evolve button when quest completed but level < 50', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Toa_Tahu', exp: LOW_LEVEL_EXP }],
      completedQuests: [TOA_NUVA_QUEST],
    });
    await goto(page, '/characters/Toa_Tahu', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveSection = page.locator('.evolve-section');
    await expect(evolveSection).toBeVisible();

    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeVisible();
    await expect(evolveButton).toBeDisabled();
    await expect(evolveButton).toContainText('Evolve to Toa Tahu Nuva');

    await expect(evolveSection).toContainText('needs to reach level 50');
  });

  test('shows enabled evolve button and evolves when quest completed and level >= 50', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Toa_Tahu', exp: HIGH_LEVEL_EXP }],
      completedQuests: [TOA_NUVA_QUEST],
    });
    await goto(page, '/characters/Toa_Tahu', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveSection = page.locator('.evolve-section');
    await expect(evolveSection).toBeVisible();

    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeVisible();
    await expect(evolveButton).toBeEnabled();
    await expect(evolveButton).toContainText('Evolve to Toa Tahu Nuva');

    await expect(evolveSection).toContainText('is ready to evolve');

    await evolveButton.click();

    await expect(page).toHaveURL(/\/characters\/Toa_Tahu_Nuva/);
    await expect(page.locator('.character-name')).toContainText('Toa Tahu Nuva');

    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });

  test('does not show evolve button when quest not completed', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Toa_Tahu', exp: HIGH_LEVEL_EXP }],
      completedQuests: [],
    });
    await goto(page, '/characters/Toa_Tahu', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });
});

test.describe('Character Evolution - Matoran Naming Day (ID change)', () => {
  test('shows disabled evolve button when quest completed but level < 50', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Jala', exp: LOW_LEVEL_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Jala', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveSection = page.locator('.evolve-section');
    await expect(evolveSection).toBeVisible();

    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeDisabled();
    await expect(evolveButton).toContainText('Evolve to Jaller');
  });

  test('shows enabled evolve button and evolves on click', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Jala', exp: HIGH_LEVEL_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Jala', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveButton = page.locator('.evolve-section button.confirm-button');
    await expect(evolveButton).toBeEnabled();
    await expect(evolveButton).toContainText('Evolve to Jaller');

    await evolveButton.click();

    await expect(page).toHaveURL(/\/characters\/Jaller/);
    await expect(page.locator('.character-name')).toContainText('Jaller');
  });
});

test.describe('Character Evolution - Matoran Naming Day (stage override)', () => {
  test('shows disabled upgrade button when quest completed but level < 50', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Kapura', exp: LOW_LEVEL_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Kapura', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveSection = page.locator('.evolve-section');
    await expect(evolveSection).toBeVisible();

    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeDisabled();
    await expect(evolveButton).toContainText('Upgrade to Rebuilt form');
  });

  test('shows enabled upgrade button and upgrades on click', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Kapura', exp: HIGH_LEVEL_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Kapura', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveButton = page.locator('.evolve-section button.confirm-button');
    await expect(evolveButton).toBeEnabled();
    await expect(evolveButton).toContainText('Upgrade to Rebuilt form');

    await evolveButton.click();

    // Stage override keeps the same ID, so URL stays the same
    await expect(page).toHaveURL(/\/characters\/Kapura/);
    // After upgrading, the evolve section should disappear
    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });

  test('does not show upgrade button when stage already applied', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      recruitedCharacters: [{ id: 'Kapura', exp: HIGH_LEVEL_EXP, stage: 'Rebuilt' }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Kapura', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });
});
