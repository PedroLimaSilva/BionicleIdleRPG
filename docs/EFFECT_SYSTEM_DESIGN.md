# Effect System Design

## Principle

**Type determines WHEN** the effect applies (which phase of combat).
**Value determines WHAT** (positive or negative outcome).

Combat logic does not branch on "buff vs debuff"—it simply applies the effect value at the appropriate phase.

## Effect Types and Trigger Points

| Type | Trigger | Value semantics | Example |
|------|---------|-----------------|---------|
| **HEAL** | End/start of turn | `hp += maxHp * multiplier`; positive = heal, negative = poison | 0.1 = heal 10%, -0.1 = lose 10% HP |
| **DEFENSE** | Damage calculation (defender) | Multiplies defense stat: `effectiveDefense = defense * multiplier`; >1 = fortify, <1 = weaken | 1.5 = 50% more defense, 0.5 = half defense |
| **DMG_MITIGATOR** | Damage calculation (defender) | Multiplies final damage; 0 = immunity | 0 = no damage, 0.5 = half damage |
| **ATK_MULT** | Damage calculation (attacker) | `damage *= multiplier` | 2 = deal double, 0.5 = deal half |
| **SPEED** | Turn order determination | Adds/removes turns | 2 = extra turn, -1 = skip turn |
| **AGGRO** | Target choice | multiplier 0 = untargetable | Affects who can be selected |
| **CONFUSION** | Target choice | Flips valid targets to allies | Modifies target selection |

## Unified Application

- **Damage calculation**: Sum/apply all relevant effects (DEFENSE, DMG_MITIGATOR, ATK_MULT) by multiplying. No special case for "debuff".
- **Turn start/end**: Apply HEAL effects. `multiplier > 0` heals, `multiplier < 0` damages.
- **Target choice**: Apply AGGRO and CONFUSION to filter/transform valid targets.

## Implementation Notes

- **DEFENSE** multiplies the defender's defense stat in `calculateAtkDmg` (effectiveDefense = defense × multiplier). >1 = fortify, <1 = weaken.
- **DMG_MITIGATOR** multiplies final damage in `applyDamage` (shield; 0 = immunity).
- **HEAL** supports negative multiplier (poison); `hp` is clamped to `[0, maxHp]`.
- **Future**: DEFENSE and DMG_MITIGATOR could merge into a single `DAMAGE_TAKEN` type—both multiply incoming damage. The distinction (Akaku weakens vs Hau shields) is only in mask flavor; the math is identical.
