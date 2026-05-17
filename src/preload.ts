import { KIT_2001_GLB_PATH } from './game/kit/kit2001';
import { useArmor } from './hooks/useArmor';
import { useKitAttachments } from './hooks/useKitAttachments';
import { useMask } from './hooks/useMask';
import { useNuvaMask } from './hooks/useNuvaMask';

// Preload models once at app start
export function preloadAssets() {
  useMask.preload();
  useArmor.preload();
  useNuvaMask.preload();
  useKitAttachments.preload(KIT_2001_GLB_PATH);
}
