import { LegoColor } from '../types/Colors';
import { Combatant, CombatantTemplate } from '../types/Combat';
import { ElementTribe, Mask } from '../types/Matoran';

export const COMBATANT_DEX: Record<string, CombatantTemplate> = {
  Toa_Kopaka: {
    id: 'Toa_Kopaka',
    name: 'Toa Kopaka',
    model: 'Toa_Kopaka',
    element: ElementTribe.Ice,
    baseHp: 90,
    baseAttack: 16,
    baseDefense: 14,
    baseSpeed: 8,
  },
  Toa_Pohatu: {
    id: 'Toa_Pohatu',
    name: 'Toa Pohatu',
    model: 'Toa_Pohatu',
    element: ElementTribe.Stone,
    baseHp: 100,
    baseAttack: 20,
    baseDefense: 12,
    baseSpeed: 6,
  },
  Toa_Tahu: {
    id: 'Toa_Tahu',
    name: 'Toa Tahu',
    model: 'Toa_Tahu',
    element: ElementTribe.Fire,
    baseHp: 90,
    baseAttack: 18,
    baseDefense: 10,
    baseSpeed: 9,
  },
  Toa_Onua: {
    id: 'Toa_Onua',
    name: 'Toa Onua',
    model: 'Toa_Onua',
    element: ElementTribe.Earth,
    baseHp: 110,
    baseAttack: 15,
    baseDefense: 16,
    baseSpeed: 5,
  },
  Toa_Gali: {
    id: 'Toa_Gali',
    name: 'Toa Gali',
    model: 'Toa_Gali',
    element: ElementTribe.Water,
    baseHp: 95,
    baseAttack: 14,
    baseDefense: 14,
    baseSpeed: 7,
  },
  Toa_Lewa: {
    id: 'Toa_Lewa',
    name: 'Toa Lewa',
    model: 'Toa_Lewa',
    element: ElementTribe.Air,
    baseHp: 85,
    baseAttack: 17,
    baseDefense: 10,
    baseSpeed: 11,
  },

  // Bohrok - Differentiated by swarm behavior
  tahnok: {
    id: 'tahnok',
    name: 'Tahnok',
    model: 'bohrok',
    element: ElementTribe.Fire,
    baseHp: 80,
    baseAttack: 22,
    baseDefense: 10,
    baseSpeed: 8,
  },
  gahlok: {
    id: 'gahlok',
    name: 'Gahlok',
    model: 'bohrok',
    element: ElementTribe.Water,
    baseHp: 75,
    baseAttack: 18,
    baseDefense: 12,
    baseSpeed: 10,
  },
  lehvak: {
    id: 'lehvak',
    name: 'Lehvak',
    model: 'bohrok',
    element: ElementTribe.Air,
    baseHp: 70,
    baseAttack: 16,
    baseDefense: 9,
    baseSpeed: 12,
  },
  pahrak: {
    id: 'pahrak',
    name: 'Pahrak',
    model: 'bohrok',
    element: ElementTribe.Stone,
    baseHp: 95,
    baseAttack: 20,
    baseDefense: 14,
    baseSpeed: 6,
  },
  nuhvok: {
    id: 'nuhvok',
    name: 'Nuhvok',
    model: 'bohrok',
    element: ElementTribe.Earth,
    baseHp: 90,
    baseAttack: 17,
    baseDefense: 15,
    baseSpeed: 5,
  },
  kohrak: {
    id: 'kohrak',
    name: 'Kohrak',
    model: 'bohrok',
    element: ElementTribe.Ice,
    baseHp: 85,
    baseAttack: 19,
    baseDefense: 11,
    baseSpeed: 9,
  },
};

function resolveAttack(attacker: Combatant, defender: Combatant): number {
  const rawDamage = Math.max(1, attacker.attack - defender.defense);
  const final = rawDamage + Math.floor(Math.random() * 5); // optional variance
  return final;
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

      // Trigger animations and wait for both to complete
      const actorNode = document.getElementById(`combatant-${self.id}`);
      const targetNode = document.getElementById(`combatant-${target.id}`);

      const animationPromises: Promise<void>[] = [];

      if (actorNode) {
        animationPromises.push(
          new Promise((res) => {
            actorNode.classList.add('attacking');
            const handler = () => {
              actorNode.classList.remove('attacking');
              actorNode.removeEventListener('animationend', handler);
              res();
            };
            actorNode.addEventListener('animationend', handler);
          })
        );
      }

      if (targetNode) {
        animationPromises.push(
          new Promise((res) => {
            targetNode.classList.remove('hit');
            // Force reflow to restart animation
            void targetNode.offsetWidth;
            targetNode.classList.add('hit');

            const handler = () => {
              targetNode.classList.remove('hit');
              targetNode.removeEventListener('animationend', handler);
              res();
            };
            targetNode.addEventListener('animationend', handler);
          })
        );
      }
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
  lvl: number,
  maskOverride?: Mask,
  maskColorOverride?: LegoColor
): Combatant {
  const template = COMBATANT_DEX[id];
  if (!template) {
    console.error('Missing base stats for ', id);
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
