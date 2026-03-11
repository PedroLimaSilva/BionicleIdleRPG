import {
  KraataCollection,
  KraataPower,
  KraataTransformation,
  MAX_KRAATA_STAGE,
  addKraataToCollection,
  removeKraataFromCollection,
} from '../types/Kraata';

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

export function canStartKraataArmor(
  collection: KraataCollection,
  power: KraataPower,
  stage: number
): boolean {
  return getKraataCount(collection, power, stage) >= 1;
}

export function getActiveTransformation(
  transformations: KraataTransformation[],
  power: KraataPower,
  stage: number
): KraataTransformation | undefined {
  return transformations.find((t) => t.power === power && t.stage === stage);
}

export function isTransformationComplete(transformation: KraataTransformation): boolean {
  return Date.now() >= transformation.endsAt;
}
