import { ArenaGlbScene } from './arenas/ArenaGlbScene';
import { DEFAULT_ARENA_ID, getArenaDefinition } from './arenas/registry';
import type { ArenaId } from './arenas/types';

interface ArenaEnvironmentProps {
  arenaId?: ArenaId;
  receiveShadow: boolean;
}

/**
 * Renders an arena GLB with its paired atmosphere (fog, HDRI, lighting).
 * Each arena definition owns its mesh path and atmosphere component.
 */
export function ArenaEnvironment({
  arenaId = DEFAULT_ARENA_ID,
  receiveShadow,
}: ArenaEnvironmentProps) {
  const { Atmosphere, glbUrl } = getArenaDefinition(arenaId);

  return (
    <>
      <Atmosphere castShadow={receiveShadow} />
      <group name="ArenaEnvironment">
        <ArenaGlbScene glbUrl={glbUrl} receiveShadow={receiveShadow} />
      </group>
    </>
  );
}
