# Device-Specific Interactions in Tests

## Overview

Main e2e tests run once on Desktop only. **Responsiveness tests** (`responsiveness.spec.ts`) explicitly test different viewports by calling `page.setViewportSize()` and use viewport-aware helpers for interactions.

- **Desktop** (width ≥ 768px): Hover interactions (mouse)
- **Mobile** (width < 768px): Tap interactions (touch)

## Responsiveness Tests

For tests that manually set viewport size, use `viewportAwareHover()`:

### `viewportAwareHover(locator, viewportWidth)`

Chooses tap vs hover based on viewport width:

```typescript
import { VIEWPORTS, viewportAwareHover } from './helpers';

test('inventory at mobile viewport', async ({ page }) => {
  await page.setViewportSize(VIEWPORTS.mobilePortrait);
  await goto(page, '/inventory');

  const item = page.locator('.inventory-item').first();
  await viewportAwareHover(item, VIEWPORTS.mobilePortrait.width);

  await expect(page).toHaveScreenshot('inventory-mobile.png');
});
```

### `VIEWPORTS` constant

Predefined viewport sizes for responsiveness tests:

- `VIEWPORTS.desktop` - 1920x1080
- `VIEWPORTS.mobilePortrait` - 412x915 (Pixel 7)
- `VIEWPORTS.mobileLandscape` - 851x393

## Main Tests (Desktop Only)

Main tests run only on Desktop. Use standard `locator.hover()` for hover interactions—no viewport checks needed.

## Legacy Helpers

`deviceHover(locator, testInfo)` and `isMobile(testInfo)` remain available for compatibility but are unused since we no longer run tests across multiple projects. Use `viewportAwareHover()` in responsiveness tests instead.
