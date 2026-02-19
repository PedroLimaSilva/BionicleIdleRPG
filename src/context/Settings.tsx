import { createContext, useContext, useEffect, useState } from 'react';
import {
  getDebugMode,
  getShadowsEnabled,
  saveDebugMode,
  saveShadowsEnabled,
} from '../services/gamePersistence';

export interface SettingsState {
  debugMode: boolean;
  setDebugMode: (value: boolean) => void;
  shadowsEnabled: boolean;
  setShadowsEnabled: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsState | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [debugMode, setDebugModeState] = useState(getDebugMode);
  const [shadowsEnabled, setShadowsEnabledState] = useState(getShadowsEnabled);

  useEffect(() => {
    saveDebugMode(debugMode);
  }, [debugMode]);

  useEffect(() => {
    saveShadowsEnabled(shadowsEnabled);
  }, [shadowsEnabled]);

  return (
    <SettingsContext.Provider
      value={{
        debugMode,
        setDebugMode: setDebugModeState,
        shadowsEnabled,
        setShadowsEnabled: setShadowsEnabledState,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
