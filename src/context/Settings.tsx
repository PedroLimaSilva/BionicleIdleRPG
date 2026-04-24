import { useEffect, useState } from 'react';
import {
  getDebugMode,
  getPerformanceMonitorEnabled,
  getShadowsEnabled,
  getTelemetryEnabled,
  saveDebugMode,
  savePerformanceMonitorEnabled,
  saveShadowsEnabled,
  saveTelemetryEnabled,
} from '../services/gamePersistence';

import { SettingsContext } from './SettingsContext';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [debugMode, setDebugModeState] = useState(getDebugMode);
  const [performanceMonitorEnabled, setPerformanceMonitorEnabledState] = useState(
    getPerformanceMonitorEnabled
  );
  const [shadowsEnabled, setShadowsEnabledState] = useState(getShadowsEnabled);
  const [telemetryEnabled, setTelemetryEnabledState] = useState(getTelemetryEnabled);

  useEffect(() => {
    saveDebugMode(debugMode);
  }, [debugMode]);

  useEffect(() => {
    savePerformanceMonitorEnabled(performanceMonitorEnabled);
  }, [performanceMonitorEnabled]);

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
        performanceMonitorEnabled,
        setDebugMode: setDebugModeState,
        setPerformanceMonitorEnabled: setPerformanceMonitorEnabledState,
        setShadowsEnabled: setShadowsEnabledState,
        setTelemetryEnabled,
        shadowsEnabled,
        telemetryEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
