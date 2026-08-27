import * as THREE from 'three';
import { useMemo } from 'react';
import { tintArenaDiffuse } from '../arenaRecolor';
import { ArenaSky } from '../shared/ArenaSky';
import { HoneycombFloor } from '../shared/HoneycombFloor';
import { KanohiMonument } from '../shared/KanohiMonument';
import type { ArenaSceneProps } from '../types';

const SANDSTONE = '#c4b187';
const DEFAULT_ACCENT = '#2f6fb0';
const SKY_BLUE = '#6aa0d8';
const DEFAULT_HORIZON = '#e6d2a4';
/** `Ground.001` / `Plane` radius from `arena_desert.glb` (2 m plane × node scale). */
const DESERT_FLOOR_RADIUS = 8.476853370666504;

/**
 * Desert arena decor: three giant carved Kanohi monuments framing the canyon
 * (positions per art direction), plus a blue sky dome. Meshes are reused from
 * `kit_2001.glb` + `masks.glb` (issue #366). Element-tribe recolors tint the
 * accents, horizon haze, and sky.
 */
export function DesertArenaScene({ receiveShadow, recolor }: ArenaSceneProps) {
  const accent = recolor?.accent ?? DEFAULT_ACCENT;
  const horizon = recolor?.fog ?? DEFAULT_HORIZON;
  const floorStone = useMemo(() => tintArenaDiffuse(SANDSTONE, recolor), [recolor]);
  // Tint the zenith toward the biome haze so volcano reads smoky, snow pale-blue.
  const skyTop = new THREE.Color(SKY_BLUE).lerp(new THREE.Color(horizon), 0.4).getStyle();

  return (
    <group name="DesertArenaDecor">
      <HoneycombFloor
        stoneColor={floorStone}
        receiveShadow={receiveShadow}
        radius={DESERT_FLOOR_RADIUS}
        tileRepeat={212}
      />
      <ArenaSky top={skyTop} bottom={horizon} radius={80} />

      <KanohiMonument
        maskName="Hau"
        position={[-3.2, -0.05, 0.55]}
        rotationY={1.5}
        maskHeight={1.1}
        headHeight={1.05}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
      <KanohiMonument
        maskName="Kakama"
        position={[-1.3, -0.05, -1.9]}
        rotationY={0.6}
        maskHeight={1.1}
        headHeight={1.05}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
      <KanohiMonument
        maskName="Pakari"
        position={[2, -0.05, -2.5]}
        rotationY={-0.6}
        maskHeight={1.1}
        headHeight={1.05}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
    </group>
  );
}
