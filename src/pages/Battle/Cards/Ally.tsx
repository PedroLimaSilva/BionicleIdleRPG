import { useEffect, useRef, useState } from 'react';
import { Combatant } from '../../../types/Combat';
import { DamagePopup } from './DamagePopup';
import { MATORAN_DEX } from '../../../data/matoran';
import { MatoranAvatar } from '../../../components/MatoranAvatar';

export function AllyCard({ combatant }: { combatant: Combatant }) {
  const prevHpRef = useRef(combatant.hp);
  const [damage, setDamage] = useState<number | null>(null);

  useEffect(() => {
    if (combatant.hp < prevHpRef.current) {
      setDamage(prevHpRef.current - combatant.hp);
    }
    prevHpRef.current = combatant.hp;
  }, [combatant.hp]);
  const dex = MATORAN_DEX[combatant.id];
  return (
    <div
      id={`combatant-${combatant.id}`}
      key={combatant.id}
      className={`character-card element-${dex.element}`}
    >
      <MatoranAvatar
        matoran={{ ...dex, ...combatant, exp: 0 }}
        styles='matoran-avatar model-preview'
      />
      <div className='card-header'>
        {dex.name}
        <div className='level-label'>Level {combatant.lvl}</div>
      </div>
      <div className='hp-bar'>
        HP: {combatant.hp}/{combatant.maxHp}
        {damage && <DamagePopup damage={damage} direction='up' />}
      </div>
    </div>
  );
}
