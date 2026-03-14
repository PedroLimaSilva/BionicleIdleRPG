# Telemetry

The app includes a lightweight, zero-dependency telemetry system that sends a single POST beacon per browser session. It tracks:

1. Which app version each user is running
2. A snapshot of their game state (progress, characters, quests, etc.)

Telemetry is **completely inert** until `VITE_TELEMETRY_URL` is set at build time, and requires **explicit user consent** on first visit.

## Client-side behaviour

- On first visit (no `TELEMETRY_ENABLED` in localStorage) a consent prompt asks for permission
- The user's choice is stored in localStorage and the prompt never reappears
- The Settings page has a "Send anonymous usage data" toggle that reads/writes the same key
- When enabled, one beacon is sent per browser session (tracked via `sessionStorage`)
- Uses `navigator.sendBeacon` with a `fetch` fallback (`keepalive: true`)
- Failures are silently swallowed — telemetry never affects gameplay

## Payload shape

```typescript
{
  appVersion: string; // e.g. "0.1.0+a1b2c3d" (semver + commit hash)
  gameStateVersion: number; // CURRENT_GAME_STATE_VERSION (schema version)
  timestamp: string; // ISO 8601
  gameState: PartialGameState; // same shape persisted to localStorage
}
```

`PartialGameState` includes: `version`, `protodermis`, `protodermisCap`, `collectedKrana`, `kraataCollection`, `rahkshi`, `recruitedCharacters`, `activeQuests`, `completedQuests`.

## Backend setup: Supabase (recommended)

Supabase's free tier (500 MB database, 500K edge function invocations/month) is more than enough for this use case.

### 1. Create the table

Run in the Supabase SQL Editor:

```sql
create table telemetry_sessions (
  id          bigint generated always as identity primary key,
  received_at timestamptz not null default now(),
  app_version text        not null,
  game_state_version int  not null,
  client_timestamp   timestamptz not null,
  game_state  jsonb       not null
);

create index idx_telemetry_app_version on telemetry_sessions (app_version);
create index idx_telemetry_received_at on telemetry_sessions (received_at);
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
