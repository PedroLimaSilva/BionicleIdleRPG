import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import {
  Bone,
  BoxGeometry,
  BufferAttribute,
  DataTexture,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RGBAFormat,
  Scene,
  Skeleton,
  SkinnedMesh,
  UnsignedByteType,
} from 'three';
import type { Camera, Object3D } from 'three';
import { LegoColor } from '../../types/Colors';
import { isTestMode } from '../../utils/testMode';
import { getWeatheredMetalMaterial } from './CharacterScene/WeatheredMetalMaterial';
import { DUMMY_NORMAL_MAP } from './hooks/dummyTextures';
import { setupMaskDiscolorationShader } from './hooks/maskDiscoloration';
import { KAUKAU_TRANSMISSION } from './hooks/maskMaterial';
import {
  buildTransmissiveKitMaterial,
  type TransmissiveKitKind,
} from './hooks/transmissiveKitMaterial';
import { BANK_PLASTIC_WEATHERED, primeKitMaterialBank } from './kitMaterialBank';
import { MATA_METAL_PBR } from './kit/palettes/metalPbr';
import { isWebGLBackend } from './webgpuRenderer';

type CompileAsyncRenderer = {
  compileAsync?: (object: Object3D, camera: Camera, targetScene?: Scene | null) => Promise<unknown>;
};

const TRANSMISSIVE_KINDS: readonly TransmissiveKitKind[] = [
  'brain',
  'clear',
  'crystal',
  'mctoranFace',
  'vahkiHood',
];

let variantsWarmed = false;

function bakeSwatch(): DataTexture {
  const texture = new DataTexture(
    new Uint8Array([255, 255, 255, 255]),
    1,
    1,
    RGBAFormat,
    UnsignedByteType
  );
  texture.needsUpdate = true;
  return texture;
}

/** Tiny box with a 1-bone bind so WebGPU compiles both Mesh and SkinnedMesh pipelines. */
function createPreviewGeometry(): BoxGeometry {
  const geo = new BoxGeometry(0.2, 0.2, 0.2);
  const count = geo.getAttribute('position').count;
  const skinIndex = new Uint16Array(count * 4);
  const skinWeight = new Float32Array(count * 4);
  for (let i = 0; i < count; i += 1) {
    skinWeight[i * 4] = 1;
  }
  geo.setAttribute('skinIndex', new BufferAttribute(skinIndex, 4));
  geo.setAttribute('skinWeight', new BufferAttribute(skinWeight, 4));
  return geo;
}

function addPreviewMeshes(
  group: Group,
  geo: BoxGeometry,
  material: Mesh['material'],
  skeleton: Skeleton
): Mesh {
  const mesh = new Mesh(geo, material);
  mesh.frustumCulled = false;
  group.add(mesh);

  const skinned = new SkinnedMesh(geo, material);
  skinned.frustumCulled = false;
  skinned.bind(skeleton);
  group.add(skinned);
  return mesh;
}

function buildVariantPreviewGroup(): Group {
  primeKitMaterialBank();
  const group = new Group();
  group.name = 'ShaderVariantBank';
  const geo = createPreviewGeometry();
  const bone = new Bone();
  bone.name = 'ShaderVariantBankBone';
  group.add(bone);
  const skeleton = new Skeleton([bone]);

  addPreviewMeshes(
    group,
    geo,
    getWeatheredMetalMaterial(LegoColor.Red, BANK_PLASTIC_WEATHERED),
    skeleton
  );
  addPreviewMeshes(
    group,
    geo,
    getWeatheredMetalMaterial(LegoColor.Red, { ...BANK_PLASTIC_WEATHERED, ...MATA_METAL_PBR }),
    skeleton
  );
  addPreviewMeshes(
    group,
    geo,
    getWeatheredMetalMaterial(LegoColor.Red, {
      ...BANK_PLASTIC_WEATHERED,
      discolorationMap: bakeSwatch(),
    }),
    skeleton
  );
  addPreviewMeshes(
    group,
    geo,
    getWeatheredMetalMaterial(LegoColor.Red, {
      ...BANK_PLASTIC_WEATHERED,
      normalMap: DUMMY_NORMAL_MAP,
    }),
    skeleton
  );

  for (const kind of TRANSMISSIVE_KINDS) {
    addPreviewMeshes(
      group,
      geo,
      buildTransmissiveKitMaterial(
        'Bank',
        kind,
        LegoColor.TransNeonGreen,
        LegoColor.TransNeonGreen,
        0.1
      ),
      skeleton
    );
  }

  const maskMat = new MeshStandardMaterial({
    color: LegoColor.Red,
    emissiveMap: bakeSwatch(),
    name: 'Hau',
  });
  const maskMesh = addPreviewMeshes(group, geo, maskMat, skeleton);
  setupMaskDiscolorationShader(maskMesh, LegoColor.Red);

  const kaukau = new MeshPhysicalMaterial({
    color: LegoColor.Blue,
    name: 'Kaukau_baked',
    transmission: KAUKAU_TRANSMISSION,
  });
  const kaukauMesh = addPreviewMeshes(group, geo, kaukau, skeleton);
  setupMaskDiscolorationShader(kaukauMesh, LegoColor.Blue);

  return group;
}

function disposePreviewGroup(group: Group): void {
  const seen = new Set<Mesh['geometry']>();
  group.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh || !mesh.geometry || seen.has(mesh.geometry)) return;
    seen.add(mesh.geometry);
    mesh.geometry.dispose();
  });
}

/**
 * Once per WebGPU canvas, compile the shared kit shader variants against the
 * live lights/env so the next character hop reuses GPU pipelines.
 *
 * Preview meshes stay off the live scene (`compileAsync(group, camera, scene)`).
 * `visible = false` on a scene child is skipped by Three's projector, so the
 * old hidden boxes never compiled. Each TSL graph is attached to both a Mesh
 * and a dummy SkinnedMesh so kit and body pipeline keys are warm.
 */
export function ShaderVariantBank() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (isTestMode() || variantsWarmed) return undefined;
    if (isWebGLBackend(gl)) return undefined;

    const renderer = gl as CompileAsyncRenderer;
    const compile = renderer.compileAsync;
    if (typeof compile !== 'function') return undefined;

    variantsWarmed = true;
    const group = buildVariantPreviewGroup();

    void compile
      .call(renderer, group, camera, scene)
      .catch((error: unknown) => {
        console.warn('[ShaderVariantBank] compileAsync failed', error);
      })
      .finally(() => {
        disposePreviewGroup(group);
      });

    return undefined;
  }, [camera, gl, scene]);

  return null;
}

export function resetShaderVariantBankForTests(): void {
  variantsWarmed = false;
}
