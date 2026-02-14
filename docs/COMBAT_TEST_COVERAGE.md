# Combat & Mask Power Test Coverage

This document captures the coverage analysis of the combat-related test suites (as of the review date). Use it to prioritize test additions and track gaps.

---

## Recent Changes (Mask Power Duration Bug Fix)

### Problem
Mask powers activated in wave 2 (e.g. Hau) could stay active past their intended duration—they should expire at round end but sometimes remained active.

### Changes Made

1. **combatUtils.ts – Round-end logic**
   - Round-end decrements (mask power duration, debuff duration) now run as a **dedicated final step** after all actor turns, instead of inside the last actor’s step.
   - Ensures round-end always runs, including when combat ends early (all enemies defeated mid-round).

2. **combatUtils.ts – getLatestState callback**
   - `queueCombatRound` accepts an optional `getLatestState?: () => { team; enemies }` callback.
   - The round-end step uses this to read the latest team/enemies before decrementing, avoiding stale closures.

3. **BattleSimulator (battleSimulation.spec.ts)**
   - Uses `stateRef`, `setTeamWithRef`, `setEnemiesWithRef`, and `getLatestState` so the round-end step always sees up-to-date state.

4. **useBattleState.tsx**
   - Added `teamRef` and `enemiesRef` to track the latest team/enemies across async steps.
   - `runRound` passes `setTeamWithRef`, `setEnemiesWithRef`, and `getLatestState` to `queueCombatRound`.

### Test Status

| Scenario | Status |
|----------|--------|
| Hau expires in wave 2 — start directly in wave 2 (1 Toa) | ✓ Pass |
| Hau expires in wave 2 — start directly in wave 2 (2 Toa) | ✓ Pass |
| Hau expires in wave 2 — empty wave 1, advance, then wave 2 round | ✓ Pass |
| Hau expires in wave 2 — single Toa, run wave 1 until defeat, advance | ✓ Pass |
| Hau expires in wave 2 — 2 Toa, Hau only in wave 1, defeat, advance | Skipped (previously failed) |
| Hau expires in wave 2 — 2 Toa, Hau + Kakama in wave 1, defeat, advance | ✗ Fail |
| Hau expires in wave 2 — 2 Toa, multiple wave 1 rounds, advance | ✗ Fail (skipped) |

The multi-round case (wave 1 rounds → advance → wave 2 round) still fails; see Root Cause Analysis below.

### Root Cause Analysis

#### Observed pattern

| Scenario | Wave 1 | Wave 2 | Result |
|----------|--------|--------|--------|
| Start directly in wave 2 (1 or 2 Toa) | N/A | Hau activates, round runs | ✓ Pass |
| Empty wave 1, advance | No rounds run | Hau activates, round runs | ✓ Pass |
| Single Toa: run wave 1 until defeat, advance | Multiple rounds, Hau only | Hau activates | ✓ Pass |
| 2 Toa: 1 round wave 1 (Hau + Kakama), defeat, advance | 1 round with both powers | Hau activates | ✗ Fail |
| 2 Toa: multiple wave 1 rounds, defeat, advance | Many rounds | Hau activates | ✗ Fail |

The failure correlates with **using both Hau and Kakama in wave 1**, not with the number of wave 1 rounds. Single-Toa flow (Hau only) passes; 2-Toa flow with Kakama in wave 1 fails.

#### Hypotheses

1. **Kakama turn-order side effects**  
   When Kakama is used, `triggerMaskPowers` inserts a cloned Pohatu (`{ ...actor, maskPower: { ...actor.maskPower } }`) into the turn order, so there are two entries with `id === 'Toa_Pohatu'`. Both steps resolve `self` via `actorList.find(c => c.id === actor.id)`, so they operate on the same combatant. That alone does not explain Hau failing in wave 2, but it changes how `currentTeam` is built and passed through the round. Kakama may be creating subtle object-sharing or state-handling differences that surface only after advance.

2. **Shared references after wave 1**  
   Wave 1 round 1 with Hau + Kakama updates both Tahu and Pohatu in `currentTeam`. `triggerMaskPowers` replaces team members with `actor` from the `all` array (`{ ...c, side: 'team' }`), which shares `maskPower` with the original. Although `cloneCombatants(this.team)` is used at round start, the mutated objects may still be referenced elsewhere (e.g. in closures or the turn order), so `this.team` could end up with shared state that survives into wave 2 and affects the round-end decrement.

3. **Early-exit and `setTeam` order**  
   With 2 high-level Toa, wave 2’s tahnok often dies on Tahu’s first hit. Later steps (Pohatu, tahnok) return early and do not call `setTeam`. `getLatestState()` should still return the team from Tahu’s step, and the round-end runs after all steps. This path was validated for other cases; if it were wrong, the single-Toa case would also fail, so this is a lower-priority hypothesis.

4. **`stateRef` lifecycle across rounds**  
   Each `runRound()` creates a new `stateRef`, and `getLatestState` closes over it. The round-end step should see the current round’s state. The failure when Kakama is used in wave 1 suggests the problem is not a simple cross-round closure, but possibly how state is constructed or updated when Kakama alters the turn order.

