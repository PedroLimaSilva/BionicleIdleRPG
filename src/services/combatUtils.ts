import { COMBATANT_DEX, MASK_POWERS } from '../data/combat';
import {
  BattleStrategy,
  Combatant,
  EnemyEncounter,
  NuiRamaVariant,
  TargetEffect,
} from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';
import { emitBattleCameraEmphasis } from '../utils/battleCameraEmphasis';
import { emitBattleHitFeedback } from '../utils/battleHitFeedback';

declare global {
  interface Window {
    combatantRefs: Record<
      string,
      {
        playAnimation?: (name: string, options?: { faceTargetId?: string }) => Promise<void>;
        waitForAttackComplete?: () => Promise<void>;
      }
    >;
    combatantPositions?: Record<string, [number, number, number]>;
  }
}

/**
 * Main 6: symmetric effectiveness built from two interlocking
 * Hamiltonian cycles so every element has exactly 2 strengths
 * and 2 weaknesses. If A beats B (1.5×) then B is weak vs A (0.5×).
 * All main-6 row/column sums equal 8.0.
 *
 * Light & Shadow: "Dragon-type" — mutually super-effective (1.5×)
 * against each other, neutral (1.0×) to everything else.
 *
 * Cycle 1 – Water → Fire → Ice → Stone → Air → Earth → Water
 *   Water > Fire   water extinguishes fire
 *   Fire  > Ice    fire melts ice
 *   Ice   > Stone  freeze-thaw shatters brittle stone
 *   Stone > Air    stone blocks wind, immovable
 *   Air   > Earth  wind erosion, sky vs underground
 *   Earth > Water  earth absorbs / dams water
 *
 * Cycle 2 – Earth → Fire → Air → Ice → Water → Stone → Earth
 *   Earth > Fire   earth / dirt smothers fire
 *   Fire  > Air    fire consumes oxygen
 *   Air   > Ice    warm winds melt ice
 *   Ice   > Water  ice freezes water
 *   Water > Stone  water erodes stone over time
 *   Stone > Earth  rock slides displace earth
 *
 *          D E F E N D E R
 *    |    | 🔥  | 🌊  | ❄️  | 🪨  | 🌍  | 💨  | 🌑  | 🌕  |
 * A  | 🔥 | 1.0 | 0.5 | 1.5 | 1.0 | 0.5 | 1.5 | 1.0 | 1.0 |
 * T  | 🌊 | 1.5 | 1.0 | 0.5 | 1.5 | 0.5 | 1.0 | 1.0 | 1.0 |
 * T  | ❄️ | 0.5 | 1.5 | 1.0 | 1.5 | 1.0 | 0.5 | 1.0 | 1.0 |
 * A  | 🪨 | 1.0 | 0.5 | 0.5 | 1.0 | 1.5 | 1.5 | 1.0 | 1.0 |
 * C  | 🌍 | 1.5 | 1.5 | 1.0 | 0.5 | 1.0 | 0.5 | 1.0 | 1.0 |
 * K  | 💨 | 0.5 | 1.0 | 1.5 | 0.5 | 1.5 | 1.0 | 1.0 | 1.0 |
 * E  | 🌑 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.5 |
 * R  | 🌕 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.5 | 1.0 |
 */
export const ELEMENT_EFFECTIVENESS: Record<ElementTribe, Record<ElementTribe, number>> = {
  [ElementTribe.Air]: {
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Earth]: 1.5,
    [ElementTribe.Fire]: 0.5,
    [ElementTribe.Ice]: 1.5,
    [ElementTribe.Light]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Stone]: 0.5,
    [ElementTribe.Water]: 1.0,
  },
  [ElementTribe.Earth]: {
    [ElementTribe.Air]: 0.5,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Fire]: 1.5,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Light]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Stone]: 0.5,
    [ElementTribe.Water]: 1.5,
  },
  [ElementTribe.Fire]: {
    [ElementTribe.Air]: 1.5,
    [ElementTribe.Earth]: 0.5,
    [ElementTribe.Fire]: 1.0,
    [ElementTribe.Ice]: 1.5,
    [ElementTribe.Light]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Water]: 0.5,
  },
  [ElementTribe.Ice]: {
    [ElementTribe.Air]: 0.5,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Fire]: 0.5,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Light]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Stone]: 1.5,
    [ElementTribe.Water]: 1.5,
  },
  [ElementTribe.Light]: {
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Fire]: 1.0,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Light]: 1.0,
    [ElementTribe.Shadow]: 1.5,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Water]: 1.0,
  },
  [ElementTribe.Shadow]: {
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Fire]: 1.0,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Light]: 1.5,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Water]: 1.0,
  },
  [ElementTribe.Stone]: {
    [ElementTribe.Air]: 1.5,
    [ElementTribe.Earth]: 1.5,
    [ElementTribe.Fire]: 1.0,
    [ElementTribe.Ice]: 0.5,
    [ElementTribe.Light]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Water]: 0.5,
  },
  [ElementTribe.Water]: {
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Earth]: 0.5,
    [ElementTribe.Fire]: 1.5,
    [ElementTribe.Ice]: 0.5,
    [ElementTribe.Light]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Stone]: 1.5,
    [ElementTribe.Water]: 1.0,
  },
};

