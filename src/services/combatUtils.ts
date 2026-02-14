import { COMBATANT_DEX, MASK_POWERS } from '../data/combat';
import { LegoColor } from '../types/Colors';
import { BattleStrategy, Combatant, TargetDebuff } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';

declare global {
  interface Window {
    combatantRefs: Record<string, { playAnimation?: (name: string) => Promise<void> }>;
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
const elementEffectiveness: Record<ElementTribe, Record<ElementTribe, number>> = {
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

export function calculateAtkDmg(
  attacker: Combatant,
  defender: Combatant,
  attackerSide?: 'team' | 'enemy'
): number {
  let rawDamage = Math.max(1, attacker.attack - defender.defense);

  // Apply attacker's ATK_MULT mask power (e.g., Pakari - Mask of Strength)
  if (
    attacker.maskPower?.active &&
    attacker.maskPower.effect.type === 'ATK_MULT' &&
    attacker.maskPower.effect.target === 'self' &&
    attacker.maskPower.effect.multiplier
  ) {
    rawDamage = Math.floor(rawDamage * attacker.maskPower.effect.multiplier);
  }

  // Apply DEFENSE debuff on defender: allies deal +multiplier damage (e.g. Akaku)
  const defenseDebuff = defender.debuffs?.find(
    (d) => d.type === 'DEFENSE' && attackerSide !== undefined && d.sourceSide === attackerSide
  );
  if (defenseDebuff?.type === 'DEFENSE') {
    rawDamage = Math.floor(rawDamage * defenseDebuff.multiplier);
  }

  const multiplier = elementEffectiveness[attacker.element]?.[defender.element] ?? 1.0;
  const final = Math.floor((rawDamage + Math.floor(Math.random() * 5)) * multiplier);
  return Math.max(1, final);
}

export function applyDamage(target: Combatant, damage: number): Combatant {
  let finalDamage = damage;

  // Apply defender's DMG_MITIGATOR mask power (e.g., Hau - Mask of Shielding, Miru - Mask of Levitation)
  if (
    target.maskPower?.active &&
    target.maskPower.effect.type === 'DMG_MITIGATOR' &&
    target.maskPower.effect.multiplier !== undefined
  ) {
    finalDamage = Math.floor(damage * target.maskPower.effect.multiplier);
  }

  return {
    ...target,
    hp: Math.max(0, target.hp - finalDamage),
  };
}

/** Applies DEBUFF mask effect to the defender (e.g. Akaku DEFENSE, Komau CONFUSION). */
function applyDebuffToTarget(
  attacker: Combatant,
  target: Combatant,
  attackerSide: 'team' | 'enemy'
): Combatant {
  const effect = attacker.maskPower?.effect;
  if (
    !attacker.maskPower?.active ||
    effect?.type !== 'DEBUFF' ||
    effect?.target !== 'enemy' ||
    !effect?.debuffDuration
  ) {
    return target;
  }

  const durationUnit =
    effect.debuffDuration.unit === 'turn' || effect.debuffDuration.unit === 'round'
      ? effect.debuffDuration.unit
      : 'turn';

  if (effect.debuffType === 'DEFENSE' && effect.multiplier) {
    const debuff: TargetDebuff = {
      type: 'DEFENSE',
      multiplier: effect.multiplier,
      durationRemaining: effect.debuffDuration.amount,
      durationUnit,
      sourceSide: attackerSide,
    };
    const existingDebuffs = target.debuffs ?? [];
    return { ...target, debuffs: [...existingDebuffs, debuff] };
  }

  if (effect.debuffType === 'CONFUSION') {
    const debuff: TargetDebuff = {
      type: 'CONFUSION',
      durationRemaining: effect.debuffDuration.amount,
      durationUnit,
      sourceSide: attackerSide,
    };
    const existingDebuffs = target.debuffs ?? [];
    return { ...target, debuffs: [...existingDebuffs, debuff] };
  }

  return target;
}

/** Decrements debuff durations. For 'turn': only on the combatant whose turn it is. For 'round': all. */
function decrementDebuffDurations(
  combatants: Combatant[],
  unit: 'turn' | 'round',
  onlyForCombatantId?: string
): Combatant[] {
  return combatants.map((c) => {
    if (!c.debuffs?.length) return c;
    if (unit === 'turn' && onlyForCombatantId !== undefined && c.id !== onlyForCombatantId) {
      return c;
    }
    const updatedDebuffs = c.debuffs
      .map((d) =>
        d.durationUnit === unit && d.durationRemaining > 0
          ? { ...d, durationRemaining: d.durationRemaining - 1 }
          : d
      )
      .filter((d) => d.durationRemaining > 0);
    return { ...c, debuffs: updatedDebuffs.length > 0 ? updatedDebuffs : undefined };
  });
}

export function applyHealing(combatant: Combatant): Combatant {
  // Apply HEAL mask power (e.g., Kaukau - Mask of Water Breathing)
  if (
    combatant.maskPower?.active &&
    combatant.maskPower.effect.type === 'HEAL' &&
    combatant.maskPower.effect.multiplier !== undefined
  ) {
    const healAmount = Math.floor(combatant.maxHp * combatant.maskPower.effect.multiplier);
    return {
      ...combatant,
      hp: Math.min(combatant.maxHp, combatant.hp + healAmount),
    };
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
  // Filter out untargetable enemies (AGGRO mask power with multiplier 0)
  const targetableEnemies = targets.filter(
    (t) =>
      !(
        t.maskPower?.active &&
        t.maskPower.effect.type === 'AGGRO' &&
        t.maskPower.effect.multiplier === 0
      )
  );

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

      // Reset duration to original value from MASK_POWERS when (re-)activating,
      // and create new maskPower/effect objects to avoid shared-reference mutations.
      const originalPower = MASK_POWERS[actor.maskPower.shortName];
      const originalDuration = originalPower?.effect.duration ?? actor.maskPower.effect.duration;
      actor.maskPower = {
        ...actor.maskPower,
        active: true,
        effect: {
          ...actor.maskPower.effect,
          duration: { ...originalDuration },
        },
      };

      // Special case: SPEED mask grants an extra turn this round
      if (actor.maskPower.effect.type === 'SPEED') {
        // Clone the actor for the second turn to avoid object mutation issues
        const clonedActor = { ...actor, maskPower: structuredClone(actor.maskPower) };
        newTurnOrder.push(clonedActor);
      }

      console.log('activating mask power', actor.id, actor.maskPower);
      if (isTeam) {
        currentTeam = currentTeam.map((t) => (t.id === actor.id ? actor : t));
      } else {
        currentEnemies = currentEnemies.map((t) => (t.id === actor.id ? actor : t));
      }
    }
  }
  enqueue(async () => {
    // Apply mask powers
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
        console.log(`${healedSelf.id} healed for ${healedSelf.hp - oldHp} HP`);
      }

      // CONFUSION: attack own allies instead of enemies (or self if alone)
      const isConfused = self.debuffs?.some(
        (d) => d.type === 'CONFUSION' && d.durationRemaining > 0
      );
      const effectiveOpponentList = isConfused
        ? actorList.filter((t) => t.hp > 0 && t.id !== self.id)
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

      // Apply DEBUFF mask effect to target (e.g. Akaku DEFENSE, Komau CONFUSION) - only when not confused
      if (!isConfused) {
        target = applyDebuffToTarget(self, target, isTeam ? 'team' : 'enemy');
      }
      const newOpponentListForMark = opponentList.map((t) => (t.id === target.id ? target : t));
      if (opponentList !== newOpponentListForMark) {
        if (isTeam) currentEnemies = newOpponentListForMark;
        else currentTeam = newOpponentListForMark;
      }

      const damage = calculateAtkDmg(self, target, isTeam ? 'team' : 'enemy');

      // Expect 3D combatant refs to be globally accessible for now
      const actorRef = window.combatantRefs?.[self.id];
      const targetRef = window.combatantRefs?.[target.id];

      const animationPromises: Promise<void>[] = [];

      if (actorRef && actorRef.playAnimation)
        animationPromises.push(actorRef.playAnimation?.('Attack'));
      if (targetRef && targetRef.playAnimation)
        animationPromises.push(targetRef.playAnimation?.('Hit'));

      await Promise.all(animationPromises);

      // Apply damage and update state
      let updatedTarget = applyDamage(target, damage);

      // Decrement 'attack' unit counters for attacker
      self = decrementMaskPowerCounter(self, 'attack');

      // Decrement 'hit' unit counters for defender
      updatedTarget = decrementMaskPowerCounter(updatedTarget, 'hit');

      // Decrement 'turn' unit counters ONLY for the combatant whose turn it is
      self = decrementMaskPowerCounter(self, 'turn');

      // Update both attacker and defender in their respective lists
      // When confused, target is in actorList (attacking allies), so update both in actorList
      const newActorList = actorList.map((c) =>
        c.id === self.id ? self : c.id === updatedTarget.id ? updatedTarget : c
      );
      const newOpponentList = opponentList.map((t) =>
        t.id === updatedTarget.id ? updatedTarget : t
      );

      // Decrement turn-based debuffs (e.g. CONFUSION) - only for the actor whose turn it is
      const nextActorList = decrementDebuffDurations(newActorList, 'turn', self.id);
      const nextOpponentList = decrementDebuffDurations(newOpponentList, 'turn', self.id);

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

      console.log(
        `${self.id} (${actor.side}) attacked ${target.id} (${
          isTeam ? 'enemy' : 'team'
        }) for ${damage} damage → HP: ${target.hp} → ${updatedTarget.hp}`
      );
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
    let nextTeam = currentTeam.map((c) =>
      decrementMaskPowerCounter(c, 'round')
    );
    let nextEnemies = currentEnemies.map((c) =>
      decrementMaskPowerCounter(c, 'round')
    );
    nextTeam = decrementDebuffDurations(nextTeam, 'round');
    nextEnemies = decrementDebuffDurations(nextEnemies, 'round');
    currentTeam = nextTeam;
    currentEnemies = nextEnemies;
    setTeam(currentTeam);
    setEnemies(currentEnemies);
  });
}

/**
 * Decrements wave-based mask power counters for all combatants
 * Should be called when advancing to a new wave
 */
export function decrementWaveCounters(combatants: Combatant[]): Combatant[] {
  return combatants.map((c) => decrementMaskPowerCounter(c, 'wave'));
}

export function generateCombatantStats(
  id: string,
  templateId: string,
  lvl: number,
  maskOverride?: Mask,
  maskColorOverride?: LegoColor
): Combatant {
  const template = COMBATANT_DEX[templateId];
  if (!template) {
    console.error('Missing base stats for ', templateId);
  }

  const maxHp = template.baseHp + lvl * 10;
  const attack = template.baseAttack + lvl * 3;
  const defense = template.baseDefense + lvl * 2;
  const speed = template.baseSpeed + lvl * 1;
  const mask = maskOverride || template.mask;
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
    maskColorOverride,
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
