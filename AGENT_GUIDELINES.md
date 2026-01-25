# Agent Guidelines

## Project Purpose and Scope

This is a **web-based idle RPG game** set in the Bionicle universe. It is a single-page React application with:
- Idle/incremental gameplay where characters generate resources over time (including offline)
- Quest-based story progression with unlock chains
- Turn-based combat with elemental affinities and mask powers
- 3D character visualization using React Three Fiber
- localStorage persistence with offline progress calculation

The game runs entirely in the browser. All game logic must support offline progress calculation.

---

## Non-Negotiable Architectural Rules

### Layer Separation

**DO NOT** violate these layer boundaries:

1. **Types (`src/types/`)** → May import nothing except other types
2. **Data (`src/data/`)** → May import types only
3. **Game Logic (`src/game/`)** → May import types and data only. Must remain pure functions.
4. **Services (`src/services/`)** → May import types, data, and game logic. Must not import hooks or components.
5. **Hooks (`src/hooks/`)** → May import anything except other hooks (except composition in `useGameLogic`)
6. **Context (`src/context/`)** → May import hooks and types only
7. **Components/Pages** → May import anything

**NEVER** make game logic functions depend on React hooks or component state.

**NEVER** import hooks into services or game logic.

**NEVER** create circular dependencies between hooks.

### State Management Architecture

**DO NOT** change these patterns:

- `useGameLogic` is the **only** hook that composes other state hooks
- All state hooks return both state and mutation functions
- The `GameState` type is the single source of truth for the game API
- Context providers wrap `useGameLogic` and expose it via `useGame()`

**NEVER** create additional context providers for game state slices. All game state flows through `GameContext`.

**NEVER** call `useGameLogic` from anywhere except `GameProvider`.

**NEVER** access individual state hooks (like `useInventoryState`) directly from components. Always use `useGame()`.

### Data Structure Patterns

**DO NOT** break these patterns:

- Static game content lives in `src/data/` as `Record<Enum, T>` or arrays
- Runtime state stores only IDs, not full objects
- Full data is retrieved by looking up IDs in dictionaries (e.g., `MATORAN_DEX[id]`)
- Characters have dual representation: `BaseMatoran` (static) + `RecruitedCharacterData` (runtime)

**NEVER** store full character/job/item objects in runtime state.

**NEVER** duplicate static data into runtime state.

**NEVER** mutate objects in `MATORAN_DEX`, `JOB_DETAILS`, `ITEM_DICTIONARY`, or other data dictionaries.

---

## Domain Rules and Invariants

### Character Management

**MUST ENFORCE:**

1. A character can only be recruited once (ID uniqueness in `recruitedCharacters`)
2. A character can have EITHER a job assignment OR a quest assignment, NEVER both
3. When starting a quest, the character's `assignment` must be set to `undefined`
4. When canceling a quest, the character becomes idle (no automatic job reassignment)
5. `buyableCharacters` must always exclude IDs present in `recruitedCharacters`

**NEVER** allow a character to have both `assignment` and `quest` fields populated.

**NEVER** automatically reassign jobs when quests end.

### Quest System

**MUST ENFORCE:**

1. Quest prerequisites (`unlockedAfter`) form a directed acyclic graph (no circular dependencies)
2. Items marked `consumed: true` are deducted when starting a quest
3. Consumed items are restored when canceling a quest
4. Quest completion must remove the quest from `activeQuests` and add its ID to `completedQuests`
5. Quest rewards that unlock characters must add them to `buyableCharacters`, not `recruitedCharacters`

**NEVER** add characters directly to `recruitedCharacters` as quest rewards. They must go to `buyableCharacters` first.

**NEVER** create circular quest dependencies.

**NEVER** forget to restore consumed items when canceling quests.

### Time and Offline Progress

**MUST ENFORCE:**

1. All timestamps are stored in milliseconds (via `Date.now()`)
2. Job assignments store `assignedAt` timestamp
3. Offline progress is calculated by comparing stored timestamps to current time
4. The system assumes time flows forward (monotonically increasing timestamps)

**NEVER** use seconds for stored timestamps (quest durations are in seconds but converted at runtime).

**NEVER** reset timestamps without recalculating earned progress first.

**NEVER** assume the tick interval affects offline progress calculations.

### Inventory and Items

**MUST ENFORCE:**