const BASE_HIT_CHANCE = 1;
const CRIT_CHANCE = 0.125;
const CRIT_DAMAGE_MULT = 1.5;

export type AtkDamageResult = { damage: number; isCritical: boolean };

/** Product of active ACCURACY_MULT effects on the attacker (1 = normal accuracy). */
export function getAccuracyMultiplier(combatant: Combatant): number {
  let mult = 1;
  for (const e of combatant.effects ?? []) {
    if (e.type === 'ACCURACY_MULT' && e.durationRemaining > 0) {
      mult *= e.multiplier;
    }
  }
  return mult;
}

/** Whether the attacker's swing connects (Ruru and future accuracy effects). */
export function rollAttackHits(attacker: Combatant): boolean {
  const hitChance = BASE_HIT_CHANCE * getAccuracyMultiplier(attacker);
  if (hitChance >= 1) return true;
  if (hitChance <= 0) return false;
  return Math.random() < hitChance;
}

export function calculateAtkDmg(attacker: Combatant, defender: Combatant): AtkDamageResult {
  // DEFENSE multiplies the defense stat: >1 = fortify, <1 = weaken
  let defenseMult = 1;
  for (const e of defender.effects ?? []) {
    if (e.durationRemaining > 0 && e.type === 'DEFENSE') defenseMult *= e.multiplier;
  }
  const effectiveDefense = defender.defense * defenseMult;
  let rawDamage = Math.max(1, attacker.attack - effectiveDefense);

  // Effects drive changes. ATK_MULT effects stack multiplicatively.
  let atkMult = 1;
  for (const e of attacker.effects ?? []) {
    if (e.type === 'ATK_MULT' && e.durationRemaining > 0 && e.multiplier) {
      atkMult *= e.multiplier;
    }
  }
  if (atkMult !== 1) {
    rawDamage = Math.floor(rawDamage * atkMult);
  }

  const multiplier = ELEMENT_EFFECTIVENESS[attacker.element]?.[defender.element] ?? 1.0;
  const preCrit = Math.max(1, Math.floor((rawDamage + Math.floor(Math.random() * 5)) * multiplier));
  const isCritical = Math.random() >= 1 - CRIT_CHANCE;
  const damage = isCritical ? Math.max(1, Math.floor(preCrit * CRIT_DAMAGE_MULT)) : preCrit;
  return { damage, isCritical };
}

export function applyDamage(target: Combatant, damage: number): Combatant {
  // Effects drive changes. DMG_MITIGATOR multiplies final damage (0 = immunity, 0.5 = half, 1 = normal).
  let mult = 1;
  for (const e of target.effects ?? []) {
    if (e.durationRemaining <= 0) continue;
    if (e.type === 'DMG_MITIGATOR') mult *= e.multiplier;
  }
  const finalDamage = Math.floor(damage * mult);

  return {
    ...target,
    hp: Math.max(0, target.hp - finalDamage),
  };
}

