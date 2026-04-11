import { useEffect, useState } from 'react';
import { Combatant } from '../../../types/Combat';
import { hasActiveEffectFromSource } from '../../../services/combatUtils';
import { CHARACTER_DEX } from '../../../data/dex/index';
import { MatoranAvatar } from '../../../components/MatoranAvatar';
import { MaskPowerTooltip } from '../../../components/MaskPowerTooltip';
import { MaskActivationBurst } from './MaskActivationBurst';

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

  const dex = CHARACTER_DEX[combatant.id as keyof typeof CHARACTER_DEX];
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
          maskPowerActive={maskActive}
        />
      </MaskPowerTooltip>
      <MaskActivationBurst active={maskActive} elementClass={`element-${dex.element}`} />
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
    </div>
  );
}
