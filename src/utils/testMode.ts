import { AnimationAction } from 'three';

/**
 * Test mode utilities for Playwright visual testing
 *
 * When running in test mode, animations are paused at frame 0 to prevent flaky screenshots
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

/**
 * Setup an animation action for test mode
 * In test mode, the action is paused at time 0
 * In normal mode, the action plays normally
 */
export function setupAnimationForTestMode(action: AnimationAction): void {
  if (isTestMode()) {
    action.time = 0;
    action.paused = true;
    console.log('[TEST_MODE] animation loaded');
  }
}
