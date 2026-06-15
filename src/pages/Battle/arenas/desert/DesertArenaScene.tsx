import { KanohiMonument } from '../shared/KanohiMonument';
import type { ArenaSceneProps } from '../types';

const SANDSTONE = '#c4b187';
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
        position={[-1.7, -0.05, -0.45]}
        rotationY={0.5}
        maskHeight={0.62}
        headHeight={0.5}
        bodyHeight={0.95}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
      <KanohiMonument
        maskName="Pakari"
        position={[1.75, -0.05, -0.55]}
        rotationY={-0.55}
        maskHeight={0.66}
        headHeight={0.54}
        bodyHeight={1.02}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
    </group>
  );
}
