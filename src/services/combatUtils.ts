import { COMBATANT_DEX, MASK_POWERS } from '../data/combat';
import { BattleStrategy, Combatant, TargetEffect } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';

declare global {
  interface Window {
    combatantRefs: Record<
      string,
      { playAnimation?: (name: string, options?: { faceTargetId?: string }) => Promise<void> }
    >;
    combatantPositions?: Record<string, [number, number, number]>;
  }
}

/**
 *          D E F E N D E R
 *    |    | 🔥  | 🌊  | ❄️  | 🪨  | 🌍  | 💨  | 🌑  | 🌕  |
 * A  | 🔥 | 1.0 | 1.0 | 1.5 | 1.0 | 0.5 | 1.5 | 1.0 | 1.0 |
 * T  | 🌊 | 1.5 | 1.0 | 0.5 | 1.5 | 1.0 | 1.0 | 1.0 | 1.0 |
 * T  | ❄️ | 0.5 | 1.5 | 1.0 | 1.5 | 1.0 | 1.0 | 1.0 | 1.0 |
 * A  | 🪨 | 1.0 | 0.5 | 1.5 | 1.0 | 1.0 | 1.5 | 1.0 | 1.0 |
 * C  | 🌍 | 1.5 | 1.0 | 1.0 | 1.0 | 1.0 | 0.5 | 1.0 | 1.0 |
 * K  | 💨 | 1.5 | 1.0 | 1.0 | 1.0 | 1.5 | 1.0 | 1.0 | 1.0 |
 * E  | 🌑 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.5 | 1.5 |
 * R  | 🌕 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.5 | 0.5 |
 */
export const ELEMENT_EFFECTIVENESS: Record<ElementTribe, Record<ElementTribe, number>> = {
  [ElementTribe.Fire]: {
    [ElementTribe.Fire]: 1.0,
    [ElementTribe.Water]: 1.0,
    [ElementTribe.Ice]: 1.5,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Earth]: 0.5,
    [ElementTribe.Air]: 1.5,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Light]: 1.0,
  },
  [ElementTribe.Water]: {
    [ElementTribe.Fire]: 1.5,
    [ElementTribe.Water]: 1.0,
    [ElementTribe.Ice]: 0.5,
    [ElementTribe.Stone]: 1.5,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Light]: 1.0,
  },
  [ElementTribe.Ice]: {
    [ElementTribe.Fire]: 0.5,
    [ElementTribe.Water]: 1.5,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Stone]: 1.5,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Light]: 1.0,
  },
  [ElementTribe.Stone]: {
    [ElementTribe.Fire]: 1.0,
    [ElementTribe.Water]: 0.5,
    [ElementTribe.Ice]: 1.5,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Air]: 1.5,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Light]: 1.0,
  },
  [ElementTribe.Earth]: {
    [ElementTribe.Fire]: 1.5,
    [ElementTribe.Water]: 1.0,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Air]: 0.5,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Light]: 1.0,
  },
  [ElementTribe.Air]: {
    [ElementTribe.Fire]: 1.5,
    [ElementTribe.Water]: 1.0,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Earth]: 1.5,
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Shadow]: 1.0,
    [ElementTribe.Light]: 1.0,
  },
  [ElementTribe.Shadow]: {
    [ElementTribe.Fire]: 1.0,
    [ElementTribe.Water]: 1.0,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Shadow]: 0.5,
    [ElementTribe.Light]: 1.5,
  },
  [ElementTribe.Light]: {
    [ElementTribe.Fire]: 1.0,
    [ElementTribe.Water]: 1.0,
    [ElementTribe.Ice]: 1.0,
    [ElementTribe.Stone]: 1.0,
    [ElementTribe.Earth]: 1.0,
    [ElementTribe.Air]: 1.0,
    [ElementTribe.Shadow]: 1.5,
    [ElementTribe.Light]: 0.5,
  },
};

