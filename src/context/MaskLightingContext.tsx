import { createContext, useContext } from 'react';

type MaskLightingContextValue = {
  /** When true, cloned mask materials use dielectric PBR for low-IBL cavern arenas. */
  normalizeForArena: boolean;
};

const MaskLightingContext = createContext<MaskLightingContextValue>({
  normalizeForArena: false,
});

export function ArenaMaskLightingProvider({ children }: { children: React.ReactNode }) {
  return (
    <MaskLightingContext.Provider value={{ normalizeForArena: true }}>
      {children}
    </MaskLightingContext.Provider>
  );
}

export function useMaskLightingContext(): MaskLightingContextValue {
  return useContext(MaskLightingContext);
}
