# Telemetry

The app includes a lightweight telemetry system powered by [PostHog](https://posthog.com) that sends a single session snapshot per browser session and captures uncaught errors. It tracks:

1. Which app version each user is running
2. A snapshot of their game state (progress, characters, quests, etc.)
3. Uncaught errors with stack traces (via PostHog Error Tracking)

Telemetry is **completely inert** until `VITE_PUBLIC_POSTHOG_KEY` is set at build time, and requires **explicit user consent** on first visit. When no key is configured, the consent prompt, Settings toggle, and privacy policy link are all hidden.

## Client-side behaviour

- On first visit (no `TELEMETRY_ENABLED` in localStorage) a consent prompt asks for permission
- The prompt links to `/privacy-policy` and is suppressed on that page so users can read it before deciding
- The user's choice is stored in localStorage and the prompt never reappears
- The Settings page has a "Send anonymous usage data" toggle (with privacy policy link) that reads/writes the same key
- PostHog is initialized with `opt_out_capturing_by_default: true` and only starts sending data after opt-in
- When enabled, one `game_session_snapshot` event is sent per browser session (tracked via `sessionStorage`)
- Uncaught errors are reported immediately (not limited to once per session) with the error message, stack trace, and game state snapshot
- Failures are silently swallowed — telemetry never affects gameplay

## Version string

The version displayed in Settings and sent in telemetry follows the format `<semver>+<commit hash>` (e.g. `0.1.0+a1b2c3d`). The semver comes from `package.json` and the commit hash is resolved at build time. Bump `package.json` version when cutting releases.

## Payload shape

Session and error events share the same property shape:

```typescript
{
  client_id?: string;          // random UUID, generated on consent, stored in localStorage
  app_version: string;         // e.g. "0.1.0+a1b2c3d" (semver + commit hash)
  game_state_version: number;  // CURRENT_GAME_STATE_VERSION (schema version)
  timestamp: string;           // ISO 8601
  game_state: PartialGameState; // same shape persisted to localStorage
  error_message?: string;      // present only in error reports
  error_stack?: string;        // present only in error reports
}
```

`client_id` is a random UUID generated via `crypto.randomUUID()` when the user opts in. It is stored in localStorage under `TELEMETRY_ID`, passed to PostHog via `identify()`, and included in every event to correlate sessions from the same browser. It is not linked to any personal information. Clearing site data removes it; a new one is generated only if the user opts in again.

`PartialGameState` includes: `version`, `protodermis`, `protodermisCap`, `collectedKrana`, `kraataCollection`, `rahkshi`, `recruitedCharacters`, `activeQuests`, `completedQuests`.

## Error reporting

Global `error` and `unhandledrejection` handlers are installed at startup (in `main.tsx` via `setupErrorReporting()`). When an uncaught error occurs:

1. The error message and stack trace are captured
2. The game state is read directly from localStorage (React may have crashed)
3. A report is sent immediately via PostHog's `captureException` — no once-per-session restriction
4. The report includes the same fields as a session report, plus `error_message` and `error_stack`

Error reports respect the same guards as session reports: they are only sent when PostHog is configured and the user has opted in.

## Configuring PostHog

Vite reads `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` from `.env` files or the shell environment at build time using `loadEnv()` in `vite.config.ts`.

| File / method                            | Scope                                      |
| ---------------------------------------- | ------------------------------------------ |
| `.env.production`                        | Production builds only (`yarn build`)      |
| `.env.local`                             | Local overrides (gitignored via `*.local`) |
| `.env`                                   | All modes                                  |
| `VITE_PUBLIC_POSTHOG_KEY=... yarn build` | One-off / CI builds                        |

Example `.env.production`:

```
VITE_PUBLIC_POSTHOG_KEY=phc_your_project_api_key
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Use `https://eu.i.posthog.com` for EU Cloud projects.

For local development, a `.env.local` with a dummy key makes the consent prompt and Settings toggle visible without sending real data.

### 1. Create a PostHog project

1. Sign up at [posthog.com](https://posthog.com) (free tier is sufficient for this use case)
2. Create a project and copy the **Project API Key** from Project Settings
3. Note your region (US or EU) for the host URL

### 2. Build with the key

```bash
VITE_PUBLIC_POSTHOG_KEY=phc_your_project_api_key yarn build
```

Or add the key to `.env.production` for persistent configuration.

### 3. Enable Error Tracking (optional but recommended)

In your PostHog project:

1. Go to **Error Tracking** in the sidebar
2. Enable exception autocapture if prompted
3. Upload source maps from production builds for readable stack traces (see [PostHog source maps docs](https://posthog.com/docs/error-tracking/upload-source-maps))

## Analyzing the data

PostHog provides built-in dashboards and querying — no custom backend or SQL required.

### Useful views

- **Events → `game_session_snapshot`**: filter and inspect session snapshots with game state properties
- **Error Tracking**: view grouped exceptions with stack traces
- **Trends**: chart sessions per `app_version`, average `protodermis`, completed quest counts, etc.
- **Persons**: correlate sessions by `client_id` (distinct ID)

### Example insights

- Sessions per app version: Trends chart on `game_session_snapshot`, breakdown by `app_version`
- Average protodermis by version: Trends on `game_state.protodermis` with breakdown by `app_version`
- Error rate after a release: Error Tracking filtered by `$exception` events, grouped by `app_version`

## Testing

### Unit tests

Tests in `src/services/telemetry.spec.ts` cover the telemetry service:

- Payload construction (version, timestamp, state)
- Fallback when `__APP_VERSION__` is undefined
- No-op when PostHog is not configured
- No-op when opted out
- Exactly-once-per-session guarantee
- PostHog opt-in/opt-out consent sync
- Error report deduplication behaviour (not deduplicated)
- Silent failure on capture errors

Run with `yarn test:ci`.

### E2E tests (Playwright)

The E2E helpers (`e2e/helpers.ts`) automatically dismiss the telemetry consent prompt by setting `TELEMETRY_ENABLED=false` in localStorage. Both `enableTestMode()` and `setupGameState()` do this, so no existing test is blocked by the consent modal.

To write a test that **explicitly verifies the consent flow**, skip the helpers and navigate directly:

```typescript
test('should show consent prompt on fresh state', async ({ page }) => {
  // Don't call enableTestMode() — leave TELEMETRY_ENABLED absent
  await page.goto('/BionicleIdleRPG/');
  await expect(page.locator('.consent-panel')).toBeVisible();
});
```

### Local development

Create a `.env.local` file in the project root (gitignored via `*.local`) with a dummy key so the consent prompt and Settings toggle are visible during development:

```
VITE_PUBLIC_POSTHOG_KEY=phc_local_dev_dummy
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Without this file (or any `VITE_PUBLIC_POSTHOG_KEY`), the consent prompt and Settings toggle are completely hidden.