/** Creates a TargetEffect from a mask effect for application to multiple targets (e.g. team-wide Nuva masks). */
function createEffectFromMaskEffect(
  effect: NonNullable<Combatant['maskPower']>['effect'],
  sourceId: string
): TargetEffect | null {
  const dur = effect.duration;
  const amount = dur.amount;

  switch (effect.type) {
    case 'DMG_MITIGATOR': {
      const unit =
        dur.unit === 'turn' || dur.unit === 'round' || dur.unit === 'hit' ? dur.unit : 'round';
      return {
        durationRemaining: amount,
        durationUnit: unit,
        multiplier: effect.multiplier ?? 1,
        sourceId,
        type: 'DMG_MITIGATOR',
      };
    }
    case 'HEAL': {
      const unit = dur.unit === 'turn' || dur.unit === 'round' ? dur.unit : 'turn';
      return {
        durationRemaining: amount,
        durationUnit: unit,
        multiplier: effect.multiplier ?? 0,
        sourceId,
        type: 'HEAL',
      };
    }
    case 'ATK_MULT': {
      const unit = dur.unit === 'attack' || dur.unit === 'round' ? dur.unit : 'round';
      return {
        durationRemaining: amount,
        durationUnit: unit,
        multiplier: effect.multiplier ?? 1,
        sourceId,
        type: 'ATK_MULT',
      };
    }
    case 'AGGRO': {
      const unit = dur.unit === 'turn' || dur.unit === 'round' ? dur.unit : 'turn';
      return {
        durationRemaining: amount,
        durationUnit: unit,
        multiplier: effect.multiplier ?? 0,
        sourceId,
        type: 'AGGRO',
      };
    }
    case 'SPEED':
      return {
        durationRemaining: amount,
        durationUnit: 'round',
        multiplier: effect.multiplier ?? 2,
        sourceId,
        type: 'SPEED',
      };
    case 'DEFENSE': {
      const unit = dur.unit === 'turn' || dur.unit === 'round' ? dur.unit : 'round';
      return {
        durationRemaining: amount,
        durationUnit: unit,
        multiplier: effect.multiplier ?? 1,
        sourceId,
        type: 'DEFENSE',
      };
    }
    case 'ACCURACY_MULT': {
      const unit = dur.unit === 'turn' || dur.unit === 'round' ? dur.unit : 'turn';
      return {
        durationRemaining: amount,
        durationUnit: unit,
        multiplier: effect.multiplier ?? 1,
        sourceId,
        type: 'ACCURACY_MULT',
      };
    }
    case 'CONFUSION': {
      const unit = dur.unit === 'turn' || dur.unit === 'round' ? dur.unit : 'turn';
      return {
        durationRemaining: amount,
        durationUnit: unit,
        sourceId,
        type: 'CONFUSION',
      };
    }
    default:
      return null;
  }
}

/** Applies an effect to a combatant (adds to effects array). */
function applyEffectToCombatant(combatant: Combatant, eff: TargetEffect): Combatant {
  const effects = [...(combatant.effects ?? []), eff];
  return { ...combatant, effects };
}

/** Applies on-attack mask effect to the target (e.g. Akaku DEFENSE, Komau CONFUSION).
 * Only applies when mask is active and target is 'enemy'. */
function applyOnAttackEffectToTarget(
  attacker: Combatant,
  target: Combatant
): { target: Combatant; attacker: Combatant } {
  const effect = attacker.maskPower?.effect;
  if (!attacker.maskPower?.active || attacker.maskPower.target !== 'enemy' || !effect) {
    return { attacker, target };
  }

  // Only DEFENSE and CONFUSION are applied on attack to enemy targets
  if (effect.type !== 'DEFENSE' && effect.type !== 'CONFUSION') {
    return { attacker, target };
  }

  const eff = createEffectFromMaskEffect(effect, attacker.id);
  if (!eff) {
    return { attacker, target };
  }

  const effects = [...(target.effects ?? []), eff];
  return { attacker, target: { ...target, effects } };
}

/** Decrements effect durations for a combatant. Handles all effect types (buffs and debuffs). */
function decrementEffectDurations(
  combatant: Combatant,
  unit: 'attack' | 'hit' | 'turn' | 'round'
): Combatant {
  if (!combatant.effects?.length) return combatant;
  const updatedEffects = combatant.effects
    .map((e) =>
      e.durationUnit === unit && e.durationRemaining > 0
        ? { ...e, durationRemaining: e.durationRemaining - 1 }
        : e
    )
    .filter((e) => e.durationRemaining > 0);
  return { ...combatant, effects: updatedEffects.length > 0 ? updatedEffects : undefined };
}

export function applyHealing(combatant: Combatant): Combatant {
  // Effects drive changes. If combatant has HEAL effect(s), apply them (stack additively).
  let healMult = 0;
  for (const e of combatant.effects ?? []) {
    if (e.type === 'HEAL' && e.durationRemaining > 0 && e.multiplier !== undefined) {
      healMult += e.multiplier;
    }
  }
  if (healMult !== 0) {
    const delta = Math.floor(combatant.maxHp * healMult);
    const newHp = Math.max(0, Math.min(combatant.maxHp, combatant.hp + delta));
    return { ...combatant, hp: newHp };
  }
  return combatant;
}

/**
 * Decrements mask power duration/cooldown for a specific unit type
 */
