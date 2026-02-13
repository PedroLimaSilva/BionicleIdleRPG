import { COMBATANT_DEX, MASK_POWERS } from '../data/combat';
import { LegoColor } from '../types/Colors';
import { BattleStrategy, Combatant } from '../types/Combat';
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

export function calculateAtkDmg(attacker: Combatant, defender: Combatant): number {
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
function decrementMaskPowerCounter(
  combatant: Combatant,
  unit: 'attack' | 'hit' | 'turn' | 'round' | 'wave'
): Combatant {
  if (!combatant.maskPower) return combatant;

  const updatedMaskPower = { ...combatant.maskPower };
  let changed = false;

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
      // Set cooldown when effect expires
      const originalMask = COMBATANT_DEX[combatant.id]?.mask;
      if (originalMask) {
        const power = MASK_POWERS[originalMask];
        if (power) {
          updatedMaskPower.effect.cooldown = {
            ...power.effect.cooldown,
          };
        }
      }
    }
    changed = true;
  }

  // Decrement cooldown if not active and unit matches
  if (
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
      actor.maskPower.active = true;

      // Special case: SPEED mask grants an extra turn this round
      if (actor.maskPower.effect.type === 'SPEED') {
        // Clone the actor for the second turn to avoid object mutation issues
        const clonedActor = { ...actor, maskPower: { ...actor.maskPower } };
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
  enqueue: (step: () => Promise<void>) => void
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
      if (!self || self.hp <= 0) return;

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

      const targets = opponentList.filter((t) => t.hp > 0);
      if (targets.length === 0) return;

      const target = chooseTarget(self, targets);
      const damage = calculateAtkDmg(self, target);

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
      const newActorList = actorList.map((c) => (c.id === self.id ? self : c));
      const newOpponentList = opponentList.map((t) =>
        t.id === updatedTarget.id ? updatedTarget : t
      );

      if (isTeam) {
        currentTeam = newActorList;
        currentEnemies = newOpponentList;
        setTeam(currentTeam);
        setEnemies(currentEnemies);
      } else {
        currentTeam = newOpponentList;
        currentEnemies = newActorList;
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

  // Decrement 'round' unit counters at the end of the round
  enqueue(async () => {
    currentTeam = currentTeam.map((c) => decrementMaskPowerCounter(c, 'round'));
    currentEnemies = currentEnemies.map((c) => decrementMaskPowerCounter(c, 'round'));
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
