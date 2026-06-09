# Architecture Roadmap

## Purpose

This document identifies technical debt, inconsistencies, and architectural improvements for the Bionicle Idle RPG project. It is organized by priority and impact, with clear acceptance criteria for each item.

**Important:** This roadmap describes _potential_ improvements. Items should only be implemented when explicitly prioritized and approved.

---

## Priority 2: Consistency Improvements (Low Risk)

### 2.1 Standardize User Feedback Mechanism ✅ Implemented

**Status:** Resolved. No `alert()` calls remain in the codebase.

**Implementation:**

- Successful recruitment shows `RecruitmentCelebration` (animated modal with 3D character reveal and element-colored particles).
- Insufficient protodermis disables the recruit button (`canRecruit` guard); `recruitMatoran` returns the prior state without side effects.

**Remaining gap (optional polish):** There is still no shared toast/activity-log system for other transient feedback (e.g. PWA update badge is the only toast-like UI). Consider a unified non-blocking feedback component if more surfaces need it.

---

### 2.2 Standardize Variable Naming Conventions

**Issue:** Inconsistent use of `CHARACTER_DEX` (snake_case) vs `matoranDex` (camelCase) for local variables.

**Locations:** Multiple files in `src/game/` and `src/services/`

**Recommendation:** Use camelCase consistently for local variables.

**Acceptance Criteria:**

- All local variables use camelCase
- No functional changes
- TypeScript compiles without errors

---

## Priority 3: Technical Debt (Medium Risk)

### 3.1 Add Save Migration System

**Issue:** Changing `CURRENT_GAME_STATE_VERSION` invalidates all saves when no version-step migration exists.

**Current behavior:**

- Version mismatch → reject save → load `INITIAL_GAME_STATE`
- Ad-hoc retrocompat in `loadGameState` (`src/services/gamePersistence.ts`) handles specific legacy shapes when the version still matches: `widgets` → `protodermis`, kraata in legacy `inventory` → `kraataCollection`, unrecognized job IDs cleared, and missing `customCharacters` / `collectedKrana` / `rahkshi` defaults filled in

**Recommendation:** Add explicit per-version migration functions so `CURRENT_GAME_STATE_VERSION` bumps can upgrade older saves instead of discarding them.

**Proposed approach:**

```typescript
type Migration = (oldState: any) => any;

const MIGRATIONS: Record<number, Migration> = {
  9: (state) => state, // v8 → v9
  10: (state) => ({ ...state, newField: defaultValue }), // v9 → v10
};

function migrateState(state: any, targetVersion: number): any {
  let current = state;
  for (let v = state.version + 1; v <= targetVersion; v++) {
    if (MIGRATIONS[v]) {
      current = MIGRATIONS[v](current);
      current.version = v;
    }
  }
  return current;
}
```

**Acceptance Criteria:**

- Old saves are migrated instead of discarded
- Migration failures fall back to initial state
- Each version bump includes a migration function

---

### 3.2 Add Quest Prerequisite Cycle Detection

**Issue:** No validation prevents circular quest dependencies.

**Current:** Assumes quest designers don't create cycles.

**Recommendation:** Add validation function that detects cycles in `unlockedAfter` chains.

**Proposed approach:**

```typescript
function detectQuestCycles(quests: Quest[]): string[] {
  // Implement topological sort or DFS cycle detection
  // Return array of quest IDs involved in cycles
}
```

**Acceptance Criteria:**

- Cycles are detected at build time or app initialization
- Error is logged with cycle details
- Development build fails if cycles exist

---

## Priority 4: Testing & Observability (Medium Risk)

### 4.1 Add Unit Tests for Game Logic

**Issue:** Minimal test coverage, especially for pure game logic functions.

**Current:** Unit tests exist across `src/game/` (e.g. `Levelling`, `Jobs`, `Quests`, `BattleRewards`, `Krana`, `CharacterEvolution`, `masks`, `nuvaSymbols`, `ProtodermisConversion`, `encounterVisibility`, `customMataBuild`) and `src/services/` (e.g. `combatUtils`, `maskPowers`, `maskPowerCooldowns`, `battleSimulation`, `gamePersistence`, `matoranUtils`, `customCharacterShare`). E2E coverage includes recruitment, quests, cutscenes, custom characters, battle flow, and character detail. Coverage is substantially improved but not yet comprehensive (e.g. some mask powers like Ruru/Matatu remain untested in combat).

