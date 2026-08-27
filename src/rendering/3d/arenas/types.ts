import type { ComponentType } from 'react';
import type { ArenaId } from '../../../types/Arena';
import type { ElementTribe } from '../../../types/Matoran';

export type { ArenaId };

/**
 * Recolor applied to an arena's materials so one biome can represent different
 * element tribes (see issue #366 — "should be able to be recolored to reflect
 * different element tribes"). Colors are multiplied into diffuse and used for
 * emissive accents.
 */
export interface ArenaRecolor {
  /** Base/diffuse tint of arena meshes. Multiplied in by default (white = no change). */
  diffuse: string;
  /** Color for accent / emissive ("glow"/"accent") materials and props. */
  accent: string;
  /** Optional fog tint for the atmosphere to blend toward. */
  fog?: string;
  /**
   * When set (0..1), diffuse is *blended toward* `diffuse` by this amount instead
   * of multiplied. Blending can both lighten (snow) and darken (volcano) the base
   * texture, enabling dramatic biome restyles. Omit for a subtle multiply tint.
   */
  blend?: number;
}

/** Per-arena camera framing and combat spawn slots. */
export interface ArenaLayout {
  /** Stage diameter used for camera framing FOV. */
  boxSize: number;
  /** Arena center — camera look-at target and sun target. */
  center: [number, number, number];
  /** Team (Toa) spawn slots. */
  team: [number, number, number][];
  /** Enemy spawn slots. */
  enemy: [number, number, number][];
  /** Base camera offset (multiples of `boxSize`) added to center in portrait. */
  cameraPortrait: [number, number, number];
  /** Base camera offset (multiples of `boxSize`) added to center in landscape. */
  cameraLandscape: [number, number, number];
  /** Raises the camera look-at target so open-sky biomes reveal the sky. Default 0. */
  lookAtHeight?: number;
}

export interface ArenaAtmosphereProps {
  castShadow: boolean;
  /** Optional element-tribe recolor for fog/light tinting. */
  recolor?: ArenaRecolor;
}

export interface ArenaSceneProps {
  receiveShadow: boolean;
  /** Optional element-tribe recolor for procedural props. */
  recolor?: ArenaRecolor;
}

export interface ArenaDefinition {
  id: ArenaId;
  /** Authored GLB. Procedural arenas (e.g. Mangaia) may omit it. */
  glbUrl?: string;
  /** Per-biome fog, HDRI, and lights. */
  Atmosphere: ComponentType<ArenaAtmosphereProps>;
  /** Optional extra scene content composed in code (statues, props, beams). */
  Scene?: ComponentType<ArenaSceneProps>;
  /** Camera framing + spawn slots. */
  layout: ArenaLayout;
  /** Maps an element tribe to a recolor variation for this arena, if supported. */
  recolorForTribe?: (tribe: ElementTribe | undefined) => ArenaRecolor | undefined;
}
