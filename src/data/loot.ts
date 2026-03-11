export enum GameItemId {
  // Kraata – Stage 1 slugs harvested from defeated Rahkshi
  KraataAccuracy = 'KraataAccuracy',
  KraataAdaptation = 'KraataAdaptation',
  KraataAnger = 'KraataAnger',
  KraataChainLightning = 'KraataChainLightning',
  KraataChameleon = 'KraataChameleon',
  KraataConfusion = 'KraataConfusion',
  KraataCyclone = 'KraataCyclone',
  KraataDarkness = 'KraataDarkness',
  KraataDensityControl = 'KraataDensityControl',
  KraataDisintegration = 'KraataDisintegration',
  KraataDodge = 'KraataDodge',
  KraataElasticity = 'KraataElasticity',
  KraataElectricity = 'KraataElectricity',
  KraataFear = 'KraataFear',
  KraataFireResistance = 'KraataFireResistance',
  KraataFragmentation = 'KraataFragmentation',
  KraataGravity = 'KraataGravity',
  KraataHeatVision = 'KraataHeatVision',
  KraataHunger = 'KraataHunger',
  KraataIceResistance = 'KraataIceResistance',
  KraataIllusion = 'KraataIllusion',
  KraataInsectControl = 'KraataInsectControl',
  KraataInvulnerability = 'KraataInvulnerability',
  KraataLaserVision = 'KraataLaserVision',
  KraataMagnetism = 'KraataMagnetism',
  KraataMindReading = 'KraataMindReading',
  KraataPlantControl = 'KraataPlantControl',
  KraataPlasma = 'KraataPlasma',
  KraataPoison = 'KraataPoison',
  KraataPowerScream = 'KraataPowerScream',
  KraataQuickHealing = 'KraataQuickHealing',
  KraataRahiControl = 'KraataRahiControl',
  KraataShapeshifting = 'KraataShapeshifting',
  KraataShattering = 'KraataShattering',
  KraataSilence = 'KraataSilence',
  KraataSleep = 'KraataSleep',
  KraataSlowness = 'KraataSlowness',
  KraataSonics = 'KraataSonics',
  KraataStasisField = 'KraataStasisField',
  KraataTeleportation = 'KraataTeleportation',
  KraataVacuum = 'KraataVacuum',
  KraataWeatherControl = 'KraataWeatherControl',
}

export interface GameItem {
  name: string;
  description?: string;
  /** Kraata stage (1–6). Present only for kraata items. */
  stage?: number;
}

export const ITEM_DICTIONARY: Record<GameItemId, GameItem> = {
  // Kraata – Stage 1 slugs
  [GameItemId.KraataAccuracy]: { name: 'Kraata of Accuracy', stage: 1 },
  [GameItemId.KraataAdaptation]: { name: 'Kraata of Adaptation', stage: 1 },
  [GameItemId.KraataAnger]: { name: 'Kraata of Anger', stage: 1 },
  [GameItemId.KraataChainLightning]: {
    name: 'Kraata of Chain Lightning',
    stage: 1,
  },
  [GameItemId.KraataChameleon]: { name: 'Kraata of Chameleon', stage: 1 },
  [GameItemId.KraataConfusion]: { name: 'Kraata of Confusion', stage: 1 },
  [GameItemId.KraataCyclone]: { name: 'Kraata of Cyclone', stage: 1 },
  [GameItemId.KraataDarkness]: { name: 'Kraata of Darkness', stage: 1 },
  [GameItemId.KraataDensityControl]: {
    name: 'Kraata of Density Control',
    stage: 1,
  },
  [GameItemId.KraataDisintegration]: { name: 'Kraata of Disintegration', stage: 1 },
  [GameItemId.KraataDodge]: { name: 'Kraata of Dodge', stage: 1 },
  [GameItemId.KraataElasticity]: { name: 'Kraata of Elasticity', stage: 1 },
  [GameItemId.KraataElectricity]: { name: 'Kraata of Electricity', stage: 1 },
  [GameItemId.KraataFear]: { name: 'Kraata of Fear', stage: 1 },
  [GameItemId.KraataFireResistance]: {
    name: 'Kraata of Fire Resistance',

    stage: 1,
  },
  [GameItemId.KraataFragmentation]: { name: 'Kraata of Fragmentation', stage: 1 },
  [GameItemId.KraataGravity]: { name: 'Kraata of Gravity', stage: 1 },
  [GameItemId.KraataHeatVision]: { name: 'Kraata of Heat Vision', stage: 1 },
  [GameItemId.KraataHunger]: { name: 'Kraata of Hunger', stage: 1 },
  [GameItemId.KraataIceResistance]: {
    name: 'Kraata of Ice Resistance',

    stage: 1,
  },
  [GameItemId.KraataIllusion]: { name: 'Kraata of Illusion', stage: 1 },
  [GameItemId.KraataInsectControl]: {
    name: 'Kraata of Insect Control',

    stage: 1,
  },
  [GameItemId.KraataInvulnerability]: {
    name: 'Kraata of Invulnerability',
    stage: 1,
  },
  [GameItemId.KraataLaserVision]: { name: 'Kraata of Laser Vision', stage: 1 },
  [GameItemId.KraataMagnetism]: { name: 'Kraata of Magnetism', stage: 1 },
  [GameItemId.KraataMindReading]: { name: 'Kraata of Mind Reading', stage: 1 },
  [GameItemId.KraataPlantControl]: {
    name: 'Kraata of Plant Control',

    stage: 1,
  },
  [GameItemId.KraataPlasma]: { name: 'Kraata of Plasma', stage: 1 },
  [GameItemId.KraataPoison]: { name: 'Kraata of Poison', stage: 1 },
  [GameItemId.KraataPowerScream]: { name: 'Kraata of Power Scream', stage: 1 },
  [GameItemId.KraataQuickHealing]: {
    name: 'Kraata of Quick Healing',

    stage: 1,
  },
  [GameItemId.KraataRahiControl]: { name: 'Kraata of Rahi Control', stage: 1 },
  [GameItemId.KraataShapeshifting]: { name: 'Kraata of Shapeshifting', stage: 1 },
  [GameItemId.KraataShattering]: { name: 'Kraata of Shattering', stage: 1 },
  [GameItemId.KraataSilence]: { name: 'Kraata of Silence', stage: 1 },
  [GameItemId.KraataSleep]: { name: 'Kraata of Sleep', stage: 1 },
  [GameItemId.KraataSlowness]: { name: 'Kraata of Slowness', stage: 1 },
  [GameItemId.KraataSonics]: { name: 'Kraata of Sonics', stage: 1 },
  [GameItemId.KraataStasisField]: { name: 'Kraata of Stasis Field', stage: 1 },
  [GameItemId.KraataTeleportation]: { name: 'Kraata of Teleportation', stage: 1 },
  [GameItemId.KraataVacuum]: { name: 'Kraata of Vacuum', stage: 1 },
  [GameItemId.KraataWeatherControl]: {
    name: 'Kraata of Weather Control',
    stage: 1,
  },
};

/** Returns true if the given GameItemId is a kraata item. */
export function isKraataItem(id: string): boolean {
  return id.startsWith('Kraata');
}
