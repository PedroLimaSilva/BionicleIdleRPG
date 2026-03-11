import { ListedCharacterData, RecruitedCharacterData } from '../types/Matoran';
import { RECRUITMENT_REGISTRY } from '../data/recruitment';
import { EVOLUTION_PATHS } from './CharacterEvolution';

/** Ids that belong to the same "recruitment line" (e.g. Jala and Jaller). Built from EVOLUTION_PATHS. */
const recruitmentLineCache = new Map<string, string[]>();

function buildRecruitmentLines(): Map<string, string[]> {
  const idToSet = new Map<string, Set<string>>();

  function getOrCreateSet(id: string): Set<string> {
    let s = idToSet.get(id);
    if (!s) {
      s = new Set([id]);
      idToSet.set(id, s);
    }
    return s;
  }

  function merge(a: Set<string>, b: Set<string>): void {
    if (a === b) return;
    const [bigger, smaller] = a.size >= b.size ? [a, b] : [b, a];
    for (const id of smaller) {
      bigger.add(id);
      idToSet.set(id, bigger);
    }
  }

  for (const path of EVOLUTION_PATHS) {
    for (const [fromId, toId] of Object.entries(path.evolutions)) {
      merge(getOrCreateSet(fromId), getOrCreateSet(toId));
    }
  }

  const result = new Map<string, string[]>();
  for (const [id, set] of idToSet) {
    result.set(id, Array.from(set));
  }
  return result;
}

let linesMap: Map<string, string[]> | null = null;

function getLinesMap(): Map<string, string[]> {
  if (!linesMap) linesMap = buildRecruitmentLines();
  return linesMap;
}

/**
 * Returns all character ids that count as the same recruit (e.g. Jala and Jaller).
 * Used so we don't show "Jala" in the shop if the player already has Jaller.
 */
export function getRecruitmentLineIds(characterId: string): string[] {
  let cached = recruitmentLineCache.get(characterId);
  if (cached) return cached;
  const lines = getLinesMap();
  cached = lines.get(characterId) ?? [characterId];
  recruitmentLineCache.set(characterId, cached);
  return cached;
}

/**
 * True if the player already has this character (or any evolved/pre-evolved form in the same line).
 */
export function isCharacterRecruited(
  characterId: string,
  recruitedCharacters: RecruitedCharacterData[]
): boolean {
  const lineIds = getRecruitmentLineIds(characterId);
  const recruitedIds = new Set(recruitedCharacters.map((r) => r.id));
  return lineIds.some((id) => recruitedIds.has(id));
}

/**
 * Derives buyable characters from completedQuests and recruitedCharacters.
 * Resilient to inconsistent saves: only quest completion and current roster matter.
 */
export function getBuyableCharacters(
  completedQuests: string[],
  recruitedCharacters: RecruitedCharacterData[]
): ListedCharacterData[] {
  const completedSet = new Set(completedQuests);
  const result: ListedCharacterData[] = [];

  for (const entry of RECRUITMENT_REGISTRY) {
    if (!completedSet.has(entry.unlockedByQuest)) continue;
    if (isCharacterRecruited(entry.id, recruitedCharacters)) continue;
    result.push({ id: entry.id, cost: entry.cost });
  }

  return result;
}

/**
 * Returns recruitment entries unlocked by a given quest (for UI: "Unlock: X, Y").
 */
export function getCharactersUnlockedByQuest(questId: string): ListedCharacterData[] {
  return RECRUITMENT_REGISTRY.filter((e) => e.unlockedByQuest === questId).map((e) => ({
    id: e.id,
    cost: e.cost,
  }));
}
