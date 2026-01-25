import { useEffect, useRef, useState } from 'react';
import { Combatant } from '../../../types/Combat';
import { DamagePopup } from './DamagePopup';
import { MATORAN_DEX } from '../../../data/matoran';
import { MatoranAvatar } from '../../../components/MatoranAvatar';

export function AllyCard({
  combatant,
  onClick,
}: {
  combatant: Combatant;
  onClick: () => void;
}) {
  const prevHpRef = useRef(combatant.hp);
  const [damage, setDamage] = useState<number | null>(null);
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    setSelected(combatant.willUseAbility);
  }, [combatant.willUseAbility]);

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
      onClick={onClick}
      className={`character-card element-${dex.element} ${
        !combatant.maskPower?.effect.cooldown && 'disabled'
      } ${selected && 'selected'}`}
    >
      <MatoranAvatar
        matoran={{ ...dex, ...combatant, maskOverride: combatant.maskPower?.shortName,
          exp: 0,
        }}
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
