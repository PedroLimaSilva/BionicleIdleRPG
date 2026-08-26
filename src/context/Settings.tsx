import { useEffect, useState } from 'react';
import {
  getDebugCharacterCreation,
  getDebugMode,
  getPerformanceMonitorEnabled,
  getShadowsEnabled,
  getTelemetryEnabled,
  saveDebugCharacterCreation,
  saveDebugMode,
  savePerformanceMonitorEnabled,
  saveShadowsEnabled,
  saveTelemetryEnabled,
} from '../persistence/gamePersistence';

import { SettingsContext } from './SettingsContext';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [debugCharacterCreation, setDebugCharacterCreationState] =
    useState(getDebugCharacterCreation);
  const [debugMode, setDebugModeState] = useState(getDebugMode);
  const [performanceMonitorEnabled, setPerformanceMonitorEnabledState] = useState(
    getPerformanceMonitorEnabled
  );
  const [shadowsEnabled, setShadowsEnabledState] = useState(getShadowsEnabled);
  const [telemetryEnabled, setTelemetryEnabledState] = useState(getTelemetryEnabled);

  useEffect(() => {
    saveDebugCharacterCreation(debugCharacterCreation);
  }, [debugCharacterCreation]);

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
        debugCharacterCreation,
        debugMode,
        performanceMonitorEnabled,
        setDebugCharacterCreation: setDebugCharacterCreationState,
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
