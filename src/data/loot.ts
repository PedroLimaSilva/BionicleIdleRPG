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
}

export interface GameItem {
  name: string;
  description?: string;
  icon?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  value?: number;
}

export const ITEM_DICTIONARY: Record<GameItemId, GameItem> = {
  [GameItemId.Charcoal]: { name: 'Charcoal' },
  [GameItemId.BurnishedAlloy]: { name: 'Burnished Alloy' },
  [GameItemId.RefinedProtodermis]: { name: 'Refined Protodermis' },
  [GameItemId.FurnaceCore]: { name: 'Furnace Core' },
  [GameItemId.WaterAlgae]: { name: 'Water Algae' },
  [GameItemId.GaPearl]: { name: 'Ga Pearl' },
  [GameItemId.FilteredProtodermis]: { name: 'Filtered Protodermis' },
  [GameItemId.AquaFilter]: { name: 'Aqua Filter' },
  [GameItemId.FeatherTufts]: { name: 'Feather Tufts' },
  [GameItemId.JungleResin]: { name: 'Jungle Resin' },
  [GameItemId.ChuteGrease]: { name: 'Chute Grease' },
  [GameItemId.TransportCoreFragment]: { name: 'Transport Core Fragment' },
  [GameItemId.StoneBlock]: { name: 'Stone Block' },
  [GameItemId.GemShard]: { name: 'Gem Shard' },
  [GameItemId.StatueParts]: { name: 'Statue Parts' },
  [GameItemId.CarvingTool]: { name: 'Carving Tool' },
  [GameItemId.LightStone]: { name: 'Light Stone' },
  [GameItemId.BiolumeThread]: { name: 'Biolume Thread' },
  [GameItemId.StasisSeal]: { name: 'Stasis Seal' },
  [GameItemId.CryoCore]: { name: 'Cryo Core' },
  [GameItemId.IceChip]: { name: 'Ice Chip' },
  [GameItemId.FrostChisel]: { name: 'Frost Chisel' },
  [GameItemId.DataTablet]: { name: 'Data Tablet' },
  [GameItemId.CipherKey]: { name: 'Cipher Key' },
};
