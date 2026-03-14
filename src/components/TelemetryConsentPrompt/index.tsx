import { useState } from 'react';
import { hasTelemetryConsent } from '../../services/gamePersistence';
import { useSettings } from '../../context/useSettings';
import './index.scss';

export function TelemetryConsentPrompt() {
  const [visible, setVisible] = useState(() => !hasTelemetryConsent());
  const { setTelemetryEnabled } = useSettings();

  if (!visible) return null;

  const handleChoice = (allowed: boolean) => {
    setTelemetryEnabled(allowed);
    setVisible(false);
  };

  return (
    <div className="consent-backdrop">
      <div className="consent-panel" role="dialog" aria-modal="true">
        <h2 className="consent-title">Help improve this game?</h2>
        <p className="consent-body">
          We'd like to send anonymous usage data (app version and game progress snapshot) once per
          session. No personal information is collected. You can change this anytime in Settings.
        </p>
        <div className="consent-actions">
          <button className="consent-btn consent-btn--allow" onClick={() => handleChoice(true)}>
            Allow
          </button>
          <button className="consent-btn consent-btn--deny" onClick={() => handleChoice(false)}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