**Recommendation:** Continue adding tests for critical game logic and combat edge cases:

- Remaining mask power implementations (`Ruru`, `Matatu`)
- Quest prerequisite validation (see 3.2)
- Integration paths for custom character share/recruit flows

**Acceptance Criteria:**

- Core game logic has >80% test coverage
- Tests run in CI/CD pipeline
- Tests verify invariants (e.g., exp never decreases, time flows forward)

---

## Priority 5: Code Quality (Low Risk)

### 5.1 Remove Commented Code ✅ Resolved

**Status:** The previously noted commented-out combatant-stats block in `CharacterDetail` has been removed. No other significant commented-out feature blocks are known in that file.

**Acceptance Criteria (ongoing):**

- No commented-out code remains when discovered
- If a feature is needed, create a task to implement it properly

---

### 5.2 Item System (Removed — Deferred)

**Issue:** A generic item/inventory economy was removed from the game.

**Current:** `ITEM_DICTIONARY`, `GameItemId`, and the generic `inventory` save field are gone. Collectibles use dedicated state (`collectedKrana`, `kraataCollection`, mask collection via quest progress). Legacy saves with `inventory` are migrated into `kraataCollection` on load.

**Recommendation:** Defer reintroducing items until a concrete quest-item mechanic is designed. If reintroduced, define a minimal type from scratch rather than reviving the old dictionary.

**Decision needed (when items return):**

- What item types will quest mechanics require?
- Should items be IDs in state or embedded in quest progress only?

**Acceptance Criteria (when reintroduced):**

- Item types and metadata are complete for every item in use, OR unused fields are removed from the type definition

---

### 5.3 Clarify Character Tags System

**Issue:** `MatoranTag` exists but has limited use in game logic.

**Current:**

- `MatoranTag.Custom` — used for player-created characters (creation, persistence, share tokens)
- `MatoranTag.ChroniclersCompany` — set on Chronicler's Company matoran in `src/data/dex/matoran.ts` but not referenced by quests, jobs, or combat

