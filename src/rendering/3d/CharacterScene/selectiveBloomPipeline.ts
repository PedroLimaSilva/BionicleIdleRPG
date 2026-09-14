import { NoBlending, type Camera, type Scene } from 'three';
import { RenderPipeline, RenderTarget } from 'three/webgpu';
import { float, mrt, output, pass, vec3, vec4 } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

/** Match master's SelectiveBloom: intensity 0.28, threshold 0.25, mipmap-style radius. */
export const SELECTIVE_BLOOM_STRENGTH = 0.28;
export const SELECTIVE_BLOOM_RADIUS = 0.5;
export const SELECTIVE_BLOOM_THRESHOLD = 0.25;

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
  compileAsync?: (renderer: unknown) => Promise<unknown>;
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

export type SelectiveBloomPipelineOptions = {
  bloomEnabled?: boolean;
  variant?: SelectiveBloomVariant;
};

type BloomRenderer = {
  getRenderTarget?: () => unknown;
  setRenderTarget?: (target: unknown) => void;
};

/**
 * Same TSL graph as {@link CharacterSelectiveBloom}: MRT scene pass plus optional
 * bloom convolution. Used at runtime and by ShaderVariantBank compile.
 */
export function createSelectiveBloomPipeline(
  gl: unknown,
  scene: Scene,
  camera: Camera,
  { bloomEnabled = true, variant = 'card' }: SelectiveBloomPipelineOptions = {}
): RenderPipeline {
  const scenePass = pass(scene, camera) as unknown as TslPassNode;
  scenePass.setMRT(mrt({ bloomIntensity: float(0), output }));

  const outputPass = scenePass.getTextureNode();
  const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity');
  const bloomPass = bloomEnabled
    ? (bloom(
        outputPass.mul(bloomIntensityPass) as never,
        SELECTIVE_BLOOM_STRENGTH,
        SELECTIVE_BLOOM_RADIUS,
        SELECTIVE_BLOOM_THRESHOLD
      ) as unknown as TslTextureNode)
    : null;

  let outputNode: TslTextureNode;
  let quadTransparent: boolean;

  if (variant === 'scene') {
    const linearRgb = bloomPass ? outputPass.rgb.add(bloomPass.rgb) : outputPass.rgb;
    outputNode = (vec4(linearRgb as never, float(1)) as unknown as TslTextureNode).renderOutput();
    quadTransparent = false;
  } else {
    const haloMix = float(1).sub(outputPass.a as never);
    const bloomCover = bloomPass
      ? bloomPass.r.max(bloomPass.g).max(bloomPass.b).saturate()
      : float(0);
    const linearRgb = outputPass.rgb
      .mul(outputPass.a)
      .add(bloomPass ? bloomPass.rgb : float(0))
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

  const quadMat = (rp as RenderPipeline & { _quadMesh?: { material: PipelineQuadMaterial } })
    ._quadMesh?.material;
  if (quadMat) {
    quadMat.transparent = quadTransparent;
    quadMat.premultipliedAlpha = false;
    quadMat.depthWrite = false;
    quadMat.blending = NoBlending;
    quadMat.needsUpdate = true;
  }
  return rp;
}

/**
 * Compile card bloom + battle MRT (no convolution) into an offscreen target so
 * the first visible character frame is not a ~180 ms sync pipeline build.
 */
export async function compileSelectiveBloomPipelines(
  renderer: BloomRenderer,
  scene: Scene,
  camera: Camera
): Promise<void> {
  const card = createSelectiveBloomPipeline(renderer, scene, camera, {
    bloomEnabled: true,
    variant: 'card',
  });
  const battle = createSelectiveBloomPipeline(renderer, scene, camera, {
    bloomEnabled: false,
    variant: 'scene',
  });
  const target = new RenderTarget(4, 4);
  const previous = renderer.getRenderTarget?.() ?? null;
  try {
    renderer.setRenderTarget?.(target);
    card.render();
    battle.render();
  } finally {
    renderer.setRenderTarget?.(previous);
    target.dispose();
    card.dispose();
    battle.dispose();
  }
}
