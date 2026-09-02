import { isCanvasRoute, shouldFadeCanvasOnExit } from './canvasRoutes';

describe('canvasRoutes', () => {
  describe('isCanvasRoute', () => {
    test('matches character detail and dex preview routes', () => {
      expect(isCanvasRoute('/characters/Takua')).toBe(true);
      expect(isCanvasRoute('/test/dex/Takua')).toBe(true);
    });

    test('does not match list routes without canvas', () => {
      expect(isCanvasRoute('/characters')).toBe(false);
      expect(isCanvasRoute('/test/dex')).toBe(false);
      expect(isCanvasRoute('/quests')).toBe(false);
    });
  });

  describe('shouldFadeCanvasOnExit', () => {
    test('returns true when leaving a canvas route for a non-canvas route', () => {
      expect(shouldFadeCanvasOnExit('/characters/Takua', '/characters')).toBe(true);
      expect(shouldFadeCanvasOnExit('/characters/Takua', '/')).toBe(true);
    });

    test('returns false when staying on or entering canvas routes', () => {
      expect(shouldFadeCanvasOnExit('/characters/Takua', '/characters/Pohatu')).toBe(false);
      expect(shouldFadeCanvasOnExit('/quests', '/characters/Takua')).toBe(false);
    });
  });
});
