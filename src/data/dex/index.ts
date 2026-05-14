import { MATORAN_DEX } from './matoran';
import { ENEMY_DEX } from './enemy';
import { TOA_DEX } from './toa';
import { BaseMatoran, isCustomCharacterId, RecruitedCharacterData } from '../../types/Matoran';

const dex = {
  ...ENEMY_DEX,
  ...TOA_DEX,
  ...MATORAN_DEX,
};

/**
 * All characters (enemies, Toa, Matoran) by id. Indexable by string for runtime ids.
 *
 * NOTE: Entries for static characters MUST NOT be mutated (see AGENT_GUIDELINES.md).
 * Entries for player-created/shared custom characters (ids prefixed with `custom_`) are
 * registered at runtime via {@link registerCustomCharacterInDex} so the rest of the
 * codebase can look them up the same way as static characters.
 */
export const CHARACTER_DEX: Record<string, BaseMatoran> = dex;

/**
 * Registers a custom character's base data into the dex. Safe to call multiple times
 * (idempotent: subsequent calls overwrite the entry, which is required for renames).
 *
 * Throws if used with a non-custom id, to prevent accidental mutation of static data.
 */
export function registerCustomCharacterInDex(base: BaseMatoran): void {
  if (!isCustomCharacterId(base.id)) {
    throw new Error(
      `registerCustomCharacterInDex called with non-custom id "${base.id}". ` +
        `Custom ids must start with the custom_ prefix.`
    );
  }
  CHARACTER_DEX[base.id] = base;
}

/** Removes a custom character's base data from the dex. */
export function unregisterCustomCharacterInDex(id: string): void {
  if (!isCustomCharacterId(id)) return;
  delete CHARACTER_DEX[id];
}

export const RECRUITED_MATORAN_DATA: RecruitedCharacterData[] = [
  {
    exp: 1000,
    id: 'Takua',
  },
];

export const LISTED_MATORAN_DATA = [];
