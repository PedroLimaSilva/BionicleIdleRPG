# Combat & Mask Power Test Coverage

This document captures the coverage analysis of the combat-related test suites (as of the review date). Use it to prioritize test additions and track gaps.

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
| Komau | CONFUSION | turn(3) | turn(4) | ✗ |
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

### Masks covered (lifecycle)

| Mask | Tested? | Notes |
|------|---------|-------|
| Hau | ✓ | Round duration, inactive after round, wave cooldown |
| Kakama | ✓ | Round duration |
| Pakari | ✓ | Attack duration |
| Kaukau | ✓ | Turn duration |

### Gaps

| Gap | Priority | Action | Status |
|-----|----------|--------|--------|
| Akaku, Miru, Mahiki, Huna | Medium | Add simulation tests | ✓ Done |
| Hit-based duration (Miru 2 hits, Mahiki 1 hit) | Medium | Add tests that verify hit decrement | ✓ Done |
| Kakama double attack | Medium | Verify Pohatu attacks twice in one round | ✓ Done |
| Multi-round post-advanceWave bug | Known | Test skipped; Hau stays active in wave 2 | Known |

---

## Cross-File Summary

| Aspect | maskPowers | maskPowerCooldowns | battleSimulation |
|--------|------------|--------------------|------------------|
| Masks tested | 6 of 12 | N/A (wave only) | 4 of 12 |
| Effect types tested | 3 of 7 | - | - |
| Duration units exercised | - | 1 of 5 (wave) | round, attack, turn |
| Cooldown units exercised | - | 1 of 2 (wave) | wave |
| Full combat flow | ✗ | ✗ | ✓ |

---

## Recommended Next Steps

1. ~~**maskPowers.spec.ts**: Add Huna/chooseTarget test, optionally Kakama and Rau.~~ ✓ Implemented
2. **maskPowerCooldowns.spec.ts**: Consider exporting `decrementMaskPowerCounter` for unit tests, or add tests via battle simulation for turn/round/attack/hit. (Deferred)
3. ~~**battleSimulation.spec.ts**: Add Akaku, Miru, Mahiki, Huna; add hit-based duration tests; fix or document the post-advanceWave bug.~~ ✓ Implemented (except fix)
4. **Unimplemented effects**: Ruru (ACCURACY_MULT), Komau (CONFUSION), Matatu (immobilize) — tests can wait until implemented.

---

## Implementation Notes (latest)

- **combatUtils.ts**: Fixed cooldown being decremented in same pass when duration expires — cooldown is now correctly set from MASK_POWERS when duration reaches 0.
