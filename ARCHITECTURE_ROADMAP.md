# Architecture Roadmap

## Purpose

This document identifies technical debt, inconsistencies, and architectural improvements for the Bionicle Idle RPG project. It is organized by priority and impact, with clear acceptance criteria for each item.

**Important:** This roadmap describes *potential* improvements. Items should only be implemented when explicitly prioritized and approved.

---

## Priority 2: Consistency Improvements (Low Risk)

### 2.1 Standardize User Feedback Mechanism

**Issue:** Mixed use of `alert()` and activity log for user feedback.

**Current locations:**
- `src/services/matoranUtils.ts` - uses `alert()` for insufficient widgets
- `src/pages/Recruitment/index.tsx` - uses `alert()` for successful recruitment

**Recommendation:** Replace `alert()` calls with proper UI feedback (toast notifications or activity log).

**Acceptance Criteria:**
- No `alert()` calls remain in codebase
- User feedback is visible and non-blocking
- Feedback is consistent across all actions

---

### 2.2 Standardize Variable Naming Conventions

**Issue:** Inconsistent use of `matoran_dex` (snake_case) vs `matoranDex` (camelCase) for local variables.

**Locations:** Multiple files in `src/game/` and `src/services/`

**Recommendation:** Use camelCase consistently for local variables.

**Acceptance Criteria:**
- All local variables use camelCase
- No functional changes
- TypeScript compiles without errors

---

## Priority 3: Technical Debt (Medium Risk)

### 3.1 Add Save Migration System

**Issue:** Changing `CURRENT_GAME_STATE_VERSION` invalidates all saves with no migration path.

**Current behavior:** Version mismatch → reject save → load `INITIAL_GAME_STATE`

**Recommendation:** Implement migration functions for version upgrades.

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

### 3.2 Implement Inventory Validation

**Issue:** No runtime validation prevents negative inventory values.

**Current:** Relies on correct implementation of all inventory mutations.

**Recommendation:** Add validation in `addToInventory` utility.

**Proposed approach:**
```typescript
export function addToInventory(
  inventory: Inventory,
  item: GameItemId,
  amount: number
): Inventory {
  const newAmount = (inventory[item] || 0) + amount;
  if (newAmount < 0) {
    console.error(`Attempted to set ${item} to negative value: ${newAmount}`);
    return inventory; // or throw error
  }
  return {
    ...inventory,
    [item]: newAmount,
  };
}
```

**Acceptance Criteria:**
- Negative inventory values are prevented
- Error is logged when attempted
- Existing functionality is preserved

---

### 3.3 Add Quest Prerequisite Cycle Detection

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

**Current:** Only `combatUtils.spec.ts` exists.

**Recommendation:** Add tests for critical game logic in `src/game/`:
- `Levelling.ts` - exp calculations
- `Jobs.ts` - productivity modifiers, offline progress, reward rolling
- `Quests.ts` - quest availability filtering

**Acceptance Criteria:**
- Core game logic has >80% test coverage
- Tests run in CI/CD pipeline
- Tests verify invariants (e.g., exp never decreases, time flows forward)

---

### 4.2 Add Activity Log Retention Policy

**Issue:** Activity logs accumulate indefinitely with no pruning.

**Current:** Logs are ephemeral (not persisted) but grow unbounded during session.

**Recommendation:** Implement automatic pruning (e.g., keep last 100 entries or last 24 hours).

**Proposed approach:**
```typescript
const MAX_LOG_ENTRIES = 100;

function pruneActivityLog(log: ActivityLogEntry[]): ActivityLogEntry[] {
  if (log.length <= MAX_LOG_ENTRIES) return log;
  return log.slice(-MAX_LOG_ENTRIES);
}
```

**Acceptance Criteria:**
- Log size is bounded
- Oldest entries are removed first
- No memory leaks during long sessions

---

### 4.3 Add Development-Only Invariant Checks

**Issue:** Invariants are documented but not enforced at runtime.

**Recommendation:** Add development-mode assertions for critical invariants.

