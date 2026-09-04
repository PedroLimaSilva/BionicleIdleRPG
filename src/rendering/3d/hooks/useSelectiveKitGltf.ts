import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader, DRACOLoader, MeshoptDecoder } from 'three-stdlib';
import type { GLTF } from 'three-stdlib';
import {
  buildSelectiveKitCacheKey,
  collectRequiredKitNodes,
} from '../kit/selectiveKitTextureSelection';
import {
  extendGltfLoaderForSelectiveKits,
  prepareSelectiveKitLoad,
} from '../kit/selectiveKitGltfLoader';
import type { KitSocketAttachment } from '../../../types/KitParts';

let dracoLoader: DRACOLoader | null = null;

function kitGltfExtensions(loader: GLTFLoader): void {
  extendGltfLoaderForSelectiveKits(loader);
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
  }
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(
    typeof MeshoptDecoder === 'function' ? MeshoptDecoder() : MeshoptDecoder
  );
}

/**
 * Loads a kit GLB with Draco geometry and only fetches baked/albedo textures for
 * nodes referenced in `attachments`. Missing or failed textures behave like parts
 * without maps (see `kitMaterialApplication`).
 */
export function useSelectiveKitGltf(
  kitUrl: string,
  attachments: Record<string, KitSocketAttachment>
): GLTF {
  const requiredNodes = useMemo(() => collectRequiredKitNodes(attachments), [attachments]);
  const cacheKey = useMemo(
    () => buildSelectiveKitCacheKey(kitUrl, requiredNodes),
    [kitUrl, requiredNodes]
  );

  prepareSelectiveKitLoad(cacheKey, requiredNodes);

  return useLoader(GLTFLoader, cacheKey, kitGltfExtensions) as GLTF;
}