// exported for unit tests (maskPowerCooldowns.spec.ts)
export function decrementMaskPowerCounter(
  combatant: Combatant,
  unit: 'attack' | 'hit' | 'turn' | 'round' | 'wave'
): Combatant {
  if (!combatant.maskPower) return combatant;

  const updatedMaskPower = { ...combatant.maskPower };
  let changed = false;
  let cooldownJustSetFromExpiry = false;

  // Decrement duration if active and unit matches
  if (
    updatedMaskPower.active &&
    updatedMaskPower.effect.duration.unit === unit &&
    updatedMaskPower.effect.duration.amount > 0
  ) {
    updatedMaskPower.effect = {
      ...updatedMaskPower.effect,
      duration: {
        ...updatedMaskPower.effect.duration,
        amount: updatedMaskPower.effect.duration.amount - 1,
      },
    };

    // Deactivate if duration expires
    if (updatedMaskPower.effect.duration.amount === 0) {
      updatedMaskPower.active = false;
      // Set cooldown when effect expires (use shortName so overrides & positional IDs work)
      const power = MASK_POWERS[updatedMaskPower.shortName];
      if (power) {
        updatedMaskPower.cooldown = {
          ...power.cooldown,
        };
        cooldownJustSetFromExpiry = true;
      }
    }
    changed = true;
  }

  // Decrement cooldown if not active and unit matches (skip if we just set it from expiry)
  if (
    !cooldownJustSetFromExpiry &&
    !updatedMaskPower.active &&
    updatedMaskPower.cooldown.unit === unit &&
    updatedMaskPower.cooldown.amount > 0
  ) {
    updatedMaskPower.cooldown = {
      ...updatedMaskPower.cooldown,
      amount: updatedMaskPower.cooldown.amount - 1,
    };
    changed = true;
  }

  return changed ? { ...combatant, maskPower: updatedMaskPower } : combatant;
}

/**
 * Deactivates mask powers whose effects were applied to other combatants (enemy/allEnemies)
 * when all those effect recipients are dead. Starts cooldown so the mask can be used again.
 */
function deactivateMaskPowersWithDeadTargets(
  team: Combatant[],
  enemies: Combatant[]
): { team: Combatant[]; enemies: Combatant[] } {
  const all = [...team, ...enemies];
  const targetsEnemyOrAll = (mp: { target?: string } | undefined) =>
    mp?.target === 'enemy' || mp?.target === 'allEnemies';

  let nextTeam = team;
  for (const c of team) {
    if (!c.maskPower?.active || !targetsEnemyOrAll(c.maskPower)) continue;

    const recipientsWithEffect = all.filter((x) =>
      x.effects?.some((e) => e.sourceId === c.id && e.durationRemaining > 0)
    );
    const allRecipientsDead =
      recipientsWithEffect.length > 0 && recipientsWithEffect.every((r) => r.hp <= 0);

    if (allRecipientsDead) {
      const power = MASK_POWERS[c.maskPower.shortName];
      const updated = {
        ...c,
        maskPower: {
          ...c.maskPower,
          active: false,
          cooldown: power ? { ...power.cooldown } : c.maskPower.cooldown,
        },
      };
      nextTeam = nextTeam.map((t) => (t.id === c.id ? updated : t));
    }
  }

  return { enemies, team: nextTeam };
}

// exported only for tests
export function chooseTarget(self: Combatant, targets: Combatant[]): Combatant {
  // Filter out untargetable enemies (AGGRO effect with multiplier 0)
  const targetableEnemies = targets.filter((t) => {
    const untargetable = t.effects?.some(
      (e) => e.type === 'AGGRO' && e.multiplier === 0 && e.durationRemaining > 0
    );
    return !untargetable;
  });

  // If all enemies are untargetable, fall back to all targets
  const validTargets = targetableEnemies.length > 0 ? targetableEnemies : targets;

  switch (self.strategy) {
    case BattleStrategy.LowestHp: {
      let lowestHpIndex = 0;
      for (let i = 0; i < validTargets.length; i++) {
        const target = validTargets[i];
        if (validTargets[lowestHpIndex].hp > target.hp) {
          lowestHpIndex = i;
        }
      }
      return validTargets[lowestHpIndex];
    }
    case BattleStrategy.MostEffective: {
      let bestDmgIndex = 0;
      let bestDmg = 0;
      for (let i = 0; i < validTargets.length; i++) {
        const target = validTargets[i];
        const targetDmg = calculateAtkDmg(self, target).damage;
        if (targetDmg > bestDmg) {
          bestDmg = targetDmg;
          bestDmgIndex = i;
        }
      }
      return validTargets[bestDmgIndex];
    }
    case BattleStrategy.Random:
    default:
      return validTargets[Math.floor(Math.random() * validTargets.length)];
  }
}

