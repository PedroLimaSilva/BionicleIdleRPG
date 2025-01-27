import { Mask, Matoran } from '../../types/Matoran';

import { CompositedImage } from '../CompositedImage';

import eyes from './matoran_eyes.png';
import head from './matoran_head.png';
import arms from './matoran_arms.png';
import legs from './matoran_legs.png';
import torso from './matoran_torso.png';

import hau from './matoran_hau.png';
import kaukau from './matoran_kaukau.png';
import akaku from './matoran_akaku.png';
import kakama from './matoran_kakama.png';
import pakari from './matoran_pakari.png';
import miru from './matoran_miru.png';
import huna from './matoran_huna.png';

import './index.scss';

function getMask(matoran: Matoran) {
  switch (matoran.mask) {
    case Mask.Akaku:
      return akaku;
    case Mask.Pakari:
      return pakari;
    case Mask.Kakama:
      return kakama;
    case Mask.Miru:
      return miru;
    case Mask.Kaukau:
      return kaukau;
    case Mask.Huna:
      return huna;
    case Mask.Hau:
    default:
      return hau;
  }
}

export function MatoranAvatar(props: { matoran: Matoran; styles: string }) {
  const { colors } = props.matoran;
  return (
    <CompositedImage
      className={`composited-avatar ${props.styles}`}
      images={[legs, torso, eyes, head, arms, getMask(props.matoran)]}
      colors={[
        colors.feet,
        colors.body,
        colors.eyes,
        '#fff', // head
        colors.arms,
        colors.mask,
      ]}
    />
  );
  return;
}
