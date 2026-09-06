import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { NoBlending } from 'three';
import { RenderPipeline } from 'three/webgpu';
import { float, mrt, output, pass, vec3, vec4 } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { shouldEnableSelectiveBloom } from '../../../utils/testMode';

/** Match master's SelectiveBloom: intensity 0.28, threshold 0.25, mipmap-style radius. */
const BLOOM_STRENGTH = 0.28;
const BLOOM_RADIUS = 0.5;
const BLOOM_THRESHOLD = 0.25;

/**
 * Stand-in for `--container-background` mid stop. Halo is backdrop + bloom so
 * it reads as glow instead of a dark smudge.
 */
const CARD_BACKDROP = vec3(30 / 255, 30 / 255, 35 / 255);

type TslTextureNode = {
  a: TslTextureNode;
  add: (other: unknown) => TslTextureNode;
  b: TslTextureNode;
  g: TslTextureNode;
  max: (other: unknown) => TslTextureNode;
  mul: (other: unknown) => TslTextureNode;
  r: TslTextureNode;
  rgb: TslTextureNode;
  renderOutput: () => TslTextureNode;
  saturate: () => TslTextureNode;
  sub: (other: unknown) => TslTextureNode;
};

type TslPassNode = {
  getTextureNode: (name?: string) => TslTextureNode;
  setMRT: (node: unknown) => void;
};

type PipelineQuadMaterial = {
  blending: number;
  depthWrite: boolean;
  needsUpdate: boolean;
  premultipliedAlpha: boolean;
  transparent: boolean;
};

/**
 * WebGPU selective bloom for CharacterScene.
 *
 * Default MRT `bloomIntensity` is 0. Kit brains, kit Glow, and Rahkshi Eyes write 1 via
 * {@link applySelectiveBloomMrt}; Glowing Eyes do not.
 *
 * The HTML compositor ignores RGB at alpha 0, so halo pixels get coverage from
 * the bloom buffer and are composited onto a card-colored stand-in at the same
 * strength as on-character bloom. Empty pixels stay alpha 0. Color-transform
 * with alpha 1 — RenderOutputNode would kill `a == 0` bloom. Disabled in TEST_MODE.
 */
export function CharacterSelectiveBloom() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const enabled = shouldEnableSelectiveBloom();

  const pipeline = useMemo(() => {
    if (!enabled) return null;

    const scenePass = pass(scene, camera) as unknown as TslPassNode;
    scenePass.setMRT(mrt({ bloomIntensity: float(0), output }));

    const outputPass = scenePass.getTextureNode();
    const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity');
    const bloomPass = bloom(
      outputPass.mul(bloomIntensityPass) as never,
      BLOOM_STRENGTH,
      BLOOM_RADIUS,
      BLOOM_THRESHOLD
    ) as unknown as TslTextureNode;
    const haloMix = float(1).sub(outputPass.a as never);
    const bloomCover = bloomPass.r.max(bloomPass.g).max(bloomPass.b).saturate();
    const linearRgb = outputPass.rgb
      .mul(outputPass.a)
      .add(bloomPass.rgb)
      .add(CARD_BACKDROP.mul(haloMix).mul(bloomCover as never));
    const converted = (
      vec4(linearRgb as never, float(1)) as unknown as TslTextureNode
    ).renderOutput();
    const cover = outputPass.a.max(bloomCover);

    const rp = new RenderPipeline(gl as never);
    rp.outputColorTransform = false;
    rp.outputNode = vec4(converted.rgb as never, cover as never);

    const renderer = gl as { setClearColor?: (color: number, alpha: number) => void };
    renderer.setClearColor?.(0x000000, 0);

    const quadMat = (rp as RenderPipeline & { _quadMesh: { material: PipelineQuadMaterial } })
      ._quadMesh.material;
    quadMat.transparent = true;
    quadMat.premultipliedAlpha = false;
    quadMat.depthWrite = false;
    quadMat.blending = NoBlending;
    quadMat.needsUpdate = true;
    return rp;
  }, [camera, enabled, gl, scene]);

  useEffect(() => {
    return () => pipeline?.dispose();
  }, [pipeline]);

  useFrame(
    () => {
      pipeline?.render();
    },
    enabled ? 1 : 0
  );

  return null;
}
