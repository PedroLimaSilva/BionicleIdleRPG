export type PwaInstallPlatform = 'ios' | 'android' | 'desktop';

const IOS_UA = /iPad|iPhone|iPod/i;
const ANDROID_UA = /Android/i;

/** True when the app is running as an installed PWA (standalone / home-screen launch). */
export function isPwaInstalled(): boolean {
  if (typeof window === 'undefined') return true;

  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };
  if (navigatorWithStandalone.standalone) return true;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
}

export function isIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  return (
    IOS_UA.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isAndroidDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return ANDROID_UA.test(navigator.userAgent);
}

/** Best-effort platform bucket for install instructions. */
export function getPwaInstallPlatform(): PwaInstallPlatform {
  if (isIosDevice()) return 'ios';
  if (isAndroidDevice()) return 'android';
  return 'desktop';
}

/** Whether we should surface the install affordance in the browser. */
export function canOfferPwaInstall(options?: { hasNativeInstallPrompt?: boolean }): boolean {
  if (isPwaInstalled()) return false;

  const platform = getPwaInstallPlatform();
  if (platform === 'ios' || platform === 'android') return true;

  return options?.hasNativeInstallPrompt ?? false;
}
