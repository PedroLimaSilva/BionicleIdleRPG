import { useMemo } from 'react';
import { BaseMatoran, Mask, MatoranStage, RecruitedCharacterData } from '../../types/Matoran';
import { useGame } from '../../context/Game';
import { getEffectiveMaskColor } from '../../game/maskColor';

import { CompositedImage } from '../CompositedImage';

import './index.scss';
import { LegoColor } from '../../types/Colors';

function getMask(matoran: BaseMatoran & RecruitedCharacterData) {
  return `${import.meta.env.BASE_URL}/avatar/Kanohi/${matoran.maskOverride || matoran.mask}.webp`;
}

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
  const maskColor = useMemo(
    () => matoran.maskColorOverride || getEffectiveMaskColor(matoran, completedQuests),
    [matoran, completedQuests]
  );

  const mask = useMemo(() => {
    return getMask(matoran);
  }, [matoran]);

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
        `${import.meta.env.BASE_URL}/avatar/Brain.png`,
        `${import.meta.env.BASE_URL}/avatar/Face.png`,
        mask,
      ]}
      colors={[colors.eyes, '#fff', maskColor]}
    />
  );
}
