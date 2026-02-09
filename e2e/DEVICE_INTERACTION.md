# Device-Specific Interactions in Tests

## Overview

Different devices require different interaction methods:

- **Desktop**: Hover interactions (mouse)
- **Mobile**: Tap interactions (touch)

## Helper Functions

### `deviceHover(locator, testInfo)`

Automatically chooses the correct interaction based on the device:

- Mobile projects: Uses `tap()`
- Desktop projects: Uses `hover()`

**Example:**

```typescript
import { test, expect } from '@playwright/test';
import { setupGameState, goto, deviceHover } from './helpers';

test('should interact with item', async ({ page }, testInfo) => {
  await setupGameState(page, GAME_STATE);
  await goto(page, '/inventory');

  const firstItem = page.locator('.inventory-item').first();

  // Automatically taps on mobile, hovers on desktop
  await deviceHover(firstItem, testInfo);

  await expect(page).toHaveScreenshot('item-interaction.png');
});
```

### `isMobile(testInfo)`

Check if the current test is running on a mobile device:

**Example:**

```typescript
test('should show different UI on mobile', async ({ page }, testInfo) => {
  await goto(page, '/page');

  if (isMobile(testInfo)) {
    // Mobile-specific assertions
    await expect(page.locator('.mobile-menu')).toBeVisible();
  } else {
    // Desktop-specific assertions
    await expect(page.locator('.desktop-nav')).toBeVisible();
  }
});
```

## Manual Conditional Logic

If you need more control, you can check the project name directly:

```typescript
test('custom interaction', async ({ page }, testInfo) => {
  const element = page.locator('.element');

  if (testInfo.project.name.includes('Mobile')) {
    // Mobile-specific interaction
    await element.tap();
    await element.tap(); // Double tap
  } else {
    // Desktop-specific interaction
    await element.hover();
    await element.click();
  }
});
```

## Project Names

The following project names are configured:

- `Desktop Chrome` - Desktop browser (1920x1080)
- `Mobile Chrome Portrait` - Mobile portrait (Pixel 7)
- `Mobile Chrome Landscape` - Mobile landscape (Pixel 7)

All projects with "Mobile" in the name are considered mobile devices.

## Best Practices

1. **Use `deviceHover()` for simple interactions** - Cleaner and more maintainable
2. **Use `isMobile()` for conditional logic** - More readable than checking project name
3. **Use manual checks for complex scenarios** - When you need fine-grained control
4. **Always pass `testInfo`** - Add it as the second parameter to your test function

## Common Patterns

### Hover/Tap then Screenshot

```typescript
test('item hover state', async ({ page }, testInfo) => {
  await goto(page, '/items');

  const item = page.locator('.item').first();
  await deviceHover(item, testInfo);

  await expect(page).toHaveScreenshot('item-hover.png');
});
```

### Multiple Items

```typescript
test('all items', async ({ page }, testInfo) => {
  await goto(page, '/items');

  const items = await page.locator('.item').all();

  for (const item of items) {
    await deviceHover(item, testInfo);
    await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
  }
});
```

### Conditional Assertions

```typescript
test('responsive layout', async ({ page }, testInfo) => {
  await goto(page, '/page');

  if (isMobile(testInfo)) {
    // Mobile: hamburger menu
    await expect(page.locator('.hamburger')).toBeVisible();
  } else {
    // Desktop: full navigation
    await expect(page.locator('.nav-bar')).toBeVisible();
  }

  await expect(page).toHaveScreenshot('layout.png');
});
```
