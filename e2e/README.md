# E2E Visual Regression Tests

This directory contains end-to-end (E2E) visual regression tests using Playwright.

## Overview

These tests validate the UI and prevent visual regressions by:
- Taking screenshots of key pages and components
- Comparing them against baseline snapshots
- Testing across multiple viewports (Desktop Chrome, Mobile Chrome Portrait/Landscape)

## Important: Docker for Consistent Screenshots

**⚠️ If you're on macOS and need to update snapshots for CI, use Docker!**

Screenshots differ between macOS and Linux (CI environment). See [DOCKER_TESTING.md](./DOCKER_TESTING.md) for details.

**Quick commands:**
```bash
# Update snapshots for CI (Linux/Docker)
yarn test:e2e:docker:update

# Run tests in CI environment (Linux/Docker)
yarn test:e2e:docker
```

## Running Tests

### Run all tests (headless)
```bash
yarn test:e2e
```

### Run tests with UI mode (interactive)
```bash
yarn test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
yarn test:e2e:headed
```

### Debug tests
```bash
yarn test:e2e:debug
```

### View test report
```bash
yarn test:e2e:report
```

## Updating Snapshots

When you make intentional UI changes, you'll need to update the baseline snapshots:

```bash
yarn test:e2e:update-snapshots
```

**Important:** Review the snapshot changes carefully before committing them to ensure they match your intended changes.

## Test Configuration

Tests are configured in `playwright.config.ts` with:

- **Desktop Chrome**: 1920x1080 viewport (Chromium engine)
- **Mobile Chrome Portrait**: Pixel 7 (default orientation, Chromium engine)
- **Mobile Chrome Landscape**: Pixel 7 landscape (851x393, Chromium engine)

**Note**: All tests use Chromium for consistency between local development and CI environments.

## Animation Handling

**Critical for preventing flaky tests!**

All 3D character models in this app have animations (idle animations, flavor animations, etc.). To prevent screenshots from being different on every frame, we use a **test mode** system:

### How It Works

1. **Test Mode localStorage**: Tests set `localStorage.setItem('TEST_MODE', 'true')` before navigation
2. **Animation Pausing**: When test mode is detected:
   - All Three.js animation mixers set `timeScale = 0` to pause animations
   - All idle animations are forced to `time = 0` and `paused = true` to ensure they're at frame 0
   - This guarantees consistent screenshots at exactly the same animation frame every time
3. **Persistence**: Test mode persists across navigation automatically via localStorage
4. **Helper Functions**:
   - Use `enableTestMode(page)` to enable test mode before navigation
   - Use `setupGameState(page, state)` which automatically enables test mode
   - Use `goto(page, '/path')` for navigation (test mode is already set via localStorage)

### Implementation Details

- **Test Mode Utilities** (`src/utils/testMode.ts`):
  - `isTestMode()` - Detects if `localStorage.getItem('TEST_MODE') === 'true'`
  - `getAnimationTimeScale()` - Returns 0 in test mode, 1 otherwise
  - `shouldDisableAnimations()` - Returns true in test mode
  - `setupAnimationForTestMode(action)` - Forces animation to frame 0 and pauses it in test mode

- **Test Helpers** (`e2e/helpers.ts`):
  - `enableTestMode(page)` - Sets localStorage flag before page load
  - `setupGameState(page, state)` - Sets game state and automatically enables test mode
  - `goto(page, path)` - Navigate to a path (test mode persists via localStorage)

- **Model Integration**: All character models (Toa, Matoran, Bohrok) call `setupAnimationForTestMode()` on their idle animations to ensure they're paused at frame 0
- **Animation Controller**: The `useAnimationController` hook also respects test mode and disables random flavor animations

### Example Usage

```typescript
import { enableTestMode, goto, setupGameState, waitForCanvas } from './helpers';

test('should render 3D scene', async ({ page }) => {
  await enableTestMode(page);
  await goto(page, '/characters');

  // Wait for specific elements instead of networkidle (better for mobile)
  await page.locator('.character-card').first().waitFor({ state: 'visible' });

  await waitForCanvas(page);
  await expect(page).toHaveScreenshot('scene.png');
});

// Or with game state (automatically enables test mode):
test('should render with custom state', async ({ page }) => {
  await setupGameState(page, { widgets: 1000, inventory: {} });
  await goto(page, '/characters');

  await expect(page).toHaveScreenshot('scene.png');
});
```

## Visual Regression Tolerance

Different test scenarios have different tolerance levels for pixel differences:

- **Standard UI**: `maxDiffPixels: 100-150` - Allows for minor rendering differences
- **Avatars/Images**: `maxDiffPixels: 200` - Higher tolerance for image compositing
- **3D Scenes**: `maxDiffPixels: 300, threshold: 0.2` - Moderate tolerance for WebGL rendering (animations are paused in test mode)

## Test Structure

- `homepage.spec.ts` - Homepage and navigation
- `recruitment.spec.ts` - Character recruitment page
- `character-inventory.spec.ts` - Character inventory and cards
- `3d-scene.spec.ts` - 3D character scenes (WebGL)
- `quests.spec.ts` - Quest page
- `inventory.spec.ts` - Inventory page
- `battle.spec.ts` - Battle selector and battle pages

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Pushes to master/main branches

Results are uploaded as artifacts in GitHub Actions.

## Troubleshooting

### Tests failing due to minor pixel differences

If tests fail with small pixel differences that are acceptable:
1. Review the diff images in the test report
2. If changes are intentional, update snapshots
3. If tolerance is too strict, adjust `maxDiffPixels` in the test

### WebGL rendering differences

3D scene tests may have inconsistent results across different machines due to GPU rendering differences. These tests have moderate tolerance thresholds. Mobile tests use Chrome (Chromium) for better WebGL consistency. **Note:** Animations are automatically paused in test mode to prevent flaky screenshots.

### Snapshots missing

On first run, Playwright will generate baseline snapshots. These should be committed to the repository.

## Best Practices

1. **Always use `gotoWithTestMode()`** - Never use `page.goto()` directly; always use the helper to ensure animations are paused
2. **Wait for specific elements, not networkidle** - Use `page.locator('.element').waitFor({ state: 'visible' })` instead of `page.waitForLoadState('networkidle')` for better mobile compatibility
3. **Review diffs carefully** - Always inspect visual changes before updating snapshots
4. **Test on multiple viewports** - Ensure responsive design works correctly
5. **Keep tests focused** - Each test should validate a specific page or component
6. **Use appropriate timeouts** - Wait for content to load before taking screenshots (use helper functions like `waitForCanvas()`)
7. **Set reasonable tolerances** - Balance between catching regressions and avoiding flaky tests

