const preload = jest.fn();

jest.mock('@react-three/drei', () => ({
  useGLTF: { preload: (...args: unknown[]) => preload(...args) },
}));

import { preloadCharacterRigUrls, resetCharacterRigPreloadForTests } from './preloadCharacterRigs';

describe('preloadCharacterRigUrls', () => {
  beforeEach(() => {
    preload.mockClear();
    resetCharacterRigPreloadForTests();
  });

  test('calls useGLTF.preload once per unique url', () => {
    preloadCharacterRigUrls(['/a.glb', '/b.glb']);
    preloadCharacterRigUrls(['/b.glb', '/c.glb']);
    expect(preload.mock.calls.map((call) => call[0])).toEqual(['/a.glb', '/b.glb', '/c.glb']);
  });
});
