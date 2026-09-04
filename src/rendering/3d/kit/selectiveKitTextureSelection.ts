import type { KitSocketAttachment } from '../../../types/KitParts';

/** glTF JSON subset used to resolve kit node → material → texture indices. */
export type KitGltfJson = {
  nodes?: Array<{ name?: string; mesh?: number }>;
  meshes?: Array<{ primitives: Array<{ material?: number }> }>;
  materials?: Array<{
    emissiveTexture?: { index: number };
    normalTexture?: { index: number };
    pbrMetallicRoughness?: { baseColorTexture?: { index: number } };
  }>;
};

const KIT_NODES_FRAGMENT = '#kitnodes=';

/** Unique kit node names referenced by a character attachment map. */
export function collectRequiredKitNodes(
  attachments: Record<string, KitSocketAttachment>
): Set<string> {
  const nodes = new Set<string>();
  for (const row of Object.values(attachments)) {
    nodes.add(row.kitNodeName);
  }
  return nodes;
}

/** Material indices used by the given kit node names. */
export function collectMaterialIndicesForKitNodes(
  json: KitGltfJson,
  requiredNodes: ReadonlySet<string>
): Set<number> {
  const materialIndices = new Set<number>();
  const nodes = json.nodes ?? [];
  const meshes = json.meshes ?? [];

  for (const node of nodes) {
    if (!node.name || !requiredNodes.has(node.name) || node.mesh === undefined) continue;
    const mesh = meshes[node.mesh];
    if (!mesh) continue;
    for (const prim of mesh.primitives) {
      if (prim.material !== undefined) materialIndices.add(prim.material);
    }
  }
  return materialIndices;
}

/** Texture indices referenced by the given material indices (baked + albedo maps). */
export function collectTextureIndicesForMaterials(
  json: KitGltfJson,
  materialIndices: ReadonlySet<number>
): Set<number> {
  const textureIndices = new Set<number>();
  const materials = json.materials ?? [];

  for (const materialIndex of materialIndices) {
    const mat = materials[materialIndex];
    if (!mat) continue;
    if (mat.emissiveTexture) textureIndices.add(mat.emissiveTexture.index);
    if (mat.normalTexture) textureIndices.add(mat.normalTexture.index);
    const base = mat.pbrMetallicRoughness?.baseColorTexture;
    if (base) textureIndices.add(base.index);
  }
  return textureIndices;
}

/** Union of texture indices required for the given kit node names. */
export function collectAllowedTextureIndices(
  json: KitGltfJson,
  requiredNodes: ReadonlySet<string>
): Set<number> {
  const materials = collectMaterialIndicesForKitNodes(json, requiredNodes);
  return collectTextureIndicesForMaterials(json, materials);
}

export function hashRequiredKitNodes(nodes: Iterable<string>): string {
  const sorted = [...new Set(nodes)].sort().join('\0');
  let hash = 5381;
  for (let i = 0; i < sorted.length; i++) {
    hash = ((hash << 5) + hash) ^ sorted.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

/** useLoader cache key; fetches still use {@link resolveKitGltfUrl}. */
export function buildSelectiveKitCacheKey(kitUrl: string, requiredNodes: Iterable<string>): string {
  return `${kitUrl}${KIT_NODES_FRAGMENT}${hashRequiredKitNodes(requiredNodes)}`;
}

export function resolveKitGltfUrl(cacheOrUrl: string): string {
  const idx = cacheOrUrl.indexOf(KIT_NODES_FRAGMENT);
  return idx === -1 ? cacheOrUrl : cacheOrUrl.slice(0, idx);
}

export function isSelectiveKitCacheKey(url: string): boolean {
  return url.includes(KIT_NODES_FRAGMENT);
}
