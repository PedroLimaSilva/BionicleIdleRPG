import {
  KraataCollection,
  KraataPower,
  MAX_KRAATA_STAGE,
  addKraataToCollection,
  removeKraataFromCollection,
} from '../types/Kraata';

const KRAATA_POWERS = Object.values(KraataPower) as KraataPower[];
import { RahkshiArmor } from '../types/Rahkshi';

export const KRAATA_ARMOR_DURATION_MS = 24 * 60 * 60 * 1000;
export const RAHKSHI_FORGE_COST = 5000;

export function getKraataCount(
  collection: KraataCollection,
  power: KraataPower,
  stage: number
): number {
  return collection[power]?.[stage] ?? 0;
}

export function canMergeKraata(
  collection: KraataCollection,
  power: KraataPower,
  stage: number
): boolean {
  if (stage >= MAX_KRAATA_STAGE) return false;
  return getKraataCount(collection, power, stage) >= 2;
}

export function applyKraataMerge(
  collection: KraataCollection,
  power: KraataPower,
  stage: number
): KraataCollection {
  const count = getKraataCount(collection, power, stage);
  if (count < 2 || stage >= MAX_KRAATA_STAGE) return collection;

  const afterRemoval = removeKraataFromCollection(collection, power, stage, 2);
  return addKraataToCollection(afterRemoval, power, stage + 1, 1);
}

export function canMergeAnyKraata(collection: KraataCollection): boolean {
  for (const power of KRAATA_POWERS) {
    const stages = collection[power];
    if (!stages) continue;
    for (let stage = 1; stage < MAX_KRAATA_STAGE; stage++) {
      if (canMergeKraata(collection, power, stage)) return true;
    }
  }
  return false;
}

export function applyAllKraataMerges(collection: KraataCollection): KraataCollection {
  let current = collection;
  let changed = true;
  while (changed) {
    changed = false;
    for (const power of KRAATA_POWERS) {
      const stages = current[power];
      if (!stages) continue;
      for (let stage = 1; stage < MAX_KRAATA_STAGE; stage++) {
        if (canMergeKraata(current, power, stage)) {
          current = applyKraataMerge(current, power, stage);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }
  return current;
}

export function canStartRahkshiForge(
  collection: KraataCollection,
  power: KraataPower,
  stage: number,
  protodermis: number
): boolean {
  return stage === 1 && getKraataCount(collection, power, stage) >= 1 && protodermis >= RAHKSHI_FORGE_COST;
}

export function getPreparingRahkshi(
  rahkshi: RahkshiArmor[],
  power: KraataPower,
  sourceStage: number
): RahkshiArmor[] {
  return rahkshi.filter(
    (r) => r.status === 'preparing' && r.power === power && r.sourceStage === sourceStage
  );
}

export function getReadyRahkshi(rahkshi: RahkshiArmor[]): RahkshiArmor[] {
  return rahkshi.filter((r) => r.status === 'ready');
}

export function getReadyRahkshiWithoutKraata(rahkshi: RahkshiArmor[]): RahkshiArmor[] {
  return rahkshi.filter((r) => r.status === 'ready' && !r.kraata);
}

export function isForgeComplete(armor: RahkshiArmor): boolean {
  if (armor.status !== 'preparing' || !armor.endsAt) return false;
  return Date.now() >= armor.endsAt;
}
