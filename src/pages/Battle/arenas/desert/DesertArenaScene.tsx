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
        position={[-1.5, -0.05, -0.1]}
        rotationY={0.42}
        maskHeight={1.0}
        pedestalHeight={0.72}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
      <KanohiMonument
        maskName="Pakari"
        position={[1.55, -0.05, -0.2]}
        rotationY={-0.46}
        maskHeight={1.05}
        pedestalHeight={0.78}
        stoneColor={SANDSTONE}
        accent={accent}
        receiveShadow={receiveShadow}
        castShadow={receiveShadow}
      />
    </group>
  );
}
