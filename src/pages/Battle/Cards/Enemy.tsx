import { useEffect, useRef, useState } from 'react';
import { Combatant } from '../../../types/Combat';
import { DamagePopup, DamagePopupEvent } from './DamagePopup';

export function EnemyCard({ enemy }: { enemy: Combatant }) {
  const prevHpRef = useRef(enemy.hp);
  const popupSequenceRef = useRef(0);
  const [damage, setDamage] = useState<DamagePopupEvent | null>(null);
  const [healing, setHealing] = useState<DamagePopupEvent | null>(null);

  useEffect(() => {
    if (enemy.hp < prevHpRef.current) {
      // HP decreased - damage taken
      setDamage({
        id: ++popupSequenceRef.current,
        value: prevHpRef.current - enemy.hp,
      });
      setHealing(null); // Clear any healing popup
    } else if (enemy.hp > prevHpRef.current) {
      // HP increased - healing received
      setHealing({
        id: ++popupSequenceRef.current,
        value: enemy.hp - prevHpRef.current,
      });
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
        {damage && (
          <DamagePopup
            popup={damage}
            direction="down"
            isHealing={false}
            onComplete={(id) => {
              setDamage((current) => (current?.id === id ? null : current));
            }}
          />
        )}
        {healing && (
          <DamagePopup
            popup={healing}
            direction="down"
            isHealing={true}
            onComplete={(id) => {
              setHealing((current) => (current?.id === id ? null : current));
            }}
          />
        )}
      </div>
    </div>
  );
}