export function calculateAtkDmg(attacker: Combatant, defender: Combatant): number {
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
  const final = Math.floor((rawDamage + Math.floor(Math.random() * 5)) * multiplier);
  return Math.max(1, final);
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
        type: 'DMG_MITIGATOR',
        multiplier: effect.multiplier ?? 1,
        durationRemaining: amount,
        durationUnit: unit,
        sourceId,
      };
    }
    case 'HEAL': {
      const unit = dur.unit === 'turn' || dur.unit === 'round' ? dur.unit : 'turn';
      return {
        type: 'HEAL',
        multiplier: effect.multiplier ?? 0,
        durationRemaining: amount,
        durationUnit: unit,
        sourceId,
      };
    }
    case 'ATK_MULT': {
      const unit = dur.unit === 'attack' || dur.unit === 'round' ? dur.unit : 'round';
      return {
        type: 'ATK_MULT',
        multiplier: effect.multiplier ?? 1,
        durationRemaining: amount,
        durationUnit: unit,
        sourceId,
      };
    }
    case 'AGGRO': {
      const unit = dur.unit === 'turn' || dur.unit === 'round' ? dur.unit : 'turn';
      return {
        type: 'AGGRO',
        multiplier: effect.multiplier ?? 0,
        durationRemaining: amount,
        durationUnit: unit,
        sourceId,
      };
    }
    case 'SPEED':
      return {
        type: 'SPEED',
        multiplier: effect.multiplier ?? 2,
        durationRemaining: amount,
        durationUnit: 'round',
        sourceId,
      };
    default:
      return null;
  }
}

/** Applies an effect to a combatant (adds to effects array). */
function applyEffectToCombatant(combatant: Combatant, eff: TargetEffect): Combatant {
  const effects = [...(combatant.effects ?? []), eff];
  return { ...combatant, effects };
}

/** Applies DEBUFF mask effect to the defender. Does NOT extend attacker's mask duration (would cause
 * re-application on each attack). The mask's original 1-attack duration gets consumed by decrementMaskPowerCounter. */
function applyDebuffToTarget(
  attacker: Combatant,
  target: Combatant
): { target: Combatant; attacker: Combatant } {
  const effect = attacker.maskPower?.effect;
  if (
    !attacker.maskPower?.active ||
    effect?.type !== 'DEBUFF' ||
    attacker.maskPower.target !== 'enemy' ||
    !effect?.debuffDuration
  ) {
    return { target, attacker };
  }

  const durationUnit =
    effect.debuffDuration.unit === 'turn' || effect.debuffDuration.unit === 'round'
      ? effect.debuffDuration.unit
      : 'turn';

  if (effect.debuffType === 'DEFENSE' && effect.multiplier) {
    const eff: TargetEffect = {
      type: 'DEFENSE',
      multiplier: effect.multiplier,
      durationRemaining: effect.debuffDuration.amount,
      durationUnit,
      sourceId: attacker.id,
    };
    const effects = [...(target.effects ?? []), eff];
    return { target: { ...target, effects }, attacker };
  }

  if (effect.debuffType === 'CONFUSION') {
    const eff: TargetEffect = {
      type: 'CONFUSION',
      durationRemaining: effect.debuffDuration.amount,
      durationUnit,
      sourceId: attacker.id,
    };
    const effects = [...(target.effects ?? []), eff];
    return { target: { ...target, effects }, attacker };
  }

  return { target, attacker };
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
        updatedMaskPower.effect.cooldown = {
          ...power.effect.cooldown,
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
    updatedMaskPower.effect.cooldown.unit === unit &&
    updatedMaskPower.effect.cooldown.amount > 0
  ) {
    updatedMaskPower.effect = {
      ...updatedMaskPower.effect,
      cooldown: {
        ...updatedMaskPower.effect.cooldown,
        amount: updatedMaskPower.effect.cooldown.amount - 1,
      },
    };
    changed = true;
  }

  return changed ? { ...combatant, maskPower: updatedMaskPower } : combatant;
}