#### Most likely cause

The strongest correlation is **Kakama usage in wave 1**. The combination of:

- Inserting a second actor with the same id in the turn order
- Replacing team members with shallow-copied `actor` objects in `triggerMaskPowers`
- Shared `maskPower` references between `all` and the team

may leave shared references that survive to wave 2. When the round-end step decrements Hau, it may be acting on a Tahu that is not the same object reference as the one whose state is ultimately written to `this.team`, or a stale copy may overwrite the decremented state.

#### Suggested next steps

1. Add logging in the round-end step: log `getLatestState().team` before decrement and the decremented team before `setTeam`, and confirm which Tahu instance has Hau active.
2. Ensure full isolation: after wave 1, do `this.team = structuredClone(this.team)` before the wave 2 round and re-run the failing test.
3. Try the failing flow with Kakama disabled in wave 1 (only Hau) to see if Hau-expiry passes with 2 Toa.
4. In `triggerMaskPowers`, use `structuredClone` when replacing team members with `actor` to eliminate shared references.

---

## Test Files in Scope

| File | Scope |
|------|--------|
| `src/services/maskPowers.spec.ts` | Effect application (damage multipliers, mitigation, healing) |
| `src/services/maskPowerCooldowns.spec.ts` | Duration/cooldown decrement logic (wave unit only) |
| `src/services/battleSimulation.spec.ts` | Full battle flow, mask activation, lifecycle across rounds |

---

## Masks Defined in `MASK_POWERS` (combat.ts)

| Mask | Effect Type | Duration | Cooldown | Implemented? |
|------|-------------|----------|----------|--------------|
| Akaku | ATK_MULT (1.5x) | turn(2) | turn(4) | ✓ |
| Hau | DMG_MITIGATOR (0) | round(1) | wave(1) | ✓ |
| Kaukau | HEAL (0.2) | turn(3) | wave(1) | ✓ |
| Huna | AGGRO (untargetable) | turn(1) | turn(3) | ✓ (chooseTarget) |
| Kakama | SPEED (extra turn) | round(1) | turn(5) | ✓ (triggerMaskPowers) |
| Pakari | ATK_MULT (3x) | attack(1) | turn(2) | ✓ |
| Miru | DMG_MITIGATOR (0, 2 hits) | hit(2) | wave(1) | ✓ |
| Ruru | ACCURACY_MULT (0.5) | turn(2) | turn(4) | ✗ |
| Komau | CONFUSION | turn(3) | turn(4) | ✓ |
| Rau | ATK_MULT (1.5x, wave) | wave(1) | wave(2) | ✓ |
| Matatu | Immobilize enemy | wave(1) | turn(2) | ✗ |
| Mahiki | DMG_MITIGATOR (0, 1 hit) | hit(1) | turn(2) | ✓ |

**Duration units:** `attack`, `hit`, `turn`, `round`, `wave`  
**Cooldown units:** `turn`, `wave`

---

## 1. maskPowers.spec.ts — Effect Application Coverage

### What it tests

- `calculateAtkDmg` with ATK_MULT masks
- `applyDamage` with DMG_MITIGATOR masks
- `applyHealing` with HEAL masks

### Masks covered

| Mask | Tested? | Notes |
|------|---------|-------|
| Pakari | ✓ | 3x damage when active, no boost when inactive |
| Akaku | ✓ | 1.5x damage when active |
| Hau | ✓ | Full immunity when active, none when inactive |
| Miru | ✓ | Full immunity when active |
| Mahiki | ✓ | Full immunity when active |
| Kaukau | ✓ | 20% heal when active, no heal when inactive, cap at max HP |

### Gaps

| Gap | Priority | Action | Status |
|-----|----------|--------|--------|
| Huna (AGGRO) | High | Add test: enemy with Huna active is filtered out by `chooseTarget` | ✓ Done |
| Kakama (SPEED) | Medium | Add test: verify SPEED grants extra turn (may need battleSimulation) | ✓ Done (battleSimulation) |
| Rau (ATK_MULT, wave) | Low | Add test: same ATK_MULT behavior | ✓ Done |
| Miru/Mahiki inactive | Low | Add "does not mitigate when inactive" (like Hau) | ✓ Done |

---

## 2. maskPowerCooldowns.spec.ts — Duration/Cooldown Coverage

### What it tests

- `decrementWaveCounters` only (calls `decrementMaskPowerCounter` with unit `'wave'`)

### Unit types covered

| Unit | Duration tested? | Cooldown tested? | Notes |
|------|------------------|------------------|-------|
| wave | ✓ | ✓ | Full logic tested |
| round | Structure only | - | Asserts `unit === 'round'`, no decrement |
| turn | Structure only | - | "Does not decrement" (correct, wave-only) |
| attack | Structure only | - | Asserts `unit === 'attack'` |
| hit | Structure only | - | Asserts `unit === 'hit'` |

### Gaps

