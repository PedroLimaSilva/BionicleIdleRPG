import { PartialGameState } from '../types/GameState';
import { getTelemetryEnabled } from './gamePersistence';

const SESSION_KEY = 'TELEMETRY_SENT';

export interface TelemetryPayload {
  appVersion: string;
  gameStateVersion: number;
  timestamp: string;
  gameState: PartialGameState;
}

export function getTelemetryUrl(): string {
  return typeof __TELEMETRY_URL__ !== 'undefined' ? __TELEMETRY_URL__ : '';
}

export function buildPayload(state: PartialGameState): TelemetryPayload {
  return {
    appVersion: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown',
    gameStateVersion: state.version,
    timestamp: new Date().toISOString(),
    gameState: state,
  };
}

/**
 * Sends a single telemetry beacon per browser session.
 *
 * No-ops when:
 * - __TELEMETRY_URL__ is empty (not configured at build time)
 * - The user has opted out via Settings
 * - A beacon was already sent this session (tracked via sessionStorage)
 *
 * Failures are silently swallowed so telemetry never affects gameplay.
 */
export function sendSessionTelemetry(state: PartialGameState): void {
  try {
    const url = getTelemetryUrl();
    if (!url) return;
    if (!getTelemetryEnabled()) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    sessionStorage.setItem(SESSION_KEY, '1');

    const payload = buildPayload(state);
    const body = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Telemetry must never break the app
  }
}
