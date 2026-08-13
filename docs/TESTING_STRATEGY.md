# Testing Strategy

Guidance for keeping the test suite fast, stable, and meaningful. Complements [e2e/README.md](../e2e/README.md), [e2e/DOCKER_TESTING.md](../e2e/DOCKER_TESTING.md), and domain-specific notes such as [COMBAT_TEST_COVERAGE.md](./COMBAT_TEST_COVERAGE.md).

---

## Goals

1. **Catch real regressions** in game logic, UI flows, and 3D rendering.
2. **Minimize flakiness** — especially around WebGL, async model loading, and animations.
3. **Keep CI predictable** — bounded runtimes, Linux-consistent snapshots, clear failure signals.

---

## Test pyramid

| Layer               | Tool                                | What to test                                               | Stability                      |
| ------------------- | ----------------------------------- | ---------------------------------------------------------- | ------------------------------ |
| **Unit**            | Jest (`yarn test:ci`)               | Pure game logic, services, material/kit rules, persistence | High — no GPU                  |
| **E2E (UI)**        | Playwright (`yarn test:e2e:app`)    | Navigation, forms, quest/evolution flows, DOM state        | High when canvas is hidden     |
| **E2E (3D visual)** | Playwright (`yarn test:e2e:models`) | Every character model loads and renders correctly          | Lower — WebGL pixel comparison |

**Rule of thumb:** push correctness down the pyramid. Assert behavior in Jest when pixels are not the point.

---

## Unit tests (Jest)

### Scope

- `src/game/` — combat, quests, leveling, masks, kit nodes, evolution rules
- `src/services/` — persistence, battle simulation, utilities
- `src/hooks/*.spec.ts` — material prep, animation helpers (Three objects, no WebGL context)
- `src/pages/Battle/arenas/*.spec.ts` — arena recolor/GLB utilities

### Patterns

- Keep game logic pure (see [AGENT_GUIDELINES.md](../AGENT_GUIDELINES.md)).
- Test **rules and outputs**, not implementation details.
- For 3D-adjacent logic (mask materials, kit palettes, disk attachments), instantiate Three objects in Node and assert properties — no canvas required.

### When to add a unit test

- New quest unlock conditions, combat formulas, or persistence migrations.
- New mask/kit/material rules that would be painful to verify via screenshot.
- Bug fixes — add a regression test at the lowest layer that can express the invariant.

---

## E2E tests (Playwright)

Playwright is split into two **projects** (see `playwright.config.ts`):

| Project                 | Command                | CI job       | Notes                                                                   |
| ----------------------- | ---------------------- | ------------ | ----------------------------------------------------------------------- |
| `Desktop Chrome`        | `yarn test:e2e:app`    | `e2e-app`    | All specs except `modelRendering.spec.ts`; dev server; parallel workers |
| `Desktop Chrome Models` | `yarn test:e2e:models` | `e2e-models` | Canvas golden masters only; production `preview` server; one worker     |

`yarn test:e2e` still runs both projects locally.

### UI / flow tests (preferred default)

For pages where 3D is decorative or unrelated to the assertion:

1. `setupGameState(page, state)` — enables `TEST_MODE`.
2. `goto(page, path, { hideCanvasBeforeNav: true })` — avoids WebGL blocking navigation.
3. `hideCanvas(page)` — skip GPU work entirely.
4. Assert **DOM state** (`toBeVisible`, `toHaveClass`, `toHaveText`, `data-testid`).
5. Optional **full-page screenshot** for 2D chrome only (evolution panels, modals, settings).

Examples: `evolution.spec.ts`, `recruitment.spec.ts` (celebration modal), `quests.spec.ts`.

### 3D model rendering tests

File: `e2e/characters/detail/modelRendering.spec.ts`

**Coverage:** every recruitable / rahkshi model variant must load without error and match a baseline canvas snapshot.

**Improvements in use (do not regress):**

| Technique                                          | Why                                                                                              |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Canvas-only screenshots** (`#canvas-mount`)      | Avoids font/layout noise; only capture when the canvas is visible (detail routes, not inventory) |
| **Serial suites** (`serialCharacterModelSuite.ts`) | One cold boot per group; client-side inventory navigation between models                         |
| **`waitForCharacterModelReady`**                   | Gates on `[TEST_MODE] model ready` console signal, not fixed sleeps                              |
| **`TEST_MODE` disables bloom/shadows**             | Reduces post-processing timing variance (`src/utils/testMode.ts`)                                |
| **SwiftShader in CI**                              | Software WebGL for consistent headless Chromium (`playwright.config.ts`)                         |
| **Production preview in models job**               | Pre-bundled assets; faster per-test load than Vite dev server                                    |

**Do not reduce model count** — the value is verifying that _all_ models load. Optimize _how_ they are tested (serial navigation, canvas crop, split CI job), not _whether_ they are tested.

#### Serial suite pattern

