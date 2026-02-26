import { useArmor } from './hooks/useArmor';
import { useMask } from './hooks/useMask';
import { useNuvaMask } from './hooks/useNuvaMask';

// Preload models once at app start
export function preloadAssets() {
  useMask.preload();
  useArmor.preload();
  useNuvaMask.preload();
}