// exported only for tests
export function chooseTarget(self: Combatant, targets: Combatant[]): Combatant {
  // Filter out untargetable enemies (AGGRO effect with multiplier 0)
  const targetableEnemies = targets.filter((t) => {
    const untargetable = t.effects?.some((e) => e.type === 'AGGRO' && e.multiplier === 0 && e.durationRemaining > 0);
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
        const targetDmg = calculateAtkDmg(self, target);
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
  return { currentTeam, currentEnemies, turnOrder: newTurnOrder };
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

      // Apply DEBUFF mask effect to target (Akaku, Komau)
      if (!isConfused) {
        const { target: markedTarget } = applyDebuffToTarget(self, target);
        target = markedTarget;
      }
      const newOpponentListForMark = opponentList.map((t) => (t.id === target.id ? target : t));
      if (opponentList !== newOpponentListForMark) {
        if (isTeam) currentEnemies = newOpponentListForMark;
        else currentTeam = newOpponentListForMark;
      }

      const damage = calculateAtkDmg(self, target);
      const willBeDefeated = target.hp - damage <= 0;

      // Expect 3D combatant refs to be globally accessible for now
      const actorRef = window.combatantRefs?.[self.id];
      const targetRef = window.combatantRefs?.[target.id];

      // Await Attack - resolves at contact frame (attackResolveAtFraction)
      if (actorRef?.playAnimation) {
        await actorRef.playAnimation('Attack', { faceTargetId: target.id });
      }

      // Apply damage and update state when contact occurs (HP bar drops at impact)
      let updatedTarget = applyDamage(target, damage);

      // Decrement 'attack' unit counters for attacker (mask + buffs)
      self = decrementMaskPowerCounter(self, 'attack');
      self = decrementEffectDurations(self, 'attack');

      // Decrement 'hit' unit counters for defender (mask + buffs)
      updatedTarget = decrementMaskPowerCounter(updatedTarget, 'hit');
      updatedTarget = decrementEffectDurations(updatedTarget, 'hit');

      // Decrement 'turn' unit counters ONLY for the combatant whose turn it is
      self = decrementMaskPowerCounter(self, 'turn');
      self = decrementEffectDurations(self, 'turn');

      // Update both attacker and defender in their respective lists
      // When confused, target is in actorList (attacking allies), so update both in actorList
      // self already has turn-based effects decremented above
      const nextActorList = actorList.map((c) =>
        c.id === self.id ? self : c.id === updatedTarget.id ? updatedTarget : c
      );
      const nextOpponentList = opponentList.map((t) =>
        t.id === updatedTarget.id ? updatedTarget : t
      );

      if (isTeam) {
        currentTeam = nextActorList;
        currentEnemies = nextOpponentList;
        setTeam(currentTeam);
        setEnemies(currentEnemies);
      } else {
        currentTeam = nextOpponentList;
        currentEnemies = nextActorList;
        setTeam(currentTeam);
        setEnemies(currentEnemies);
      }

      // Await target reaction so next turn doesn't start before hit/defeat finishes
      if (targetRef?.playAnimation) {
        if (willBeDefeated) {
          await targetRef.playAnimation('Defeat', { faceTargetId: self.id });
        } else {
          await targetRef.playAnimation('Hit', { faceTargetId: self.id });
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
 * Returns true if any buff or debuff with sourceId exists on team or enemies (durationRemaining > 0).
 * Used as source of truth for mask UI (caster glow while effect is active).
 */
export function hasActiveEffectFromSource(
  team: Combatant[],
  enemies: Combatant[],
  sourceId: string
): boolean {
  const hasFrom = (list: Combatant[]) =>
    list.some((c) => c.effects?.some((e) => e.sourceId === sourceId && e.durationRemaining > 0));
  return hasFrom(team) || hasFrom(enemies);
}

/**
 * Returns true if any alive team member has a mask power off cooldown and not currently active.
 * Uses buffs/debuffs as source of truth for "active" when enemies provided.
 */
export function hasReadyMaskPowers(team: Combatant[], enemies: Combatant[] = []): boolean {
  return team.some((c) => {
    if (c.hp <= 0 || !c.maskPower || c.maskPower.effect.cooldown.amount !== 0) return false;
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
    maskPower.effect.cooldown.amount = 0;
  }

  return {
    id,
    name: template.name,
    model: template.model,
    lvl,
    maskPower,
    element: template.element,
    maxHp,
    hp: maxHp,
    attack,
    defense,
    speed,
    strategy: template.strategy || BattleStrategy.Random,
    willUseAbility: false,
  };
}
