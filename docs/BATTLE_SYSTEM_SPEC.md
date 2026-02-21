# Battle System Specification

## Overview

The battle system is a turn-based combat system where players select a team of Toa to fight against waves of enemies. Battles are ephemeral - all progress is lost on page reload, with only final rewards being persisted.

## Battle Flow

### 1. Battle Selection (Idle Phase)

- User browses available battles
- Each battle displays:
  - Name and description
  - Difficulty level
  - Number of waves
  - Enemy types (headliner)
  - Potential loot drops
- User selects a battle to start

### 2. Team Preparation (Preparing Phase)

- Battle transitions to `BattlePhase.Preparing`
- First wave of enemies is loaded and displayed
- User selects up to 3 Toa for their team
- User can review enemy composition
- User confirms team selection OR retreats to cancel
- On confirmation: Battle transitions to `BattlePhase.Inprogress`

### 3. Battle In Progress (Inprogress Phase)

#### Round Structure

Each round consists of:

1. **Pre-Round: Mask Power Selection**
   - User can enable mask powers for each Toa
   - Mask powers can only be enabled if cooldown has expired (cooldown.amount === 0)
   - User can toggle mask powers on/off before running the round
   - Visual indicator shows which powers are ready vs on cooldown

2. **Round Execution**
   - User clicks "Run Round" button
   - Combat actions are queued and executed sequentially:

     a. **Mask Power Activation Phase**
     - All combatants with `willUseAbility === true` activate their mask powers
     - Mask power `active` flag is set to `true`
     - Special case: SPEED mask powers grant an extra turn in the same round
     - Mask power cooldowns are set to their configured values
     - `willUseAbility` is reset to `false`

     b. **Combat Phase**
     - Turn order determined by speed stat (highest to lowest)
     - Each combatant takes their turn in order:
       - Skip if HP <= 0
       - Select target based on strategy (Random, LowestHp, MostEffective)
       - Calculate damage (base damage + element effectiveness + random variance)
       - Apply mask power effects (damage multipliers, mitigation, etc.)
       - Play attack/hit animations
       - Apply damage to target
       - Update HP values

3. **Post-Round**
   - Check victory/defeat conditions
   - Decrement mask power durations and cooldowns
   - Update UI to reflect new state

#### Wave Progression

- When all enemies in current wave reach 0 HP:
  - If more waves remain: Load next wave, heal team (optional), continue battle
  - If final wave: Transition to `BattlePhase.Victory`
- When all team members reach 0 HP:
  - Transition to `BattlePhase.Defeat`

### 4. Battle Conclusion

#### Victory (Victory Phase)

- Display victory screen
- Show rewards summary:
  - Experience gained per Toa
  - Loot items obtained (based on drop chances)
- User collects rewards
- Rewards are persisted to game state:
  - Toa gain experience
  - Items added to inventory
- Return to battle selection

#### Defeat (Defeat Phase)

- Display defeat screen
- No rewards granted
- Return to battle selection

#### Retreat (Retreated Phase)

- User can retreat during Preparing or Inprogress phases
- No rewards granted
- Return to battle selection

## Mask Power System

### Mask Power Structure

```typescript
interface MaskPower {
  description: string;
  shortName: Mask;
  longName: string;
  effect: MaskEffect;
  active?: boolean; // Whether the power is currently active
}

interface MaskEffect {
  type: 'ATK_MULT' | 'DMG_MITIGATOR' | 'HEAL' | 'AGGRO' | 'SPEED' | 'ACCURACY_MULT' | 'CONFUSION';
  duration: CombatDuration; // How long the effect lasts
  cooldown: CombatDuration; // How long until it can be used again
  multiplier?: number; // Effect strength
  target: 'self' | 'enemy' | 'allEnemies' | 'team';
}

interface CombatDuration {
  unit: 'attack' | 'hit' | 'turn' | 'round' | 'wave';
  amount: number;
}
```

### Mask Powers as Buffs/Debuffs

Mask powers can apply effects to multiple targets:

- **target: 'self'** – Effect stays on the caster (original behavior)
- **target: 'enemy'** – Debuff applied to attacked enemy (e.g. Akaku, Komau)
- **target: 'allEnemies'** – Debuff applied to all enemies (e.g. Ruru)
- **target: 'team'** – Buff applied to all allies (Nuva masks)

When `target: 'team'`, the mask power creates `TargetBuff` instances on each ally. Buffs have their own duration/cooldown lifecycle, and damage/healing logic checks both `maskPower.active` and `buffs` on each combatant.

### Mask Power Lifecycle

1. **Initialization**: Cooldown starts at 0 (ready to use)
2. **Activation**: User toggles `willUseAbility` before round
3. **Trigger**: At start of round, power activates (`active = true`)
4. **Duration**: Effect applies during combat for specified duration
5. **Cooldown**: After use, cooldown counter is set and decrements each unit
6. **Ready**: When cooldown reaches 0, power can be used again

### Duration & Cooldown Units

- **attack**: Counts down when this combatant attacks
- **hit**: Counts down when this combatant is hit
- **turn**: Counts down after each combatant's turn (1 turn = 1 actor's action check, might be paralized)
- **round**: Counts down after all combatants have acted
- **wave**: Counts down when a new wave starts

## State Persistence

### Ephemeral (Lost on Reload)

- Current battle state
- Current wave number
- Combatant HP values
- Active mask powers
- Round progress

### Persistent (Saved to Game State)

- Toa experience (only on victory)
- Inventory items (only on victory)
- Completed battles (for unlocking new content)

## Technical Implementation Notes

### Battle State Hook (`useBattleState`)

- Manages all battle state and phase transitions
- Provides methods: `startBattle`, `confirmTeam`, `runRound`, `advanceWave`, `retreat`, `toggleAbility`
- Handles victory/defeat detection via useEffect
- Maintains action queue for sequential combat execution

### Combat Utils (`combatUtils.ts`)

- `queueCombatRound`: Orchestrates round execution
- `triggerMaskPowers`: Handles mask power activation
- `calculateAtkDmg`: Computes damage with element effectiveness
- `chooseTarget`: Implements targeting strategies
- `generateCombatantStats`: Creates combatant instances from templates

### Current Implementation Status

- ✅ Basic combat flow
- ✅ Wave progression
- ✅ Element effectiveness system
- ✅ Battle strategies (Random, LowestHp, MostEffective)
- ✅ Mask power activation
- ✅ Mask power effect application (ATK_MULT, DMG_MITIGATOR, HEAL, AGGRO, SPEED)
- ✅ Mask power duration tracking (all unit types)
- ✅ Mask power cooldown tracking (all unit types)
- ❌ Advanced mask effects (ACCURACY_MULT, CONFUSION, immobilization)
- ✅ Nuva mask powers (team-wide effects via buffs)
- ❌ Reward distribution
- ❌ Experience gain
