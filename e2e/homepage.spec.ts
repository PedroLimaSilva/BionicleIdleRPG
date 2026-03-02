import { test, expect } from '@playwright/test';
import { enableTestMode, goto } from './helpers';

test.describe('Homepage', () => {
  test('should display quests page as homepage', async ({ page }) => {
    await enableTestMode(page);
    await goto(page, '/');

    // Homepage is now the quests page
    await expect(page.locator('h2.quests-page__title').first()).toContainText('Ongoing Quests');
  });
});
