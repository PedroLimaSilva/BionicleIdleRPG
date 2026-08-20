/**
 * @jest-environment jsdom
 */
import { PartialGameState } from '../types/GameState';
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';

const MOCK_STATE: PartialGameState = {
  activeQuests: [],
  collectedKrana: {},
  completedQuests: [],
  customCharacters: [],
  kraataCollection: {},
  protodermis: 100,
  protodermisCap: 2000,
  rahkshi: [],
  recruitedCharacters: [],
  version: CURRENT_GAME_STATE_VERSION,
};

let mockTelemetryEnabled: boolean;

const mockCapture = jest.fn();
const mockCaptureException = jest.fn();
const mockIdentify = jest.fn();
const mockInit = jest.fn();
const mockOptInCapturing = jest.fn();
const mockOptOutCapturing = jest.fn();

jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    capture: (...args: unknown[]) => mockCapture(...args),
    captureException: (...args: unknown[]) => mockCaptureException(...args),
    identify: (...args: unknown[]) => mockIdentify(...args),
    init: (...args: unknown[]) => mockInit(...args),
    opt_in_capturing: (...args: unknown[]) => mockOptInCapturing(...args),
    opt_out_capturing: (...args: unknown[]) => mockOptOutCapturing(...args),
  },
}));

jest.mock('./gamePersistence', () => ({
  getLastPersistedGameState: () => null,
  getTelemetryEnabled: () => mockTelemetryEnabled,
  getTelemetryId: () => 'test-uuid-1234',
  loadRawGameState: () => null,
}));

function loadModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('./telemetry') as typeof import('./telemetry');
}

beforeEach(() => {
  jest.resetModules();
  sessionStorage.clear();
  mockTelemetryEnabled = true;
  mockCapture.mockClear();
  mockCaptureException.mockClear();
  mockIdentify.mockClear();
  mockInit.mockClear();
  mockOptInCapturing.mockClear();
  mockOptOutCapturing.mockClear();

  (globalThis as Record<string, unknown>).__APP_VERSION__ = '1.2.3';
  (globalThis as Record<string, unknown>).__POSTHOG_HOST__ = 'https://us.i.posthog.com';
  (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = '';
});

afterEach(() => {
  jest.restoreAllMocks();
  (globalThis as Record<string, unknown>).__APP_VERSION__ = 'test';
  (globalThis as Record<string, unknown>).__POSTHOG_HOST__ = 'https://us.i.posthog.com';
  (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = '';
});

describe('buildPayload', () => {
  it('includes client ID, app version, game state version, timestamp, and state', () => {
    const { buildPayload } = loadModule();
    const payload = buildPayload(MOCK_STATE);

    expect(payload.clientId).toBe('test-uuid-1234');
    expect(payload.appVersion).toBe('1.2.3');
    expect(payload.gameStateVersion).toBe(CURRENT_GAME_STATE_VERSION);
    expect(payload.timestamp).toBeTruthy();
    expect(payload.gameState).toEqual(MOCK_STATE);
  });

  it('falls back to "unknown" when __APP_VERSION__ is not defined', () => {
    delete (globalThis as Record<string, unknown>).__APP_VERSION__;
    const { buildPayload } = loadModule();
    const payload = buildPayload(MOCK_STATE);

    expect(payload.appVersion).toBe('unknown');
  });
});

describe('isAnalyticsConfigured', () => {
  it('returns false when PostHog key is empty', () => {
    const { isAnalyticsConfigured } = loadModule();
    expect(isAnalyticsConfigured()).toBe(false);
  });

  it('returns true when PostHog key is set', () => {
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { isAnalyticsConfigured } = loadModule();
    expect(isAnalyticsConfigured()).toBe(true);
  });
});

describe('syncAnalyticsConsent', () => {
  it('opts in and identifies the client when telemetry is enabled', () => {
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { syncAnalyticsConsent } = loadModule();

    syncAnalyticsConsent();

    expect(mockInit).toHaveBeenCalledWith(
      'phc_test',
      expect.objectContaining({
        api_host: 'https://us.i.posthog.com',
        opt_out_capturing_by_default: true,
      })
    );
    expect(mockOptInCapturing).toHaveBeenCalled();
    expect(mockIdentify).toHaveBeenCalledWith('test-uuid-1234');
  });

  it('opts out when telemetry is disabled', () => {
    mockTelemetryEnabled = false;
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { syncAnalyticsConsent } = loadModule();

    syncAnalyticsConsent();

    expect(mockOptOutCapturing).toHaveBeenCalled();
    expect(mockIdentify).not.toHaveBeenCalled();
  });
});

describe('sendSessionTelemetry', () => {
  it('does nothing when PostHog is not configured', () => {
    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);

    expect(mockCapture).not.toHaveBeenCalled();
  });

  it('does nothing when telemetry is opted out', () => {
    mockTelemetryEnabled = false;
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);

    expect(mockCapture).not.toHaveBeenCalled();
  });

  it('sends exactly once per session', () => {
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);
    sendSessionTelemetry(MOCK_STATE);
    sendSessionTelemetry(MOCK_STATE);

    expect(mockCapture).toHaveBeenCalledTimes(1);
  });

  it('captures a game_session_snapshot event with game state properties', () => {
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);

    expect(mockCapture).toHaveBeenCalledWith(
      'game_session_snapshot',
      expect.objectContaining({
        app_version: '1.2.3',
        client_id: 'test-uuid-1234',
        game_state: MOCK_STATE,
        game_state_version: CURRENT_GAME_STATE_VERSION,
      })
    );
  });

  it('never throws even if capture throws', () => {
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';

    mockCapture.mockImplementation(() => {
      throw new Error('Network error');
    });

    const { sendSessionTelemetry } = loadModule();

    expect(() => sendSessionTelemetry(MOCK_STATE)).not.toThrow();
  });
});

describe('sendErrorReport', () => {
  it('sends immediately with error details', () => {
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { sendErrorReport } = loadModule();

    sendErrorReport({ message: 'Something broke', stack: 'Error: Something broke\n    at foo' });

    expect(mockCaptureException).toHaveBeenCalledTimes(1);
    const [error, properties] = mockCaptureException.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Something broke');
    expect(properties).toEqual(
      expect.objectContaining({
        error_message: 'Something broke',
        error_stack: 'Error: Something broke\n    at foo',
      })
    );
  });

  it('does not deduplicate — sends on every call', () => {
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { sendErrorReport } = loadModule();

    sendErrorReport({ message: 'error 1' });
    sendErrorReport({ message: 'error 2' });
    sendErrorReport({ message: 'error 3' });

    expect(mockCaptureException).toHaveBeenCalledTimes(3);
  });

  it('does nothing when telemetry is opted out', () => {
    mockTelemetryEnabled = false;
    (globalThis as Record<string, unknown>).__POSTHOG_KEY__ = 'phc_test';
    const { sendErrorReport } = loadModule();

    sendErrorReport({ message: 'crash' });

    expect(mockCaptureException).not.toHaveBeenCalled();
  });

  it('does nothing when PostHog is not configured', () => {
    const { sendErrorReport } = loadModule();

    sendErrorReport({ message: 'crash' });

    expect(mockCaptureException).not.toHaveBeenCalled();
  });
});
