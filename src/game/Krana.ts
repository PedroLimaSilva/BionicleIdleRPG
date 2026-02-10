import { ElementTribe } from '../types/Matoran';
import { KranaCollection, KranaElement, KranaId } from '../types/Krana';

export const ALL_KRANA_IDS: KranaId[] = ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'];

// Only the six Toa elements participate in Krana collection.
export const KRANA_ELEMENTS: KranaElement[] = [
  ElementTribe.Fire,
  ElementTribe.Water,
  ElementTribe.Air,
  ElementTribe.Earth,
  ElementTribe.Ice,
  ElementTribe.Stone,
];

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
  return KRANA_ELEMENTS.every((element) => {
    const collected = collectedKrana[element] ?? [];
    return ALL_KRANA_IDS.every((id) => collected.includes(id));
  });
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
