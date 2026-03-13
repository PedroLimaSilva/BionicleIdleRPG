import { useMemo } from 'react';
import { BaseMatoran, Mask, MatoranStage, RecruitedCharacterData } from '../../types/Matoran';
import { useGame } from '../../context/Game';
import { getEffectiveMaskColor } from '../../game/maskColor';

import { CompositedImage } from '../CompositedImage';

import './index.scss';
import { LegoColor } from '../../types/Colors';
import { masksCollected } from '../../services/matoranUtils';

export function MatoranAvatar({
  matoran,
  styles,
  maskPowerActive,
}: {
  matoran: BaseMatoran &
    RecruitedCharacterData & { maskOverride?: Mask; maskColorOverride?: LegoColor };
  styles: string;
  maskPowerActive?: boolean;
}) {
  const { completedQuests } = useGame();
  const { colors } = matoran;
  const collected = masksCollected(matoran, completedQuests);
  const effectiveMask = collected.includes(matoran.mask) ? matoran.mask : collected[0];
  const maskColor = useMemo(() => {
    if (matoran.maskColorOverride) return matoran.maskColorOverride;
    if (
      effectiveMask === Mask.Avohkii ||
      effectiveMask === Mask.Vahi ||
      effectiveMask === Mask.HauNuvaInfected
    ) {
      return LegoColor.White;
    }
    return getEffectiveMaskColor(matoran, completedQuests);
  }, [matoran, completedQuests, effectiveMask]);

  const mask = useMemo(
    () => `${import.meta.env.BASE_URL}/avatar/Kanohi/${effectiveMask}.webp`,
    [effectiveMask]
  );

  const glowStyle = maskPowerActive ? { filter: `drop-shadow(0 0 12px ${maskColor})` } : undefined;

  // Bohrok and Bohrok Kal use pre-rendered avatar images
  if (matoran.stage === MatoranStage.Bohrok || matoran.stage === MatoranStage.BohrokKal) {
    return (
      <img
        className={`composited-avatar ${styles}`}
        style={glowStyle}
        src={`${import.meta.env.BASE_URL}/avatar/Bohrok/${matoran.name}.webp`}
        alt={matoran.name}
      />
    );
  }

  return (
    <CompositedImage
      key={matoran.name}
      className={`composited-avatar ${styles}`}
      style={glowStyle}
      images={[
        `${import.meta.env.BASE_URL}/avatar/Brain.webp`,
        `${import.meta.env.BASE_URL}/avatar/Face.webp`,
        mask,
      ]}
      colors={[colors.eyes, colors.face, maskColor]}
    />
  );
}
