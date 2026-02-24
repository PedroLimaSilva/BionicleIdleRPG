import { useGLTF } from '@react-three/drei';
import { useArmor } from './hooks/useArmor';
import { useMask } from './hooks/useMask';
import { useNuvaMask } from './hooks/useNuvaMask';

// Preload models once at app start
export function preloadAssets() {
  useGLTF.preload(import.meta.env.BASE_URL + 'matoran_master.glb');
  useMask.preload();
  useArmor.preload();
  useNuvaMask.preload();

  // useGLTF.preload('/models/toa.glb');
  // useGLTF.preload('/models/turaga.glb');
  // Add more as needed
}