**Examples:**
```typescript
// In development only
if (process.env.NODE_ENV === 'development') {
  // Check single assignment invariant
  const hasConflict = character.assignment && character.quest;
  if (hasConflict) {
    console.error('Invariant violation: character has both job and quest', character);
  }

  // Check inventory non-negative
  Object.entries(inventory).forEach(([item, amount]) => {
    if (amount < 0) {
      console.error('Invariant violation: negative inventory', item, amount);
    }
  });
}
```

**Acceptance Criteria:**
- Assertions run in development mode only
- No performance impact in production
- Violations are logged with context

---

## Priority 5: Code Quality (Low Risk)

### 5.1 Remove Commented Code

**Issue:** Commented code suggests incomplete features or abandoned approaches.

**Locations:**
- `src/pages/CharacterDetail/index.tsx` lines 65-67 (combatant stats)

**Recommendation:** Either implement the feature or remove the comment.

**Acceptance Criteria:**
- No commented-out code remains
- If feature is needed, create a task to implement it properly

---

### 5.2 Populate Missing Item Metadata

**Issue:** Item fields like `rarity`, `value`, `description`, `icon` are mostly unpopulated.

**Current:** Fields exist in type but are undefined in `ITEM_DICTIONARY`.

**Recommendation:** Either populate the fields or remove them from the type.

**Decision needed:**
- Are these fields planned for future features?
- Should they be removed to reduce confusion?

**Acceptance Criteria:**
- All items have complete metadata, OR
- Unused fields are removed from type definition

---

### 5.3 Clarify Character Tags System

**Issue:** `MatoranTag` enum exists with only one value (`ChroniclersCompany`), but tags aren't used in game logic.

**Current:** Tags are defined but not referenced in quests, jobs, or combat.

**Recommendation:** Either implement tag-based mechanics or remove the system.

**Decision needed:**
- Are tags planned for quest requirements or special abilities?
- Should the system be removed as premature abstraction?

**Acceptance Criteria:**
- Tags are used in at least one game mechanic, OR
- Tag system is removed from types and data

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

### 6.1 Implement Cutscene System

**Issue:** Quests have `cutscene` field (YouTube video IDs) but no rendering implementation.

**Current:** Field is populated but never displayed.

**Recommendation:** Implement modal or embedded player for quest cutscenes.

**Acceptance Criteria:**
- Cutscenes play when quest is completed
- Player can skip cutscenes
- Cutscenes don't block game progression

---

### 6.2 Clarify Character Stage Transformation

**Issue:** Characters have `stage` property but no transformation logic.

**Current:** Stage is immutable after character creation.

**Recommendation:** Either implement stage transformation (e.g., Matoran → Toa) or document that stages are fixed.

**Decision needed:**
- Should characters transform between stages?
- Is this a planned feature or fixed character property?

**Acceptance Criteria:**
- Stage transformation is implemented with quest rewards, OR
- Documentation clarifies that stages are immutable character properties

---

### 6.3 Complete Mask Hunt Quest Line

**Issue:** `masksCollected` function has hardcoded quest IDs but not all masks have individual unlock quests.

**Current:** Some masks unlock via specific quests, others only via `maskhunt_final_collection`.

**Recommendation:** Either complete individual mask hunt quests or document the intended unlock pattern.

**Acceptance Criteria:**
- All masks have individual unlock quests, OR
- Documentation clarifies which masks are only available via final collection

---

## Priority 7: Performance & Scalability (Low Priority)

### 7.1 Optimize Job Tick Interval

**Issue:** 5-second tick interval may cause performance issues with many characters.

**Current:** All characters processed every 5 seconds regardless of assignment status.

**Recommendation:** Only process characters with active assignments.

**Proposed approach:**
```typescript
setRecruitedCharacters((prev) =>
  prev.map((matoran) => {
    if (!matoran.assignment) return matoran; // Skip idle characters
    // ... process job tick
  })
);
```

**Acceptance Criteria:**
- Idle characters are skipped during tick processing
- No functional changes to job mechanics
- Performance improvement measurable with 20+ characters

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

**Issue:** Some computations (quest availability, job unlocks) recalculate on every render.

**Current:** Functions are called directly in components without memoization.

**Recommendation:** Use `useMemo` for expensive derived state.

**Examples:**
- Quest availability filtering
- Job unlock status
- Mask collection status

**Acceptance Criteria:**
- Expensive computations are memoized
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
