import { ArenaGlbScene } from '../../rendering/3d/arenas/ArenaGlbScene';
import { DEFAULT_ARENA_ID, getArenaDefinition } from '../../rendering/3d/arenas/registry';
import type { ArenaId, ArenaRecolor } from '../../rendering/3d/arenas/types';

interface ArenaEnvironmentProps {
  arenaId?: ArenaId;
  receiveShadow: boolean;
  /** Optional element-tribe recolor applied to atmosphere, GLB, and props. */
  recolor?: ArenaRecolor;
}

/**
 * Renders an arena with its paired atmosphere (fog, HDRI, lighting), an optional
 * authored GLB, and optional procedural decor. Each arena definition owns these
 * parts so adding a biome only requires a new folder + registry entry.
 */
export function ArenaEnvironment({
  arenaId = DEFAULT_ARENA_ID,
  receiveShadow,
  recolor,
}: ArenaEnvironmentProps) {
  const { Atmosphere, glbUrl, Scene } = getArenaDefinition(arenaId);

  return (
    <>
      <Atmosphere castShadow={receiveShadow} recolor={recolor} />
      <group name="ArenaEnvironment">
        {glbUrl && (
          <ArenaGlbScene glbUrl={glbUrl} receiveShadow={receiveShadow} recolor={recolor} />
        )}
        {Scene && <Scene receiveShadow={receiveShadow} recolor={recolor} />}
      </group>
    </>
  );
}
