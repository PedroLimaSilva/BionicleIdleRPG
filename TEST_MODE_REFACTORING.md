# Test Mode Refactoring Summary

## Overview

Refactored the E2E test mode system from URL parameter-based to localStorage-based approach, and added Docker support for consistent cross-platform screenshot generation.

## Changes Made

### 1. Test Mode System (URL → localStorage)

**Before:**

- Test mode enabled via `?testMode=true` URL parameter
- Required custom navigation wrappers to preserve parameter across navigation
- Components: `TestModeLink`, `TestModeNavLink`, `useTestModeNavigate`

**After:**

- Test mode enabled via `localStorage.setItem('TEST_MODE', 'true')`
- Persists automatically across navigation
- Uses standard React Router components (`Link`, `NavLink`, `useNavigate`)

#### Files Modified:

**Core Utilities:**

- `src/utils/testMode.ts` - Updated `isTestMode()` to read from localStorage instead of URL

**Test Helpers:**

- `e2e/helpers.ts`:
  - Added `enableTestMode(page)` - Sets localStorage before page load
  - Updated `setupGameState(page, state)` - Auto-enables test mode
  - Renamed `gotoWithTestMode()` → `goto()` - Removed URL parameter logic

**React Components:**

- `src/components/NavBar/index.tsx` - Use `NavLink` instead of `TestModeNavLink`
- `src/pages/Recruitment/index.tsx` - Use `useNavigate` instead of `useTestModeNavigate`
- `src/pages/Battle/index.tsx` - Use `Link` and `useNavigate`
- `src/pages/CharacterDetail/index.tsx` - Use `Link`
- `src/pages/CharacterInventory/index.tsx` - Use `Link`

**Test Files:**

- `e2e/characters/recruitment.spec.ts`
- `e2e/characters/inventory.spec.ts`
- `e2e/characters/detail.spec.ts`
- `e2e/homepage.spec.ts`
- `e2e/settings.spec.ts`
- `e2e/battle/selector.spec.ts`
- `e2e/inventory.spec.ts`
- `e2e/quests.spec.ts`

All updated to use:

```typescript
await enableTestMode(page);
await goto(page, '/path');
// OR
await setupGameState(page, GAME_STATE); // Auto-enables test mode
await goto(page, '/path');
```

**Files Removed:**

- `src/components/TestModeLink.tsx`
- `src/components/TestModeNavLink.tsx`
- `src/hooks/useTestModeNavigate.tsx` (already deleted by user)

**Documentation:**

- `e2e/README.md` - Updated test mode documentation
- `PLAYWRIGHT_SETUP.md` - Updated implementation details

### 2. Docker Support for Cross-Platform Testing

**Problem:** Screenshots differ between macOS (local) and Linux (CI), causing test failures.

**Solution:** Docker-based testing that matches CI environment.

#### New Files:

- `Dockerfile.playwright` - Docker image matching CI environment
- `docker-compose.playwright.yml` - Docker Compose configuration
- `e2e/DOCKER_TESTING.md` - Comprehensive Docker testing guide

#### Modified Files:

**playwright.config.ts:**

- Added environment-based snapshot path configuration
- CI/Docker: Uses `*-snapshots/` (committed to git)
- Local: Uses `*-snapshots-local/` (ignored by git)

```typescript
const isCI = !!process.env.CI || !!process.env.PLAYWRIGHT_DOCKER;
const snapshotPathTemplate = isCI
  ? '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}'
  : '{testDir}/{testFileDir}/{testFileName}-snapshots-local/{arg}-{projectName}{ext}';
```

**.gitignore:**

- Added `**/*-snapshots-local/` to ignore local macOS snapshots

**package.json:**

- Added `test:e2e:docker` - Run tests in Docker
- Added `test:e2e:docker:update` - Update snapshots in Docker
- Added `test:e2e:docker:build` - Build Docker image

**e2e/README.md:**

- Added Docker testing section with quick commands

## Usage

### Local Development (macOS)

```bash
# Run tests locally (uses local snapshots)
yarn test:e2e

# Tests will use *-snapshots-local/ which are ignored by git
```

### Updating CI Snapshots

```bash
# 1. Build Docker image (first time or after dependency changes)
yarn test:e2e:docker:build

# 2. Update snapshots in Docker (Linux environment)
yarn test:e2e:docker:update

# 3. Commit the updated snapshots
git add e2e/**/*-snapshots/
git commit -m "Update E2E snapshots"
```

### Verifying CI Compatibility

```bash
# Run tests in Docker (same as CI)
yarn test:e2e:docker
```

## Benefits

### Test Mode Refactoring:

1. **Simpler code** - No custom navigation wrappers needed
2. **Better persistence** - localStorage survives page reloads and navigation
3. **Standard React Router** - Uses official components, easier to maintain
4. **Cleaner URLs** - No `?testMode=true` in URLs during tests

### Docker Support:

1. **Consistent screenshots** - Match CI environment exactly
2. **Local flexibility** - Run tests on macOS without worrying about differences
3. **Clear separation** - CI snapshots committed, local snapshots ignored
4. **Easy updates** - Simple commands to update CI snapshots

## Migration Notes

- All test mode navigation wrappers have been removed
- All tests updated to use new localStorage-based approach
- Documentation updated to reflect new system
- Docker setup ready for cross-platform consistency
