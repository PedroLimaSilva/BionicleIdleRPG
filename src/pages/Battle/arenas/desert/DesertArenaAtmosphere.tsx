import * as THREE from 'three';
import { DEFAULT_ARENA_LAYOUT } from '../../arenaLayout';
import { ArenaHdriIbl } from '../shared/ArenaHdriIbl';
import type { ArenaAtmosphereProps } from '../types';

const ARENA_CENTER = DEFAULT_ARENA_LAYOUT.center;

const COLORS = {
  fog: '#e8c992',
  sandDark: '#a8844f',
  skyFill: '#c8dff5',
  sun: '#fff0d4',
} as const;

const HDRI = {
  files: 'quarry_01_1k.hdr',
  intensity: 0.55,
  path: `${import.meta.env.BASE_URL}hdri/`,
} as const;

/**
 * Blend the base fog color toward an optional recolor fog tint so element-tribe
 * variations read on the haze without losing the warm desert base.
 */
function resolveFog(tint?: string): string {
  if (!tint) return COLORS.fog;
  return new THREE.Color(COLORS.fog).lerp(new THREE.Color(tint), 0.5).getStyle();
}

/** Atmosphere for the Po-Wahi desert arena (`arena_blockout.glb`). */
export function DesertArenaAtmosphere({ castShadow, recolor }: ArenaAtmosphereProps) {
  const fogColor = resolveFog(recolor?.fog);
  return (
    <>
      <fog attach="fog" args={[fogColor, 2.5, 11]} />
      <ArenaHdriIbl {...HDRI} />
      <ambientLight color="#f5e6c8" intensity={0.35} />
      <hemisphereLight args={[COLORS.sun, COLORS.sandDark, 0.45]} />
      <directionalLight
        ref={(el) => {
          if (el && el.parent && !el.target.parent) {
            el.target.position.set(...ARENA_CENTER);
            el.parent.add(el.target);
          }
        }}
        position={[2.8, 4.5, 2.2]}
        color={COLORS.sun}
        intensity={1.45}
        castShadow={castShadow}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
        shadow-normalBias={0.005}
      />
      <directionalLight position={[-2.5, 2.5, -1.5]} color={COLORS.skyFill} intensity={0.2} />
    </>
  );
}