function triggerMaskPowers(
  turnOrder: (Combatant & { side: string })[],
  currentTeam: Combatant[],
  currentEnemies: Combatant[],
  setTeam: (team: Combatant[]) => void,
  setEnemies: (enemies: Combatant[]) => void,
  enqueue: (step: () => Promise<void>) => void
) {
  const newTurnOrder = [];
  for (const actor of turnOrder) {
    newTurnOrder.push(actor);
    const isTeam = actor.side === 'team';

    const actorList = isTeam ? currentTeam : currentEnemies;

    const self = actorList.find((c) => c.id === actor.id);
    if (!self || self.hp <= 0) continue;

    if (actor.maskPower && actor.willUseAbility) {
      actor.willUseAbility = false;

      const effect = actor.maskPower.effect;
      const originalPower = MASK_POWERS[actor.maskPower.shortName];

      if (actor.maskPower.target === 'team' && isTeam) {
        // Team-wide mask (e.g. Nuva): apply effect to all allies (including caster)
        const eff = createEffectFromMaskEffect(effect, actor.id);
        if (eff) {
          currentTeam = currentTeam.map((t) => (t.hp > 0 ? applyEffectToCombatant(t, eff) : t));
          if (effect.type === 'SPEED') {
            const aliveAllies = currentTeam.filter((t) => t.hp > 0);
            for (const ally of aliveAllies) {
              newTurnOrder.push({ ...ally, side: 'team' });
            }
          }
        }
      } else if (actor.maskPower.target === 'allEnemies') {
        // All-enemies mask (e.g. Ruru): apply effect to every living opponent.
        const eff = createEffectFromMaskEffect(effect, actor.id);
        if (eff) {
          if (isTeam) {
            currentEnemies = currentEnemies.map((e) =>
              e.hp > 0 ? applyEffectToCombatant(e, eff) : e
            );
          } else {
            currentTeam = currentTeam.map((t) =>
              t.hp > 0 ? applyEffectToCombatant(t, eff) : t
            );
          }
        }
      } else if (actor.maskPower.target === 'self') {
        // Self-target: apply effect to caster. Effects drive changes; mask target is only for application.
        const eff = createEffectFromMaskEffect(effect, actor.id);
        if (eff) {
          if (isTeam) {
            currentTeam = currentTeam.map((t) =>
              t.id === actor.id ? applyEffectToCombatant(t, eff) : t
            );
          } else {
            currentEnemies = currentEnemies.map((t) =>
              t.id === actor.id ? applyEffectToCombatant(t, eff) : t
            );
          }
          if (effect.type === 'SPEED') {
            const clonedActor = { ...actor, maskPower: structuredClone(actor.maskPower) };
            newTurnOrder.push(clonedActor);
          }
        }
      }
      // Set active=true and duration on caster (for UI/cooldown; effects drive actual changes)
      const originalDuration = originalPower?.effect.duration ?? effect.duration;
      actor.maskPower = {
        ...actor.maskPower,
        active: true,
        effect: {
          ...actor.maskPower.effect,
          duration: { ...originalDuration },
        },
      };
      if (isTeam) {
        // Merge maskPower + willUseAbility into buffed caster (don't overwrite with actor—would drop buffs)
        currentTeam = currentTeam.map((t) =>
          t.id === actor.id ? { ...t, maskPower: actor.maskPower, willUseAbility: false } : t
        );
      } else {
        currentEnemies = currentEnemies.map((t) => (t.id === actor.id ? actor : t));
      }
    }
  }
  enqueue(async () => {
    setEnemies(currentEnemies);
    setTeam(currentTeam);
  });
  return { currentEnemies, currentTeam, turnOrder: newTurnOrder };
}

