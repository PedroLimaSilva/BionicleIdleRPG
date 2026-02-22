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
  StructuralReinforcement = 'StructuralReinforcement',
  ProtodermisPatch = 'ProtodermisPatch',
  LavaBrick = 'LavaBrick',
  WaterSeal = 'WaterSeal',
  JungleTimber = 'JungleTimber',
  CarvingFragment = 'CarvingFragment',
  TunnelBrace = 'TunnelBrace',
  FrostSeal = 'FrostSeal',
}

export interface GameItem {
  name: string;
  description?: string;
  icon?: string;
  element?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  sources?: MatoranJob[];
  value?: number;
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
  [GameItemId.StructuralReinforcement]: {
    name: 'Structural Reinforcement',
    element: ElementTribe.Fire,
    sources: [MatoranJob.TaKoroRebuilder],
  },
  [GameItemId.ProtodermisPatch]: {
    name: 'Protodermis Patch',
    element: ElementTribe.Fire,
    sources: [MatoranJob.TaKoroRebuilder],
  },
  [GameItemId.LavaBrick]: {
    name: 'Lava Brick',
    element: ElementTribe.Fire,
  },
  [GameItemId.WaterSeal]: {
    name: 'Water Seal',
    element: ElementTribe.Water,
    sources: [MatoranJob.GaKoroRebuilder],
  },
  [GameItemId.JungleTimber]: {
    name: 'Jungle Timber',
    element: ElementTribe.Air,
    sources: [MatoranJob.LeKoroRebuilder],
  },
  [GameItemId.CarvingFragment]: {
    name: 'Carving Fragment',
    element: ElementTribe.Stone,
    sources: [MatoranJob.PoKoroRebuilder],
  },
  [GameItemId.TunnelBrace]: {
    name: 'Tunnel Brace',
    element: ElementTribe.Earth,
    sources: [MatoranJob.OnuKoroRebuilder],
  },
  [GameItemId.FrostSeal]: {
    name: 'Frost Seal',
    element: ElementTribe.Ice,
    sources: [MatoranJob.KoKoroRebuilder],
  },
};
