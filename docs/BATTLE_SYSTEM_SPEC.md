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
   - Mask powers can only be enabled if:
     - Cooldown has expired (cooldown.amount === 0) AND
     - No active effects with sourceId === combatant.id exist on any combatant
   - User can toggle mask powers on/off before running the round
   - Visual indicator shows which powers are ready vs on cooldown vs active (effects still present)

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
   - Decrement effect durations (for all effects on all combatants)
   - Decrement mask power durations (for active mask powers)
   - When mask power duration expires, set cooldown and deactivate
   - Decrement mask power cooldowns (for inactive mask powers)
   - Remove expired effects from combatants' `effects` arrays
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
  target: 'self' | 'enemy' | 'allEnemies' | 'team'; // Who the mask affects when activated
  cooldown: CombatDuration; // Mask power cooldown (starts after effect duration expires)
  effect: MaskEffect; // Template for creating effects
  active?: boolean; // Whether the power is currently active (UI state)
}

interface MaskEffect {
  type:
    | 'ATK_MULT'
    | 'DMG_MITIGATOR'
    | 'HEAL'
    | 'AGGRO'
    | 'SPEED'
    | 'ACCURACY_MULT'
    | 'DEFENSE'
    | 'CONFUSION';
  duration: CombatDuration; // Template: how long created effects last
  multiplier?: number; // Effect strength
}

interface CombatDuration {
  unit: 'attack' | 'hit' | 'turn' | 'round' | 'wave';
  amount: number;
}

// Applied effect on a combatant (created from MaskEffect template)
type TargetEffect = {
  type: 'DMG_MITIGATOR' | 'HEAL' | 'ATK_MULT' | 'AGGRO' | 'SPEED' | 'DEFENSE' | 'CONFUSION';
  multiplier: number; // Effect strength (can be negative for debuffs)
  durationRemaining: number; // Decrements each matching unit
  durationUnit: 'attack' | 'hit' | 'turn' | 'round';
  sourceId: string; // ID of the combatant who created this effect
};
```

### Mask Powers as Buffs/Debuffs

Mask powers can apply effects to multiple targets:

- **target: 'self'** – Effect applied to the caster (e.g. Pakari, Hau, Kaukau)
- **target: 'enemy'** – Effect applied to attacked enemy (e.g. Akaku, Komau)
- **target: 'allEnemies'** – Effect applied to all enemies (e.g. Ruru)
- **target: 'team'** – Effect applied to all allies including caster (Nuva masks)

**Key Separation of Concerns:**

- **Mask Powers** have `target` (who to apply to) and `cooldown` (when can use again)
- **Effects** have `sourceId` (who created it) and `durationRemaining` (how long it lasts)

When a mask is activated, it creates `TargetEffect` instances on the appropriate combatants based on `target`. All effects use a single unified `effects` array on each combatant. Each effect tracks:

- `sourceId`: The combatant who activated the mask power
- `durationRemaining`/`durationUnit`: How long the effect lasts
- `type` and `multiplier`: What the effect does

**Effects drive all combat changes.** The mask power's `active` flag is just UI state. The actual "is this mask power active?" check is: `hasActiveEffectFromSource(team, enemies, combatant.id)` which returns true if ANY combatant has an effect with matching `sourceId` and `durationRemaining > 0`.

### Mask Power Lifecycle

1. **Initialization**: Cooldown starts at 0 (ready to use)
2. **Activation**: User toggles `willUseAbility` before round
3. **Trigger**: At start of round, power activates:
   - `active = true` on the mask power (UI state)
   - `TargetEffect` created with `sourceId` and added to target combatant(s)' `effects` array
   - Effect has `durationRemaining` (copied from mask's `effect.duration.amount`)
4. **Effect Duration**: Effect applies during combat while `durationRemaining > 0`
   - Effect duration decrements based on `durationUnit` (attack/hit/turn/round)
   - Effect is removed from combatant when `durationRemaining` reaches 0
5. **Cooldown Start**: When ALL effects with `sourceId === combatant.id` expire:
   - Mask power `active` flag set to `false`
   - Cooldown counter is set from `MASK_POWERS[shortName].effect.cooldown`
   - Cooldown decrements each matching unit
6. **Ready**: When cooldown reaches 0 AND no effects exist, power can be used again

### Duration & Cooldown Units

**Effect Duration Units** (when effects decrement):

- **attack**: Counts down when the affected combatant attacks
- **hit**: Counts down when the affected combatant is hit
- **turn**: Counts down after the affected combatant's turn
- **round**: Counts down after all combatants have acted

**Mask Power Duration Units** (when mask power `active` flag duration decrements):

- Same as effect duration units above
- When mask power duration reaches 0, `active` is set to false and cooldown starts

**Mask Power Cooldown Units** (when cooldown decrements):

- **turn**: Counts down after each combatant's turn
- **round**: Counts down after all combatants have acted
- **wave**: Counts down when a new wave starts

**Important:** Cooldown only starts decrementing AFTER all effects with `sourceId === combatant.id` have expired (durationRemaining === 0).

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
- ✅ Komau CONFUSION effect
- ✅ Reward distribution (EXP, loot, Krana)
- ✅ Experience gain (persisted on Collect Rewards)
- ❌ Advanced mask effects (ACCURACY_MULT for Ruru, Matatu immobilize)
- ✅ Nuva mask powers (team-wide effects)
