# Playwright Visual Testing Setup - Complete ✅

## Summary

Successfully set up Playwright for visual regression testing of your Bionicle Idle RPG Three.js application!

## What Was Installed

- **@playwright/test** v1.58.0
- **Chromium** browser (for all testing)

## Test Configuration

### Browsers & Viewports

Tests run across 3 different configurations:

1. **Desktop Chrome** - 1920x1080 viewport (Chromium engine)
2. **Mobile Chrome Portrait** - Pixel 7 (Chromium engine)
3. **Mobile Chrome Landscape** - Pixel 7 landscape (851x393, Chromium engine)

**Why Chromium everywhere?** Ensures consistency between local development (macOS) and CI (Linux).

### Test Coverage

Created 7 test files covering all major pages:

- ✅ `homepage.spec.ts` - Homepage and navigation bar
- ✅ `recruitment.spec.ts` - Character recruitment page with avatars
- ✅ `character-inventory.spec.ts` - Character inventory and cards
- ✅ `3d-scene.spec.ts` - 3D character scenes (WebGL rendering)
- ✅ `quests.spec.ts` - Quest page
- ✅ `inventory.spec.ts` - Inventory page
- ✅ `battle.spec.ts` - Battle selector and battle pages

**Total: 39 tests** (13 tests × 3 viewports)

## Available Commands

```bash
# Run all tests (headless)
yarn test:e2e

# Run tests with interactive UI
yarn test:e2e:ui

# Run tests in headed mode (see browser)
yarn test:e2e:headed

# Debug tests step-by-step
yarn test:e2e:debug

# View HTML test report
yarn test:e2e:report

# Update baseline snapshots (after intentional UI changes)
yarn test:e2e:update-snapshots
```

## How Visual Regression Testing Works

1. **First Run**: Playwright captures baseline screenshots
2. **Subsequent Runs**: New screenshots are compared against baselines
3. **Differences Detected**: Tests fail if visual changes exceed tolerance thresholds
4. **Review & Update**: Review diffs, then update baselines if changes are intentional

## Animation Handling ⚠️ Important!

**Problem**: 3D character models have animations that would cause different screenshots on every frame, leading to flaky tests.

**Solution**: Test Mode System

- All tests set `localStorage.setItem('TEST_MODE', 'true')` before navigation
- When detected, all Three.js animation mixers pause (set `timeScale = 0`)
- All idle animations are forced to `time = 0` and `paused = true` to ensure they're at frame 0
- Test mode persists across all navigation automatically via localStorage
- This ensures consistent screenshots at exactly the same animation frame every time

**Implementation**:

- Use `enableTestMode(page)` helper before navigation to set localStorage flag
- Use `setupGameState(page, state)` which automatically enables test mode
- Use `goto(page, '/path')` for navigation (test mode persists via localStorage)
- All character models automatically detect test mode and call `setupAnimationForTestMode()` on their idle animations
- See `src/utils/testMode.ts` and `e2e/helpers.ts` for the implementation

## Tolerance Levels

Different components have different tolerance for pixel differences:

- **Standard UI**: 100-150 pixels - For text, buttons, layouts
- **Images/Avatars**: 200 pixels - For composited images
- **3D Scenes**: 300 pixels (20% threshold) - For WebGL rendering (animations paused in test mode)

## CI/CD Integration

✅ Added to GitHub Actions workflow (`.github/workflows/main.yml`)

Tests run automatically on:

- Pull requests
- Pushes to master/main branches

Results are uploaded as artifacts for 30 days.

## Next Steps

### 1. Generate Baseline Snapshots

Run tests for the first time to create baseline snapshots:

```bash
yarn test:e2e
```

This will create snapshot images in `e2e/**/*-snapshots/` directories.

### 2. Commit Snapshots

Commit the generated snapshots to your repository:

```bash
git add e2e
git commit -m "Add Playwright visual regression test baselines"
```

### 3. Test the Workflow

Make a small UI change and run tests to see visual regression detection in action:

```bash
yarn test:e2e
```

### 4. Review Test Reports

If tests fail, view the HTML report to see visual diffs:

```bash
yarn test:e2e:report
```

## Files Created/Modified

### New Files

- `playwright.config.ts` - Playwright configuration
- `e2e/homepage.spec.ts` - Homepage tests
- `e2e/characters/recruitment.spec.ts` - Recruitment page tests
- `e2e/characters/inventory.spec.ts` - Character inventory tests
- `e2e/characters/detail.spec.ts` - Character detail tests
- `e2e/quests.spec.ts` - Quest page tests
- `e2e/inventory.spec.ts` - Inventory page tests
- `e2e/battle/selector.spec.ts` - Battle selector tests
- `e2e/helpers.ts` - Test helper utilities (includes `enableTestMode()`, `setupGameState()`, `goto()`)
- `e2e/README.md` - E2E testing documentation
- `src/utils/testMode.ts` - Test mode detection and animation control utilities (localStorage-based)

### Modified Files

- `package.json` - Added Playwright scripts
- `.gitignore` - Added Playwright artifacts
- `.github/workflows/main.yml` - Added E2E test job
- `src/hooks/useAnimationController.tsx` - Added test mode support
- All Toa model components - Added animation pausing in test mode
- `BohrokModel.tsx` - Added animation pausing in test mode
- All navigation components - Removed test mode wrappers, now use standard React Router components

## Best Practices

1. **Always use `gotoWithTestMode()`** - This is critical for preventing flaky tests due to animations
2. **Run tests before committing** - Catch visual regressions early
3. **Review diffs carefully** - Don't blindly update snapshots
4. **Test on multiple viewports** - Ensure responsive design works
5. **Use appropriate tolerances** - Balance strictness vs. flakiness
6. **Keep tests focused** - One page/component per test file

## Troubleshooting

### Tests fail with minor pixel differences

- Review the diff in the HTML report
- If acceptable, update snapshots: `yarn test:e2e:update-snapshots`

### WebGL tests are flaky

- **Animations are now paused in test mode** - This should eliminate most flakiness
- 3D scene tests have moderate tolerance due to GPU rendering variations
- Mobile tests use Chrome (Chromium) for better WebGL consistency
- Make sure all tests use `gotoWithTestMode()` helper

### Snapshots differ between machines

- This is normal for WebGL content
- CI/CD will use consistent environment
- Local snapshots may differ slightly from CI

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Visual Comparisons Guide](https://playwright.dev/docs/test-snapshots)
- [E2E Testing Best Practices](https://playwright.dev/docs/best-practices)
- `e2e/README.md` - Detailed E2E testing guide

---

**Setup Complete!** 🎉 You now have comprehensive visual regression testing for your Three.js application.
