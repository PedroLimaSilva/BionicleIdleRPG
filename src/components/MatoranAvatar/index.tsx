import { Mask, Matoran } from '../../types/Matoran';

import { ColorizeImage } from '../ColorizedImage';

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
      return <ColorizeImage imageUrl={akaku} color={matoran.colors.mask} />;
    case Mask.Pakari:
      return <ColorizeImage imageUrl={pakari} color={matoran.colors.mask} />;
    case Mask.Kakama:
      return <ColorizeImage imageUrl={kakama} color={matoran.colors.mask} />;
    case Mask.Miru:
      return <ColorizeImage imageUrl={miru} color={matoran.colors.mask} />;
    case Mask.Kaukau:
      return <ColorizeImage imageUrl={kaukau} color={matoran.colors.mask} />;
    case Mask.Huna:
      return <ColorizeImage imageUrl={huna} color={matoran.colors.mask} />;
    case Mask.Hau:
    default:
      return <ColorizeImage imageUrl={hau} color={matoran.colors.mask} />;
  }
}

export function MatoranAvatar(props: { matoran: Matoran; styles: string }) {
  return (
    <div className={`composited-avatar ${props.styles}`}>
      <ColorizeImage imageUrl={legs} color={props.matoran.colors.feet} />
      <ColorizeImage imageUrl={torso} color={props.matoran.colors.body} />
      <img src={eyes} />
      <img src={head} />
      <ColorizeImage imageUrl={arms} color={props.matoran.colors.arms} />
      {getMask(props.matoran)}
    </div>
  );
  return;
}