```typescript
defineSerialCharacterModelSuite({
  suiteName: 'Toa Characters',
  characterIds: ['Toa_Gali', 'Toa_Kopaka' /* … */],
  inventoryTab: 'toa',
  buildGameState: (ids) => ({ ...INITIAL_GAME_STATE, recruitedCharacters: recruited(ids) }),
});
```

- `test.describe.configure({ mode: 'serial' })` + shared `page` in `beforeAll`.
- First character: cold `goto`; subsequent: `navigateToCharacterViaInventory` (no reload).
- One-off game states (mask overrides, quest flags) use `captureCharacterModelScreenshot` with a full reload.

### Snapshot tolerances

| Content                                  | `maxDiffPixels` | `threshold` |
| ---------------------------------------- | --------------- | ----------- |
| Standard UI                              | 100–150         | default     |
| Images / avatars                         | 200             | default     |
| 3D canvas (`CHARACTER_MODEL_SCREENSHOT`) | 300             | 0.2         |

Tolerances are a safety valve, not a substitute for deterministic setup. Prefer fixing waits and test-mode flags before widening thresholds.

---

## Test mode (`TEST_MODE`)

Enabled via `localStorage` before navigation (`setupGameState`, `enableTestMode`).

| Behavior                                     | Purpose                                              |
| -------------------------------------------- | ---------------------------------------------------- |
| Animation `timeScale = 0`, paused at frame 0 | Same pose every screenshot                           |
| Bloom / selective post-processing off        | No frame-to-frame glow variance                      |
| Real-time shadows off                        | Stable lighting                                      |
| `[TEST_MODE] model ready` console log        | Playwright sync point after kit/mask materials apply |

`maybeBlockSlowExternalFonts` aborts Google Font requests **only in Docker** (`PLAYWRIGHT_DOCKER`) where outbound network is unavailable. GitHub Actions CI keeps real fonts so UI snapshots match committed baselines.

### Environment

- GitHub Actions runs on **ubuntu-latest** with `CI=true`.
- Snapshots live in `e2e/**/*-snapshots/` (committed).
- Local macOS runs use `*-snapshots-local/` (gitignored).

### CI jobs

| Job          | What runs                                                              |
| ------------ | ---------------------------------------------------------------------- |
| `test`       | Lint, format, Jest                                                     |
| `e2e-app`    | `yarn test:e2e:app` — fast UI/regression specs                         |
| `e2e-models` | `yarn build` + `yarn test:e2e:models` — all character canvas snapshots |
| `build`      | Production build (after all tests pass)                                |

`e2e-app` and `e2e-models` run **in parallel** so slow WebGL work does not block UI feedback.

### Updating snapshots

**Always update model snapshots in a Linux environment:**

```bash
# Preferred: Docker (matches CI; avoids Colima bind-mount issues)
yarn test:e2e:docker:build
yarn test:e2e:docker:models:update

# Alternative: Linux host / cloud agent with production preview
yarn build
CI=true E2E_USE_PREVIEW=true yarn test:e2e:models:update-snapshots
```

`scripts/run-playwright-docker.sh` builds the app, copies sources into the container (avoids stale Colima mounts), runs Playwright against `yarn preview`, and copies snapshots back.

### Before merging visual changes

1. Review diff images in the Playwright HTML report — not just green CI.
2. Commit only `*-snapshots/`, never `*-snapshots-local/`.
3. Run `yarn test:e2e:docker:models` (or the Linux commands above) before push.

---

## What we are not doing (and why)

### Migrating to Babylon.js for testing

Babylon has strong engine-level visual tests (`NullEngine`, Playwright harness), but our flakiness comes from **full-app E2E + WebGL screenshots**, not from Three.js specifically. A renderer swap would not remove the need for test mode, canvas crops, or Linux snapshot discipline.

### Replacing model screenshots with fewer tests

Every named character must still have a canvas golden master — serial navigation and canvas-only captures make that affordable without dropping coverage.

### Pixel-testing game logic

Quest requirements, combat outcomes, and inventory rules belong in Jest. E2E should confirm the player _sees_ the right UI state, not re-derive formulas.

---

## Future improvements (optional)

1. **More `data-testid` hooks** — reduce reliance on CSS class selectors in flow tests.
2. **Expand unit coverage** for kit attachment and mask discoloration shaders (logic without GPU).
3. **Document per-spec canvas policy** — which specs hide canvas vs capture it (table in `e2e/README.md`).

---

## Quick reference

| Task                            | Command                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Unit tests                      | `yarn test:ci`                                                                     |
| All E2E (local)                 | `yarn test:e2e`                                                                    |
| App/UI E2E only                 | `yarn test:e2e:app`                                                                |
| Model canvas E2E only           | `yarn test:e2e:models`                                                             |
| E2E in Docker (all)             | `yarn test:e2e:docker`                                                             |
| E2E models in Docker            | `yarn test:e2e:docker:models`                                                      |
| Update model snapshots (Docker) | `yarn test:e2e:docker:models:update`                                               |
| Update model snapshots (Linux)  | `yarn build && CI=true E2E_USE_PREVIEW=true yarn test:e2e:models:update-snapshots` |
| Lint                            | `yarn lint`                                                                        |
