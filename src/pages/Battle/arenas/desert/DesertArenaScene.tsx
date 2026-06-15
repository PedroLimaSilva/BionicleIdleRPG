import * as THREE from 'three';
import { ArenaSky } from '../shared/ArenaSky';
import { KanohiMonument } from '../shared/KanohiMonument';
import type { ArenaSceneProps } from '../types';

const SANDSTONE = '#c4b187';
const DEFAULT_ACCENT = '#2f6fb0';
const SKY_BLUE = '#6aa0d8';
const DEFAULT_HORIZON = '#e6d2a4';

/**
 * Desert arena decor: three giant carved Kanohi monuments framing the canyon
 * (positions per art direction), plus a blue sky dome. Meshes are reused from
 * `kit_2001.glb` + `masks.glb` (issue #366). Element-tribe recolors tint the
 * accents, horizon haze, and sky.
 */
export function DesertArenaScene({ receiveShadow, recolor }: ArenaSceneProps) {
  const accent = recolor?.accent ?? DEFAULT_ACCENT;
  const horizon = recolor?.fog ?? DEFAULT_HORIZON;
  // Tint the zenith toward the biome haze so volcano reads smoky, snow pale-blue.
  const skyTop = new THREE.Color(SKY_BLUE).lerp(new THREE.Color(horizon), 0.4).getStyle();

  return (
    <group name="DesertArenaDecor">
      <ArenaSky top={skyTop} bottom={horizon} radius={80} />

      <KanohiMonument
        maskName="Hau"
        position={[-2.3, -0.05, -0.2]}
        rotationY={0.6}
        maskHeight={1.0}
        headHeight={0.95}
        pedestalHeight={0.95}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
      <KanohiMonument
        maskName="Kakama"
        position={[0.0, -0.05, -1.7]}
        rotationY={0.0}
        maskHeight={1.1}
        headHeight={1.05}
        pedestalHeight={1.25}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
      <KanohiMonument
        maskName="Pakari"
        position={[2.5, -0.05, 0.0]}
        rotationY={-0.6}
        maskHeight={1.05}
        headHeight={1.0}
        pedestalHeight={1.0}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
    </group>
  );
}
