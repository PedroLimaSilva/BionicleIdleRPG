/**
 * @jest-environment jsdom
 */
import { PartialGameState } from '../types/GameState';
import { CURRENT_GAME_STATE_VERSION } from '../data/gameState';

const MOCK_STATE: PartialGameState = {
  activeQuests: [],
  collectedKrana: {},
  completedQuests: [],
  kraataCollection: {},
  protodermis: 100,
  protodermisCap: 2000,
  rahkshi: [],
  recruitedCharacters: [],
  version: CURRENT_GAME_STATE_VERSION,
};

let mockTelemetryEnabled: boolean;

jest.mock('./gamePersistence', () => ({
  getTelemetryEnabled: () => mockTelemetryEnabled,
  getTelemetryId: () => 'test-uuid-1234',
  loadRawGameState: () => null,
}));

function loadModule() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('./telemetry') as typeof import('./telemetry');
}

const mockSendBeacon = jest.fn().mockReturnValue(true);
const mockFetch = jest.fn().mockResolvedValue({ ok: true });

beforeEach(() => {
  jest.resetModules();
  sessionStorage.clear();
  mockTelemetryEnabled = true;
  mockSendBeacon.mockClear();
  mockFetch.mockClear();

  (globalThis as Record<string, unknown>).__APP_VERSION__ = '1.2.3';
  (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = '';

  Object.defineProperty(navigator, 'sendBeacon', {
    configurable: true,
    value: mockSendBeacon,
    writable: true,
  });

  globalThis.fetch = mockFetch as unknown as typeof fetch;
});

afterEach(() => {
  jest.restoreAllMocks();
  (globalThis as Record<string, unknown>).__APP_VERSION__ = 'test';
  (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = '';
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

describe('sendSessionTelemetry', () => {
  it('does nothing when __TELEMETRY_URL__ is empty', () => {
    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);

    expect(mockSendBeacon).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does nothing when telemetry is opted out', () => {
    mockTelemetryEnabled = false;
    (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = 'https://example.com/telemetry';
    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);

    expect(mockSendBeacon).not.toHaveBeenCalled();
  });

  it('sends exactly once per session', () => {
    (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = 'https://example.com/telemetry';
    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);
    sendSessionTelemetry(MOCK_STATE);
    sendSessionTelemetry(MOCK_STATE);

    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
  });

  it('sends beacon with correct URL', () => {
    (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = 'https://example.com/telemetry';
    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);

    expect(mockSendBeacon).toHaveBeenCalledWith('https://example.com/telemetry', expect.any(Blob));
  });

  it('falls back to fetch when sendBeacon is unavailable', () => {
    (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = 'https://example.com/telemetry';

    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: undefined,
      writable: true,
    });

    const { sendSessionTelemetry } = loadModule();

    sendSessionTelemetry(MOCK_STATE);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/telemetry',
      expect.objectContaining({
        keepalive: true,
        method: 'POST',
      })
    );
  });

  it('never throws even if sendBeacon throws', () => {
    (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = 'https://example.com/telemetry';

    mockSendBeacon.mockImplementation(() => {
      throw new Error('Network error');
    });

    const { sendSessionTelemetry } = loadModule();

    expect(() => sendSessionTelemetry(MOCK_STATE)).not.toThrow();
  });
});

describe('sendErrorReport', () => {
  it('sends immediately with error details', () => {
    (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = 'https://example.com/telemetry';
    const { sendErrorReport } = loadModule();

    sendErrorReport({ message: 'Something broke', stack: 'Error: Something broke\n    at foo' });

    expect(mockSendBeacon).toHaveBeenCalledTimes(1);
    const blob = mockSendBeacon.mock.calls[0][1] as Blob;
    expect(blob).toBeInstanceOf(Blob);
  });

  it('does not deduplicate — sends on every call', () => {
    (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = 'https://example.com/telemetry';
    const { sendErrorReport } = loadModule();

    sendErrorReport({ message: 'error 1' });
    sendErrorReport({ message: 'error 2' });
    sendErrorReport({ message: 'error 3' });

    expect(mockSendBeacon).toHaveBeenCalledTimes(3);
  });

  it('does nothing when telemetry is opted out', () => {
    mockTelemetryEnabled = false;
    (globalThis as Record<string, unknown>).__TELEMETRY_URL__ = 'https://example.com/telemetry';
    const { sendErrorReport } = loadModule();

    sendErrorReport({ message: 'crash' });

    expect(mockSendBeacon).not.toHaveBeenCalled();
  });

  it('does nothing when URL is empty', () => {
    const { sendErrorReport } = loadModule();

    sendErrorReport({ message: 'crash' });

    expect(mockSendBeacon).not.toHaveBeenCalled();
  });
});
