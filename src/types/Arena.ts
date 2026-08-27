/**
 * Battle arena identifiers (types layer).
 *
 * Kept in `src/types/` so static game data (e.g. `EnemyEncounter`) can tag an
 * encounter with the biome it is fought in without importing from the
 * component/page layer. The arena registry in `src/rendering/3d/arenas/`
 * provides the concrete `ArenaDefinition` for each id.
 */
export type ArenaId = 'desert' | 'mangaia' | 'metru' | 'metru_archives';
