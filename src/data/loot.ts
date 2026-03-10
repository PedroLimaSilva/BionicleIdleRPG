import { MatoranJob } from '../types/Jobs';
import { ElementTribe } from '../types/Matoran';

export enum GameItemId {
  Charcoal = 'Charcoal',
  BurnishedAlloy = 'BurnishedAlloy',
  RefinedProtodermis = 'RefinedProtodermis',
  FurnaceCore = 'FurnaceCore',
  WaterAlgae = 'WaterAlgae',
  GaPearl = 'GaPearl',
  FilteredProtodermis = 'FilteredProtodermis',
  AquaFilter = 'AquaFilter',
  FeatherTufts = 'FeatherTufts',
  JungleResin = 'JungleResin',
  ChuteGrease = 'ChuteGrease',
  TransportCoreFragment = 'TransportCoreFragment',
  StoneBlock = 'StoneBlock',
  GemShard = 'GemShard',
  StatueParts = 'StatueParts',
  CarvingTool = 'CarvingTool',
  LightStone = 'LightStone',
  BiolumeThread = 'BiolumeThread',
  StasisSeal = 'StasisSeal',
  CryoCore = 'CryoCore',
  IceChip = 'IceChip',
  FrostChisel = 'FrostChisel',
  DataTablet = 'DataTablet',
  CipherKey = 'CipherKey',

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
  icon?: string;
  element?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  sources?: MatoranJob[];
  value?: number;
  /** Kraata stage (1–6). Present only for kraata items. */
  stage?: number;
}

