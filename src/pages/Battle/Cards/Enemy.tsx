import { useEffect, useRef, useState } from 'react';
import { Combatant } from '../../../types/Combat';
import { DamagePopup } from './DamagePopup';

export function EnemyCard({ enemy }: { enemy: Combatant }) {
  const prevHpRef = useRef(enemy.hp);
  const [damage, setDamage] = useState<number | null>(null);
  const [healing, setHealing] = useState<number | null>(null);

  useEffect(() => {
    if (enemy.hp < prevHpRef.current) {
      // HP decreased - damage taken
      setDamage(prevHpRef.current - enemy.hp);
      setHealing(null); // Clear any healing popup
    } else if (enemy.hp > prevHpRef.current) {
      // HP increased - healing received
      setHealing(enemy.hp - prevHpRef.current);
      setDamage(null); // Clear any damage popup
    }
    prevHpRef.current = enemy.hp;
  }, [enemy.hp]);

  return (
    <div
      id={`combatant-${enemy.id}`}
      key={enemy.id}
      className={`enemy-card element-${enemy.element}`}
    >
      <div className="name">{enemy.name}</div>
      <div className="hp-bar">
        HP: {enemy.hp}/{enemy.maxHp}
        {damage && <DamagePopup damage={damage} direction="down" isHealing={false} />}
        {healing && <DamagePopup damage={healing} direction="down" isHealing={true} />}
      </div>
    </div>
  );
}
