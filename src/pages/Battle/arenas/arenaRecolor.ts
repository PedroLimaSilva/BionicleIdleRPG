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
  [ElementTribe.Air]: { accent: '#56d268', diffuse: '#cfe6bd', fog: '#d8e9c2' },
  [ElementTribe.Earth]: { accent: '#8a5fd0', diffuse: '#c6bcc6', fog: '#cabfcf' },
  // Volcanic: darken the rock toward scorched basalt with glowing lava accents.
  [ElementTribe.Fire]: { accent: '#ff5212', blend: 0.42, diffuse: '#5e3322', fog: '#a8492a' },
  // Snowy mountain: lighten the canyon toward frost with icy accents.
  [ElementTribe.Ice]: { accent: '#9fe8ff', blend: 0.72, diffuse: '#e8eff5', fog: '#eef4f8' },
  [ElementTribe.Light]: { accent: '#ffe27a', diffuse: '#f3e9c8', fog: '#f0e4c2' },
  [ElementTribe.Shadow]: { accent: '#7a3aa0', diffuse: '#b4adba', fog: '#b6aebd' },
  [ElementTribe.Stone]: { accent: '#caa24a', diffuse: '#e7cfa0', fog: '#e8c992' },
  [ElementTribe.Water]: { accent: '#2aa7ff', diffuse: '#bcd4e6', fog: '#cfe0ec' },
};

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

  const recolorOne = (mat: THREE.Material): THREE.Material => {
    if (!isStandardMat(mat)) return mat;
    const clone = mat.clone();
    if (isAccentMaterial(clone.name)) {
      clone.color.copy(accent);
      clone.emissive = accent.clone();
      clone.emissiveIntensity = Math.max(clone.emissiveIntensity ?? 1, 1.2);
    } else if (recolor.blend != null) {
      // Blend toward the target so the base texture can be lightened or darkened.
      clone.color.lerp(diffuse, recolor.blend);
    } else {
      clone.color.multiply(diffuse);
    }
    return clone;
  };

  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    mesh.material = Array.isArray(mesh.material)
      ? mesh.material.map(recolorOne)
      : recolorOne(mesh.material);
  });
}
