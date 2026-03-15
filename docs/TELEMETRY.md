# Telemetry

The app includes a lightweight, zero-dependency telemetry system that sends a single POST beacon per browser session. It tracks:

1. Which app version each user is running
2. A snapshot of their game state (progress, characters, quests, etc.)

Telemetry is **completely inert** until `VITE_TELEMETRY_URL` is set at build time, and requires **explicit user consent** on first visit. When no URL is configured, the consent prompt, Settings toggle, and privacy policy link are all hidden.

## Client-side behaviour

- On first visit (no `TELEMETRY_ENABLED` in localStorage) a consent prompt asks for permission
- The prompt links to `/privacy-policy` and is suppressed on that page so users can read it before deciding
- The user's choice is stored in localStorage and the prompt never reappears
- The Settings page has a "Send anonymous usage data" toggle (with privacy policy link) that reads/writes the same key
- When enabled, one beacon is sent per browser session (tracked via `sessionStorage`)
- Uses `navigator.sendBeacon` with a `fetch` fallback (`keepalive: true`)
- Failures are silently swallowed — telemetry never affects gameplay

## Version string

The version displayed in Settings and sent in telemetry follows the format `<semver>+<commit hash>` (e.g. `0.1.0+a1b2c3d`). The semver comes from `package.json` and the commit hash is resolved at build time. Bump `package.json` version when cutting releases.

## Payload shape

```typescript
{
  clientId?: string; // random UUID, generated on consent, stored in localStorage
  appVersion: string; // e.g. "0.1.0+a1b2c3d" (semver + commit hash)
  gameStateVersion: number; // CURRENT_GAME_STATE_VERSION (schema version)
  timestamp: string; // ISO 8601
  gameState: PartialGameState; // same shape persisted to localStorage
}
```

`clientId` is a random UUID generated via `crypto.randomUUID()` when the user opts in. It is stored in localStorage under `TELEMETRY_ID` and included in every report to correlate sessions from the same browser. It is not linked to any personal information. Clearing site data removes it; a new one is generated only if the user opts in again.

`PartialGameState` includes: `version`, `protodermis`, `protodermisCap`, `collectedKrana`, `kraataCollection`, `rahkshi`, `recruitedCharacters`, `activeQuests`, `completedQuests`.

## Configuring the telemetry URL

Vite reads `VITE_TELEMETRY_URL` from `.env` files or the shell environment at build time using `loadEnv()` in `vite.config.ts`.

| File / method                       | Scope                                      |
| ----------------------------------- | ------------------------------------------ |
| `.env.production`                   | Production builds only (`yarn build`)      |
| `.env.local`                        | Local overrides (gitignored via `*.local`) |
| `.env`                              | All modes                                  |
| `VITE_TELEMETRY_URL=... yarn build` | One-off / CI builds                        |

Example `.env.production`:

```
VITE_TELEMETRY_URL=https://<project-ref>.supabase.co/functions/v1/telemetry-ingest
```

For local development, a `.env.local` with a dummy URL makes the consent prompt and Settings toggle visible without sending real data.

## Backend setup: Supabase (recommended)

Supabase's free tier (500 MB database, 500K edge function invocations/month) is more than enough for this use case.

### 1. Create the table

Run in the Supabase SQL Editor:

```sql
create table telemetry_sessions (
  id          bigint generated always as identity primary key,
  received_at timestamptz not null default now(),
  client_id   text,
  app_version text        not null,
  game_state_version int  not null,
  client_timestamp   timestamptz not null,
  game_state  jsonb       not null
);

create index idx_telemetry_app_version on telemetry_sessions (app_version);
create index idx_telemetry_received_at on telemetry_sessions (received_at);
create index idx_telemetry_client_id on telemetry_sessions (client_id);
```

### 2. Create an Edge Function

```bash
supabase functions new telemetry-ingest
```

Replace `supabase/functions/telemetry-ingest/index.ts` with:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { error } = await supabase.from('telemetry_sessions').insert({
      client_id: body.clientId ?? null,
      app_version: body.appVersion,
      game_state_version: body.gameStateVersion,
      client_timestamp: body.timestamp,
      game_state: body.gameState,
    });

    if (error) {
      console.error('Insert error:', error);
      return new Response('Error', { status: 500, headers: corsHeaders });
    }

    return new Response('OK', { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error('Handler error:', e);
    return new Response('Error', { status: 500, headers: corsHeaders });
  }
});
```

Deploy:

```bash
supabase functions deploy telemetry-ingest --no-verify-jwt
```

`--no-verify-jwt` is required because `sendBeacon` cannot set auth headers. The function authenticates server-side with the service role key.

### 3. Build with the URL

```bash
VITE_TELEMETRY_URL=https://<project-ref>.supabase.co/functions/v1/telemetry-ingest yarn build
```

Or add it to `.env.production` for persistent configuration.

## Alternative backends

The client simply POSTs JSON to a URL, so any backend that accepts a POST works:

| Option                                    | Cost                           | Notes                                     |
| ----------------------------------------- | ------------------------------ | ----------------------------------------- |
| **Supabase** (Edge Function + Postgres)   | Free tier                      | Recommended; structured queries via JSONB |
| **Cloudflare Worker + D1**                | Free tier (100K req/day, 5 GB) | Very low latency; SQL queries on D1       |
| **Google Apps Script → Sheets**           | Free                           | Zero infrastructure; limited query power  |
| **Vercel Serverless Function + Postgres** | Free tier                      | Good if already on Vercel                 |
| **Self-hosted** (any HTTP server + DB)    | Varies                         | Full control                              |

## Analyzing the data

### SQL queries (Supabase SQL Editor)

```sql
-- Sessions per version
select app_version, count(*) as sessions
from telemetry_sessions
group by app_version
order by sessions desc;

-- Sessions per day
select date_trunc('day', received_at) as day, count(*)
from telemetry_sessions
group by day order by day;

-- Average protodermis by version
select app_version,
       avg((game_state->>'protodermis')::numeric) as avg_proto,
       avg(jsonb_array_length(game_state->'completedQuests')) as avg_quests
from telemetry_sessions
group by app_version;

-- Distribution of completed quest counts
select jsonb_array_length(game_state->'completedQuests') as quest_count,
       count(*) as sessions
from telemetry_sessions
group by quest_count order by quest_count;
```

### Separate analytics frontend

For a proper dashboard, build a standalone app (separate repo):

- **Vite + React + Recharts** (or Chart.js) for charts
- **`@supabase/supabase-js`** client with a read-only key to query `telemetry_sessions`
- Deploy on Vercel / Netlify / Cloudflare Pages for free

Since the volume is low (one row per user per session), direct table queries work fine without any aggregation pipeline.

### No-code alternatives

- **Metabase** or **Grafana**: connect to Supabase's direct Postgres connection string and build dashboards with zero code
- **Supabase SQL Editor**: ad-hoc queries whenever needed

## Testing

### Unit tests

8 tests in `src/services/telemetry.spec.ts` cover the telemetry service:

- Payload construction (version, timestamp, state)
- Fallback when `__APP_VERSION__` is undefined
- No-op when URL is empty
- No-op when opted out
- Exactly-once-per-session guarantee
- Correct beacon URL
- `fetch` fallback when `sendBeacon` is unavailable
- Silent failure on network errors

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

Create a `.env.local` file in the project root (gitignored via `*.local`) with a dummy URL so the consent prompt and Settings toggle are visible during development:

```
VITE_TELEMETRY_URL=http://localhost:3001/telemetry
```

Without this file (or any `VITE_TELEMETRY_URL`), the consent prompt and Settings toggle are completely hidden.
