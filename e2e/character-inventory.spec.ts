import { test, expect } from '@playwright/test';
import { gotoWithTestMode, waitForCharacterCards } from './helpers';

test.describe('Character Inventory Page', () => {
  test('should display character inventory', async ({ page }) => {
    await gotoWithTestMode(page, '/characters');

    // Wait for character cards to be visible instead of networkidle
    await waitForCharacterCards(page);

    // Take a screenshot
    await expect(page).toHaveScreenshot('character-inventory.png', {
      fullPage: true,
      maxDiffPixels: 150,
    });
  });

  test('should display character cards with avatars', async ({ page }) => {
    await gotoWithTestMode(page, '/characters');

    // Wait for character cards to be visible
    await waitForCharacterCards(page);

    // Take screenshot
    await expect(page).toHaveScreenshot('character-cards.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});

