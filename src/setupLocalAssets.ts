import { useGLTF } from '@react-three/drei';

/**
 * Configure assets that drei/three would otherwise fetch from CDNs.
 * Must run before any GLTF preload or load.
 */
export function setupLocalAssets(): void {
  useGLTF.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
}
