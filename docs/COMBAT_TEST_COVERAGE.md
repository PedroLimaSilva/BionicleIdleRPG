# Combat & Mask Power Test Coverage

Reference for combat-related test suites and mask power coverage. Open work: [#344](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/344) (Matatu), [#338](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/338) (broader coverage).

---

## Test Files in Scope

| File                                      | Scope                                                        |
| ----------------------------------------- | ------------------------------------------------------------ |
| `src/services/maskPowers.spec.ts`         | Effect application (damage multipliers, mitigation, healing) |
| `src/services/maskPowerCooldowns.spec.ts` | Duration/cooldown decrement logic                            |
| `src/services/battleSimulation.spec.ts`   | Full battle flow, mask activation, lifecycle across rounds   |

---

## Masks in `MASK_POWERS` (combat.ts)

| Mask   | Effect Type               | Duration  | Cooldown |
| ------ | ------------------------- | --------- | -------- |
| Akaku  | ATK_MULT (1.5x)           | turn(2)   | turn(4)  |
| Hau    | DMG_MITIGATOR (0)         | round(1)  | wave(1)  |
| Kaukau | HEAL (0.2)                | turn(3)   | wave(1)  |
| Huna   | AGGRO (untargetable)      | turn(1)   | turn(3)  |
| Kakama | SPEED (extra turn)        | round(1)  | turn(5)  |
| Pakari | ATK_MULT (3x)             | attack(1) | turn(2)  |
| Miru   | DMG_MITIGATOR (0, 2 hits) | hit(2)    | wave(1)  |
| Ruru   | ACCURACY_MULT (0.5)       | turn(2)   | turn(4)  |
| Komau  | CONFUSION                 | turn(3)   | turn(4)  |
| Rau    | ATK_MULT (1.5x, wave)     | wave(1)   | wave(2)  |
| Matatu | Immobilize enemy          | wave(1)   | turn(2)  |
| Mahiki | DMG_MITIGATOR (0, 1 hit)  | hit(1)    | turn(2)  |

**Duration units:** `attack`, `hit`, `turn`, `round`, `wave`  
**Cooldown units:** `turn`, `wave`

Matatu is not yet implemented — see [#344](https://github.com/PedroLimaSilva/BionicleIdleRPG/issues/344).

---

## Coverage by test file

### maskPowers.spec.ts

Tests `calculateAtkDmg`, `applyDamage`, `applyHealing`, `getAccuracyMultiplier` / `rollAttackHits` for Pakari, Akaku, Hau, Miru, Mahiki, Kaukau, Ruru, Huna, Kakama, and Rau.

### maskPowerCooldowns.spec.ts

Tests `decrementMaskPowerCounter` for all duration and cooldown unit types, including cooldown set on expiry.

### battleSimulation.spec.ts

Full battle flow from team confirm through victory; mask lifecycle (activation, effect, deactivation); wave advance; multi-round and post-`advanceWave` scenarios. Covers Hau, Kakama, Pakari, Kaukau, Akaku, Miru, Mahiki, Huna, Komau, and Ruru.

---

## Implementation Notes

- **combatUtils.ts**: `rollAttackHits` runs before `calculateAtkDmg`; misses skip damage and target hit animations.
- **combatUtils.ts**: Cooldown is set from `MASK_POWERS` when duration expires; not decremented in the same pass.
- **combatUtils.ts**: Round-end decrements (mask power duration, debuffs) run as a dedicated final step after all actor turns.
- **combatUtils.ts**: Optional `getLatestState` callback allows round-end to read latest team/enemies and avoid stale closures.
- **combatUtils.ts**: `triggerMaskPowers` resets duration from `MASK_POWERS` on reactivation.
- **useBattleState.tsx**: Uses refs and `getLatestState` so the round-end step receives current team/enemies during async step execution.
