# Bohrok Kal Quest Line – Design Spec

Decisions for the Bohrok Kal arc after Toa Nuva evolution: Nuva symbols sequestered, overpowered opponents, story battle system, no grinding.

---

## Decided Approach

### Encounter Model: Option C

- **Quests**: Timer-based narrative quests. Bohrok Kal encounters appear in the battle selector but do **not** block quest progress.
- **Encounters**: Unlocked alongside the arc; tuned so winning is extremely difficult until the final quest. Final quest unlocks a winnable "final confrontation" encounter.
- **No grind**: Quest progression is never gated on battle wins.

### Nuva Symbols: Sequestered (Stat Diminishment)

- **Narrative**: Bohrok Kal sequester the Nuva symbols at arc start. Explains why the Kal are overpowered and the Toa struggle.
- **Mechanical**: Toa Nuva stats are diminished while symbols are sequestered. Stats restore when symbols are reclaimed (final quest).
- **No collectible grind**: Symbols are stolen in the opening quest and reclaimed when the Toa triumph. No "collect 6 symbols" loop.

### Story Battle System

We invest in a **story battle system** for key quest moments:

- Battles triggered **from quests** (not only from the battle selector).
- **Scripted outcomes**: Win or loss predetermined; player plays through but outcome is fixed.
- Story battles use BK models and integrate with the existing battle arena.

---

## Quest Arc Structure

| Quest                  | Story battle? | Notes                                                |
|------------------------|---------------|------------------------------------------------------|
| The Stolen Symbols     | No            | Ambush/theft. Narrative only.                        |
| First Strikes          | Optional      | First confrontation; scripted loss if used.           |
| Scattered              | No            | Toa split, each loses. Narrative only.                |
| Gathering Strength     | No            | Planning, regrouping. No combat.                     |
| The Final Confrontation| **Yes**       | Climax. Winnable story battle.                        |

**Decided**: Minimal story battles—only the Final Confrontation has a required story battle. First Strikes may add an optional scripted-loss battle later.

---

## Story Battle System Specification

### Goals

- Battles triggered from quests.
- Scripted outcomes: `win` or `loss` predetermined.
- Support stat modifiers (diminished Toa Nuva when symbols sequestered).

### Core Components

1. **Quest-triggered battles**: Quest can specify a story battle; launching/completing it advances the quest.
2. **Scripted outcome**: `scriptedOutcome: 'win' | 'loss'`. Loss advances quest, no penalty.
3. **Stat modifiers**: `isNuvaSymbolsSequestered(completedQuests)` — derived; Toa Nuva receive stat penalty when true.
4. **Encounter types**: Repeatable (battle selector) vs story (quest-triggered, one-off).

### Data Model

- **Derived**: `isNuvaSymbolsSequestered(completedQuests)` — true when `bohrok_kal_stolen_symbols` completed and `bohrok_kal_final_confrontation` not yet completed.
- **Quest**: Optional `storyBattle?: { encounterId: string; trigger: 'onStart' | 'onComplete'; scriptedOutcome: 'win' | 'loss' }`.
- **EnemyEncounter**: Optional `scriptedOutcome?: 'win' | 'loss'` for story battles.

### Implementation Phases

1. **Phase 1**: Add `isNuvaSymbolsSequestered(completedQuests)` and stat modifier for Toa Nuva.
2. **Phase 2**: Add `scriptedOutcome`; defeat with `scriptedOutcome === 'loss'` advances quest.
3. **Phase 3**: Quest-triggered battle flow.
4. **Phase 4**: Bohrok Kal combatants, encounters, and quest line content.

---

## Implementation Notes

- **Bohrok Kal models**: Reuse `bohrok_master.glb` with different color scheme (metallic/chrome) if no dedicated Kal model.
- **Combatants**: Add `tahnok_kal`, `gahlok_kal`, etc. to `COMBATANT_DEX` with elevated stats.
- **Encounter visibility**: Bohrok Kal encounters filtered by `unlockedAfter` as today.
