const preload = jest.fn();

jest.mock('@react-three/drei', () => ({
  useGLTF: { preload: (...args: unknown[]) => preload(...args) },
}));

jest.mock('suspend-react', () => ({
  peek: () => [{}],
}));

import { preloadCharacterRigUrls, resetCharacterRigPreloadForTests } from './preloadCharacterRigs';

describe('preloadCharacterRigUrls', () => {
  beforeEach(() => {
    preload.mockClear();
    resetCharacterRigPreloadForTests();
  });

  test('calls useGLTF.preload once per unique url', async () => {
    await preloadCharacterRigUrls(['/a.glb', '/b.glb']);
    await preloadCharacterRigUrls(['/b.glb', '/c.glb']);
    expect(preload.mock.calls.map((call) => call[0])).toEqual(['/a.glb', '/b.glb', '/c.glb']);
  });

  test('reports progress as each url becomes ready', async () => {
    const ticks: Array<{ loaded: number; total: number }> = [];
    await preloadCharacterRigUrls(['/a.glb', '/b.glb'], (progress) => {
      ticks.push(progress);
    });
    expect(ticks[0]).toEqual({ loaded: 0, total: 2 });
    expect(ticks[ticks.length - 1]).toEqual({ loaded: 2, total: 2 });
  });
});
