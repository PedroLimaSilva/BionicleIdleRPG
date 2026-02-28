import { useEffect, useRef, useState } from 'react';
import { Combatant } from '../../../types/Combat';
import { hasActiveEffectFromSource } from '../../../services/combatUtils';
import { DamagePopup, DamagePopupEvent } from './DamagePopup';
import { MATORAN_DEX } from '../../../data/matoran';
import { MatoranAvatar } from '../../../components/MatoranAvatar';
import { MaskPowerTooltip } from '../../../components/MaskPowerTooltip';

export function AllyCard({
  combatant,
  onClick,
  team = [],
  enemies = [],
}: {
  combatant: Combatant;
  onClick: () => void;
  team?: Combatant[];
  enemies?: Combatant[];
}) {
  const prevHpRef = useRef(combatant.hp);
  const popupSequenceRef = useRef(0);
  const [damage, setDamage] = useState<DamagePopupEvent | null>(null);
  const [healing, setHealing] = useState<DamagePopupEvent | null>(null);
  const [selected, setSelected] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [maxCooldown, setMaxCooldown] = useState<number>(0);

  const maskActive =
    !!combatant.maskPower?.active || hasActiveEffectFromSource(team, enemies, combatant.id);

  useEffect(() => {
    setSelected(combatant.hp > 0 && (maskActive || combatant.willUseAbility));
  }, [combatant.willUseAbility, maskActive, combatant.hp]);

  useEffect(() => {
    setDisabled(
      combatant.hp <= 0 || ((combatant.maskPower?.cooldown?.amount ?? 0) > 0 && !maskActive)
    );
  }, [combatant.hp, combatant.maskPower?.cooldown?.amount, maskActive]);

  useEffect(() => {
    if (combatant.maskPower && combatant.maskPower?.cooldown?.amount > maxCooldown) {
      setMaxCooldown(combatant.maskPower?.cooldown?.amount);
    }
  }, [combatant.maskPower, combatant.maskPower?.cooldown?.amount, maxCooldown]);

  useEffect(() => {
    if (combatant.hp < prevHpRef.current) {
      // HP decreased - damage taken
      setDamage({
        id: ++popupSequenceRef.current,
        value: prevHpRef.current - combatant.hp,
      });
      setHealing(null); // Clear any healing popup
    } else if (combatant.hp > prevHpRef.current) {
      // HP increased - healing received
      setHealing({
        id: ++popupSequenceRef.current,
        value: combatant.hp - prevHpRef.current,
      });
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
      {combatant.maskPower?.cooldown && (
        <div
          className="cooldown-fill"
          style={{
            height: `${combatant.maskPower?.cooldown?.amount === 0 ? 0 : (combatant.maskPower?.cooldown?.amount / maxCooldown) * 100}%`,
          }}
        ></div>
      )}
      <div className="hp-bar">
        HP: {combatant.hp}/{combatant.maxHp}
        {damage && (
          <DamagePopup
            popup={damage}
            direction="up"
            isHealing={false}
            onComplete={(id) => {
              setDamage((current) => (current?.id === id ? null : current));
            }}
          />
        )}
        {healing && (
          <DamagePopup
            popup={healing}
            direction="up"
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
