/**
 * @jest-environment jsdom
 */
import {
  buildTelemetryConsentValue,
  CURRENT_TELEMETRY_POLICY_VERSION,
  LEGACY_TELEMETRY_ENABLED_KEY,
  TELEMETRY_CONSENT_KEY,
  TELEMETRY_CONSENT_RECONSENT_SESSION_KEY,
} from '../constants/telemetryConsent';
import {
  getTelemetryEnabled,
  hasTelemetryConsent,
  isTelemetryConsentStale,
  saveTelemetryEnabled,
} from './gamePersistence';

describe('telemetry consent versioning', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('treats absent consent as no consent and not stale on first visit', () => {
    expect(hasTelemetryConsent()).toBe(false);
    expect(isTelemetryConsentStale()).toBe(false);
    expect(getTelemetryEnabled()).toBe(false);
  });

  it('stores false when declined and the policy version when accepted', () => {
    saveTelemetryEnabled(false);
    expect(localStorage.getItem(TELEMETRY_CONSENT_KEY)).toBe('false');
    expect(getTelemetryEnabled()).toBe(false);
    expect(hasTelemetryConsent()).toBe(true);

    localStorage.clear();
    sessionStorage.clear();

    saveTelemetryEnabled(true);
    expect(localStorage.getItem(TELEMETRY_CONSENT_KEY)).toBe(
      JSON.stringify(CURRENT_TELEMETRY_POLICY_VERSION)
    );
    expect(getTelemetryEnabled()).toBe(true);
    expect(hasTelemetryConsent()).toBe(true);
  });

  it('does not re-prompt when the user previously declined', () => {
    localStorage.setItem(TELEMETRY_CONSENT_KEY, JSON.stringify(false));

    expect(hasTelemetryConsent()).toBe(true);
    expect(isTelemetryConsentStale()).toBe(false);
    expect(getTelemetryEnabled()).toBe(false);
    expect(localStorage.getItem(TELEMETRY_CONSENT_KEY)).toBe('false');
  });

  it('re-prompts when consent was an older accepted policy version', () => {
    localStorage.setItem(TELEMETRY_CONSENT_KEY, JSON.stringify('2025-01-01'));

    expect(hasTelemetryConsent()).toBe(false);
    expect(isTelemetryConsentStale()).toBe(true);
    expect(getTelemetryEnabled()).toBe(false);
    expect(localStorage.getItem(TELEMETRY_CONSENT_KEY)).toBeNull();
  });

  it('re-prompts when legacy opt-in storage is present', () => {
    localStorage.setItem(LEGACY_TELEMETRY_ENABLED_KEY, 'true');

    expect(hasTelemetryConsent()).toBe(false);
    expect(isTelemetryConsentStale()).toBe(true);
    expect(getTelemetryEnabled()).toBe(false);
    expect(localStorage.getItem(LEGACY_TELEMETRY_ENABLED_KEY)).toBeNull();
  });

  it('migrates legacy decline without re-prompting', () => {
    localStorage.setItem(LEGACY_TELEMETRY_ENABLED_KEY, 'false');

    expect(hasTelemetryConsent()).toBe(true);
    expect(isTelemetryConsentStale()).toBe(false);
    expect(getTelemetryEnabled()).toBe(false);
    expect(localStorage.getItem(TELEMETRY_CONSENT_KEY)).toBe('false');
    expect(localStorage.getItem(LEGACY_TELEMETRY_ENABLED_KEY)).toBeNull();
  });

  it('migrates legacy opt-in when the user accepts again', () => {
    localStorage.setItem(LEGACY_TELEMETRY_ENABLED_KEY, 'true');

    saveTelemetryEnabled(true);

    expect(localStorage.getItem(TELEMETRY_CONSENT_KEY)).toBe(
      JSON.stringify(buildTelemetryConsentValue(true))
    );
    expect(isTelemetryConsentStale()).toBe(false);
    expect(getTelemetryEnabled()).toBe(true);
  });

  it('clears the re-consent flag after a prior opt-in responds', () => {
    localStorage.setItem(LEGACY_TELEMETRY_ENABLED_KEY, 'true');
    isTelemetryConsentStale();

    saveTelemetryEnabled(false);

    expect(sessionStorage.getItem(TELEMETRY_CONSENT_RECONSENT_SESSION_KEY)).toBeNull();
    expect(isTelemetryConsentStale()).toBe(false);
    expect(hasTelemetryConsent()).toBe(true);
  });
});
