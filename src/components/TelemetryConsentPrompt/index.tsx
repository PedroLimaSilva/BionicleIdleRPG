import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { hasTelemetryConsent, isTelemetryConsentStale } from '../../persistence/gamePersistence';
import { isAnalyticsConfigured } from '../../services/telemetry';
import { useSettings } from '../../context/useSettings';
import './index.scss';

export function TelemetryConsentPrompt() {
  const [visible, setVisible] = useState(() => !hasTelemetryConsent() && isAnalyticsConfigured());
  const isReconsent = isTelemetryConsentStale();
  const { setTelemetryEnabled } = useSettings();
  const { pathname } = useLocation();

  if (!visible || pathname === '/privacy-policy') return null;

  const handleChoice = (allowed: boolean) => {
    setTelemetryEnabled(allowed);
    setVisible(false);
  };

  return (
    <div className="consent-backdrop">
      <div className="consent-panel" role="dialog" aria-modal="true">
        <h2 className="consent-title">
          {isReconsent ? 'Privacy policy updated' : 'Help improve this game?'}
        </h2>
        <p className="consent-body">
          {isReconsent ? (
            <>
              We've updated our <Link to="/privacy-policy">privacy policy</Link> and expanded what
              anonymous usage data may include (such as session recordings and heatmaps). Please
              review the policy and choose whether to continue sharing usage data.
            </>
          ) : (
            <>
              We'd like to receive anonymous usage data to help improve the game — including an app
              version and game progress snapshot once per session, which screens you visit, how you
              interact with the UI, session recordings, and heatmaps. No personal information is
              collected. You can learn more in our <Link to="/privacy-policy">privacy policy</Link>.
              You can change your choice anytime in Settings.
            </>
          )}
        </p>
        <div className="consent-actions">
          <button className="button confirm-button" onClick={() => handleChoice(true)}>
            Allow
          </button>
          <button className="button cancel-button" onClick={() => handleChoice(false)}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
