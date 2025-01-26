import { Mask, Matoran } from '../../types/Matoran';

import { ColorizeImage } from '../ColorizedImage';

import eyes from './matoran_eyes.png';
import head from './matoran_head.png';
import arms from './matoran_arms.png';
import legs from './matoran_legs.png';
import torso from './matoran_torso.png';

import hau from './matoran_hau.png';
import kaukau from './matoran_kaukau.png';

import './index.scss';

function getMask(matoran: Matoran) {
  switch (matoran.mask) {
    case Mask.Kaukau:
      return <ColorizeImage imageUrl={kaukau} color={matoran.colors.mask} />;
    case Mask.Huna:
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