1. Inventory quantities must never be negative
2. Item requirements must be checked before allowing recruitment or quest starts
3. The `Inventory` type is `Partial<Record<GameItemId, number>>`
4. Inventory merging uses `mergeInventory` or `addToInventory` utilities

**NEVER** allow negative inventory values.

**NEVER** bypass item requirement checks.

**NEVER** mutate inventory objects directly. Always create new objects.

### Experience and Leveling

**MUST ENFORCE:**

1. Experience is cumulative and never decreases
2. Levels are derived from total exp using `getLevelFromExp`, never stored separately
3. Experience is always additive (never reset or subtracted)

**NEVER** store level as a separate field in character state.

**NEVER** subtract experience or reset it to zero.

### Persistence

**MUST ENFORCE:**

1. Only these fields are persisted: `version`, `widgets`, `inventory`, `recruitedCharacters`, `buyableCharacters`, `activeQuests`, `completedQuests`
2. Battle state is NOT persisted (battles reset on page refresh)
3. Activity log is NOT persisted (regenerated on load for offline progress only)
4. Save version must match `CURRENT_GAME_STATE_VERSION` or the save is rejected

**NEVER** add new fields to persistence without updating `useGamePersistence` and `loadGameState`.

**NEVER** change `CURRENT_GAME_STATE_VERSION` without providing migration logic or accepting that old saves will be lost.

**NEVER** persist battle state or activity log.

---

## Explicit Anti-Patterns and Forbidden Changes

### Forbidden: Breaking Immutability

**NEVER** mutate state objects directly. Example of what NOT to do:

```typescript
// WRONG - Direct mutation
if (id === m.id) {
  m.maskOverride = mask;
  return m;
}

// CORRECT - Immutable update
if (id === m.id) {
  return { ...m, maskOverride: mask };
}
```

### Forbidden: Mixing Timestamp Units

**NEVER** store timestamps in seconds. Always use milliseconds from `Date.now()`.

Quest durations are defined in seconds but must be converted to milliseconds when calculating `endsAt`.

### Forbidden: Bypassing the Dictionary Pattern

**NEVER** create functions that return full character objects from state. Example of what NOT to do:

```typescript
// WRONG - Storing full objects
const [characters, setCharacters] = useState<BaseMatoran[]>([...]);

// CORRECT - Storing IDs, looking up in dictionary
const [characters, setCharacters] = useState<RecruitedCharacterData[]>([...]);
const fullData = MATORAN_DEX[character.id];
```

### Forbidden: Creating New Context Providers for Game State

**NEVER** create additional context providers for inventory, characters, quests, etc.

All game state must flow through the single `GameContext` provided by `GameProvider`.

### Forbidden: Storing Derived State

**NEVER** store computed values that can be derived from existing state. Examples:

- Do not store level (derive from exp)
- Do not store quest availability (compute from completedQuests)
- Do not store job unlock status (compute from completedQuests)

### Forbidden: Breaking the Job Tick Contract

The `useJobTickEffect` hook runs on an interval and processes all assigned jobs.

**NEVER** create multiple job tick intervals.

**NEVER** process job exp outside of `applyJobExp` or `applyOfflineJobExp`.

**NEVER** modify the job tick logic without ensuring offline progress calculations remain consistent.

---

## How to Approach Refactors Safely

### Before Making Changes

1. **Identify the layer** the code belongs to (types, data, game logic, services, hooks, context, components)
2. **Check dependencies** - ensure you're not violating layer boundaries
3. **Identify invariants** - what assumptions does this code make? What assumptions does other code make about it?
4. **Search for usages** - use codebase-retrieval to find all places that depend on what you're changing

### When Modifying Game Logic

1. Game logic functions in `src/game/` must remain pure (no side effects, no React dependencies)
2. If you need to add side effects, put them in services or hooks, not game logic
3. Ensure offline progress calculations still work (test by simulating time passage)
4. Verify that the function signature matches what hooks/services expect

### When Modifying State Hooks

1. Check if the hook is composed in `useGameLogic` - if so, changes affect the entire game state
2. Ensure mutation functions are included in the returned object
3. Verify that `useGamePersistence` includes any new state that should be saved
4. Check if components are destructuring specific fields from `useGame()` that you're changing

### When Modifying Data Definitions

