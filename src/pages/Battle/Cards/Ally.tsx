import { useEffect, useRef, useState } from 'react';
import { Combatant } from '../../../types/Combat';
import { DamagePopup } from './DamagePopup';
import { MATORAN_DEX } from '../../../data/matoran';
import { MatoranAvatar } from '../../../components/MatoranAvatar';
import { MaskPowerTooltip } from '../../../components/MaskPowerTooltip';

export function AllyCard({
  combatant,
  maskGlow = false,
  onClick,
}: {
  combatant: Combatant;
  maskGlow?: boolean;
  onClick: () => void;
}) {
  const prevHpRef = useRef(combatant.hp);
  const [damage, setDamage] = useState<number | null>(null);
  const [healing, setHealing] = useState<number | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [maxCooldown, setMaxCooldown] = useState<number>(0);

  useEffect(() => {
    setSelected(
      combatant.hp > 0 &&
        (combatant.maskPower?.active || combatant.willUseAbility || maskGlow)
    );
  }, [combatant.willUseAbility, combatant.maskPower?.active, combatant.hp, maskGlow]);

  useEffect(() => {
    setDisabled(
      combatant.hp <= 0 ||
        ((combatant.maskPower?.effect?.cooldown?.amount ?? 0) > 0 && !combatant.maskPower?.active)
    );
  }, [combatant.hp, combatant.maskPower?.effect?.cooldown?.amount, combatant.maskPower?.active]);

  useEffect(() => {
    if (combatant.maskPower && combatant.maskPower?.effect?.cooldown?.amount > maxCooldown) {
      setMaxCooldown(combatant.maskPower?.effect?.cooldown?.amount);
    }
  }, [combatant.maskPower, combatant.maskPower?.effect?.cooldown?.amount, maxCooldown]);

  useEffect(() => {
    if (combatant.hp < prevHpRef.current) {
      // HP decreased - damage taken
      setDamage(prevHpRef.current - combatant.hp);
      setHealing(null); // Clear any healing popup
    } else if (combatant.hp > prevHpRef.current) {
      // HP increased - healing received
      setHealing(combatant.hp - prevHpRef.current);
      setDamage(null); // Clear any damage popup
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
        disabled ? 'disabled' : ''
      } ${selected && 'selected'}`}
    >
      <MaskPowerTooltip mask={combatant.maskPower?.shortName}>
        <MatoranAvatar
          matoran={{
            ...dex,
            ...combatant,
            maskOverride: combatant.maskPower?.shortName,
            exp: 0,
          }}
          styles="matoran-avatar model-preview"
        />
      </MaskPowerTooltip>
      <div className="card-header">
        {dex.name}
        <div className="level-label">Level {combatant.lvl}</div>
      </div>
      {combatant.maskPower?.effect?.cooldown && (
        <div
          className="cooldown-fill"
          style={{
            height: `${combatant.maskPower?.effect?.cooldown?.amount === 0 ? 0 : (combatant.maskPower?.effect?.cooldown?.amount / maxCooldown) * 100}%`,
          }}
        ></div>
      )}
      <div className="hp-bar">
        HP: {combatant.hp}/{combatant.maxHp}
        {damage && <DamagePopup damage={damage} direction="up" isHealing={false} />}
        {healing && <DamagePopup damage={healing} direction="up" isHealing={true} />}
      </div>
    </div>
  );
}
