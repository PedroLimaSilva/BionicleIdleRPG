import { test, expect } from '@playwright/test';
import { goto, hideCanvas, INITIAL_GAME_STATE, setupGameState } from './helpers';

test.describe('Character Dex', () => {
  test('lists un-recruited characters and opens a 3D preview with mask and animation controls', async ({
    page,
  }) => {
    await setupGameState(page, INITIAL_GAME_STATE);
    await goto(page, '/test/dex', {
      hideCanvasBeforeNav: true,
      waitUntil: 'domcontentloaded',
    });
    await hideCanvas(page);

    await expect(page.getByRole('heading', { name: 'Character Dex' })).toBeVisible();
    await expect(page.getByTestId('dex-count')).toContainText('character');

    const tahuCard = page.locator('[data-character-id="Toa_Tahu"]');
    await expect(tahuCard).toBeVisible();
    await expect(tahuCard).toContainText('Toa Tahu');

    await page.getByLabel('Search characters').fill('nui');
    await expect(page.locator('[data-character-id="nui_rama"]')).toBeVisible();
    await expect(page.locator('[data-character-id="Toa_Tahu"]')).toHaveCount(0);

    await page.getByLabel('Search characters').fill('tahu');
    await expect(page.locator('[data-character-id="Toa_Tahu"]')).toBeVisible();
    await expect(page.locator('[data-character-id="Takua"]')).toHaveCount(0);

    await tahuCard.click();
    await expect(page.getByRole('heading', { exact: true, name: 'Toa Tahu' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Attack' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Defeat' })).toBeVisible();
    await expect(page.getByRole('switch', { name: 'Mask power' })).toHaveAttribute(
      'aria-checked',
      'false'
    );

    await page.getByRole('switch', { name: 'Mask power' }).click();
    await expect(page.getByRole('switch', { name: 'Mask power' })).toHaveAttribute(
      'aria-checked',
      'true'
    );

    await page.getByRole('option', { name: 'Kakama' }).click();
    await expect(page.getByRole('option', { name: 'Kakama' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.locator('.character-dex-mask-name')).toHaveText(/Mask of Speed/);

    await page.getByRole('button', { name: 'Attack' }).click();
    await page.getByRole('link', { name: 'All characters' }).click();
    await expect(page.getByRole('heading', { name: 'Character Dex' })).toBeVisible();
  });

  test('diminished preview exposes packed map toggles', async ({ page }) => {
    await setupGameState(page, INITIAL_GAME_STATE);
    await goto(page, '/test/dex/Jala', {
      hideCanvasBeforeNav: true,
      waitUntil: 'domcontentloaded',
    });
    await hideCanvas(page);

    await expect(page.getByRole('heading', { exact: true, name: 'Jala' })).toBeVisible();
    const discoloration = page.getByRole('switch', { name: 'Packed discoloration' });
    const roughness = page.getByRole('switch', { name: 'Packed roughness' });
    const metalness = page.getByRole('switch', { name: 'Packed metalness' });
    await expect(discoloration).toHaveAttribute('aria-checked', 'true');
    await expect(roughness).toHaveAttribute('aria-checked', 'true');
    await expect(metalness).toHaveAttribute('aria-checked', 'true');

    await roughness.click();
    await expect(roughness).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByText('Roughness off (flat slot roughness)')).toBeVisible();

    await metalness.click();
    await expect(metalness).toHaveAttribute('aria-checked', 'false');
    await discoloration.click();
    await expect(discoloration).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByText('Discoloration off (flat slot color)')).toBeVisible();
  });

  test('Tahu preview exposes packed map toggles on the skinned sheet', async ({ page }) => {
    await setupGameState(page, INITIAL_GAME_STATE);
    await goto(page, '/test/dex/Toa_Tahu', {
      hideCanvasBeforeNav: true,
      waitUntil: 'domcontentloaded',
    });
    await hideCanvas(page);

    await expect(page.getByRole('heading', { exact: true, name: 'Toa Tahu' })).toBeVisible();
    await expect(page.getByRole('switch', { name: 'Battle LOD mesh' })).toHaveCount(0);
    const discoloration = page.getByRole('switch', { name: 'Packed discoloration' });
    const roughness = page.getByRole('switch', { name: 'Packed roughness' });
    const metalness = page.getByRole('switch', { name: 'Packed metalness' });
    await expect(discoloration).toHaveAttribute('aria-checked', 'true');
    await expect(roughness).toHaveAttribute('aria-checked', 'true');
    await expect(metalness).toHaveAttribute('aria-checked', 'true');

    await roughness.click();
    await expect(roughness).toHaveAttribute('aria-checked', 'false');
    await expect(page.getByText('Roughness off (flat slot roughness)')).toBeVisible();
  });

  test('is reachable from Settings', async ({ page }) => {
    await setupGameState(page, INITIAL_GAME_STATE);
    await goto(page, '/settings', {
      hideCanvasBeforeNav: true,
      waitUntil: 'domcontentloaded',
    });
    await hideCanvas(page);

    await page.getByRole('link', { name: 'Character Dex' }).click();
    await expect(page.getByRole('heading', { name: 'Character Dex' })).toBeVisible();
  });
});