export const ITEM_DICTIONARY: Record<GameItemId, GameItem> = {
  [GameItemId.Charcoal]: {
    name: 'Charcoal',
    element: ElementTribe.Fire,
    sources: [MatoranJob.CharcoalMaker],
  },
  [GameItemId.BurnishedAlloy]: {
    name: 'Burnished Alloy',
    element: ElementTribe.Fire,
    sources: [MatoranJob.CharcoalMaker],
  },
  [GameItemId.RefinedProtodermis]: {
    name: 'Refined Protodermis',
    element: ElementTribe.Fire,
  },
  [GameItemId.FurnaceCore]: {
    name: 'Furnace Core',
    element: ElementTribe.Fire,
  },
  [GameItemId.WaterAlgae]: {
    name: 'Water Algae',
    element: ElementTribe.Water,
    sources: [MatoranJob.AlgaeHarvester],
  },
  [GameItemId.GaPearl]: {
    name: 'Ga Pearl',
    element: ElementTribe.Water,
    sources: [MatoranJob.AlgaeHarvester],
  },
  [GameItemId.FilteredProtodermis]: {
    name: 'Filtered Protodermis',
    element: ElementTribe.Water,
    sources: [MatoranJob.HydroTechnician],
  },
  [GameItemId.AquaFilter]: {
    name: 'Aqua Filter',
    element: ElementTribe.Water,
    sources: [MatoranJob.HydroTechnician],
  },
  [GameItemId.FeatherTufts]: {
    name: 'Feather Tufts',
    element: ElementTribe.Air,
    sources: [MatoranJob.RahiNestWatcher],
  },
  [GameItemId.JungleResin]: {
    name: 'Jungle Resin',
    element: ElementTribe.Air,
    sources: [MatoranJob.RahiNestWatcher],
  },
  [GameItemId.ChuteGrease]: {
    name: 'Chute Grease',
    element: ElementTribe.Air,
    sources: [MatoranJob.ChuteController],
  },
  [GameItemId.TransportCoreFragment]: {
    name: 'Transport Core Fragment',
    element: ElementTribe.Air,
    sources: [MatoranJob.ChuteController],
  },
  [GameItemId.StoneBlock]: {
    name: 'Stone Block',
    element: ElementTribe.Stone,
    sources: [MatoranJob.QuarryRunner],
  },
  [GameItemId.GemShard]: {
    name: 'Gem Shard',
    element: ElementTribe.Stone,
    sources: [MatoranJob.QuarryRunner],
  },
  [GameItemId.StatueParts]: {
    name: 'Statue Parts',
    element: ElementTribe.Stone,
    sources: [MatoranJob.SculptureOperator],
  },
  [GameItemId.CarvingTool]: {
    name: 'Carving Tool',
    element: ElementTribe.Stone,
    sources: [MatoranJob.SculptureOperator],
  },
  [GameItemId.LightStone]: {
    name: 'Light Stone',
    element: ElementTribe.Earth,
    sources: [MatoranJob.LightStoneFarmer],
  },
  [GameItemId.BiolumeThread]: {
    name: 'Biolume Thread',
    element: ElementTribe.Earth,
    sources: [MatoranJob.LightStoneFarmer],
  },
  [GameItemId.StasisSeal]: {
    name: 'Stasis Seal',
    element: ElementTribe.Earth,
    sources: [MatoranJob.StasisTechnician],
  },
  [GameItemId.CryoCore]: {
    name: 'Cryo Core',
    element: ElementTribe.Earth,
    sources: [MatoranJob.StasisTechnician],
  },
  [GameItemId.IceChip]: {
    name: 'Ice Chip',
    element: ElementTribe.Ice,
    sources: [MatoranJob.IceSculptor],
  },
  [GameItemId.FrostChisel]: {
    name: 'Frost Chisel',
    element: ElementTribe.Ice,
    sources: [MatoranJob.IceSculptor],
  },
  [GameItemId.DataTablet]: {
    name: 'Data Tablet',
    element: ElementTribe.Ice,
    sources: [MatoranJob.KnowledgeScribe],
  },
  [GameItemId.CipherKey]: {
    name: 'Cipher Key',
    element: ElementTribe.Ice,
    sources: [MatoranJob.KnowledgeScribe],
  },

  // Kraata – Stage 1 slugs
  [GameItemId.KraataAccuracy]: { name: 'Kraata of Accuracy', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataAdaptation]: { name: 'Kraata of Adaptation', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataAnger]: { name: 'Kraata of Anger', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataChainLightning]: { name: 'Kraata of Chain Lightning', rarity: 'rare', stage: 1 },
  [GameItemId.KraataChameleon]: { name: 'Kraata of Chameleon', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataConfusion]: { name: 'Kraata of Confusion', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataCyclone]: { name: 'Kraata of Cyclone', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataDarkness]: { name: 'Kraata of Darkness', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataDensityControl]: { name: 'Kraata of Density Control', rarity: 'rare', stage: 1 },
  [GameItemId.KraataDisintegration]: { name: 'Kraata of Disintegration', rarity: 'rare', stage: 1 },
  [GameItemId.KraataDodge]: { name: 'Kraata of Dodge', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataElasticity]: { name: 'Kraata of Elasticity', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataElectricity]: { name: 'Kraata of Electricity', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataFear]: { name: 'Kraata of Fear', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataFireResistance]: { name: 'Kraata of Fire Resistance', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataFragmentation]: { name: 'Kraata of Fragmentation', rarity: 'rare', stage: 1 },
  [GameItemId.KraataGravity]: { name: 'Kraata of Gravity', rarity: 'rare', stage: 1 },
  [GameItemId.KraataHeatVision]: { name: 'Kraata of Heat Vision', rarity: 'rare', stage: 1 },
  [GameItemId.KraataHunger]: { name: 'Kraata of Hunger', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataIceResistance]: { name: 'Kraata of Ice Resistance', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataIllusion]: { name: 'Kraata of Illusion', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataInsectControl]: { name: 'Kraata of Insect Control', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataInvulnerability]: { name: 'Kraata of Invulnerability', rarity: 'rare', stage: 1 },
  [GameItemId.KraataLaserVision]: { name: 'Kraata of Laser Vision', rarity: 'rare', stage: 1 },
  [GameItemId.KraataMagnetism]: { name: 'Kraata of Magnetism', rarity: 'rare', stage: 1 },
  [GameItemId.KraataMindReading]: { name: 'Kraata of Mind Reading', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataPlantControl]: { name: 'Kraata of Plant Control', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataPlasma]: { name: 'Kraata of Plasma', rarity: 'rare', stage: 1 },
  [GameItemId.KraataPoison]: { name: 'Kraata of Poison', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataPowerScream]: { name: 'Kraata of Power Scream', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataQuickHealing]: { name: 'Kraata of Quick Healing', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataRahiControl]: { name: 'Kraata of Rahi Control', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataShapeshifting]: { name: 'Kraata of Shapeshifting', rarity: 'rare', stage: 1 },
  [GameItemId.KraataShattering]: { name: 'Kraata of Shattering', rarity: 'rare', stage: 1 },
  [GameItemId.KraataSilence]: { name: 'Kraata of Silence', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataSleep]: { name: 'Kraata of Sleep', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataSlowness]: { name: 'Kraata of Slowness', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataSonics]: { name: 'Kraata of Sonics', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataStasisField]: { name: 'Kraata of Stasis Field', rarity: 'rare', stage: 1 },
  [GameItemId.KraataTeleportation]: { name: 'Kraata of Teleportation', rarity: 'rare', stage: 1 },
  [GameItemId.KraataVacuum]: { name: 'Kraata of Vacuum', rarity: 'uncommon', stage: 1 },
  [GameItemId.KraataWeatherControl]: { name: 'Kraata of Weather Control', rarity: 'rare', stage: 1 },
};

/** Returns true if the given GameItemId is a kraata item. */
export function isKraataItem(id: string): boolean {
  return id.startsWith('Kraata');
}
