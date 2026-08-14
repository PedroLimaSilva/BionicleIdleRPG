import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/500.css';
import '@fontsource/orbitron/700.css';

import { useGLTF } from '@react-three/drei';

/**
 * Configure assets that drei/three would otherwise fetch from CDNs.
 * Must run before any GLTF preload or load.
 */
export function setupLocalAssets(): void {
  useGLTF.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
}
