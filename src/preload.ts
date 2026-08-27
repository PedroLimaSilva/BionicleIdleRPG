import { KIT_2001_GLB_PATH } from './rendering/3d/kit/kit2001';
import { KIT_2003_GLB_PATH } from './rendering/3d/kit/kit2003';
import { KIT_2004_GLB_PATH } from './rendering/3d/kit/kit2004';
import { useArmor } from './rendering/3d/hooks/useArmor';
import { useGreatMask } from './rendering/3d/hooks/useGreatMask';
import { useKitAttachments } from './rendering/3d/hooks/useKitAttachments';
import { useMask } from './rendering/3d/hooks/useMask';
import { useNuvaMask } from './rendering/3d/hooks/useNuvaMask';

// Preload models once at app start
export function preloadAssets() {
  useMask.preload();
  useArmor.preload();
  useNuvaMask.preload();
  useGreatMask.preload();
  useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2003_GLB_PATH, KIT_2004_GLB_PATH);
}
