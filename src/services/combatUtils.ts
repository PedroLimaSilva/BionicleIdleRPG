import { COMBATANT_DEX } from '../data/combat';
import { LegoColor } from '../types/Colors';
import { Combatant } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';

declare global {
  interface Window {
    combatantRefs: Record<
      string,
      { playAnimation?: (name: string) => Promise<void> }
    >;
  }
}


/**
 * |    | 🔥  | 🌊  | ❄️  | 🪨  | 🌍  | 💨  | 🌑  | 🌕  |
 * | 🔥 | 1.0 | 1.0 | 1.5 | 1.0 | 0.5 | 1.5 | 1.0 | 1.0 |
 * | 🌊 | 1.5 | 1.0 | 0.5 | 1.5 | 1.0 | 1.0 | 1.0 | 1.0 |
 * | ❄️ | 0.5 | 1.5 | 1.0 | 1.5 | 1.0 | 1.0 | 1.0 | 1.0 |
 * | 🪨 | 1.0 | 0.5 | 1.5 | 1.0 | 1.0 | 1.5 | 1.0 | 1.0 |
 * | 🌍 | 1.5 | 1.0 | 1.0 | 1.0 | 1.0 | 0.5 | 1.0 | 1.0 |
 * | 💨 | 1.5 | 1.0 | 1.0 | 1.0 | 1.5 | 1.0 | 1.0 | 1.0 |
 * | 🌑 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 0.5 | 1.5 |
 * | 🌕 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.5 | 0.5 |
 */
const elementEffectiveness: Record<
  ElementTribe,
  Record<ElementTribe, number>
> = {
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

function resolveAttack(attacker: Combatant, defender: Combatant): number {
  const rawDamage = Math.max(1, attacker.attack - defender.defense);
  const multiplier =
    elementEffectiveness[attacker.element]?.[defender.element] ?? 1.0;
  const final = Math.floor(
    (rawDamage + Math.floor(Math.random() * 5)) * multiplier
  );
  return Math.max(1, final);
}

function applyDamage(target: Combatant, damage: number): Combatant {
  return {
    ...target,
    hp: Math.max(0, target.hp - damage),
  };
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
  const turnOrder = all.sort((a, b) => b.speed - a.speed);

  let currentTeam = [...team];
  let currentEnemies = [...enemies];

  for (const actor of turnOrder) {
    const isTeam = actor.side === 'team';

    enqueue(async () => {
      const actorList = isTeam ? currentTeam : currentEnemies;
      const opponentList = isTeam ? currentEnemies : currentTeam;

      const self = actorList.find((c) => c.id === actor.id);
      if (!self || self.hp <= 0) return;

      const targets = opponentList.filter((t) => t.hp > 0);
      if (targets.length === 0) return;

      const target = targets[Math.floor(Math.random() * targets.length)];
      const damage = resolveAttack(self, target);

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
      const updatedTarget = applyDamage(target, damage);
      const newOpponentList = opponentList.map((t) =>
        t.id === target.id ? updatedTarget : t
      );

      if (isTeam) {
        currentEnemies = newOpponentList;
        setEnemies(currentEnemies);
      } else {
        currentTeam = newOpponentList;
        setTeam(currentTeam);
      }

      console.log(
        `${self.id} (${actor.side}) attacked ${target.id} (${
          isTeam ? 'enemy' : 'team'
        }) for ${damage} damage → HP: ${target.hp} → ${updatedTarget.hp}`
      );
    });
  }
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

  return {
    id,
    name: template.name,
    model: template.model,
    lvl,
    maskOverride,
    maskColorOverride,
    element: template.element,
    maxHp,
    hp: maxHp,
    attack,
    defense,
    speed,
  };
}
