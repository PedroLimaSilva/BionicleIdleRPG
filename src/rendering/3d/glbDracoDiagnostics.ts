type GltfTextureInfo = {
  index?: number;
  texCoord?: number;
};

type GltfMaterial = {
  emissiveTexture?: GltfTextureInfo;
  name?: string;
  normalTexture?: GltfTextureInfo;
  occlusionTexture?: GltfTextureInfo;
  pbrMetallicRoughness?: {
    baseColorTexture?: GltfTextureInfo;
    metallicRoughnessTexture?: GltfTextureInfo;
  };
};

type GltfPrimitive = {
  attributes?: Record<string, number>;
  material?: number;
};

type GltfTexture = {
  extensions?: { EXT_texture_webp?: { source?: number } };
  source?: number;
};

type GltfImage = { name?: string };

export type GlbDracoIssueKind =
  | 'invalid-tex-coord'
  | 'texture-missing-source'
  | 'textured-without-uv';

export type GlbDracoIssue = {
  image: string | null;
  kind: GlbDracoIssueKind;
  material: string;
  mesh: string | null;
  node: string;
  primitive: number;
  slot: string;
  texCoord: number;
};

const TEXTURE_SLOTS: {
  path: (material: GltfMaterial) => GltfTextureInfo | undefined;
  slot: string;
}[] = [
  { path: (material) => material.pbrMetallicRoughness?.baseColorTexture, slot: 'baseColorTexture' },
  {
    path: (material) => material.pbrMetallicRoughness?.metallicRoughnessTexture,
    slot: 'metallicRoughnessTexture',
  },
  { path: (material) => material.emissiveTexture, slot: 'emissiveTexture' },
  { path: (material) => material.normalTexture, slot: 'normalTexture' },
  { path: (material) => material.occlusionTexture, slot: 'occlusionTexture' },
];

function textureHasImage(texture: GltfTexture | undefined): boolean {
  if (!texture) return false;
  return texture.source !== undefined || texture.extensions?.EXT_texture_webp?.source !== undefined;
}

function imageName(texture: GltfTexture | undefined, images: GltfImage[]): string | null {
  if (!texture) return null;
  const index = texture.extensions?.EXT_texture_webp?.source ?? texture.source;
  if (index === undefined) return null;
  return images[index]?.name ?? `image[${index}]`;
}

function hintFor(kind: GlbDracoIssueKind): string {
  switch (kind) {
    case 'invalid-tex-coord':
      return 'Blender exported texCoord -1: the Image Texture UV Map is missing on this mesh (node group, or no UV unwrap).';
    case 'texture-missing-source':
      return 'Texture slot points at an empty glTF texture (no image). Disconnect unused Image Texture nodes before export.';
    case 'textured-without-uv':
      return 'Material samples a texture but this primitive has no matching TEXCOORD set. Unwrap the mesh or disconnect the texture.';
  }
}

/** Draco / gltf-transform crash when a texture slot has no UV accessor (`setTexCoord` on null). */
export function diagnoseGlbDracoIssues(gltf: Record<string, unknown>): GlbDracoIssue[] {
  const materials = (gltf.materials as GltfMaterial[] | undefined) ?? [];
  const meshes =
    (gltf.meshes as { name?: string; primitives?: GltfPrimitive[] }[] | undefined) ?? [];
  const nodes = (gltf.nodes as { mesh?: number; name?: string }[] | undefined) ?? [];
  const textures = (gltf.textures as GltfTexture[] | undefined) ?? [];
  const images = (gltf.images as GltfImage[] | undefined) ?? [];
  const issues: GlbDracoIssue[] = [];

  for (const node of nodes) {
    if (node.mesh === undefined) continue;
    const mesh = meshes[node.mesh];
    for (const [primitiveIndex, primitive] of (mesh?.primitives ?? []).entries()) {
      if (primitive.material === undefined) continue;
      const material = materials[primitive.material];
      if (!material) continue;
      const attributes = primitive.attributes ?? {};

      for (const { path, slot } of TEXTURE_SLOTS) {
        const info = path(material);
        if (!info) continue;
        const texCoord = info.texCoord ?? 0;
        const texture = info.index === undefined ? undefined : textures[info.index];
        const hasUv = `TEXCOORD_${texCoord}` in attributes;
        const base: Omit<GlbDracoIssue, 'kind'> = {
          image: imageName(texture, images),
          material: material.name ?? `material[${primitive.material}]`,
          mesh: mesh?.name ?? null,
          node: node.name ?? `node[mesh=${node.mesh}]`,
          primitive: primitiveIndex,
          slot,
          texCoord,
        };

        if (texCoord < 0) {
          issues.push({ ...base, kind: 'invalid-tex-coord' });
        }
        if (!textureHasImage(texture)) {
          issues.push({ ...base, kind: 'texture-missing-source' });
        }
        if (texCoord >= 0 && !hasUv) {
          issues.push({ ...base, kind: 'textured-without-uv' });
        }
      }
    }
  }

  return issues;
}

export function formatGlbDracoDiagnostics(glbPath: string, issues: GlbDracoIssue[]): string {
  if (issues.length === 0) {
    return `No Draco UV/texture issues in ${glbPath}.`;
  }

  const lines = [`Draco cannot compress ${glbPath} — texture slots do not match mesh UVs.`, ''];

  let previousKey = '';
  for (const issue of issues) {
    const key = `${issue.node}\0${issue.primitive}\0${issue.material}`;
    if (key !== previousKey) {
      lines.push(`  ${issue.node}  primitive ${issue.primitive}  material "${issue.material}"`);
      previousKey = key;
    }
    const image = issue.image ? `  image="${issue.image}"` : '';
    lines.push(`    ${issue.slot}  texCoord=${issue.texCoord}${image}`);
    lines.push(`      ${hintFor(issue.kind)}`);
  }

  lines.push('');
  lines.push('Fix in Blender, re-export, then yarn compress again.');
  return lines.join('\n');
}
