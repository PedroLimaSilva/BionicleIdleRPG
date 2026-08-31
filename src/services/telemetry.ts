import posthog from 'posthog-js';
import { PartialGameState } from '../types/GameState';
import {
  getTelemetryEnabled,
  getTelemetryId,
  getLastPersistedGameState,
  loadRawGameState,
} from '../persistence/gamePersistence';

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

let analyticsInitialized = false;

function getPostHogKey(): string {
  return typeof __POSTHOG_KEY__ !== 'undefined' ? __POSTHOG_KEY__ : '';
}

function getPostHogHost(): string {
  return typeof __POSTHOG_HOST__ !== 'undefined' && __POSTHOG_HOST__
    ? __POSTHOG_HOST__
    : 'https://us.i.posthog.com';
}

export function isAnalyticsConfigured(): boolean {
  return getPostHogKey().length > 0;
}

/** @deprecated Use isAnalyticsConfigured() instead. */
export function getTelemetryUrl(): string {
  return isAnalyticsConfigured() ? getPostHogHost() : '';
}

function getAppVersion(): string {
  return typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown';
}

export function buildPayload(state: PartialGameState): TelemetryPayload {
  return {
    appVersion: getAppVersion(),
    clientId: getTelemetryId(),
    gameState: state,
    gameStateVersion: state.version,
    timestamp: new Date().toISOString(),
  };
}

function buildEventProperties(state: PartialGameState, error?: TelemetryError) {
  const payload = buildPayload(state);
  return {
    app_version: payload.appVersion,
    client_id: payload.clientId,
    game_state: payload.gameState,
    game_state_version: payload.gameStateVersion,
    timestamp: payload.timestamp,
    ...(error
      ? {
          error_message: error.message,
          error_stack: error.stack,
        }
      : {}),
  };
}

function ensureAnalyticsInitialized(): boolean {
  const key = getPostHogKey();
  if (!key) return false;

  if (!analyticsInitialized) {
    posthog.init(key, {
      api_host: getPostHogHost(),
      capture_exceptions: true,
      capture_heatmaps: true,
      capture_pageview: 'history_change',
      defaults: '2026-01-30',
      disable_session_recording: false,
      opt_out_capturing_by_default: true,
      persistence: 'localStorage',
      rageclick: true,
    });
    analyticsInitialized = true;
  }

  return true;
}

/**
 * Applies the user's telemetry consent choice to PostHog.
 * Call after init and whenever the Settings toggle changes.
 */
export function syncAnalyticsConsent(): void {
  if (!ensureAnalyticsInitialized()) return;

  if (getTelemetryEnabled()) {
    posthog.opt_in_capturing();
    const clientId = getTelemetryId();
    if (clientId) {
      posthog.identify(clientId);
    }
    posthog.startSessionRecording();
    return;
  }

  posthog.opt_out_capturing();
}

/**
 * Initializes PostHog when configured and syncs the stored consent preference.
 * Safe to call at app startup before React renders.
 */
export function initAnalytics(): void {
  if (!ensureAnalyticsInitialized()) return;
  syncAnalyticsConsent();
}

/**
 * Sends a single telemetry event per browser session.
 *
 * No-ops when:
 * - PostHog is not configured at build time
 * - The user has opted out via Settings
 * - An event was already sent this session (tracked via sessionStorage)
 *
 * Failures are silently swallowed so telemetry never affects gameplay.
 */
export function sendSessionTelemetry(state: PartialGameState): void {
  try {
    if (!isAnalyticsConfigured()) return;
    if (!getTelemetryEnabled()) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    initAnalytics();
    sessionStorage.setItem(SESSION_KEY, '1');
    posthog.capture('game_session_snapshot', buildEventProperties(state));
  } catch {
    // Telemetry must never break the app
  }
}

function loadGameStateFromStorage(): PartialGameState | null {
  const cached = getLastPersistedGameState();
  if (cached) return cached;

  const raw = loadRawGameState();
  if (raw && typeof raw.version === 'number') return raw as unknown as PartialGameState;
  return null;
}

/**
 * Sends an error report immediately, bypassing the once-per-session guard.
 * Includes the game state snapshot from localStorage (React may have crashed).
 */
export function sendErrorReport(error: TelemetryError): void {
  try {
    if (!isAnalyticsConfigured()) return;
    if (!getTelemetryEnabled()) return;

    initAnalytics();

    const gameState = loadGameStateFromStorage();
    const properties = buildEventProperties(gameState ?? ({} as PartialGameState), error);
    const exception = new Error(error.message);
    if (error.stack) {
      exception.stack = error.stack;
    }

    posthog.captureException(exception, properties);
  } catch {
    // Must never make a crash worse
  }
}

/**
 * Installs global error handlers that send error reports via PostHog.
 * Call once at app startup, before React renders.
 */
export function setupErrorReporting(): void {
  if (!isAnalyticsConfigured()) return;

  initAnalytics();

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
