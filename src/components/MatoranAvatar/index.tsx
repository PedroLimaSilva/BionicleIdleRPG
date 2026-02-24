import { useMemo } from 'react';
import { BaseMatoran, MatoranStage, RecruitedCharacterData } from '../../types/Matoran';
import { useGame } from '../../context/Game';
import { getEffectiveMaskColor } from '../../game/maskColor';

import { CompositedImage } from '../CompositedImage';

import './index.scss';

function getMask(matoran: BaseMatoran & RecruitedCharacterData) {
  return `${import.meta.env.BASE_URL}/avatar/Kanohi/${matoran.maskOverride || matoran.mask}.webp`;
}

export function MatoranAvatar({
  matoran,
  styles,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
  styles: string;
}) {
  const { completedQuests } = useGame();
  const { colors } = matoran;
  const maskColor = getEffectiveMaskColor(matoran, completedQuests);

  const mask = useMemo(() => {
    return getMask(matoran);
  }, [matoran]);

  // Bohrok use a single pre-rendered avatar image
  if (matoran.stage === MatoranStage.Bohrok) {
    return (
      <img
        className={`composited-avatar ${styles}`}
        src={`${import.meta.env.BASE_URL}/avatar/Bohrok/${matoran.name}.webp`}
        alt={matoran.name}
      />
    );
  }

  return (
    <CompositedImage
      className={`composited-avatar ${styles}`}
      images={[
        `${import.meta.env.BASE_URL}/avatar/Brain.png`,
        `${import.meta.env.BASE_URL}/avatar/Face.png`,
        mask,
      ]}
      colors={[colors.eyes, '#fff', maskColor]}
    />
  );
}