export function queueCombatRound(
  team: Combatant[],
  enemies: Combatant[],
  setTeam: (team: Combatant[]) => void,
  setEnemies: (enemies: Combatant[]) => void,
  enqueue: (step: () => Promise<void>) => void,
  getLatestState?: () => { team: Combatant[]; enemies: Combatant[] }
) {
  const all = [
    ...team.map((c) => ({ ...c, side: 'team' })),
    ...enemies.map((c) => ({ ...c, side: 'enemy' })),
  ];
  let turnOrder = all.sort((a, b) => b.speed - a.speed);
  let currentTeam = [...team];
  let currentEnemies = [...enemies];

  const updatedActors = triggerMaskPowers(
    turnOrder,
    currentTeam,
    currentEnemies,
    setTeam,
    setEnemies,
    enqueue
  );
  currentTeam = updatedActors?.currentTeam ?? currentTeam;
  currentEnemies = updatedActors?.currentEnemies ?? currentEnemies;
  turnOrder = updatedActors?.turnOrder ?? turnOrder;

  for (const actor of turnOrder) {
    const isTeam = actor.side === 'team';

    enqueue(async () => {
      const actorList = isTeam ? currentTeam : currentEnemies;
      const opponentList = isTeam ? currentEnemies : currentTeam;

      let self = actorList.find((c) => c.id === actor.id);
      if (!self || self.hp <= 0) {
        return;
      }

      // Apply healing at the start of the turn (e.g., Kaukau - Mask of Water Breathing)
      const oldHp = self.hp;
      const healedSelf = applyHealing(self);
      if (healedSelf.hp !== oldHp) {
        self = healedSelf;
        const newActorList = actorList.map((c) => (c.id === healedSelf.id ? healedSelf : c));
        if (isTeam) {
          currentTeam = newActorList;
          setTeam(currentTeam);
        } else {
          currentEnemies = newActorList;
          setEnemies(currentEnemies);
        }
      }

      // CONFUSION: attack own allies instead of enemies (or self if alone)
      const isConfused = self.effects?.some(
        (e) => e.type === 'CONFUSION' && e.durationRemaining > 0
      );
      const effectiveOpponentList = isConfused
        ? actorList.filter((t) => t.hp > 0 && t.id !== actor.id)
        : opponentList;

      let targets = effectiveOpponentList.filter((t) => t.hp > 0);
      if (targets.length === 0) {
        if (isConfused && self.hp > 0) {
          targets = [self];
        } else {
          return;
        }
      }

      let target = chooseTarget(self, targets);

      // Apply on-attack mask effect to target (Akaku DEFENSE, Komau CONFUSION)
      if (!isConfused) {
        const { target: markedTarget } = applyOnAttackEffectToTarget(self, target);
        target = markedTarget;
      }
      const newOpponentListForMark = opponentList.map((t) => (t.id === target.id ? target : t));
      if (opponentList !== newOpponentListForMark) {
        if (isTeam) currentEnemies = newOpponentListForMark;
        else currentTeam = newOpponentListForMark;
      }

      const attackHits = rollAttackHits(self);
      const { damage, isCritical } = attackHits
        ? calculateAtkDmg(self, target)
        : { damage: 0, isCritical: false };
      const willBeDefeated = attackHits && target.hp - damage <= 0;

      // Expect 3D combatant refs to be globally accessible for now
      const actorRef = window.combatantRefs?.[self.id];
      const targetRef = window.combatantRefs?.[target.id];

      const cameraEmphasisStarted = !!actorRef?.playAnimation;
      if (cameraEmphasisStarted) {
        await emitBattleCameraEmphasis({
          attackerId: self.id,
          attackerSide: isTeam ? 'team' : 'enemy',
          phase: 'start',
          targetId: target.id,
        });
      }

      try {
        // Await Attack - resolves at contact frame (attackResolveAtFraction)
        if (actorRef?.playAnimation) {
          await actorRef.playAnimation('Attack', { faceTargetId: target.id });
        }

        // Apply damage and update state when contact occurs (HP bar drops at impact)
        let updatedTarget = attackHits ? applyDamage(target, damage) : target;
        const damageDealt = attackHits ? target.hp - updatedTarget.hp : 0;
        if (damageDealt > 0) {
          emitBattleHitFeedback({
            attackerElement: self.element,
            damageDealt,
            isCritical,
            reactionAnimation: willBeDefeated ? 'Defeat' : 'Hit',
            targetId: target.id,
            targetMaxHp: target.maxHp,
            targetModel: target.model,
          });
        }

        // Decrement 'attack' unit counters for attacker (mask + buffs)
        self = decrementMaskPowerCounter(self, 'attack');
        self = decrementEffectDurations(self, 'attack');

        // Decrement 'hit' unit counters for defender (mask + buffs)
        if (attackHits) {
          updatedTarget = decrementMaskPowerCounter(updatedTarget, 'hit');
          updatedTarget = decrementEffectDurations(updatedTarget, 'hit');
        }

        // Decrement 'turn' unit counters ONLY for the combatant whose turn it is
        self = decrementMaskPowerCounter(self, 'turn');
        self = decrementEffectDurations(self, 'turn');

        // Update both attacker and defender in their respective lists
        // When confused, target is in actorList (attacking allies), so update both in actorList
        // self already has turn-based effects decremented above
        const currentSelf = self!;
        const nextActorList: Combatant[] = actorList.map((c) =>
          c.id === currentSelf.id ? currentSelf : c.id === updatedTarget.id ? updatedTarget : c
        );
        const nextOpponentList: Combatant[] = opponentList.map((t) =>
          t.id === updatedTarget.id ? updatedTarget : t
        );

        if (isTeam) {
          currentTeam = nextActorList;
          currentEnemies = nextOpponentList;
        } else {
          currentTeam = nextOpponentList;
          currentEnemies = nextActorList;
        }

        // Deactivate mask powers (e.g. Komau) when all effect targets die
        const { team: teamAfterDeactivation } = deactivateMaskPowersWithDeadTargets(
          currentTeam,
          currentEnemies
        );
        currentTeam = teamAfterDeactivation;

        setTeam(currentTeam);
        setEnemies(currentEnemies);

        // Wait for both the full Attack clip and the target reaction to finish before
        // proceeding. The Attack promise resolved at contact frame, but the clip keeps
        // playing; waitForAttackComplete resolves when the clip actually ends.
        const pendingAnimations: Promise<void>[] = [];

        if (actorRef?.waitForAttackComplete) {
          pendingAnimations.push(actorRef.waitForAttackComplete());
        }

        // Await target reaction so next turn doesn't start before hit/defeat finishes.
        // Skip when attacker === target (e.g. confused with no other valid targets): same 3D ref
        // and Hit/Defeat runs stopAllAction(), which would cancel the in-progress Attack clip.
        // Skip when targetRef === actorRef with different ids (stale combatantRefs map): Hit would
        // run on the attacker's mixer and cancel Attack.
        if (
          attackHits &&
          target.id !== self.id &&
          targetRef?.playAnimation &&
          targetRef !== actorRef
        ) {
          if (willBeDefeated) {
            pendingAnimations.push(targetRef.playAnimation('Defeat', { faceTargetId: self.id }));
          } else {
            pendingAnimations.push(targetRef.playAnimation('Hit', { faceTargetId: self.id }));
          }
        }

        await Promise.all(pendingAnimations);
      } finally {
        if (cameraEmphasisStarted) {
          // Fire-and-forget: the zoom-out starts immediately, but we don't block
          // the next turn. If another combatant acts next, its 'start' event will
          // interrupt the zoom-out mid-transition and smoothly retarget to the new
          // shoulder position (snapshot-based). After the final turn of the round,
          // no 'start' arrives so the zoom-out completes naturally back to base.
          void emitBattleCameraEmphasis({ phase: 'end' });
        }
      }
    });
  }

  // Always run round-end decrements as a final step so mask powers expire correctly
  // regardless of turn order or early exits (e.g. all enemies defeated mid-round)
  enqueue(async () => {
    // Sync with latest state when provided (avoids stale closure when steps update external state)
    if (getLatestState) {
      const latest = getLatestState();
      currentTeam = latest.team;
      currentEnemies = latest.enemies;
    }
    // Deactivate mask powers (e.g. Komau) when all effect targets died this round
    const { team: teamAfterDeactivation } = deactivateMaskPowersWithDeadTargets(
      currentTeam,
      currentEnemies
    );
    currentTeam = teamAfterDeactivation;

    const nextTeam = currentTeam.map((c) =>
      decrementEffectDurations(decrementMaskPowerCounter(c, 'round'), 'round')
    );
    const nextEnemies = currentEnemies.map((c) =>
      decrementEffectDurations(decrementMaskPowerCounter(c, 'round'), 'round')
    );
    currentTeam = nextTeam;
    currentEnemies = nextEnemies;
    setTeam(currentTeam);
    setEnemies(currentEnemies);
  });
}