1. Data in `src/data/` is used throughout the codebase - changes have wide impact
2. Adding fields is usually safe; removing or renaming fields requires checking all usages
3. Ensure enum keys in `Record<Enum, T>` are exhaustive (TypeScript will help)
4. Remember that data is loaded at module initialization - changes require page refresh

### When Adding New Features

1. **New game mechanic?** → Add pure logic to `src/game/`, wire it up in a hook
2. **New content?** → Add static data to `src/data/`, reference by ID in state
3. **New state?** → Create a new hook, compose it in `useGameLogic`, add to persistence if needed
4. **New UI?** → Create component, consume `useGame()`, call mutation functions

### Testing Changes

Since there are minimal tests, verify changes by:

1. Checking TypeScript compilation (`yarn build`)
2. Running the app and testing the affected feature
3. Testing offline progress (close tab, reopen, verify state is correct)
4. Checking localStorage to ensure persistence works
5. Testing with debug mode enabled if time-based

---

## When to Ask for Clarification

### Always Ask Before:

1. **Changing `CURRENT_GAME_STATE_VERSION`** - This invalidates all existing saves
2. **Adding new fields to persisted state** - Requires updating save/load logic
3. **Modifying quest prerequisite chains** - Could break progression
4. **Changing experience formulas** - Affects all existing characters
5. **Modifying element effectiveness matrices** - Changes combat balance
6. **Removing or renaming enum values** - Breaks existing data references
7. **Changing the job tick interval** - Affects game feel and balance
8. **Modifying offline progress calculations** - Could create exploits or bugs

### Ask for Clarification When:

1. You find commented-out code and aren't sure if it's abandoned or planned
2. You find unused type fields (like `rarity`, `value`, `tags`) and want to use them
3. You encounter inconsistencies in code patterns and want to fix them
4. You need to break an invariant for a new feature
5. You're unsure if a field is intentionally unused or incomplete
6. You find data that seems incorrect (like `StasisTechnician` favoring Stone instead of Earth)

### Provide Context When Asking:

- What invariant or pattern you need to break and why
- What alternatives you considered
- What the impact would be on existing saves/progression
- Whether the change is backward compatible

---

## Special Notes

### The `GameState` Type Pattern

The `GameState` type includes both data and function signatures. This is intentional.

The `INITIAL_GAME_STATE` in `src/data/gameState.ts` contains stub functions that throw errors. This is a TypeScript workaround and should not be changed. The real implementations come from `useGameLogic`.

**NEVER** call functions from `INITIAL_GAME_STATE` directly.

**NEVER** use `INITIAL_GAME_STATE` except as a fallback in `loadGameState`.

### The Canvas Portal Pattern

The 3D canvas uses React portals to render into `#canvas-mount`.

**NEVER** remove or rename the `#canvas-mount` element.

**NEVER** create multiple canvas instances.

**NEVER** render 3D content outside the portal system.

### The Dual Character Pattern

Characters exist as:
- `BaseMatoran` in `MATORAN_DEX` (static, never changes)
- `RecruitedCharacterData` in state (runtime, minimal data)
- Combined via `getRecruitedMatoran(id, recruitedCharacters)` when full data is needed

**NEVER** merge these into a single type.

**NEVER** store `BaseMatoran` fields in `RecruitedCharacterData`.

### Debug Mode

Debug mode is stored separately from game state in localStorage under `DEBUG_MODE` key.

It currently only affects quest duration (1 second instead of actual duration).

**DO NOT** add debug mode checks that affect game balance or progression in production.

**DO NOT** persist debug mode in the main game state.

---

## Summary

This project has a clear architecture with well-defined layers and patterns. The most important rules are:

1. **Respect layer boundaries** - game logic stays pure, hooks manage state, components consume context
2. **Maintain invariants** - single assignment, ID-based references, immutable updates, time flows forward
3. **Follow the dictionary pattern** - static data in records, runtime state stores IDs only
4. **Preserve offline progress** - all time-based mechanics must support offline calculation
5. **Don't break persistence** - only change persisted fields with careful consideration

When in doubt, search the codebase for similar patterns and follow them. If you need to deviate, ask first.

## Scope of This Document

These guidelines describe the CURRENT architecture and invariants.

They are intentionally conservative and defensive.
They do NOT imply future refactors, migrations, or tooling changes.

Planned or desired future changes must be explicitly authorized
outside of this document before being acted upon.