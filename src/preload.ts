import { useGLTF } from '@react-three/drei';

// Preload models once at app start
export function preloadAssets() {
  useGLTF.preload(import.meta.env.BASE_URL + 'matoran_master.glb');

  // useGLTF.preload('/models/toa.glb');
  // useGLTF.preload('/models/turaga.glb');
  // Add more as needed
}