/**
 * Returns true if any alive combatant has a buff or debuff with sourceId (durationRemaining > 0).
 * Used as source of truth for mask UI (caster glow while effect is active).
 * Effects on dead combatants are ignored—e.g. Komau confusion on a dead enemy stops the mask glow.
 */
export function hasActiveEffectFromSource(
  team: Combatant[],
  enemies: Combatant[],
  sourceId: string
): boolean {
  const hasFrom = (list: Combatant[]) =>
    list.some(
      (c) => c.hp > 0 && c.effects?.some((e) => e.sourceId === sourceId && e.durationRemaining > 0)
    );
  return hasFrom(team) || hasFrom(enemies);
}

/**
 * Returns true if any alive team member has a mask power off cooldown and not currently active.
 * Uses buffs/debuffs as source of truth for "active" when enemies provided.
 */
export function hasReadyMaskPowers(team: Combatant[], enemies: Combatant[] = []): boolean {
  return team.some((c) => {
    if (c.hp <= 0 || !c.maskPower || c.maskPower.cooldown.amount !== 0) return false;
    const maskActive = c.maskPower.active || hasActiveEffectFromSource(team, enemies, c.id);
    return !maskActive;
  });
}

/**
 * Decrements wave-based mask power counters for all combatants
 * Should be called when advancing to a new wave
 */
