import type { RahkshiArmor } from '../../types/Rahkshi';

/** Rahkshi armor sorted by power name — matches inventory grid order. */
export function getSortedRahkshiArmor(rahkshi: RahkshiArmor[]): RahkshiArmor[] {
  return [...rahkshi].sort((a, b) => a.power.localeCompare(b.power));
}

export function getAdjacentRahkshiIds(
  rahkshi: RahkshiArmor[],
  id: string
): { nextId: string; prevId: string } | null {
  const entries = getSortedRahkshiArmor(rahkshi);
  if (entries.length <= 1) return null;
  const index = entries.findIndex((entry) => entry.id === id);
  if (index < 0) return null;
  const prevId = entries[(index - 1 + entries.length) % entries.length].id;
  const nextId = entries[(index + 1) % entries.length].id;
  return { nextId, prevId };
}
