import { existsSync } from 'fs';
import { resolve } from 'path';

import { getAvatarLayerNames } from './avatarLayers';
import { ALL_MASKS } from '../../data/masks';
import { Mask, MatoranStage } from '../../types/Matoran';

const AVATAR_DIR = resolve(__dirname, '../../../public/avatar');

const ALL_STAGES = [
  MatoranStage.Diminished,
  MatoranStage.Rebuilt,
  MatoranStage.Metru,
  MatoranStage.ToaMata,
  MatoranStage.ToaNuva,
  MatoranStage.ToaMetru,
  MatoranStage.Turaga,
];

describe('getAvatarLayerNames', () => {
  test('uses the 2001 Matoran head for Diminished and Rebuilt', () => {
    expect(getAvatarLayerNames(MatoranStage.Diminished, Mask.Hau)).toEqual({
      brain: 'McBrain',
      face: 'McFace',
      mask: Mask.Hau,
    });
    expect(getAvatarLayerNames(MatoranStage.Rebuilt, Mask.Ruru)).toEqual({
      brain: 'McBrain',
      face: 'McFace',
      mask: Mask.Ruru,
    });
  });

  test('gives Toa Metru the 2004 head and the Kanohi from their dex entry', () => {
    expect(getAvatarLayerNames(MatoranStage.ToaMetru, Mask.HauGreat)).toEqual({
      brain: 'MetruBrain',
      face: 'MetruFace',
      mask: Mask.HauGreat,
    });
  });

  test('uses the standard head for Toa, Turaga and Metru Matoran', () => {
    for (const stage of [
      MatoranStage.ToaMata,
      MatoranStage.ToaNuva,
      MatoranStage.Turaga,
      MatoranStage.Metru,
    ]) {
      expect(getAvatarLayerNames(stage, Mask.Hau)).toEqual({
        brain: 'Brain',
        face: 'Face',
        mask: Mask.Hau,
      });
    }
  });

  test('never rewrites the Kanohi it is given', () => {
    for (const stage of ALL_STAGES) {
      for (const mask of ALL_MASKS) {
        expect(getAvatarLayerNames(stage, mask).mask).toBe(mask);
      }
    }
  });

  test.each(ALL_STAGES)('resolves head layers that exist in public/avatar for %s', (stage) => {
    const layers = getAvatarLayerNames(stage, Mask.Hau);
    expect(existsSync(resolve(AVATAR_DIR, `${layers.brain}.webp`))).toBe(true);
    expect(existsSync(resolve(AVATAR_DIR, `${layers.face}.webp`))).toBe(true);
  });

  // Every mask is selectable at character creation, so each one needs an avatar image.
  test.each(ALL_MASKS)('has a Kanohi image for %s', (mask) => {
    expect(existsSync(resolve(AVATAR_DIR, 'Kanohi', `${mask}.webp`))).toBe(true);
  });
});