export function decrementWaveCounters(combatants: Combatant[]): Combatant[] {
  return combatants.map((c) => decrementMaskPowerCounter(c, 'wave'));
}

/** When true and combatant is Toa Nuva, stats are reduced (Nuva symbols sequestered). */
const NUVA_SEQUESTERED_STAT_MULTIPLIER = 0.7;

const TOA_NUVA_TEMPLATE_IDS = [
  'Toa_Tahu_Nuva',
  'Toa_Gali_Nuva',
  'Toa_Pohatu_Nuva',
  'Toa_Onua_Nuva',
  'Toa_Kopaka_Nuva',
  'Toa_Lewa_Nuva',
] as const;

export interface GenerateCombatantStatsOptions {
  maskOverride?: Mask;
  /** When true and templateId is Toa Nuva, stats are diminished. */
  nuvaSymbolsSequestered?: boolean;
  /** Custom Toa Mata: which Mata model branch `CombatantModel` should render. */
  mataRenderModelId?: string;
}

/** Stable pseudo-random jaw variant per spawn id (prep + battle use the same id → same look). */
function nuiRamaVariantFromInstanceId(instanceId: string): NuiRamaVariant {
  let h = 0;
  for (let i = 0; i < instanceId.length; i++) {
    h = Math.imul(31, h) + instanceId.charCodeAt(i);
  }
  return (h >>> 0) % 2 === 0 ? 'orange' : 'lime';
}

export function generateCombatantStats(
  id: string,
  templateId: string,
  lvl: number,
  options?: GenerateCombatantStatsOptions | Mask
): Combatant {
  // Backward compat: allow (maskOverride) as 4th/5th args
  const opts: GenerateCombatantStatsOptions =
    options !== undefined &&
    typeof options === 'object' &&
    options !== null &&
    !('shortName' in options)
      ? (options as GenerateCombatantStatsOptions)
      : { maskOverride: options as Mask | undefined };

  const template = COMBATANT_DEX[templateId];
  if (!template) {
    console.error('Missing base stats for ', templateId);
  }

  let maxHp = template.baseHp + lvl * 10;
  let attack = template.baseAttack + lvl * 3;
  let defense = template.baseDefense + lvl * 2;
  let speed = template.baseSpeed + lvl * 1;

  const isToaNuva = TOA_NUVA_TEMPLATE_IDS.includes(
    templateId as (typeof TOA_NUVA_TEMPLATE_IDS)[number]
  );
  if (opts.nuvaSymbolsSequestered && isToaNuva) {
    const mult = NUVA_SEQUESTERED_STAT_MULTIPLIER;
    maxHp = Math.max(1, Math.floor(maxHp * mult));
    attack = Math.max(1, Math.floor(attack * mult));
    defense = Math.max(0, Math.floor(defense * mult));
    speed = Math.max(1, Math.floor(speed * mult));
  }

  const mask = opts.maskOverride || template.mask;
  const maskPower = mask && structuredClone(MASK_POWERS[mask]);
  if (maskPower) {
    maskPower.cooldown.amount = 0;
  }

  const nuiRamaVariant: NuiRamaVariant | undefined =
    templateId === 'nui_rama' ? nuiRamaVariantFromInstanceId(id) : undefined;

  return {
    id,
    model: template.model,
    ...(opts.mataRenderModelId && { mataRenderModelId: opts.mataRenderModelId }),
    name: template.name,
    ...(nuiRamaVariant && { nuiRamaVariant }),
    attack,
    defense,
    element: template.element,
    hp: maxHp,
    lvl,
    maskPower,
    maxHp,
    speed,
    strategy: template.strategy || BattleStrategy.Random,
    willUseAbility: false,
  };
}

/**
 * Extra enemy levels for party-scaled solo Rahkshi (one enemy vs full party) — offsets
 * the action-economy gap so the lone Rahkshi is not effectively several levels behind.
 */
export const RAHKSHI_SOLO_PARTY_LEVEL_BONUS = 3;

/** Resolves enemy level for a wave when `scalesWithParty` is used (Rahkshi). */
export function getScaledEnemyLevelForEncounter(
  encounter: EnemyEncounter,
  waveUnits: { id: string; lvl: number }[],
  waveBaseLevel: number,
  avgPartyLevel: number
): number {
  if (!encounter.scalesWithParty) return waveBaseLevel;
  const soloBonus = waveUnits.length === 1 ? RAHKSHI_SOLO_PARTY_LEVEL_BONUS : 0;
  return Math.max(waveBaseLevel, avgPartyLevel + soloBonus);
}
