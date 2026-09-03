import { Object3D } from 'three';
import { normalizeMaskSocketScale } from './normalizeMaskSocketScale';

describe('normalizeMaskSocketScale', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('does nothing when the socket is already 1×', () => {
    const parent = new Object3D();
    parent.name = 'Masks';
    parent.scale.set(1, 1, 1);
    normalizeMaskSocketScale(parent);
    expect(parent.scale.toArray()).toEqual([1, 1, 1]);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('resets a leftover oversized socket and warns in non-prod', () => {
    const parent = new Object3D();
    parent.name = 'Masks';
    parent.scale.set(37, 37, 37);
    normalizeMaskSocketScale(parent);
    expect(parent.scale.toArray()).toEqual([1, 1, 1]);
    expect(warnSpy).toHaveBeenCalledWith(
      "[useMask] Neutralizing Masks socket scale (37, 37, 37) on 'Masks'. " +
        'Re-export the rig at 1× so this workaround can be removed.'
    );
  });
});
