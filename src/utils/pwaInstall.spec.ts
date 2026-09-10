/**
 * @jest-environment jsdom
 */
import {
  canOfferPwaInstall,
  getPwaInstallPlatform,
  isAndroidDevice,
  isIosDevice,
  isPwaInstalled,
} from './pwaInstall';

describe('pwaInstall', () => {
  const originalNavigator = global.navigator;
  let originalMatchMedia: typeof window.matchMedia | undefined;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      configurable: true,
      value: originalNavigator,
    });
    if (originalMatchMedia) {
      window.matchMedia = originalMatchMedia;
    }
  });

  describe('isPwaInstalled', () => {
    it('returns true when navigator.standalone is set (iOS)', () => {
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: { standalone: true },
      });
      expect(isPwaInstalled()).toBe(true);
    });

    it('returns true when display-mode is standalone', () => {
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: {},
      });
      window.matchMedia = jest.fn((query: string) => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: query.includes('standalone'),
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })) as typeof window.matchMedia;
      expect(isPwaInstalled()).toBe(true);
    });

    it('returns false in a normal browser tab', () => {
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: { userAgent: 'Mozilla/5.0' },
      });
      window.matchMedia = jest.fn(() => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: false,
        media: '',
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })) as typeof window.matchMedia;
      expect(isPwaInstalled()).toBe(false);
    });
  });

  describe('platform detection', () => {
    it('detects iOS Safari user agents', () => {
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: {
          maxTouchPoints: 5,
          platform: 'iPhone',
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        },
      });
      expect(isIosDevice()).toBe(true);
      expect(getPwaInstallPlatform()).toBe('ios');
    });

    it('detects Android user agents', () => {
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: {
          maxTouchPoints: 5,
          platform: 'Linux armv8l',
          userAgent:
            'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        },
      });
      expect(isAndroidDevice()).toBe(true);
      expect(getPwaInstallPlatform()).toBe('android');
    });
  });

  describe('canOfferPwaInstall', () => {
    it('returns false when already installed', () => {
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: { standalone: true },
      });
      expect(canOfferPwaInstall()).toBe(false);
    });

    it('returns true on iOS when not installed', () => {
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: {
          maxTouchPoints: 5,
          platform: 'iPhone',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
        },
      });
      window.matchMedia = jest.fn(() => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: false,
        media: '',
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })) as typeof window.matchMedia;
      expect(canOfferPwaInstall()).toBe(true);
    });

    it('returns true on desktop only when a native install prompt is available', () => {
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: {
          maxTouchPoints: 0,
          platform: 'Win32',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        },
      });
      window.matchMedia = jest.fn(() => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: false,
        media: '',
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })) as typeof window.matchMedia;
      expect(canOfferPwaInstall()).toBe(false);
      expect(canOfferPwaInstall({ hasNativeInstallPrompt: true })).toBe(true);
    });
  });
});
