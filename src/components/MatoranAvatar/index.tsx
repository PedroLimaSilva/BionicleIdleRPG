import { useMemo } from 'react';
import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';

import { CompositedImage } from '../CompositedImage';

import './index.scss';

function getMask(matoran: BaseMatoran) {
  return `${import.meta.env.BASE_URL}/avatar/${matoran.mask}.png`;
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
  return;
}
