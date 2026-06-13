# Save Migration & Persistence Plan

This document describes the planned evolution of game save/load from a single `localStorage` JSON blob to a versioned, quota-safe persistence layer.

**Tracking:** [#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333) (Phase A — **implemented**), [#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331) (Phase B — **implemented**).

---

## Problem Statement

### 1. Version bumps wipe saves

`loadGameStateAsync` accepts only saves whose `version` exactly matches `CURRENT_GAME_STATE_VERSION` (currently 9). Bumping the version without a deliberate migration strategy resets non-matching players to `INITIAL_GAME_STATE`.

On load, current-version saves are sanitized (unrecognized job IDs cleared, orphaned custom recruits removed) and optional fields receive defaults when missing.

### 2. Unbounded custom characters with no quota safety

`customCharacters` has no cap. Each entry is a full `BaseMatoran` (~300–500 bytes JSON). Share-link imports can add indefinitely. Dismissed buyable customs may remain in the array.

`localStorage.setItem` throws `QuotaExceededError` at roughly 5 MB per origin (browser-dependent). `useGamePersistence` has no try/catch — failed writes fail silently and the next reload loads stale or initial state.

### 3. Full save rewrite on every job tick

`useJobTickEffect` updates `recruitedCharacters` every 5 seconds. `useGamePersistence` then `JSON.stringify`s the **entire** `PartialGameState` — including all `customCharacters`, kraata, quests, and rahkshi — even when only one character's `exp` changed.

---

## Goals

1. **Versioned migrations** — bump `CURRENT_GAME_STATE_VERSION` without discarding old saves.
2. **Quota headroom** — support large custom-character collections without silent data loss.
3. **Granular writes** — persist exp/assignment changes without re-serializing cold data (custom characters, quest history, etc.).
4. **Preserve architecture** — `GameState` remains the in-memory single source of truth; `useGame()` API unchanged; only the persistence service layer changes.

## Non-Goals

- Backend or cloud sync
- Changing React state management (hooks / `useGameLogic` composition)
- Normalizing in-memory `GameState` into relational slices at the hook layer
- Replacing separate `localStorage` keys for settings (`DEBUG_MODE`, telemetry consent, etc.) unless there is a clear benefit

---

## Migration scope

| Layer              | What changes                          | Mechanism                                           |
| ------------------ | ------------------------------------- | --------------------------------------------------- |
| **Storage layout** | Move from one blob to split stores    | Dexie schema upgrade + one-time `localStorage` import |
| **Document shape** | Field renames / version bumps         | **Not supported** — baseline is v9 localStorage shape |

Dexie's `.version(n).upgrade()` migrates **database schema** (object stores, indexes). Application-level per-version document migrations were removed; only the `localStorage` → IndexedDB import remains.

---

## Phased Implementation

### Phase A — Near term (localStorage, low risk) ✅ Implemented

Implemented in `src/services/gamePersistence.ts`, `src/hooks/useGamePersistence.tsx`, and `src/components/SaveErrorBanner/`.

- Debounced saves with quota error surfacing via `SaveErrorBanner`
- Strict v9 save validation with load-time sanitizers (jobs, orphaned customs)
- Optional-field defaults for current-version documents

Acceptance criteria ([#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333)):

- [x] `QuotaExceededError` is caught and surfaced via `SaveErrorBanner`
- [x] Saves are debounced during idle job ticks (3 s; immediate in `TEST_MODE`; flush on tab hide / unload)
- [x] Dismissed buyable customs are removed from `customCharacters` (existing `dismissCustomCharacter` behavior)
- [x] Non-matching save versions fall back to `INITIAL_GAME_STATE`

---

### Phase B — Medium term (IndexedDB via Dexie) ✅ Implemented

Implemented in `src/services/gameDatabase.ts` with async hydration in `GameProvider`, granular writes from `useGamePersistence`, and one-time import from the legacy `localStorage` blob.

#### Proposed schema

```typescript
db.version(2).stores({
  game: 'key', // flattened: protodermis, version, quest lists, kraata, rahkshi, caps, …
  recruited: 'id', // RecruitedCharacterData per row
  customCharacters: 'id', // BaseMatoran per row
});
```

Each cold field is stored as `{ key, value }` so protodermis ticks update only the `protodermis` row.

**Load path (async):**

1. Read all tables from IndexedDB.
2. Run load-time sanitizers on assembled state (job ID cleanup, orphaned customs, optional defaults).
3. Apply offline job exp (`applyOfflineJobExp`).
4. Hydrate React state via `useGameLogic` (requires initial loading state before `GameProvider` renders children).

**Save path (granular):**

| Event                                     | Write                                                    |
| ----------------------------------------- | -------------------------------------------------------- |
| Job tick / exp change                     | `db.recruited.update(id, { exp, assignment })` — one row |
| Custom character create/import            | `db.customCharacters.put(base)` — one row                |
| Custom character dismiss                  | `db.customCharacters.delete(id)`                         |
| Quest complete, protodermis, kraata, etc. | `db.game.put({ key, value })` — only changed fields |
| Version bump after migration              | Update `game.version` row                               |

In-memory React state can continue to update the full `recruitedCharacters` array on tick; the persistence layer diffs by `id` or receives explicit patch calls from the tick path.

#### Migration from localStorage

On first load after deploy:

1. If IndexedDB is empty and `localStorage` has `GAME_STATE`, import blob into split stores.
2. Set a one-time flag in `game.importedFromLocalStorage`.
3. Delete the legacy `localStorage` blob (retained when `E2E_FORCE_GAME_STATE_IMPORT` is set for Playwright).

Load-time sanitizers run on the assembled state regardless of import path.

Acceptance criteria ([#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331)):

- [x] `localStorage` saves import into IndexedDB split stores (`importFromLocalStorageIfNeeded`)
- [x] Job tick persists only changed recruited-character rows (`writeGranularGameStateToDatabase`)
- [x] Load is async with loading state (`GameProvider` gate — no flash of initial state for valid saves)
- [x] Tests and E2E helpers updated for IndexedDB (`fake-indexeddb`, `readPersistedGameState`)

---

## Options Considered

| Option                                            | Pros                             | Cons                                                   | Verdict                                                    |
| ------------------------------------------------- | -------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| **A only: migrations + debounce on localStorage** | Small diff, no dependency        | Quota ceiling; still rewrites full blob                | Good stopgap; insufficient long-term for unbounded customs |
| **Split localStorage keys**                       | Partial writes without IndexedDB | Shared ~5 MB quota; still synchronous `JSON.stringify` | Middle ground; defer if committing to Dexie                |
| **Dexie single blob**                             | Async, more quota                | Same rewrite problem                                   | Not recommended                                            |
| **Dexie split stores (Phase B)**                  | Quota, row-level writes, async   | Refactor load/save, async hydration, new dependency    | **Recommended** for long-term                              |
| **Raw IndexedDB**                                 | No dependency                    | More boilerplate than Dexie                            | Dexie preferred for ergonomics                             |

---

## Save Size Estimates

| Scenario                                    | Approx. size                         |
| ------------------------------------------- | ------------------------------------ |
| Normal play (~20 recruits, ~5 customs)      | 30–80 KB                             |
| Heavy collector (~100 customs, full kraata) | 200–500 KB                           |
| Share-link hoarder (2000+ customs)          | 2–5+ MB — `localStorage` danger zone |

The primary growth vector is `customCharacters`, not recruited character count.

---

## Files Affected

| Phase    | Files                                                                                                                                                                                                                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A (done) | `src/services/gamePersistence.ts`, `src/hooks/useGamePersistence.tsx`, `src/components/SaveErrorBanner/`, `src/services/gamePersistence.spec.ts`, `src/hooks/useGamePersistence.spec.tsx`, `AGENT_GUIDELINES.md` |
| B (done) | `src/services/gameDatabase.ts`, `src/context/Game.tsx`, `src/hooks/useGameLogic.tsx`, `e2e/helpers.ts`, `package.json` (dexie), `src/setupTests.ts` (fake-indexeddb), `src/services/gameDatabase.spec.ts`                                                                                 |

---

## Related tracking

- **GitHub [#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333)** — Phase A (localStorage migrations and hardening)
- **GitHub [#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331)** — Phase B (IndexedDB split stores)
- **ARCHITECTURE_ROADMAP.md** — backlog index
- **AGENT_GUIDELINES.md** — persistence rules (`PartialGameState`, strict version matching)

---

## Decision Log

| Date       | Decision                                                                                                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-06-09 | Adopt two-phase plan: Phase A (migrations + localStorage hardening) then Phase B (Dexie split stores). Document migrations required regardless of storage backend. Single-blob Dexie is not sufficient for granular writes. |
| 2026-06-12 | Phase A shipped: `saveMigrations.ts`, debounced `useGamePersistence`, `saveGameState` quota handling, `SaveErrorBanner`.                                                                                                    |
| 2026-06-12 | Phase B shipped: Dexie split stores (`game`, `recruited`, `customCharacters`), async `loadGameStateAsync`, granular saves, E2E IndexedDB helpers.                                                                           |
| 2026-06-12 | Dropped per-version document migrations and legacy kraata `inventory` support. Baseline is v9 localStorage shape; only `localStorage` → IndexedDB import remains. |
