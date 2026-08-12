import { Box3, Color, Mesh, Object3D } from 'three';
import {
  isMaskGlowMaterialName,
  isMaskStandardMat,
  type MaskStandardMat,
} from './maskMaterial';

/** Vertical crown tint for Metru double-injected Kanohi (silver-gray top → mask color bottom). */
export type MaskDiscoloration = {
  color: string;
  /** Blend toward `color` at the top of the mask (0 = none, 1 = full at crown). */
  intensity: number;
  /** PBR metalness at the crown. */
  metalness?: number;
  /** PBR roughness at the crown. */
  roughness?: number;
};

type DiscolorationUniforms = {
  uDiscolorColor: { value: Color };
  uDiscolorIntensity: { value: number };
  uDiscolorMinY: { value: number };
  uDiscolorMaxY: { value: number };
  uDiscolorMetalness: { value: number };
  uDiscolorRoughness: { value: number };
};

const DISCOLOR_UNIFORMS_KEY = 'discolorationUniforms';

const DEFAULT_DISCOLOR_METALNESS = 0.9;
const DEFAULT_DISCOLOR_ROUGHNESS = 0.22;

function discolorBlendGlsl(suffix: string): string {
  return [
    `float discolorRange${suffix} = uDiscolorMaxY - uDiscolorMinY;`,
    `float discolorT${suffix} = discolorRange${suffix} > 0.0 ? clamp((vDiscolorY - uDiscolorMinY) / discolorRange${suffix}, 0.0, 1.0) : 0.0;`,
    `float discolorAmt${suffix} = discolorT${suffix} * uDiscolorIntensity;`,
  ].join('\n');
}

/**
 * Patch non-glow mask materials with an object-space vertical gradient: base mask
 * color at the bottom, discoloration color + higher metalness at the crown.
 */
export function setupMaskDiscolorationShader(root: Object3D): void {
  const box = new Box3();
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const geom = (child as Mesh).geometry;
      if (!geom.boundingBox) geom.computeBoundingBox();
      if (geom.boundingBox) box.union(geom.boundingBox);
    }
  });

  if (box.isEmpty()) return;

  const minY = box.min.y;
  const maxY = box.max.y;

  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mat = (child as Mesh).material;
    if (!isMaskStandardMat(mat)) return;
    if (isMaskGlowMaterialName(mat.name)) return;

    attachDiscolorationShader(mat, minY, maxY);
  });
}

function attachDiscolorationShader(mat: MaskStandardMat, minY: number, maxY: number): void {
  const uniforms: DiscolorationUniforms = {
    uDiscolorColor: { value: new Color(0xffffff) },
    uDiscolorIntensity: { value: 0 },
    uDiscolorMaxY: { value: maxY },
    uDiscolorMetalness: { value: DEFAULT_DISCOLOR_METALNESS },
    uDiscolorMinY: { value: minY },
    uDiscolorRoughness: { value: DEFAULT_DISCOLOR_ROUGHNESS },
  };

  mat.userData[DISCOLOR_UNIFORMS_KEY] = uniforms;

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      'varying float vDiscolorY;\nvoid main() {'
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      '#include <begin_vertex>\nvDiscolorY = transformed.y;'
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      [
        'uniform vec3 uDiscolorColor;',
        'uniform float uDiscolorIntensity;',
        'uniform float uDiscolorMinY;',
        'uniform float uDiscolorMaxY;',
        'uniform float uDiscolorMetalness;',
        'uniform float uDiscolorRoughness;',
        'varying float vDiscolorY;',
        'void main() {',
      ].join('\n')
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      [
        '#include <color_fragment>',
        discolorBlendGlsl('Color'),
        'diffuseColor.rgb = mix(diffuseColor.rgb, uDiscolorColor, discolorAmtColor);',
      ].join('\n')
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <metalness_fragment>',
      [
        '#include <metalness_fragment>',
        discolorBlendGlsl('Metal'),
        'metalnessFactor = mix(metalnessFactor, uDiscolorMetalness, discolorAmtMetal);',
      ].join('\n')
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <roughness_fragment>',
      [
        '#include <roughness_fragment>',
        discolorBlendGlsl('Rough'),
        'roughnessFactor = mix(roughnessFactor, uDiscolorRoughness, discolorAmtRough);',
      ].join('\n')
    );
  };

  mat.customProgramCacheKey = () => 'mask_discoloration_v2';
  mat.needsUpdate = true;
}

/** Push runtime discoloration settings into patched mask materials. */
export function applyMaskDiscolorationUniforms(
  mat: MaskStandardMat,
  discoloration: MaskDiscoloration | undefined
): void {
  const uniforms = mat.userData[DISCOLOR_UNIFORMS_KEY] as DiscolorationUniforms | undefined;
  if (!uniforms) return;

  if (discoloration && discoloration.intensity > 0) {
    uniforms.uDiscolorColor.value.set(discoloration.color);
    uniforms.uDiscolorIntensity.value = discoloration.intensity;
    uniforms.uDiscolorMetalness.value =
      discoloration.metalness ?? DEFAULT_DISCOLOR_METALNESS;
    uniforms.uDiscolorRoughness.value = discoloration.roughness ?? DEFAULT_DISCOLOR_ROUGHNESS;
  } else {
    uniforms.uDiscolorIntensity.value = 0;
  }
}

export function applyMaskDiscolorationToObject(
  root: Object3D,
  discoloration: MaskDiscoloration | undefined
): void {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mat = (child as Mesh).material;
    if (!isMaskStandardMat(mat) || isMaskGlowMaterialName(mat.name)) return;
    applyMaskDiscolorationUniforms(mat, discoloration);
  });
}
