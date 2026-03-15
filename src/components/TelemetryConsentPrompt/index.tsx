import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { hasTelemetryConsent } from '../../services/gamePersistence';
import { getTelemetryUrl } from '../../services/telemetry';
import { useSettings } from '../../context/useSettings';
import './index.scss';

export function TelemetryConsentPrompt() {
  const [visible, setVisible] = useState(() => !hasTelemetryConsent() && !!getTelemetryUrl());
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
        <h2 className="consent-title">Help improve this game?</h2>
        <p className="consent-body">
          We'd like to receive anonymous usage data (app version and game progress snapshot) once
          per session. No personal information is collected. You can learn more about how we use
          this data in our <Link to="/privacy-policy">privacy policy</Link>.
          You can change your choice anytime in Settings.
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
