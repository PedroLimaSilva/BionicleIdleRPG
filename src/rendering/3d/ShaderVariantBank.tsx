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
  PlaneGeometry,
  RGBAFormat,
  Scene,
  Skeleton,
  SkinnedMesh,
  UnsignedByteType,
} from 'three';
import type { Camera, Object3D } from 'three';
import { float, mrt, output } from 'three/tsl';
import { RenderTarget } from 'three/webgpu';
import { LegoColor } from '../../types/Colors';
import { isTestMode } from '../../utils/testMode';
import { applySelectiveBloomMrt } from './CharacterScene/selectiveBloom';
import { compileSelectiveBloomPipelines } from './CharacterScene/selectiveBloomPipeline';
import { getWeatheredMetalMaterial } from './CharacterScene/WeatheredMetalMaterial';
import { DUMMY_NORMAL_MAP, DUMMY_ROUGHNESS_MAP } from './hooks/dummyTextures';
import { setupMaskDiscolorationShader } from './hooks/maskDiscoloration';
import { KAUKAU_TRANSMISSION } from './hooks/maskMaterial';
import {
  buildTransmissiveKitMaterial,
  type TransmissiveKitKind,
} from './hooks/transmissiveKitMaterial';
import { BANK_PLASTIC_WEATHERED, primeKitMaterialBank } from './kitMaterialBank';
import { MATA_METAL_PBR } from './kit/palettes/metalPbr';
import { whenRendererHdriReady } from './SceneHdriEnvironment';
import { isWebGLBackend } from './webgpuRenderer';

type CompileAsyncRenderer = {
  compileAsync?: (object: Object3D, camera: Camera, targetScene?: Scene | null) => Promise<unknown>;
  getMRT?: () => unknown;
  getRenderTarget?: () => unknown;
  render?: (scene: Scene, camera: Camera) => void;
  setMRT?: (node: unknown) => void;
  setRenderTarget?: (target: unknown) => void;
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
  mesh.castShadow = true;
  mesh.frustumCulled = false;
  mesh.receiveShadow = true;
  group.add(mesh);

  const skinned = new SkinnedMesh(geo, material);
  skinned.castShadow = true;
  skinned.frustumCulled = false;
  skinned.receiveShadow = true;
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
  addPreviewMeshes(
    group,
    geo,
    getWeatheredMetalMaterial(LegoColor.Red, {
      ...BANK_PLASTIC_WEATHERED,
      discolorationMap: bakeSwatch(),
      metalnessMap: DUMMY_ROUGHNESS_MAP,
      normalMap: DUMMY_NORMAL_MAP,
      roughnessMap: DUMMY_ROUGHNESS_MAP,
    }),
    skeleton
  );

  const battleGltfMat = new MeshStandardMaterial({
    color: '#6d6e5c',
    metalness: 0.05,
    name: 'Battle_Chassis',
    normalMap: DUMMY_NORMAL_MAP,
    roughness: 0.55,
    roughnessMap: DUMMY_ROUGHNESS_MAP,
  });
  addPreviewMeshes(group, geo, battleGltfMat, skeleton);

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

  const glowMat = new MeshStandardMaterial({
    color: LegoColor.Red,
    emissive: LegoColor.Red,
    emissiveIntensity: 1,
    name: 'Glow',
  });
  applySelectiveBloomMrt(glowMat);
  addPreviewMeshes(group, geo, glowMat, skeleton);

  const floor = new Mesh(new PlaneGeometry(2, 2), new MeshStandardMaterial({ color: '#1a1a1a' }));
  floor.name = 'ShaderVariantBankShadowFloor';
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

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

async function compilePreviewGroup(
  renderer: CompileAsyncRenderer,
  group: Group,
  camera: Camera,
  scene: Scene
): Promise<void> {
  const compile = renderer.compileAsync;
  if (typeof compile !== 'function') return;

  await compile.call(renderer, group, camera, scene);

  const previousMrt = renderer.getMRT?.() ?? null;
  if (typeof renderer.setMRT === 'function') {
    renderer.setMRT(mrt({ bloomIntensity: float(0), output }));
    try {
      await compile.call(renderer, group, camera, scene);
    } finally {
      renderer.setMRT(previousMrt);
    }
  }

  if (typeof renderer.render === 'function' && typeof renderer.setRenderTarget === 'function') {
    const target = new RenderTarget(4, 4);
    const previousTarget = renderer.getRenderTarget?.() ?? null;
    scene.add(group);
    try {
      renderer.setRenderTarget(target);
      renderer.render(scene, camera);
    } finally {
      scene.remove(group);
      renderer.setRenderTarget(previousTarget);
      target.dispose();
    }

    try {
      await compileSelectiveBloomPipelines(renderer, scene, camera);
    } catch (error: unknown) {
      console.warn('[ShaderVariantBank] bloom compile failed', error);
    }
  }
}

/**
 * Once per WebGPU canvas, compile the shared kit shader variants against the
 * live lights/env so the next character hop reuses GPU pipelines.
 *
 * Preview meshes stay off the live scene (`compileAsync(group, camera, scene)`).
 * `visible = false` on a scene child is skipped by Three's projector, so the
 * old hidden boxes never compiled. Each TSL graph is attached to both a Mesh
 * and a dummy SkinnedMesh so kit and body pipeline keys are warm.
 *
 * Shadow receive/cast, bloom MRT + convolution, and HDRI EnvironmentNode are
 * exercised here too — leftover topologies that used to hitch ~180 ms after
 * SceneCompileAsync finished.
 */
export function ShaderVariantBank() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);
  const setFrameloop = useThree((state) => state.setFrameloop);

  useEffect(() => {
    if (isTestMode() || variantsWarmed) return undefined;
    if (isWebGLBackend(gl)) return undefined;

    const renderer = gl as CompileAsyncRenderer;
    const compile = renderer.compileAsync;
    if (typeof compile !== 'function') return undefined;

    variantsWarmed = true;
    const group = buildVariantPreviewGroup();
    let cancelled = false;

    if (typeof setFrameloop === 'function') setFrameloop('never');

    void whenRendererHdriReady(gl)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return undefined;
        return compilePreviewGroup(renderer, group, camera, scene);
      })
      .catch((error: unknown) => {
        console.warn('[ShaderVariantBank] compileAsync failed', error);
      })
      .finally(() => {
        disposePreviewGroup(group);
        if (cancelled) return;
        if (typeof setFrameloop === 'function') setFrameloop('always');
        invalidate?.();
      });

    return () => {
      cancelled = true;
      if (typeof setFrameloop === 'function') setFrameloop('always');
    };
  }, [camera, gl, invalidate, scene, setFrameloop]);

  return null;
}

export function resetShaderVariantBankForTests(): void {
  variantsWarmed = false;
}
