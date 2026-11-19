/**
 * @jest-environment jsdom
 */
import { isPortraitViewport } from './viewportOrientation';

function mockMatchMedia(matches: boolean): typeof window.matchMedia {
  return jest.fn((query: string) => ({
    addEventListener: jest.fn(),
    addListener: jest.fn(),
    dispatchEvent: jest.fn(),
    matches,
    media: query,
    onchange: null,
    removeEventListener: jest.fn(),
    removeListener: jest.fn(),
  })) as typeof window.matchMedia;
}

describe('isPortraitViewport', () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
  const originalInnerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight');

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    if (originalInnerWidth) {
      Object.defineProperty(window, 'innerWidth', originalInnerWidth);
    }
    if (originalInnerHeight) {
      Object.defineProperty(window, 'innerHeight', originalInnerHeight);
    }
  });

  it('uses orientation media query when available (landscape)', () => {
    window.matchMedia = mockMatchMedia(true);
    expect(isPortraitViewport()).toBe(false);
  });

  it('uses orientation media query when available (portrait)', () => {
    window.matchMedia = mockMatchMedia(false);
    expect(isPortraitViewport()).toBe(true);
  });

  it('falls back to innerWidth/innerHeight when matchMedia is missing', () => {
    // @ts-expect-error intentional delete for fallback coverage
    delete window.matchMedia;
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 932 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 430 });

    expect(isPortraitViewport()).toBe(false);

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 430 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 932 });

    expect(isPortraitViewport()).toBe(true);
  });
});
