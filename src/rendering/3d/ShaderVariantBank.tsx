import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import {
  BoxGeometry,
  DataTexture,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RGBAFormat,
  Scene,
  UnsignedByteType,
} from 'three';
import type { Camera } from 'three';
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
  compileAsync?: (scene: Scene, camera: Camera) => Promise<unknown>;
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

function addPreviewMesh(group: Group, geo: BoxGeometry, material: Mesh['material']): void {
  const mesh = new Mesh(geo, material);
  mesh.frustumCulled = false;
  group.add(mesh);
}

function buildVariantPreviewGroup(): Group {
  primeKitMaterialBank();
  const group = new Group();
  group.name = 'ShaderVariantBank';
  group.visible = false;
  const geo = new BoxGeometry(0.2, 0.2, 0.2);

  addPreviewMesh(group, geo, getWeatheredMetalMaterial(LegoColor.Red, BANK_PLASTIC_WEATHERED));
  addPreviewMesh(
    group,
    geo,
    getWeatheredMetalMaterial(LegoColor.Red, { ...BANK_PLASTIC_WEATHERED, ...MATA_METAL_PBR })
  );
  addPreviewMesh(
    group,
    geo,
    getWeatheredMetalMaterial(LegoColor.Red, {
      ...BANK_PLASTIC_WEATHERED,
      discolorationMap: bakeSwatch(),
    })
  );
  addPreviewMesh(
    group,
    geo,
    getWeatheredMetalMaterial(LegoColor.Red, {
      ...BANK_PLASTIC_WEATHERED,
      normalMap: DUMMY_NORMAL_MAP,
    })
  );

  for (const kind of TRANSMISSIVE_KINDS) {
    addPreviewMesh(
      group,
      geo,
      buildTransmissiveKitMaterial(
        'Bank',
        kind,
        LegoColor.TransNeonGreen,
        LegoColor.TransNeonGreen,
        0.1
      )
    );
  }

  const maskMat = new MeshStandardMaterial({
    color: LegoColor.Red,
    emissiveMap: bakeSwatch(),
    name: 'Hau',
  });
  const maskMesh = new Mesh(geo, maskMat);
  maskMesh.frustumCulled = false;
  group.add(maskMesh);
  setupMaskDiscolorationShader(maskMesh, LegoColor.Red);

  const kaukau = new MeshPhysicalMaterial({
    color: LegoColor.Blue,
    name: 'Kaukau_baked',
    transmission: KAUKAU_TRANSMISSION,
  });
  const kaukauMesh = new Mesh(geo, kaukau);
  kaukauMesh.frustumCulled = false;
  group.add(kaukauMesh);
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
    scene.add(group);

    void compile
      .call(renderer, scene, camera)
      .catch((error: unknown) => {
        console.warn('[ShaderVariantBank] compileAsync failed', error);
      })
      .finally(() => {
        scene.remove(group);
        disposePreviewGroup(group);
      });

    return undefined;
  }, [camera, gl, scene]);

  return null;
}

export function resetShaderVariantBankForTests(): void {
  variantsWarmed = false;
}
