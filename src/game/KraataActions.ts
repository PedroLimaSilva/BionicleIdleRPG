import {
  KraataCollection,
  KraataPower,
  MAX_KRAATA_STAGE,
  addKraataToCollection,
  removeKraataFromCollection,
} from '../types/Kraata';
import { RahkshiArmor } from '../types/Rahkshi';

export const KRAATA_ARMOR_DURATION_MS = 24 * 60 * 60 * 1000;

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

export function canStartRahkshiForge(
  collection: KraataCollection,
  power: KraataPower,
  stage: number
): boolean {
  return getKraataCount(collection, power, stage) >= 1;
}

export function getPreparingRahkshi(
  rahkshi: RahkshiArmor[],
  power: KraataPower,
  sourceStage: number
): RahkshiArmor[] {
  return rahkshi.filter(
    (r) => r.armorStage === 'preparing' && r.power === power && r.sourceStage === sourceStage
  );
}

export function getReadyRahkshi(rahkshi: RahkshiArmor[]): RahkshiArmor[] {
  return rahkshi.filter((r) => r.armorStage === 'ready');
}

export function getReadyRahkshiWithoutKraata(rahkshi: RahkshiArmor[]): RahkshiArmor[] {
  return rahkshi.filter((r) => r.armorStage === 'ready' && !r.kraata);
}

export function isForgeComplete(armor: RahkshiArmor): boolean {
  if (armor.armorStage !== 'preparing' || !armor.endsAt) return false;
  return Date.now() >= armor.endsAt;
}
