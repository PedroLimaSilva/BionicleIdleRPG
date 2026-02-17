import { useGLTF } from '@react-three/drei';
import { useArmor } from './hooks/useArmor';
import { useMask } from './hooks/useMask';

// Preload models once at app start
export function preloadAssets() {
  useGLTF.preload(import.meta.env.BASE_URL + 'matoran_master.glb');
  useMask.preload();
  useArmor.preload();

  // useGLTF.preload('/models/toa.glb');
  // useGLTF.preload('/models/turaga.glb');
  // Add more as needed
}
