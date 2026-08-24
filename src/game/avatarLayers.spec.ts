import { existsSync } from 'fs';
import { resolve } from 'path';

import { getAvatarLayerNames } from './avatarLayers';
import { Mask, MatoranStage } from '../types/Matoran';

const AVATAR_DIR = resolve(__dirname, '../../public/avatar');

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

  test('gives Metru Matoran the Toa Mata head and their noble Kanohi', () => {
    expect(getAvatarLayerNames(MatoranStage.Metru, Mask.Huna)).toEqual({
      brain: 'Brain',
      face: 'Face',
      mask: Mask.Huna,
    });
  });

  test('upgrades Toa Metru Kanohi to the Great sculpt', () => {
    expect(getAvatarLayerNames(MatoranStage.ToaMetru, Mask.Huna)).toEqual({
      brain: 'MetruBrain',
      face: 'MetruFace',
      mask: Mask.HunaGreat,
    });
    expect(getAvatarLayerNames(MatoranStage.ToaMetru, Mask.HauGreat)).toEqual({
      brain: 'MetruBrain',
      face: 'MetruFace',
      mask: Mask.HauGreat,
    });
  });

  test('leaves Kanohi without a Great sculpt untouched', () => {
    expect(getAvatarLayerNames(MatoranStage.ToaMetru, Mask.Akaku).mask).toBe(Mask.Akaku);
  });

  test('falls back to the standard head for Toa, Turaga and Metru Matoran', () => {
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

  test.each([
    [MatoranStage.Diminished, Mask.Hau],
    [MatoranStage.Rebuilt, Mask.Hau],
    [MatoranStage.Metru, Mask.Huna],
    [MatoranStage.Metru, Mask.Komau],
    [MatoranStage.Metru, Mask.Mahiki],
    [MatoranStage.Metru, Mask.Matatu],
    [MatoranStage.Metru, Mask.Rau],
    [MatoranStage.Metru, Mask.Ruru],
    [MatoranStage.ToaMetru, Mask.HauGreat],
    [MatoranStage.ToaMetru, Mask.Huna],
    [MatoranStage.ToaMetru, Mask.Komau],
    [MatoranStage.ToaMetru, Mask.Mahiki],
    [MatoranStage.ToaMetru, Mask.Matatu],
    [MatoranStage.ToaMetru, Mask.Rau],
    [MatoranStage.ToaMetru, Mask.Ruru],
    [MatoranStage.ToaMata, Mask.Hau],
    [MatoranStage.ToaNuva, Mask.HauNuva],
  ])('resolves %s / %s to files that exist in public/avatar', (stage, mask) => {
    const layers = getAvatarLayerNames(stage, mask);
    expect(existsSync(resolve(AVATAR_DIR, `${layers.brain}.webp`))).toBe(true);
    expect(existsSync(resolve(AVATAR_DIR, `${layers.face}.webp`))).toBe(true);
    expect(existsSync(resolve(AVATAR_DIR, 'Kanohi', `${layers.mask}.webp`))).toBe(true);
  });
});
