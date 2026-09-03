import { Box3, Color, Mesh, Object3D } from 'three';
import {
  adoptBakedDiscolorationMap,
  applyBakedDiscolorationUniforms,
  BAKED_DISCOLORATION_FRAGMENT_GLSL,
  createBakedDiscolorationUniforms,
  DISCOLORATION_UNIFORMS_KEY,
  getBakedDiscolorationMap,
  glslUvAttributeForTextureChannel,
  type BakedDiscolorationUniforms,
} from './bakedDiscoloration';
import { isMaskGlowMaterialName, isMaskStandardMat, type MaskStandardMat } from './maskMaterial';

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

type CrownDiscolorationUniforms = {
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
 * Patch non-glow mask materials:
 * - baked grayscale `emissiveMap` → color-specific edge discoloration
 * - optional object-space vertical gradient for Metru double-injected Kanohi
 */
export function setupMaskDiscolorationShader(root: Object3D, baseColor = '#ffffff'): void {
  const box = new Box3();
  root.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const geom = (child as Mesh).geometry;
      if (!geom.boundingBox) geom.computeBoundingBox();
      if (geom.boundingBox) box.union(geom.boundingBox);
    }
  });

  const minY = box.isEmpty() ? 0 : box.min.y;
  const maxY = box.isEmpty() ? 1 : box.max.y;

  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mat = (child as Mesh).material;
    if (!isMaskStandardMat(mat)) return;
    if (isMaskGlowMaterialName(mat.name)) return;

    attachDiscolorationShader(mat, minY, maxY, baseColor);
  });
}

function attachDiscolorationShader(
  mat: MaskStandardMat,
  minY: number,
  maxY: number,
  baseColor: string
): void {
  const map = adoptBakedDiscolorationMap(mat);
  const baked: BakedDiscolorationUniforms = createBakedDiscolorationUniforms(map, baseColor);
  const crown: CrownDiscolorationUniforms = {
    uDiscolorColor: { value: new Color(0xffffff) },
    uDiscolorIntensity: { value: 0 },
    uDiscolorMaxY: { value: maxY },
    uDiscolorMetalness: { value: DEFAULT_DISCOLOR_METALNESS },
    uDiscolorMinY: { value: minY },
    uDiscolorRoughness: { value: DEFAULT_DISCOLOR_ROUGHNESS },
  };

  mat.userData[DISCOLOR_UNIFORMS_KEY] = crown;
  mat.userData[DISCOLORATION_UNIFORMS_KEY] = baked;

  // SimpleBake often lands on TEXCOORD_1 while `uv` is still the older unwrap.
  const discolorUvAttr = glslUvAttributeForTextureChannel(map?.channel);

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, crown, baked);

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      'varying float vDiscolorY;\nvarying vec2 vDiscolorUv;\nvoid main() {'
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>\nvDiscolorY = transformed.y;\nvDiscolorUv = ${discolorUvAttr};`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      [
        'uniform sampler2D discolorationMap;',
        'uniform vec3 uDiscolorationColor;',
        'uniform float uDiscolorationIntensity;',
        'uniform float uHasDiscolorationMap;',
        'uniform vec3 uDiscolorColor;',
        'uniform float uDiscolorIntensity;',
        'uniform float uDiscolorMinY;',
        'uniform float uDiscolorMaxY;',
        'uniform float uDiscolorMetalness;',
        'uniform float uDiscolorRoughness;',
        'varying float vDiscolorY;',
        'varying vec2 vDiscolorUv;',
        'void main() {',
      ].join('\n')
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      [
        '#include <color_fragment>',
        BAKED_DISCOLORATION_FRAGMENT_GLSL,
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

  mat.customProgramCacheKey = () => `mask_discoloration_v5_uv_${discolorUvAttr}`;
  mat.needsUpdate = true;
}

/** Push runtime discoloration settings into patched mask materials. */
export function applyMaskDiscolorationUniforms(
  mat: MaskStandardMat,
  discoloration: MaskDiscoloration | undefined,
  baseColor?: string
): void {
  const crown = mat.userData[DISCOLOR_UNIFORMS_KEY] as CrownDiscolorationUniforms | undefined;
  if (crown) {
    if (discoloration && discoloration.intensity > 0) {
      crown.uDiscolorColor.value.set(discoloration.color);
      crown.uDiscolorIntensity.value = discoloration.intensity;
      crown.uDiscolorMetalness.value = discoloration.metalness ?? DEFAULT_DISCOLOR_METALNESS;
      crown.uDiscolorRoughness.value = discoloration.roughness ?? DEFAULT_DISCOLOR_ROUGHNESS;
    } else {
      crown.uDiscolorIntensity.value = 0;
    }
  }

  const baked = mat.userData[DISCOLORATION_UNIFORMS_KEY] as BakedDiscolorationUniforms | undefined;
  if (baked && baseColor) {
    applyBakedDiscolorationUniforms(baked, baseColor, getBakedDiscolorationMap(mat));
  }
}

export function applyMaskDiscolorationToObject(
  root: Object3D,
  discoloration: MaskDiscoloration | undefined,
  baseColor?: string
): void {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mat = (child as Mesh).material;
    if (!isMaskStandardMat(mat) || isMaskGlowMaterialName(mat.name)) return;
    applyMaskDiscolorationUniforms(mat, discoloration, baseColor);
  });
}
