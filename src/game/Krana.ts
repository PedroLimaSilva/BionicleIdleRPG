import { ElementTribe } from '../types/Matoran';
import { KranaCollection, KranaElement, KranaId } from '../types/Krana';
import {
  BOHROK_EVOLVE_TOA_NUVA_QUEST_ID,
  BOHROK_KRANA_LEGEND_QUEST_ID,
} from '../data/quests/bohrok_swarm';

export const ALL_KRANA_IDS: KranaId[] = ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'];

/** Type guard: true if element is a Krana-eligible Toa element (excludes Light/Shadow). */
export function isKranaElement(element: ElementTribe): element is KranaElement {
  return element !== ElementTribe.Light && element !== ElementTribe.Shadow;
}

/** All six Toa elements that participate in Krana collection (derived from enum). */
function getKranaElements(): KranaElement[] {
  return (Object.values(ElementTribe) as ElementTribe[]).filter(isKranaElement);
}

export function isKranaCollected(
  collectedKrana: KranaCollection,
  element: KranaElement,
  id: KranaId
): boolean {
  const existing = collectedKrana[element] ?? [];
  return existing.includes(id);
}

export function getElementKranaProgress(
  collectedKrana: KranaCollection,
  element: KranaElement
): { collected: KranaId[]; total: number } {
  const collected = collectedKrana[element] ?? [];
  return {
    collected,
    total: ALL_KRANA_IDS.length,
  };
}

export function areAllKranaCollected(collectedKrana: KranaCollection): boolean {
  return getKranaElements().every((element) => {
    const collected = collectedKrana[element] ?? [];
    return ALL_KRANA_IDS.every((id) => collected.includes(id));
  });
}

export function isKranaCollectionUnlocked(completedQuests: string[]): boolean {
  return completedQuests.includes(BOHROK_KRANA_LEGEND_QUEST_ID);
}

export function isKranaArcCompleted(completedQuests: string[]): boolean {
  return completedQuests.includes(BOHROK_EVOLVE_TOA_NUVA_QUEST_ID);
}

export function isKranaCollectionActive(completedQuests: string[]): boolean {
  return isKranaCollectionUnlocked(completedQuests) && !isKranaArcCompleted(completedQuests);
}

// --- Battle loot helpers ---

const COLOR_TO_ELEMENT: Record<string, KranaElement | undefined> = {
  red: ElementTribe.Air,
  blue: ElementTribe.Fire,
  lime: ElementTribe.Earth,
  white: ElementTribe.Ice,
  green: ElementTribe.Stone,
  orange: ElementTribe.Water,
};

/** Color name per Krana element, used for UI tinting (e.g. Krana collection tab). */
export const ELEMENT_TO_KRANA_COLOR: Record<KranaElement, string> = {
  [ElementTribe.Fire]: 'blue',
  [ElementTribe.Water]: 'orange',
  [ElementTribe.Air]: 'red',
  [ElementTribe.Earth]: 'lime',
  [ElementTribe.Ice]: 'white',
  [ElementTribe.Stone]: 'green',
};

function isKranaDropId(id: string): boolean {
  return id.startsWith('krana-');
}

export function parseKranaDropId(id: string): { element: KranaElement; kranaId: KranaId } | null {
  if (!isKranaDropId(id)) return null;

  const parts = id.split('-');
  if (parts.length !== 3) return null;

  const [, shortId, color] = parts;
  const element = COLOR_TO_ELEMENT[color.toLowerCase()];
  if (!element) return null;

  const normalizedId = (shortId.charAt(0).toUpperCase() +
    shortId.slice(1).toLowerCase()) as KranaId;

  if (!ALL_KRANA_IDS.includes(normalizedId)) {
    return null;
  }

  return { element, kranaId: normalizedId };
}

/** Whether a loot id is a krana drop (format krana-{id}-{color}). */
export function isKranaLootId(id: string): boolean {
  return parseKranaDropId(id) !== null;
}

/** Human-readable label for krana loot (e.g. "Ja Krana"). Returns null for non-krana. */
export function formatKranaLootLabel(id: string): string | null {
  const parsed = parseKranaDropId(id);
  if (!parsed) return null;
  return `${parsed.kranaId} Krana`;
}
