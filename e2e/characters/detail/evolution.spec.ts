import { test, expect } from '@playwright/test';
import {
  disableCSSAnimations,
  goto,
  hideCanvas,
  INITIAL_GAME_STATE,
  setupGameState,
} from '../../helpers';

const TOA_NUVA_QUEST = 'bohrok_evolve_toa_nuva';
const NAMING_DAY_QUEST = 'bohrok_kal_naming_day';

function expForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

const LOW_LEVEL_EXP = expForLevel(10);
const LEVEL_51_EXP = expForLevel(51);
const LEVEL_99_EXP = expForLevel(99);
const LEVEL_100_EXP = expForLevel(100);

test.describe('Character Evolution - Toa Mata to Toa Nuva', () => {
  test('shows disabled evolve button when quest completed but level < 50', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 10000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'Toa_Tahu', exp: LOW_LEVEL_EXP }],
      completedQuests: [TOA_NUVA_QUEST],
    });
    await goto(page, '/characters/Toa_Tahu', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);
    await hideCanvas(page);

    const evolveSection = page.locator('.evolve-section');
    await expect(evolveSection).toBeVisible();

    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeVisible();
    await expect(evolveButton).toBeDisabled();
    await expect(evolveButton).toContainText('Evolve to Toa Tahu Nuva');

    await expect(evolveSection).toContainText('needs to reach level 50');
    await expect(evolveSection).toContainText('5000 protodermis');
    await expect(page).toHaveScreenshot({
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('shows disabled button when level met but not enough protodermis', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 100,
      recruitedCharacters: [{ id: 'Toa_Tahu', exp: LEVEL_51_EXP }],
      completedQuests: [TOA_NUVA_QUEST],
    });
    await goto(page, '/characters/Toa_Tahu', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);
    await hideCanvas(page);

    const evolveSection = page.locator('.evolve-section');
    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeDisabled();
    await expect(evolveSection).toContainText('is ready to evolve');
    await expect(evolveSection).toContainText('more protodermis');
    await expect(page).toHaveScreenshot({
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('shows enabled evolve button and evolves when quest completed and level >= 50 with enough protodermis', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 5000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'Toa_Tahu', exp: LEVEL_51_EXP }],
      completedQuests: [TOA_NUVA_QUEST],
    });
    await goto(page, '/characters/Toa_Tahu', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveSection = page.locator('.evolve-section');
    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeEnabled();
    await expect(evolveButton).toContainText('Evolve to Toa Tahu Nuva');

    await evolveButton.click();

    await expect(page).toHaveURL(/\/characters\/Toa_Tahu_Nuva/);
    await expect(page.locator('.character-name')).toContainText('Toa Tahu Nuva');
    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });

  test('does not show evolve button when quest not completed', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 10000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'Toa_Tahu', exp: LEVEL_51_EXP }],
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
      protodermis: 5000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'Jala', exp: LOW_LEVEL_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Jala', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);
    await hideCanvas(page);

    const evolveButton = page.locator('.evolve-section button.confirm-button');
    await expect(evolveButton).toBeDisabled();
    await expect(evolveButton).toContainText('Evolve to Jaller');
    await expect(page).toHaveScreenshot({
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('shows enabled evolve button and evolves on click', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 1000,
      recruitedCharacters: [{ id: 'Jala', exp: LEVEL_51_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Jala', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveButton = page.locator('.evolve-section button.confirm-button');
    await expect(evolveButton).toBeEnabled();

    await evolveButton.click();

    await expect(page).toHaveURL(/\/characters\/Jaller/);
    await expect(page.locator('.character-name')).toContainText('Jaller');
  });
});

test.describe('Character Evolution - Matoran Naming Day (stage override)', () => {
  test('shows disabled upgrade button when quest completed but level < 50', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 5000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'Kapura', exp: LOW_LEVEL_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Kapura', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);
    await hideCanvas(page);

    const evolveSection = page.locator('.evolve-section');
    await expect(evolveSection).toContainText('1000 protodermis');
    await expect(evolveSection).toContainText('needs to reach level 50');

    const evolveButton = page.locator('.evolve-section button.confirm-button');
    await expect(evolveButton).toBeDisabled();
    await expect(evolveButton).toContainText('Upgrade to Rebuilt form');
    await expect(page).toHaveScreenshot({
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('shows enabled upgrade button and upgrades on click', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 1000,
      recruitedCharacters: [{ id: 'Kapura', exp: LEVEL_51_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Kapura', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveButton = page.locator('.evolve-section button.confirm-button');
    await expect(evolveButton).toBeEnabled();

    await evolveButton.click();

    await expect(page).toHaveURL(/\/characters\/Kapura/);
    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });

  test('does not show upgrade button when stage already applied', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 5000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'Kapura', exp: LEVEL_51_EXP, stage: 'Rebuilt' }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/Kapura', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });
});

test.describe('Character Evolution - Bohrok to Bohrok Kal', () => {
  test('shows disabled evolve button when quest completed but level < 100', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 10000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'tahnok', exp: LEVEL_99_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/tahnok', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);
    await hideCanvas(page);

    const evolveSection = page.locator('.evolve-section');
    await expect(evolveSection).toContainText('5000 protodermis');
    await expect(evolveSection).toContainText('needs to reach level 100');

    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeDisabled();
    await expect(evolveButton).toContainText('Evolve to Tahnok Kal');
    await expect(page).toHaveScreenshot({
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('shows disabled button when level met but not enough protodermis', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 100,
      recruitedCharacters: [{ id: 'tahnok', exp: LEVEL_100_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/tahnok', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);
    await hideCanvas(page);

    const evolveSection = page.locator('.evolve-section');
    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeDisabled();
    await expect(evolveSection).toContainText('is ready to evolve');
    await expect(evolveSection).toContainText('more protodermis');
    await expect(page).toHaveScreenshot({
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('shows enabled evolve button and evolves when quest completed and level >= 100 with enough protodermis', async ({
    page,
  }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 5000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'tahnok', exp: LEVEL_100_EXP }],
      completedQuests: [NAMING_DAY_QUEST],
    });
    await goto(page, '/characters/tahnok', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    const evolveSection = page.locator('.evolve-section');
    const evolveButton = evolveSection.locator('button.confirm-button');
    await expect(evolveButton).toBeEnabled();
    await expect(evolveButton).toContainText('Evolve to Tahnok Kal');

    await evolveButton.click();

    await expect(page).toHaveURL(/\/characters\/tahnok_kal/);
    await expect(page.locator('.character-name')).toContainText('Tahnok Kal');
    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });

  test('does not show evolve button when naming day quest not completed', async ({ page }) => {
    await setupGameState(page, {
      ...INITIAL_GAME_STATE,
      protodermis: 10000,
      protodermisCap: 10000,
      recruitedCharacters: [{ id: 'tahnok', exp: LEVEL_100_EXP }],
      completedQuests: [],
    });
    await goto(page, '/characters/tahnok', { hideCanvasBeforeNav: true });
    await disableCSSAnimations(page);

    await expect(page.locator('.evolve-section')).not.toBeVisible();
  });
});
