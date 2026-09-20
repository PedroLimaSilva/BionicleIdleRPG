import { diagnoseGlbDracoIssues, formatGlbDracoDiagnostics } from './glbDracoDiagnostics';

function gltfWithMainOnFaceplate(opts: {
  hasUv: boolean;
  texCoord: number;
  textureSource?: number;
}): Record<string, unknown> {
  const attributes: Record<string, number> = {
    JOINTS_0: 2,
    NORMAL: 1,
    POSITION: 0,
    WEIGHTS_0: 3,
  };
  if (opts.hasUv) attributes.TEXCOORD_0 = 4;

  return {
    images: [{ name: 'scratches-2' }],
    materials: [
      {
        emissiveTexture: { index: 0, texCoord: opts.texCoord },
        name: 'Main',
        pbrMetallicRoughness: {
          metallicRoughnessTexture: { index: 0, texCoord: opts.texCoord },
        },
      },
    ],
    meshes: [{ name: 'FacePlate', primitives: [{ attributes, material: 0 }] }],
    nodes: [{ mesh: 0, name: 'FacePlate_Transparent' }],
    textures:
      opts.textureSource === undefined
        ? [{ extensions: {} }]
        : [{ extensions: { EXT_texture_webp: { source: opts.textureSource } } }],
  };
}

describe('diagnoseGlbDracoIssues', () => {
  test('flags Blender texCoord -1 and empty texture objects', () => {
    const issues = diagnoseGlbDracoIssues(gltfWithMainOnFaceplate({ hasUv: false, texCoord: -1 }));
    expect(issues.map((issue) => issue.kind).sort()).toEqual([
      'invalid-tex-coord',
      'invalid-tex-coord',
      'texture-missing-source',
      'texture-missing-source',
    ]);
    expect(issues[0]).toEqual(
      expect.objectContaining({
        material: 'Main',
        node: 'FacePlate_Transparent',
        primitive: 0,
        texCoord: -1,
      })
    );
  });

  test('flags a textured primitive that has no UV set', () => {
    const issues = diagnoseGlbDracoIssues(
      gltfWithMainOnFaceplate({ hasUv: false, texCoord: 0, textureSource: 0 })
    );
    expect(issues.every((issue) => issue.kind === 'textured-without-uv')).toBe(true);
    expect(issues.map((issue) => issue.slot).sort()).toEqual([
      'emissiveTexture',
      'metallicRoughnessTexture',
    ]);
    expect(issues[0]?.image).toBe('scratches-2');
  });

  test('passes a packed body with matching TEXCOORD_0', () => {
    const issues = diagnoseGlbDracoIssues({
      images: [{ name: 'Body_Packed' }],
      materials: [
        {
          emissiveTexture: { index: 0, texCoord: 0 },
          name: 'Body_Original_Main_Baked',
          normalTexture: { index: 0, texCoord: 0 },
        },
      ],
      meshes: [
        {
          primitives: [
            {
              attributes: { NORMAL: 1, POSITION: 0, TEXCOORD_0: 2 },
              material: 0,
            },
          ],
        },
      ],
      nodes: [{ mesh: 0, name: 'Body_Baked' }],
      textures: [{ extensions: { EXT_texture_webp: { source: 0 } } }],
    });
    expect(issues).toEqual([]);
  });

  test('format names the mesh, material, and Blender UV hint', () => {
    const issues = diagnoseGlbDracoIssues(gltfWithMainOnFaceplate({ hasUv: false, texCoord: -1 }));
    const report = formatGlbDracoDiagnostics('public/Bohrok.glb', issues);
    expect(report).toContain('FacePlate_Transparent');
    expect(report).toContain('material "Main"');
    expect(report).toContain('texCoord=-1');
    expect(report).toContain('node group');
    expect(report).toContain('empty glTF texture');
  });
});
