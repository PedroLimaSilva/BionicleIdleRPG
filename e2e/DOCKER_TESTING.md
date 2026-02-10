# Docker-Based E2E Testing

## Problem

Visual regression tests produce different screenshots on different operating systems due to:

- Font rendering differences between macOS and Linux
- WebGL/GPU rendering variations
- Browser rendering engine differences

Since our CI runs on **Ubuntu Linux** (GitHub Actions), but developers may use **macOS** locally, we need a way to generate consistent screenshots that match the CI environment.

**Note:** All tests use Chromium for consistency across all platforms.

## Solution

Use Docker to run Playwright tests in the same Linux environment as CI, ensuring pixel-perfect screenshot consistency.

## Setup

### Prerequisites

- Docker installed on your machine
- Docker Compose installed (usually comes with Docker Desktop)

### Quick Start

1. **Build the Docker image** (first time only, or after dependency changes):

   ```bash
   yarn test:e2e:docker:build
   ```

2. **Run tests in Docker** (matches CI environment):

   ```bash
   yarn test:e2e:docker
   ```

3. **Update snapshots in Docker** (when you need to regenerate reference screenshots):
   ```bash
   yarn test:e2e:docker:update
   ```

## How It Works

### Snapshot Directories

The project uses **different snapshot directories** based on the environment:

- **CI/Docker (Linux)**: `e2e/**/*-snapshots/` - Committed to git, used by CI
- **Local (macOS)**: `e2e/**/*-snapshots-local/` - Ignored by git, for local development

This is configured in `playwright.config.ts`:

```typescript
const isCI = !!process.env.CI || !!process.env.PLAYWRIGHT_DOCKER;
const snapshotPathTemplate = isCI
  ? '{testDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}'
  : '{testDir}/{testFileDir}/{testFileName}-snapshots-local/{arg}-{projectName}{ext}';
```

### Environment Detection

- `CI=true` - Set by GitHub Actions
- `PLAYWRIGHT_DOCKER=true` - Set in Docker container

When either is true, Playwright uses the CI snapshot directory.

## Workflow

### For Local Development (macOS)

```bash
# Run tests locally (uses local snapshots, may differ from CI)
yarn test:e2e

# View test report
yarn test:e2e:report
```

Local tests will use `*-snapshots-local/` directories which are ignored by git. This allows you to run tests locally without worrying about screenshot differences.

### For Updating CI Snapshots

When you need to update the reference screenshots that CI uses:

```bash
# 1. Build Docker image (if not already built)
yarn test:e2e:docker:build

# 2. Update snapshots in Docker (Linux environment)
yarn test:e2e:docker:update

# 3. Commit the updated snapshots
git add e2e/**/*-snapshots/
git commit -m "Update E2E snapshots"
```

### For Verifying CI Compatibility

Before pushing, verify your tests pass in the CI environment:

```bash
# Run tests in Docker (same as CI)
yarn test:e2e:docker
```

## Files

- `Dockerfile.playwright` - Docker image definition (matches CI environment)
- `docker-compose.playwright.yml` - Docker Compose configuration
- `playwright.config.ts` - Playwright config with environment-based snapshot paths
- `.gitignore` - Ignores local snapshots (`**/*-snapshots-local/`)

## Troubleshooting

### Docker build is slow / stuck at "Building playwright"

**This is normal on first build!** The build process:

1. Downloads Playwright base image (~1GB)
2. Installs all node dependencies
3. Installs Playwright browsers (chromium, webkit)

**First build can take 5-10 minutes.** Subsequent builds are much faster due to Docker layer caching.

**To monitor progress:**

```bash
# Build with verbose output
docker-compose -f docker-compose.playwright.yml build --progress=plain

# Or build separately to see all output
docker build -f Dockerfile.playwright -t bionicle-playwright .
```

**Speed up future builds:**

- Added `.dockerignore` to exclude unnecessary files
- Docker caches layers, so only changed files trigger rebuilds
- Keep `package.json` stable to reuse dependency layer

### Dev server not accessible from Docker

Make sure your dev server is running on the host:

```bash
# In a separate terminal
yarn dev
```

The Docker container uses `host.docker.internal` to access the host's localhost.

### Docker build fails

```bash
# Clean rebuild
docker-compose -f docker-compose.playwright.yml build --no-cache
```

### Snapshots still differ in CI

1. Make sure you updated snapshots using Docker:

   ```bash
   yarn test:e2e:docker:update
   ```

2. Verify the snapshots are in the correct directory (`*-snapshots/`, not `*-snapshots-local/`)

3. Make sure the snapshots are committed to git

### Tests pass locally but fail in CI

This is expected if you're running on macOS. Use Docker to match the CI environment:

```bash
yarn test:e2e:docker
```

## Best Practices

1. **Always use Docker for snapshot updates** - This ensures consistency with CI
2. **Run local tests freely** - Local snapshots are ignored, so test away on macOS
3. **Verify in Docker before pushing** - Run `yarn test:e2e:docker` to catch issues early
4. **Commit only CI snapshots** - Never commit `*-snapshots-local/` directories

## CI Configuration

The GitHub Actions workflow (`.github/workflows/main.yml`) automatically:

- Sets `CI=true` environment variable
- Runs on `ubuntu-latest`
- Uses the same Playwright version as Docker
- Compares against snapshots in `*-snapshots/` directories
