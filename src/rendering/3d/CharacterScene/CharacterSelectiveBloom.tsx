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

export type SelectiveBloomVariant = 'card' | 'scene';

export type CharacterSelectiveBloomProps = {
  /**
   * `card` — character viewer: premultiplied alpha + card backdrop for halos.
   * `scene` — full-screen battle: opaque output so transmissive kit brains and
   * glow slots stay visible (card alpha math hides them).
   */
  variant?: SelectiveBloomVariant;
};

/**
 * WebGPU selective bloom for CharacterScene and battle arenas.
 *
 * Default MRT `bloomIntensity` is 0. Kit brains, kit Glow, Rahkshi Eyes, and
 * active Kanohi mask-power write 1; Glowing Eyes do not.
 *
 * Card variant: the HTML compositor ignores RGB at alpha 0, so halo pixels get
 * coverage from the bloom buffer and are composited onto a card-colored stand-in.
 *
 * Scene variant: writes opaque pixels — transmissive MRT materials must not be
 * multiplied by scene alpha or they vanish against the arena.
 */
export function CharacterSelectiveBloom({ variant = 'card' }: CharacterSelectiveBloomProps) {
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

    let outputNode: TslTextureNode;
    let quadTransparent: boolean;

    if (variant === 'scene') {
      const linearRgb = outputPass.rgb.add(bloomPass.rgb);
      outputNode = (vec4(linearRgb as never, float(1)) as unknown as TslTextureNode).renderOutput();
      quadTransparent = false;
    } else {
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
      outputNode = vec4(converted.rgb as never, cover as never) as unknown as TslTextureNode;
      quadTransparent = true;
    }

    const rp = new RenderPipeline(gl as never);
    rp.outputColorTransform = false;
    rp.outputNode = outputNode as never;

    const renderer = gl as { setClearColor?: (color: number, alpha: number) => void };
    renderer.setClearColor?.(0x000000, variant === 'scene' ? 1 : 0);

    const quadMat = (rp as RenderPipeline & { _quadMesh: { material: PipelineQuadMaterial } })
      ._quadMesh.material;
    quadMat.transparent = quadTransparent;
    quadMat.premultipliedAlpha = false;
    quadMat.depthWrite = false;
    quadMat.blending = NoBlending;
    quadMat.needsUpdate = true;
    return rp;
  }, [camera, enabled, gl, scene, variant]);

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