| Gap | Priority | Action | Status |
|-----|----------|--------|--------|
| turn/round/attack/hit decrement | High | `decrementMaskPowerCounter` is not exported; test via battle simulation or export for tests | Deferred |
| Cooldown set on expiry | Medium | Comment mentions it; add assertion that cooldown is copied from MASK_POWERS when duration expires | ✓ Done |
| "Cooldown Unit Types" section | Low | Currently only asserts structure, not decrement behavior | Deferred |

---

## 3. battleSimulation.spec.ts — Full Battle Flow Coverage

### What it tests

- Full battle from team confirm to victory
- Mask power lifecycle: activation → effect → deactivation between rounds
- Wave advance and wave-based cooldowns
- Mask power expiry in wave 2 (post-advanceWave scenarios)

### Test structure

| Test | Status |
|------|--------|
| runs battle from team confirm through rounds to victory | ✓ |
| Hau (1 round duration) is inactive after round ends | ✓ |
| Kakama (1 round duration) is inactive after round ends | ✓ |
| Pakari (1 attack duration) is inactive after first attack | ✓ |
| Kaukau (3 turn duration) heals for 3 turns then expires | ✓ |
| Akaku marks target; allies deal +50% damage for 2 turns | ✓ |
| Miru (2 hit duration) provides mitigation for first 2 hits | ✓ |
| Mahiki (1 hit duration) provides mitigation for 1 hit then expires | ✓ |
| Huna (1 turn untargetable) makes enemy untargetable when active | ✓ |
| Komau CONFUSION makes enemy attack their own team | ✓ |
| Komau CONFUSION: confused enemy attacks itself when alone | ✓ |
| Kakama grants Pohatu two attacks in one round | ✓ |
| wave advance decrements wave-based mask power counters | ✓ |
| multi-round: 1 round wave 1 then wave 2 – Hau only (no Kakama) | Skipped |
| multi-round: 1 round wave 1 then wave 2 – both Hau and Kakama | Skipped |
| multi-round battle with mask power toggling (empty wave 1) | ✓ |
| multi-round battle with mask power toggling between rounds | Skipped |
| Hau expires correctly in wave 2 with 2 Toa (starts directly in wave 2) | ✓ |
| Hau expires correctly in wave 2 with single Toa (isolated repro) | ✓ |
| no mask power bleeds from round N to round N+1 when duration expired | ✓ |

### Masks covered (lifecycle)

| Mask | Tested? | Notes |
|------|---------|-------|
| Hau | ✓ | Round duration, inactive after round, wave cooldown, wave 2 expiry (isolated) |
| Kakama | ✓ | Round duration, double attack |
| Pakari | ✓ | Attack duration |
| Kaukau | ✓ | Turn duration |
| Akaku | ✓ | DEFENSE debuff, turn duration |
| Miru | ✓ | Hit duration (2 hits) |
| Mahiki | ✓ | Hit duration (1 hit) |
| Huna | ✓ | AGGRO untargetable |
| Komau | ✓ | CONFUSION debuff |

### Gaps / Known issues

| Gap | Priority | Status |
|-----|----------|--------|
| Multi-round post-advanceWave bug | Known | Hau stays active in wave 2 when wave 1 used Kakama (2 Toa). Single-Toa and isolated cases pass. See **Root Cause Analysis** in Recent Changes. 2–3 tests skipped/fail. |

---

## Cross-File Summary

| Aspect | maskPowers | maskPowerCooldowns | battleSimulation |
|--------|------------|--------------------|------------------|
| Masks tested | 6 of 12 | N/A (wave only) | 9 of 12 |
| Effect types tested | 3 of 7 | - | - |
| Duration units exercised | - | 1 of 5 (wave) | round, attack, turn, hit |
| Cooldown units exercised | - | 1 of 2 (wave) | wave |
| Full combat flow | ✗ | ✗ | ✓ |

---

## Recommended Next Steps

1. ~~**maskPowers.spec.ts**: Add Huna/chooseTarget test, optionally Kakama and Rau.~~ ✓ Implemented
2. **maskPowerCooldowns.spec.ts**: Consider exporting `decrementMaskPowerCounter` for unit tests, or add tests via battle simulation for turn/round/attack/hit. (Deferred)
3. ~~**battleSimulation.spec.ts**: Add Akaku, Miru, Mahiki, Huna; add hit-based duration tests.~~ ✓ Implemented
4. **battleSimulation.spec.ts**: Fix multi-round post-advanceWave bug (Hau stays active in wave 2 when wave 1 rounds run first). Root cause under investigation.
5. **Unimplemented effects**: Ruru (ACCURACY_MULT), Matatu (immobilize) — tests can wait until implemented. Komau (CONFUSION) — ✓ Implemented.

---

## Implementation Notes

- **combatUtils.ts**: Cooldown is correctly set from MASK_POWERS when duration expires; not decremented in same pass.
- **combatUtils.ts**: Round-end decrements (mask power duration, debuffs) run as a dedicated final step after all actor turns, so they always execute regardless of turn order or early exits.
- **combatUtils.ts**: Optional `getLatestState` callback allows round-end to read latest team/enemies and avoid stale closures.
- **useBattleState.tsx**: Uses refs and `getLatestState` so the round-end step receives current team/enemies during async step execution.
