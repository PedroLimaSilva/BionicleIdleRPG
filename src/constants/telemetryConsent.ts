/** Bump when the privacy policy or telemetry scope changes materially. Prior opt-ins re-prompt. */
export const CURRENT_TELEMETRY_POLICY_VERSION = '2026-08-30';

export const TELEMETRY_CONSENT_KEY = 'TELEMETRY_CONSENT';

/** Set in sessionStorage when a prior opt-in was cleared due to a policy update. */
export const TELEMETRY_CONSENT_RECONSENT_SESSION_KEY = 'TELEMETRY_CONSENT_RECONSENT';

/** @deprecated Migrated to {@link TELEMETRY_CONSENT_KEY}. Legacy `true` triggers re-consent. */
export const LEGACY_TELEMETRY_ENABLED_KEY = 'TELEMETRY_ENABLED';

/** Stored consent: declined (`false`) or the accepted policy version string. */
export type TelemetryConsentValue = false | string;

export function buildTelemetryConsentValue(accepted: boolean): TelemetryConsentValue {
  return accepted ? CURRENT_TELEMETRY_POLICY_VERSION : false;
}
