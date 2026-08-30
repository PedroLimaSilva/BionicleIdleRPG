/** Bump when the privacy policy or telemetry scope changes materially. Stale consent re-prompts. */
export const CURRENT_TELEMETRY_POLICY_VERSION = '2026-08-30';

export const TELEMETRY_CONSENT_KEY = 'TELEMETRY_CONSENT';

/** Tracks which policy epoch the app has acknowledged; used to invalidate prior consent on bump. */
export const TELEMETRY_CONSENT_POLICY_ACK_KEY = 'TELEMETRY_CONSENT_POLICY_ACK';

/** Set in sessionStorage when a prior choice was cleared due to a policy update. */
export const TELEMETRY_CONSENT_RECONSENT_SESSION_KEY = 'TELEMETRY_CONSENT_RECONSENT';

/** @deprecated Migrated to {@link TELEMETRY_CONSENT_KEY}. Legacy rows trigger re-consent. */
export const LEGACY_TELEMETRY_ENABLED_KEY = 'TELEMETRY_ENABLED';

/** Stored consent: declined (`false`) or the accepted policy version string. */
export type TelemetryConsentValue = false | string;

export function buildTelemetryConsentValue(accepted: boolean): TelemetryConsentValue {
  return accepted ? CURRENT_TELEMETRY_POLICY_VERSION : false;
}
