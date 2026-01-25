/**
 * Test mode utilities for Playwright visual testing
 * 
 * When running in test mode, animations are paused to prevent flaky screenshots
 */

/**
 * Check if the app is running in test mode
 * Test mode is enabled via URL parameter: ?testMode=true
 */
export function isTestMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.get('testMode') === 'true';
}

/**
 * Get animation time scale based on test mode
 * Returns 0 in test mode to pause animations, 1 otherwise
 */
export function getAnimationTimeScale(): number {
  return isTestMode() ? 0 : 1;
}

/**
 * Check if animations should be disabled
 */
export function shouldDisableAnimations(): boolean {
  return isTestMode();
}

