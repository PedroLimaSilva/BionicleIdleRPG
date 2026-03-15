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

  const setTelemetryEnabled = (value: boolean) => {
    setTelemetryEnabledState(value);
    saveTelemetryEnabled(value);
  };

  return (
    <SettingsContext.Provider
      value={{
        debugMode,
        setDebugMode: setDebugModeState,
        shadowsEnabled,
        setShadowsEnabled: setShadowsEnabledState,
        telemetryEnabled,
        setTelemetryEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
