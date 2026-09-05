import * as THREE from 'three';
import { ElementTribe } from '../../../types/Matoran';
import type { ArenaRecolor } from './types';

/**
 * Element-tribe recolor palettes. `diffuse` is a light tint multiplied into the
 * arena's base materials (so a sand canyon still reads as a canyon while
 * shifting hue); `accent` is the saturated color used for emissive accents on
 * props (e.g. the Kanohi monuments). See issue #366.
 */
const TRIBE_RECOLORS: Record<ElementTribe, ArenaRecolor> = {
  [ElementTribe.Air]: { accent: '#56d268', blend: 0.6, diffuse: '#3f8f46', fog: '#8fc784' },
  [ElementTribe.Earth]: { accent: '#9a5fd0', blend: 0.62, diffuse: '#4a3a5a', fog: '#6a5a78' },
  // Volcanic: darken the rock toward scorched basalt with glowing lava accents.
  [ElementTribe.Fire]: { accent: '#ff5212', blend: 0.82, diffuse: '#4a1c0d', fog: '#b03a16' },
  // Snowy mountain: lighten the canyon toward frost with icy accents.
  [ElementTribe.Ice]: { accent: '#bfefff', blend: 0.86, diffuse: '#eef5fc', fog: '#f0f6fc' },
  [ElementTribe.Light]: { accent: '#ffe27a', blend: 0.55, diffuse: '#efe2a0', fog: '#f0e4c2' },
  [ElementTribe.Shadow]: { accent: '#9a3ad0', blend: 0.65, diffuse: '#352b40', fog: '#4a3a55' },
  // Stone keeps the natural desert look (subtle warm tint).
  [ElementTribe.Stone]: { accent: '#caa24a', diffuse: '#e7cfa0', fog: '#e8c992' },
  [ElementTribe.Water]: { accent: '#2aa7ff', blend: 0.66, diffuse: '#235f93', fog: '#5aa0d0' },
};

/** Apply the arena diffuse recolor to a base hex color (e.g. procedural floor stone). */
export function tintArenaDiffuse(baseHex: string, recolor: ArenaRecolor | undefined): string {
  const color = new THREE.Color(baseHex);
  if (!recolor) return color.getStyle();

  const diffuse = new THREE.Color(recolor.diffuse);
  if (recolor.blend != null) color.lerp(diffuse, recolor.blend);
  else color.multiply(diffuse);
  return color.getStyle();
}

/** Recolor palette for an element tribe, or `undefined` if unknown. */
export function getTribeRecolor(tribe: ElementTribe | undefined): ArenaRecolor | undefined {
  if (!tribe) return undefined;
  return TRIBE_RECOLORS[tribe];
}

type StandardMat = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial;
}

/** Materials treated as glowing accents (recolored emissive instead of diffuse). */
function isAccentMaterial(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes('glow') || n.includes('accent') || n.includes('emiss') || n.includes('lava');
}

/**
 * Apply an `ArenaRecolor` to every standard material under `root`. Diffuse
 * materials are multiplied by `recolor.diffuse`; accent materials adopt
 * `recolor.accent` as both color and emissive.
 *
 * Materials are cloned before mutation so the shared/cached source GLB and
 * other arenas are never affected.
 */
export function applyArenaRecolor(root: THREE.Object3D, recolor: ArenaRecolor): void {
  const diffuse = new THREE.Color(recolor.diffuse);
  const accent = new THREE.Color(recolor.accent);

  const tintColor = (color: THREE.Color) => {
    if (recolor.blend != null) {
      // Blend toward the target so the base texture can be lightened or darkened.
      color.lerp(diffuse, recolor.blend);
    } else {
      color.multiply(diffuse);
    }
  };

  const recolorOne = (mat: THREE.Material): THREE.Material => {
    if (isStandardMat(mat)) {
      const clone = mat.clone();
      if (isAccentMaterial(clone.name)) {
        clone.color.copy(accent);
        clone.emissive.set(0, 0, 0);
        clone.emissiveIntensity = 0;
      } else {
        tintColor(clone.color);
      }
      return clone;
    }
    // Unlit / basic materials (e.g. KHR_materials_unlit) — tint the color directly.
    if (mat instanceof THREE.MeshBasicMaterial && mat.color) {
      const clone = mat.clone();
      if (isAccentMaterial(clone.name)) clone.color.copy(accent);
      else tintColor(clone.color);
      return clone;
    }
    return mat;
  };

  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(recolorOne)
      : recolorOne(mesh.material);
  });
}
