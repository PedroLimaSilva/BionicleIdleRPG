import { useMemo } from 'react';
import { BaseMatoran, Mask, MatoranStage, RecruitedCharacterData } from '../../../types/Matoran';
import { useGame } from '../../../context/Game';
import { getAvatarLayerNames } from '../avatarLayers';
import { METRU_MASK_DISCOLORATION } from '../../3d/kit/palettes/metruKitPlayerPalette';
import { getEffectiveMaskColor } from '../../../game/characters/maskColor';

import { CompositedImage } from '../CompositedImage';

import './index.scss';
import { LegoColor } from '../../../types/Colors';
import { masksCollected } from '../../../services/matoranUtils';

export function MatoranAvatar({
  maskPowerActive,
  matoran,
  styles,
}: {
  matoran: BaseMatoran &
    RecruitedCharacterData & { maskOverride?: Mask; maskColorOverride?: LegoColor };
  styles: string;
  maskPowerActive?: boolean;
}) {
  const { completedQuests } = useGame();
  const { colors } = matoran;
  const collected = masksCollected(matoran, completedQuests);
  const effectiveMask = collected.includes(matoran.maskOverride || matoran.mask)
    ? matoran.maskOverride || matoran.mask
    : collected[0];
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

  const { brainLayer, faceLayer, maskLayer } = useMemo(() => {
    const base = `${import.meta.env.BASE_URL}/avatar/`;
    const layers = getAvatarLayerNames(matoran.stage, effectiveMask);
    return {
      brainLayer: `${base}${layers.brain}.webp`,
      faceLayer: `${base}${layers.face}.webp`,
      maskLayer: `${base}Kanohi/${layers.mask}.webp`,
    };
  }, [effectiveMask, matoran.stage]);

  const glowStyle = maskPowerActive ? { filter: `drop-shadow(0 0 12px ${maskColor})` } : undefined;
  const maskDiscoloration =
    matoran.stage === MatoranStage.Metru ? METRU_MASK_DISCOLORATION : undefined;

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

  if (matoran.stage === MatoranStage.Vahki) {
    return (
      <div className={`composited-avatar ${styles}`} style={glowStyle} aria-label={matoran.name} />
    );
  }

  return (
    <CompositedImage
      key={matoran.name}
      className={`composited-avatar ${styles}`}
      style={glowStyle}
      images={[brainLayer, faceLayer, maskLayer]}
      colors={[colors.eyes, colors.face, maskColor]}
      maskDiscoloration={maskDiscoloration}
    />
  );
}
