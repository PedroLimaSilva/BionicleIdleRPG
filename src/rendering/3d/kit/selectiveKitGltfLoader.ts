import { GLTFLoader, type GLTFLoaderPlugin } from 'three-stdlib';
import {
  collectAllowedTextureIndices,
  isSelectiveKitCacheKey,
  resolveKitGltfUrl,
} from './selectiveKitTextureSelection';

const PLUGIN_NAME = 'KIT_SELECTIVE_TEXTURES';

/** Cache key → kit nodes to load textures for (geometry always loads fully). */
const requiredNodesByCacheKey = new Map<string, ReadonlySet<string>>();

const parseCacheKeyStack: string[] = [];

export function rememberSelectiveKitNodes(
  cacheKey: string,
  requiredNodes: ReadonlySet<string>
): void {
  requiredNodesByCacheKey.set(cacheKey, requiredNodes);
}

function registerSelectiveKitPlugin(loader: GLTFLoader): void {
  loader.register((parser) => {
    const cacheKey = parseCacheKeyStack[parseCacheKeyStack.length - 1];
    const requiredNodes = cacheKey ? requiredNodesByCacheKey.get(cacheKey) : undefined;
    if (!requiredNodes) return { name: PLUGIN_NAME };

    const allowed = collectAllowedTextureIndices(parser.json, requiredNodes);
    const originalLoadTexture = parser.loadTexture.bind(parser);
    const plugin: GLTFLoaderPlugin & { name: string } = {
      name: PLUGIN_NAME,
      loadTexture(textureIndex: number) {
        if (!allowed.has(textureIndex)) return null;
        return originalLoadTexture(textureIndex);
      },
    };
    return plugin;
  });
}

function wrapGltfLoaderForSelectiveKits(loader: GLTFLoader): void {
  if ((loader as GLTFLoader & { __selectiveKitWrapped?: boolean }).__selectiveKitWrapped) return;
  (loader as GLTFLoader & { __selectiveKitWrapped?: boolean }).__selectiveKitWrapped = true;

  const originalLoad = loader.load.bind(loader);
  loader.load = (url, onLoad, onProgress, onError) => {
    const fetchUrl = resolveKitGltfUrl(url);
    parseCacheKeyStack.push(url);
    return originalLoad(
      fetchUrl,
      (gltf) => {
        parseCacheKeyStack.pop();
        onLoad(gltf);
      },
      onProgress,
      (error) => {
        parseCacheKeyStack.pop();
        onError?.(error);
      }
    );
  };

  registerSelectiveKitPlugin(loader);
}

/** drei `extendLoader` hook: selective kit textures + fetch URL without `#kitnodes` fragment. */
export function extendGltfLoaderForSelectiveKits(loader: GLTFLoader): void {
  wrapGltfLoaderForSelectiveKits(loader);
}

export function prepareSelectiveKitLoad(
  cacheKey: string,
  requiredNodes: ReadonlySet<string>
): void {
  if (!isSelectiveKitCacheKey(cacheKey)) return;
  rememberSelectiveKitNodes(cacheKey, requiredNodes);
}
