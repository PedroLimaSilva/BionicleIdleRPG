# Device-Specific Interactions in Tests

## Overview

Main e2e tests run once on Desktop only. **Responsiveness tests** (`responsiveness.spec.ts`) explicitly test different viewports by calling `page.setViewportSize()` and use viewport-aware helpers for interactions.

- **Desktop** (width ≥ 768px): Hover interactions (mouse)
- **Mobile** (width < 768px): Click interactions (Desktop Chrome lacks touch; click simulates tap for tooltips/dropdowns)

## Responsiveness Tests

### `VIEWPORTS` constant

Predefined viewport sizes for responsiveness tests:

- `VIEWPORTS.desktop` - 1920x1080
- `VIEWPORTS.mobilePortrait` - 412x915 (Pixel 7)
- `VIEWPORTS.mobileLandscape` - 851x393

## Main Tests (Desktop Only)

Main tests run only on Desktop. Use standard `locator.hover()` for hover interactions—no viewport checks needed.
