# Save Migration & Persistence Plan

This document describes the planned evolution of game save/load from a single `localStorage` JSON blob to a versioned, quota-safe persistence layer.

**Tracking:** [#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333) (Phase A), [#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331) (Phase B). Do not implement without explicit approval.

---

## Problem Statement

### 1. Version bumps wipe saves

`loadGameState` rejects any save whose `version` does not exactly match `CURRENT_GAME_STATE_VERSION`. Bumping the version without a migration path resets all players to `INITIAL_GAME_STATE`.

Ad-hoc retrocompat already exists in `src/services/gamePersistence.ts`, but only when the version still matches: `widgets` → `protodermis`, legacy `inventory` → `kraataCollection`, unrecognized job IDs cleared, and missing `customCharacters` / `collectedKrana` / `rahkshi` defaults filled in.

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

## Two Layers of Migration

These solve different problems. Both may be needed.

| Layer | What changes | Mechanism |
| --- | --- | --- |
| **Document shape** | Rename fields, add defaults, reshape arrays in saved game data | `MIGRATIONS` registry keyed by `GameState.version` |
| **Storage layout** | Move from one blob to multiple stores/tables | Dexie (or IndexedDB) schema version + upgrade handlers |

Dexie's `.version(n).upgrade()` migrates **database schema** (object stores, indexes). It does **not** automatically evolve `GameState` JSON. Even with Dexie, application-level document migrations are required when persisted fields change.

A single-blob Dexie table has the same full-rewrite problem as `localStorage`. Granular writes require a **split store** design.

---

## Phased Implementation

### Phase A — Near term (localStorage, low risk)

Implement before or independently of IndexedDB. Storage-agnostic; remains valid if Phase B uses the same migration registry.

1. **Version migration system** (`src/services/saveMigrations.ts` or equivalent)

   ```typescript
   type Migration = (state: Record<string, unknown>) => Record<string, unknown>;

   const MIGRATIONS: Record<number, Migration> = {
     10: (state) => ({ ...state, newField: defaultValue }),
   };

   function migrateState(
     state: Record<string, unknown>,
     targetVersion: number
   ): Record<string, unknown> {
     let current = { ...state };
     const from = typeof current.version === 'number' ? current.version : 0;
     for (let v = from + 1; v <= targetVersion; v++) {
       if (MIGRATIONS[v]) {
         current = MIGRATIONS[v](current);
         current.version = v;
       }
     }
     return current;
   }
   ```

   - Fold existing ad-hoc retrocompat into numbered steps where possible, or treat current version as baseline and migrate forward only.
   - Change validation to accept `version <= CURRENT_GAME_STATE_VERSION` after migration, not strict equality before.
   - On migration failure: log, fall back to `INITIAL_GAME_STATE`.

2. **Quota error handling**

   - Wrap `localStorage.setItem` in try/catch in `useGamePersistence`.
   - Surface a user-visible warning (e.g. toast or modal): save failed, export/back up if possible.

3. **Debounced save**

   - Debounce persistence writes (e.g. 2–5 s) so job ticks do not write 12×/minute.
   - Flush on `beforeunload` / `visibilitychange` where appropriate.

4. **Custom character hygiene** (product decision)

   - Remove dismissed buyable customs from `customCharacters` when the player dismisses them.
   - Optional soft cap with UX warning before hard block.

Acceptance criteria: see [#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333).

---

### Phase B — Medium term (IndexedDB via Dexie)

Move game save data off `localStorage`. Keep settings keys (`DEBUG_MODE`, `TELEMETRY_ENABLED`, etc.) on `localStorage` unless there is reason to consolidate.

#### Proposed schema

```typescript
db.version(1).stores({
  meta: 'key',              // protodermis, version, quest lists, kraata, rahkshi, caps, …
  recruited: 'id',          // RecruitedCharacterData per row
  customCharacters: 'id',   // BaseMatoran per row
});
```

**Load path (async):**

1. Read all tables from IndexedDB.
2. Run document migrations on assembled state (`migrateState` using `meta.version`).
3. Apply existing sanitizers (job ID cleanup, defaults).
4. Apply offline job exp (`applyOfflineJobExp`).
5. Hydrate React state via `useGameLogic` (requires initial loading state before `GameProvider` renders children).

**Save path (granular):**

| Event | Write |
| --- | --- |
| Job tick / exp change | `db.recruited.update(id, { exp, assignment })` — one row |
| Custom character create/import | `db.customCharacters.put(base)` — one row |
| Custom character dismiss | `db.customCharacters.delete(id)` |
| Quest complete, protodermis, kraata, etc. | `db.meta.put(...)` — small cold blob |
| Version bump after migration | Update `meta.version` |

In-memory React state can continue to update the full `recruitedCharacters` array on tick; the persistence layer diffs by `id` or receives explicit patch calls from the tick path.

#### Migration from localStorage

On first load after deploy:

1. If IndexedDB is empty and `localStorage` has `GAME_STATE`, import blob into split stores.
2. Set a one-time flag in `meta` (e.g. `importedFromLocalStorage: true`).
3. Optionally clear or retain `localStorage` key for rollback during transition.

Document migrations run on the assembled state regardless of import path.

Acceptance criteria: see [#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331).

---

## Options Considered

| Option | Pros | Cons | Verdict |
| --- | --- | --- | --- |
| **A only: migrations + debounce on localStorage** | Small diff, no dependency | Quota ceiling; still rewrites full blob | Good stopgap; insufficient long-term for unbounded customs |
| **Split localStorage keys** | Partial writes without IndexedDB | Shared ~5 MB quota; still synchronous `JSON.stringify` | Middle ground; defer if committing to Dexie |
| **Dexie single blob** | Async, more quota | Same rewrite problem | Not recommended |
| **Dexie split stores (Phase B)** | Quota, row-level writes, async | Refactor load/save, async hydration, new dependency | **Recommended** for long-term |
| **Raw IndexedDB** | No dependency | More boilerplate than Dexie | Dexie preferred for ergonomics |

---

## Save Size Estimates

| Scenario | Approx. size |
| --- | --- |
| Normal play (~20 recruits, ~5 customs) | 30–80 KB |
| Heavy collector (~100 customs, full kraata) | 200–500 KB |
| Share-link hoarder (2000+ customs) | 2–5+ MB — `localStorage` danger zone |

The primary growth vector is `customCharacters`, not recruited character count.

---

## Files Affected (when implemented)

| Phase | Files |
| --- | --- |
| A | `src/services/saveMigrations.ts` (new), `src/services/gamePersistence.ts`, `src/hooks/useGamePersistence.tsx`, `src/services/gamePersistence.spec.ts`, `AGENT_GUIDELINES.md` |
| B | Above plus `src/services/gameDatabase.ts` (new), `src/hooks/useGameLogic.tsx` (async load), `e2e/helpers.ts`, `package.json` (dexie), test setup for IndexedDB |

---

## Related tracking

- **GitHub [#333](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/333)** — Phase A (localStorage migrations and hardening)
- **GitHub [#331](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/331)** — Phase B (IndexedDB split stores)
- **ARCHITECTURE_ROADMAP.md** — backlog index
- **AGENT_GUIDELINES.md** — persistence rules (`PartialGameState`, version matching, never bump version without migration)

---

## Decision Log

| Date | Decision |
| --- | --- |
| 2026-06-09 | Adopt two-phase plan: Phase A (migrations + localStorage hardening) then Phase B (Dexie split stores). Document migrations required regardless of storage backend. Single-blob Dexie is not sufficient for granular writes. |
