import { createContext } from 'react';

export interface SettingsState {
  debugMode: boolean;
  setDebugMode: (value: boolean) => void;
  shadowsEnabled: boolean;
  setShadowsEnabled: (value: boolean) => void;
  telemetryEnabled: boolean;
  setTelemetryEnabled: (value: boolean) => void;
}

export const SettingsContext = createContext<SettingsState | null>(null);
