import { useArmor } from './rendering/3d/hooks/useArmor';
import { useGreatMask } from './rendering/3d/hooks/useGreatMask';
import { useMask } from './rendering/3d/hooks/useMask';
import { useNuvaMask } from './rendering/3d/hooks/useNuvaMask';

// Preload models once at app start. Kit GLBs load on demand per character.
export function preloadAssets() {
  useMask.preload();
  useArmor.preload();
  useNuvaMask.preload();
  useGreatMask.preload();
}
