import { PartialGameState } from '../types/GameState';
import { getTelemetryEnabled, getTelemetryId, STORAGE_KEY } from './gamePersistence';

const SESSION_KEY = 'TELEMETRY_SENT';

export interface TelemetryError {
  message: string;
  stack?: string;
}

export interface TelemetryPayload {
  clientId?: string;
  appVersion: string;
  gameStateVersion: number;
  timestamp: string;
  gameState: PartialGameState;
  error?: TelemetryError;
}

export function getTelemetryUrl(): string {
  return typeof __TELEMETRY_URL__ !== 'undefined' ? __TELEMETRY_URL__ : '';
}

function getAppVersion(): string {
  return typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown';
}

export function buildPayload(state: PartialGameState): TelemetryPayload {
  return {
    clientId: getTelemetryId(),
    appVersion: getAppVersion(),
    gameStateVersion: state.version,
    timestamp: new Date().toISOString(),
    gameState: state,
  };
}

function sendBeacon(url: string, body: string): void {
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([body], { type: 'text/plain' }));
  } else {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body,
      keepalive: true,
    }).catch(() => {});
  }
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
    sendBeacon(url, JSON.stringify(buildPayload(state)));
  } catch {
    // Telemetry must never break the app
  }
}

/**
 * Reads the persisted game state directly from localStorage.
 * Used by error reporting when React state is unavailable.
 */
function loadGameStateFromStorage(): PartialGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && typeof parsed.version === 'number') {
      return parsed as PartialGameState;
    }
  } catch {
    // Corrupt or missing — that's fine
  }
  return null;
}

/**
 * Sends an error report immediately, bypassing the once-per-session guard.
 * Includes the game state snapshot from localStorage (React may have crashed).
 */
export function sendErrorReport(error: TelemetryError): void {
  try {
    const url = getTelemetryUrl();
    if (!url) return;
    if (!getTelemetryEnabled()) return;

    const gameState = loadGameStateFromStorage();
    const payload: TelemetryPayload = {
      clientId: getTelemetryId(),
      appVersion: getAppVersion(),
      gameStateVersion: gameState?.version ?? 0,
      timestamp: new Date().toISOString(),
      gameState: gameState ?? ({} as PartialGameState),
      error,
    };

    sendBeacon(url, JSON.stringify(payload));
  } catch {
    // Must never make a crash worse
  }
}

/**
 * Installs global error handlers that send error reports via telemetry.
 * Call once at app startup, before React renders.
 */
export function setupErrorReporting(): void {
  const url = getTelemetryUrl();
  if (!url) return;

  window.addEventListener('error', (event) => {
    sendErrorReport({
      message: event.message || String(event.error),
      stack: event.error?.stack,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    sendErrorReport({
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });
}
