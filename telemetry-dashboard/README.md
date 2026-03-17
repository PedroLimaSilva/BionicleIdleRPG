# Bionicle Idle RPG — Telemetry Dashboard

Analytics dashboard for [Bionicle Idle RPG](https://github.com/PedroLimaSilva/BionicleIdleRPG). Reads telemetry data from Supabase and visualizes version adoption, player progression, and error reports.

## Data source

The game client sends a single telemetry beacon per browser session (plus immediate error reports) to a Supabase Edge Function, which inserts rows into a `telemetry_sessions` table. See the game repo's [`docs/TELEMETRY.md`](https://github.com/PedroLimaSilva/BionicleIdleRPG/blob/master/docs/TELEMETRY.md) for full details on the collection pipeline.

### Table schema

```sql
create table telemetry_sessions (
  id                 bigint generated always as identity primary key,
  received_at        timestamptz not null default now(),
  client_id          text,
  app_version        text        not null,
  game_state_version int         not null,
  client_timestamp   timestamptz not null,
  game_state         jsonb       not null,
  error_message      text,
  error_stack        text
);
```

### Payload fields

| Field | Type | Description |
|-------|------|-------------|
| `client_id` | `text` | Random UUID generated on user consent. Correlates sessions from the same browser. Not PII. |
| `app_version` | `text` | Semver + commit hash, e.g. `0.1.0+a1b2c3d` |
| `game_state_version` | `int` | Internal schema version (`CURRENT_GAME_STATE_VERSION`) |
| `client_timestamp` | `timestamptz` | When the client sent the report (ISO 8601) |
| `game_state` | `jsonb` | Snapshot of the persisted game state (see below) |
| `error_message` | `text` | Error message (null for session reports) |
| `error_stack` | `text` | Stack trace (null for session reports) |

### Game state snapshot (`game_state` JSONB)

| Key | Type | Description |
|-----|------|-------------|
| `version` | `number` | Same as `game_state_version` |
| `protodermis` | `number` | Current currency balance |
| `protodermisCap` | `number` | Maximum currency capacity |
| `recruitedCharacters` | `array` | Each entry has `id`, `exp`, optional `assignment` (job + rate + timestamp), optional `maskOverride`, optional `quest` |
| `completedQuests` | `string[]` | IDs of completed quests |
| `activeQuests` | `array` | Each entry has `questId`, `assignedMatoran`, `startedAt`, `endsAt` |
| `collectedKrana` | `object` | `{ element: [kranaId, ...] }` |
| `kraataCollection` | `object` | `{ power: { stage: count } }` |
| `rahkshi` | `array` | Rahkshi armor entries with `id`, `power`, `status`, optional `kraata` |

### Report types

- **Session reports** — one per browser session. Contain the full game state snapshot. No `error_message`.
- **Error reports** — sent immediately on uncaught errors. Contain the error message, stack trace, and a game state snapshot read from localStorage (React may have crashed). `error_message` is non-null.

## Setup

### Prerequisites

- Node.js v20+
- A Supabase project with the `telemetry_sessions` table (see schema above)

### Install

```bash
yarn install
```

### Configure

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

The anon key is safe to use here — configure Row Level Security (RLS) on the `telemetry_sessions` table to restrict access:

```sql
-- Allow read-only access via anon key (for the dashboard)
alter table telemetry_sessions enable row level security;

create policy "Allow anonymous read"
  on telemetry_sessions for select
  using (true);
```

The edge function uses the service role key for inserts, so the anon key only needs SELECT.

### Run

```bash
yarn dev
```

Opens at `http://localhost:5173`.

### Build

```bash
yarn build
```

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages).

## Dashboard pages

### Overview

- **Stat cards**: total sessions, unique clients, error count, avg quests completed, avg protodermis, avg recruited characters
- **Sessions by version**: pie chart showing version distribution
- **Sessions per day**: line chart of daily session volume
- **Quest completion distribution**: bar chart of how many quests players have completed

### Sessions

Sortable table of all recent sessions showing timestamp, version, client ID (truncated), protodermis, character count, quest count, and error indicator.

### Errors

Expandable list of error reports. Each entry shows version, timestamp, and error message. Expanding reveals client ID, game state summary, and the full stack trace.

## Useful SQL queries

These can be run in the Supabase SQL Editor for ad-hoc analysis beyond what the dashboard shows:

```sql
-- Unique clients per version
select app_version, count(distinct client_id) as clients
from telemetry_sessions
where error_message is null
group by app_version order by clients desc;

-- Most common errors
select error_message, count(*) as occurrences
from telemetry_sessions
where error_message is not null
group by error_message order by occurrences desc
limit 20;

-- Player progression over time (per client)
select client_id,
       received_at::date as day,
       (game_state->>'protodermis')::int as proto,
       jsonb_array_length(game_state->'completedQuests') as quests,
       jsonb_array_length(game_state->'recruitedCharacters') as characters
from telemetry_sessions
where client_id is not null and error_message is null
order by client_id, received_at;

-- Sessions with most characters
select client_id, app_version,
       jsonb_array_length(game_state->'recruitedCharacters') as characters,
       jsonb_array_length(game_state->'completedQuests') as quests
from telemetry_sessions
where error_message is null
order by characters desc limit 20;
```

## Tech stack

- **Vite** + **React** + **TypeScript**
- **Recharts** for charts
- **@supabase/supabase-js** for data fetching
- **React Router** for navigation
