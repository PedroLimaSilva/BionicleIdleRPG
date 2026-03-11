export enum KraataPower {
  Accuracy = 'KraataAccuracy',
  Adaptation = 'KraataAdaptation',
  Anger = 'KraataAnger',
  ChainLightning = 'KraataChainLightning',
  Chameleon = 'KraataChameleon',
  Confusion = 'KraataConfusion',
  Cyclone = 'KraataCyclone',
  Darkness = 'KraataDarkness',
  DensityControl = 'KraataDensityControl',
  Disintegration = 'KraataDisintegration',
  Dodge = 'KraataDodge',
  Elasticity = 'KraataElasticity',
  Electricity = 'KraataElectricity',
  Fear = 'KraataFear',
  FireResistance = 'KraataFireResistance',
  Fragmentation = 'KraataFragmentation',
  Gravity = 'KraataGravity',
  HeatVision = 'KraataHeatVision',
  Hunger = 'KraataHunger',
  IceResistance = 'KraataIceResistance',
  Illusion = 'KraataIllusion',
  InsectControl = 'KraataInsectControl',
  Invulnerability = 'KraataInvulnerability',
  LaserVision = 'KraataLaserVision',
  Magnetism = 'KraataMagnetism',
  MindReading = 'KraataMindReading',
  PlantControl = 'KraataPlantControl',
  Plasma = 'KraataPlasma',
  Poison = 'KraataPoison',
  PowerScream = 'KraataPowerScream',
  QuickHealing = 'KraataQuickHealing',
  RahiControl = 'KraataRahiControl',
  Shapeshifting = 'KraataShapeshifting',
  Shattering = 'KraataShattering',
  Silence = 'KraataSilence',
  Sleep = 'KraataSleep',
  Slowness = 'KraataSlowness',
  Sonics = 'KraataSonics',
  StasisField = 'KraataStasisField',
  Teleportation = 'KraataTeleportation',
  Vacuum = 'KraataVacuum',
  WeatherControl = 'KraataWeatherControl',
}

const KRAATA_POWER_VALUES = new Set<string>(Object.values(KraataPower));

export function isKraataPower(id: string): id is KraataPower {
  return KRAATA_POWER_VALUES.has(id);
}

/** Power → stage → count. */
export type KraataCollection = Partial<Record<KraataPower, Partial<Record<number, number>>>>;

export type KraataReward = { power: KraataPower; stage: number; qty: number };

export function addKraataToCollection(
  collection: KraataCollection,
  power: KraataPower,
  stage: number,
  count: number
): KraataCollection {
  const existing = collection[power] ?? {};
  return {
    ...collection,
    [power]: {
      ...existing,
      [stage]: (existing[stage] ?? 0) + count,
    },
  };
}

export const MAX_KRAATA_STAGE = 6;

export interface KraataTransformation {
  power: KraataPower;
  stage: number;
  startedAt: number;
  endsAt: number;
}

export function removeKraataFromCollection(
  collection: KraataCollection,
  power: KraataPower,
  stage: number,
  count: number
): KraataCollection {
  const existing = collection[power] ?? {};
  const current = existing[stage] ?? 0;
  const next = Math.max(0, current - count);
  return {
    ...collection,
    [power]: {
      ...existing,
      [stage]: next,
    },
  };
}

export const KRAATA_POWER_NAMES: Record<KraataPower, string> = {
  [KraataPower.Accuracy]: 'Accuracy',
  [KraataPower.Adaptation]: 'Adaptation',
  [KraataPower.Anger]: 'Anger',
  [KraataPower.ChainLightning]: 'Chain Lightning',
  [KraataPower.Chameleon]: 'Chameleon',
  [KraataPower.Confusion]: 'Confusion',
  [KraataPower.Cyclone]: 'Cyclone',
  [KraataPower.Darkness]: 'Darkness',
  [KraataPower.DensityControl]: 'Density Control',
  [KraataPower.Disintegration]: 'Disintegration',
  [KraataPower.Dodge]: 'Dodge',
  [KraataPower.Elasticity]: 'Elasticity',
  [KraataPower.Electricity]: 'Electricity',
  [KraataPower.Fear]: 'Fear',
  [KraataPower.FireResistance]: 'Fire Resistance',
  [KraataPower.Fragmentation]: 'Fragmentation',
  [KraataPower.Gravity]: 'Gravity',
  [KraataPower.HeatVision]: 'Heat Vision',
  [KraataPower.Hunger]: 'Hunger',
  [KraataPower.IceResistance]: 'Ice Resistance',
  [KraataPower.Illusion]: 'Illusion',
  [KraataPower.InsectControl]: 'Insect Control',
  [KraataPower.Invulnerability]: 'Invulnerability',
  [KraataPower.LaserVision]: 'Laser Vision',
  [KraataPower.Magnetism]: 'Magnetism',
  [KraataPower.MindReading]: 'Mind Reading',
  [KraataPower.PlantControl]: 'Plant Control',
  [KraataPower.Plasma]: 'Plasma',
  [KraataPower.Poison]: 'Poison',
  [KraataPower.PowerScream]: 'Power Scream',
  [KraataPower.QuickHealing]: 'Quick Healing',
  [KraataPower.RahiControl]: 'Rahi Control',
  [KraataPower.Shapeshifting]: 'Shapeshifting',
  [KraataPower.Shattering]: 'Shattering',
  [KraataPower.Silence]: 'Silence',
  [KraataPower.Sleep]: 'Sleep',
  [KraataPower.Slowness]: 'Slowness',
  [KraataPower.Sonics]: 'Sonics',
  [KraataPower.StasisField]: 'Stasis Field',
  [KraataPower.Teleportation]: 'Teleportation',
  [KraataPower.Vacuum]: 'Vacuum',
  [KraataPower.WeatherControl]: 'Weather Control',
};
