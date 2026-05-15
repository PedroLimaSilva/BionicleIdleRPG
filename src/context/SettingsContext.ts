import { createContext } from 'react';

export interface SettingsState {
  debugCharacterCreation: boolean;
  setDebugCharacterCreation: (value: boolean) => void;
  debugMode: boolean;
  setDebugMode: (value: boolean) => void;
  performanceMonitorEnabled: boolean;
  setPerformanceMonitorEnabled: (value: boolean) => void;
  shadowsEnabled: boolean;
  setShadowsEnabled: (value: boolean) => void;
  telemetryEnabled: boolean;
  setTelemetryEnabled: (value: boolean) => void;
}

export const SettingsContext = createContext<SettingsState | null>(null);
