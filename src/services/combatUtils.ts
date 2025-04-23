import { COMBATANT_DEX } from '../data/combat';
import { LegoColor } from '../types/Colors';
import { Combatant } from '../types/Combat';
import { Mask } from '../types/Matoran';

declare global {
  interface Window {
    combatantRefs: Record<
      string,
      { playAnimation?: (name: string) => Promise<void> }
    >;
  }
}

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
