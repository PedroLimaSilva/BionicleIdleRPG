import { KanohiMonument } from '../shared/KanohiMonument';
import type { ArenaSceneProps } from '../types';

const SANDSTONE = '#c9a368';
const DEFAULT_ACCENT = '#2f6fb0';

/**
 * Desert arena decor: two giant carved Kanohi monuments flanking the combat
 * stage, echoing the reference art (issue #366). Meshes are reused from
 * `masks.glb`. Element-tribe recolors tint the inlaid accents.
 */
export function DesertArenaScene({ receiveShadow, recolor }: ArenaSceneProps) {
  const accent = recolor?.accent ?? DEFAULT_ACCENT;
  return (
    <group name="DesertArenaDecor">
      <KanohiMonument
        maskName="Hau"
        position={[-1.85, -0.02, 1.35]}
        rotationY={0.5}
        maskHeight={1.5}
        pedestalHeight={1.0}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
      <KanohiMonument
        maskName="Pakari"
        position={[1.95, -0.02, 1.45]}
        rotationY={-0.55}
        maskHeight={1.6}
        pedestalHeight={1.1}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
    </group>
  );
}
