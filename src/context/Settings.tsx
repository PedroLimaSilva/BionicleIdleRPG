import { useEffect, useState } from 'react';
import {
  getDebugMode,
  getShadowsEnabled,
  getTelemetryEnabled,
  saveDebugMode,
  saveShadowsEnabled,
  saveTelemetryEnabled,
} from '../services/gamePersistence';

import { SettingsContext } from './SettingsContext';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [debugMode, setDebugModeState] = useState(getDebugMode);
  const [shadowsEnabled, setShadowsEnabledState] = useState(getShadowsEnabled);
  const [telemetryEnabled, setTelemetryEnabledState] = useState(getTelemetryEnabled);

  useEffect(() => {
    saveDebugMode(debugMode);
  }, [debugMode]);

  useEffect(() => {
    saveShadowsEnabled(shadowsEnabled);
  }, [shadowsEnabled]);

  useEffect(() => {
    saveTelemetryEnabled(telemetryEnabled);
  }, [telemetryEnabled]);

  return (
    <SettingsContext.Provider
      value={{
        debugMode,
        setDebugMode: setDebugModeState,
        shadowsEnabled,
        setShadowsEnabled: setShadowsEnabledState,
        telemetryEnabled,
        setTelemetryEnabled: setTelemetryEnabledState,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
