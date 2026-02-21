import { useMemo } from 'react';
import { BaseMatoran, MatoranStage, RecruitedCharacterData } from '../../types/Matoran';

import { CompositedImage } from '../CompositedImage';

import './index.scss';

function getMask(matoran: BaseMatoran & RecruitedCharacterData) {
  return `${import.meta.env.BASE_URL}/avatar/Kanohi/${matoran.maskOverride || matoran.mask}.png`;
}

export function MatoranAvatar({
  matoran,
  styles,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
  styles: string;
}) {
  const { colors, maskColorOverride } = matoran;

  const mask = useMemo(() => {
    return getMask(matoran);
  }, [matoran]);

  // Bohrok use a single pre-rendered avatar image
  if (matoran.stage === MatoranStage.Bohrok) {
    return (
      <img
        className={`composited-avatar ${styles}`}
        src={`${import.meta.env.BASE_URL}/avatar/Bohrok/${matoran.name}.png`}
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
      colors={[colors.eyes, '#fff', maskColorOverride || colors.mask]}
    />
  );
}
