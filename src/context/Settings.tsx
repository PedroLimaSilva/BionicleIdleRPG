import { useEffect, useState } from 'react';
import {
  getDebugMode,
  getShadowsEnabled,
  saveDebugMode,
  saveShadowsEnabled,
} from '../services/gamePersistence';

import { SettingsContext } from './SettingsContext';

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
