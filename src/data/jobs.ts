import { JobDetails, MatoranJob } from '../types/Jobs';
import { ElementTribe } from '../types/Matoran';
import { GameItemId } from './loot';

export const WIDGET_RATE = 0.2;

export const JOB_DETAILS: Record<MatoranJob, JobDetails> = {
  [MatoranJob.CharcoalMaker]: {
    label: '🔥 Charcoal Maker',
    description: 'Produces charcoal from wood and volcanic matter in Ta-Koro.',
    rate: 1,
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    unlock: {},
    rewards: [
      { item: GameItemId.Charcoal, chance: 1.0 },
      { item: GameItemId.BurnishedAlloy, chance: 0.3 },
    ],
  },
  [MatoranJob.ProtodermisSmelter]: {
    label: '⚙️ Protodermis Smelter',
    description: 'Operates high-temperature smelting units in Ta-Metru.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
    rewards: [
      { item: GameItemId.RefinedProtodermis, chance: 1.0 },
      { item: GameItemId.FurnaceCore, chance: 0.05 },
    ],
  },
  [MatoranJob.AlgaeHarvester]: {
    label: '🌿 Algae Harvester',
    description: 'Collects medicinal algae and aquatic plants in Ga-Koro.',
    rate: 1,
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    unlock: {
      requiredProgress: ['mnog_ga_koro_sos'],
    },
    rewards: [
      { item: GameItemId.WaterAlgae, chance: 1.0 },
      { item: GameItemId.GaPearl, chance: 0.3 },
    ],
  },
  [MatoranJob.HydroTechnician]: {
    label: '💧 Hydro Technician',
    description: 'Manages purified protodermis flow in Ga-Metru research systems.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
    rewards: [
      { item: GameItemId.FilteredProtodermis, chance: 1.0 },
      { item: GameItemId.AquaFilter, chance: 0.08 },
    ],
  },
  [MatoranJob.RahiNestWatcher]: {
    label: '🦜 Rahi Nest Watcher',
    description: 'Observes and documents flying Rahi behavior in Le-Wahi.',
    elementAffinity: {
      favored: [ElementTribe.Air],
      opposed: [],
    },
    rate: 1,
    unlock: {
      requiredProgress: ['mnog_meet_taipu'],
    },
    rewards: [
      { item: GameItemId.FeatherTufts, chance: 1.0 },
      { item: GameItemId.JungleResin, chance: 0.3 },
    ],
  },
  [MatoranJob.ChuteController]: {
    label: '🚀 Chute Controller',
    description: 'Manages Le-Metru’s high-speed chute transport systems.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Air],
      opposed: [],
    },
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
    rewards: [
      { item: GameItemId.ChuteGrease, chance: 1.0 },
      { item: GameItemId.TransportCoreFragment, chance: 0.05 },
    ],
  },
  [MatoranJob.QuarryRunner]: {
    label: '🪨 Quarry Runner',
    description: 'Extracts and transports quarried stone from Po-Wahi.',
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    rate: 1,
    unlock: {
      requiredProgress: ['mnog_po_koro_sickness'],
    },
    rewards: [
      { item: GameItemId.StoneBlock, chance: 1.0 },
      { item: GameItemId.GemShard, chance: 0.3 },
    ],
  },
  [MatoranJob.SculptureOperator]: {
    label: '🗿 Sculpture Operator',
    description: 'Builds large-scale statues and carvings in Po-Metru.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
    rewards: [
      { item: GameItemId.StatueParts, chance: 1.0 },
      { item: GameItemId.CarvingTool, chance: 0.05 },
    ],
  },
  [MatoranJob.LightStoneFarmer]: {
    label: '💡 Light Stone Farmer',
    description: 'Farm Light Stone crystals for illumination in Onu-Koro caves.',
    elementAffinity: {
      favored: [ElementTribe.Earth],
      opposed: [],
    },
    rate: 1,
    unlock: { requiredProgress: ['mnog_arrive_onu_koro'] },
    rewards: [
      { item: GameItemId.LightStone, chance: 1.0 },
      { item: GameItemId.BiolumeThread, chance: 0.3 },
    ],
  },
  [MatoranJob.StasisTechnician]: {
    label: '🔒 Stasis Technician',
    description: 'Maintains Rahi stasis chambers in Metru Nui Archives.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    unlock: {
      requiredProgress: ['unlock_archives'],
    },
    rewards: [
      { item: GameItemId.StasisSeal, chance: 1.0 },
      { item: GameItemId.CryoCore, chance: 0.05 },
    ],
  },
  [MatoranJob.IceSculptor]: {
    label: '❄️ Ice Sculptor',
    description: 'Carves artistic ice structures in Ko-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [ElementTribe.Fire],
    },
    rate: 1,
    unlock: {
      requiredProgress: ['mnog_arrive_ko_koro'],
    },
    rewards: [
      { item: GameItemId.IceChip, chance: 1.0 },
      { item: GameItemId.FrostChisel, chance: 0.3 },
    ],
  },
  [MatoranJob.KnowledgeScribe]: {
    label: '📚 Knowledge Scribe',
    description: 'Records prophecies and research in Ko-Metru knowledge towers.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [],
    },
    unlock: {
      requiredProgress: ['activate_knowledge_towers'],
    },
    rewards: [
      { item: GameItemId.DataTablet, chance: 1.0 },
      { item: GameItemId.CipherKey, chance: 0.08 },
    ],
  },
};