**Recommendation:** Either implement tag-based mechanics for story tags (e.g. Chronicler's Company quest requirements) or remove unused tag values.

**Decision needed:**

- Are tags planned for quest requirements or special abilities beyond custom characters?
- Should `ChroniclersCompany` drive a mechanic, or be removed as premature abstraction?

**Acceptance Criteria:**

- Story tags are used in at least one game mechanic, OR
- Unused tag values are removed from types and data

---

### 5.4 Standardize Timestamp Units

**Issue:** Mixed use of seconds and milliseconds creates conversion overhead.

**Current:**

- State stores milliseconds
- Quest durations defined in seconds
- `getCurrentTimestamp()` returns seconds

**Recommendation:** Standardize on milliseconds everywhere, convert only at display time.

**Acceptance Criteria:**

- All stored timestamps use milliseconds
- Quest durations stored in milliseconds
- Conversion to human-readable units happens only in UI

---

## Priority 6: Feature Completeness (High Risk)

### 6.1 Implement Cutscene System ✅ Implemented

**Status:** Cutscenes are implemented as a visual novel–style system. The `VisualNovelCutscene` component renders scripted dialogue sequences. Cutscene data lives in `src/data/cutscenes/` with scripts for MNOG, Bohrok Swarm, Bohrok Kal, Mask Hunt, and Mask of Light arcs.

---

### 6.2 Character Stage Transformation ✅ Implemented

**Status:** Evolution is implemented.

**Implementation:** Quest rewards can include an `evolution` field that maps participant dex IDs to evolved forms (e.g., Toa Mata → Toa Nuva). The `bohrok_evolve_toa_nuva` quest triggers this. Evolution replaces the character ID, drops mask overrides, and preserves EXP/assignment/quest.

---

### 6.3 Mask Hunt Unlock Pattern ✅ Documented

**Status:** Individual mask quests exist in `src/data/quests/mask_hunt.ts`; `masksCollected` in `src/services/matoranUtils.ts` maps quest IDs to masks per Toa. This is intentional, not an incomplete implementation.

**Unlock pattern (Toa Mata):**

- Each Toa starts with their story mask; additional masks unlock via named `maskhunt_*` quests (see the per-Toa `switch` in `masksCollected`).
- **`maskhunt_final_collection`** grants the full 12-mask set at once (shortcut for players who reach the finale).
- **`Rau` and `Ruru`** have no individual quest mapping — they are only included via `maskhunt_final_collection` (or the full-set shortcut). All other masks in `FULL_MASK_SET` have at least one individual quest path.

**Acceptance Criteria:** Met — pattern is documented here and encoded in `masksCollected` + quest data.

---

### 6.4 Custom Matoran Creation & Sharing ✅ Implemented

**Status:** Players can design custom Matoran (`/character-create`), recruit them for protodermis, persist them in `customCharacters`, and share/import via encoded tokens (`customCharacterShare` service). E2E coverage in `e2e/customCharacter.spec.ts`.

---

## Priority 7: Performance & Scalability (Low Priority)

### 7.1 Optimize Job Tick Interval

**Issue:** 5-second tick interval may cause unnecessary work with many characters.

**Current:** `useJobTickEffect` maps over every recruited character every 5 seconds. `applyJobExp` in `src/game/Jobs.ts` already no-ops for characters without an assignment (returns `[matoran, 0]` immediately), so idle characters incur only a cheap map iteration, not job math.

**Recommendation (optional micro-optimization):** Short-circuit at the map level — `if (!matoran.assignment) return matoran` — to avoid object spreads for idle characters when rosters are large.

**Acceptance Criteria:**

- Idle characters do no job exp/protodermis work (already true)
- Optional: map-level skip reduces allocations with 20+ characters
- No functional changes to job mechanics

---

### 7.2 Implement Lazy Loading for 3D Models

**Issue:** All character models loaded upfront, increasing initial load time.

**Current:** Models are preloaded in `preload.ts`.

**Recommendation:** Load models on-demand when character is viewed.

**Acceptance Criteria:**

- Models load only when needed
- Loading states are shown to user
- No regression in 3D rendering quality

---

### 7.3 Add Memoization for Expensive Computations

**Issue:** Some derived state may still recalculate more often than needed.

**Current:** Many surfaces already use `useMemo` (e.g. `CharacterDetail` tabs/mask info, `CharacterInventory` lists, `Quests` completed sections, `MaskCollection`, recruitment `canRecruit`). Other paths may still recompute on every render.

**Recommendation:** Audit remaining hot paths (quest availability filtering, job unlock status) and memoize where profiling shows cost.

**Acceptance Criteria:**

- Expensive computations are memoized where measured
- Dependencies are correctly specified
- No stale data issues

---

## Implementation Guidelines

### Before Starting Any Item:

1. **Get explicit approval** - Don't implement items from this roadmap without authorization
2. **Review dependencies** - Check if item depends on other roadmap items
3. **Check AGENT_GUIDELINES.md** - Ensure changes don't violate architectural rules
4. **Create a plan** - Outline specific files and changes needed
5. **Consider backward compatibility** - Will this break existing saves or features?

### During Implementation:

1. **Make incremental changes** - Small PRs are easier to review and safer to merge
2. **Test thoroughly** - Verify both new functionality and existing features
3. **Update documentation** - Keep AGENT_GUIDELINES.md in sync with changes
4. **Add tests** - Especially for bug fixes and new game logic

### After Implementation:

1. **Update this roadmap** - Mark items as complete or blocked
2. **Document decisions** - If you deviate from the plan, explain why
3. **Identify new issues** - Add newly discovered technical debt to roadmap

---

## Non-Goals

This roadmap does NOT include:

- **Major architectural rewrites** - The current architecture is sound
- **Framework migrations** - React, Vite, TypeScript are appropriate choices
- **State management library adoption** - Custom hooks pattern works well
- **Database integration** - localStorage is sufficient for this use case
- **Multiplayer features** - Out of scope for idle game
- **Mobile app conversion** - PWA support is adequate

---

## Maintenance Notes

**This document should be updated when:**

- New technical debt is discovered
- Roadmap items are completed
- Priorities change based on user feedback or business needs
- Architectural decisions are made that affect future work

**Review frequency:** Quarterly or after major feature releases

**Owner:** Project maintainer (update as needed)
