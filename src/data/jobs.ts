import { StoryProgression } from '../game/story';
import { JobDetails, MatoranJob } from '../types/Jobs';
import { ElementTribe } from '../types/Matoran';

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
      { item: 'Charcoal', chance: 1.0 },
      { item: 'BurnishedAlloy', chance: 0.1 },
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
      requiredProgress: StoryProgression.MetruNuiDiscovered,
    },
    rewards: [
      { item: 'RefinedProtodermis', chance: 1.0 },
      { item: 'FurnaceCore', chance: 0.05 },
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
    unlock: {},
    rewards: [
      { item: 'WaterAlgae', chance: 1.0 },
      { item: 'GaPearl', chance: 0.05 },
    ],
  },
  [MatoranJob.HydroTechnician]: {
    label: '💧 Hydro Technician',
    description:
      'Manages purified protodermis flow in Ga-Metru research systems.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    unlock: {
      requiredProgress: StoryProgression.MetruNuiDiscovered,
    },
    rewards: [
      { item: 'FilteredProtodermis', chance: 1.0 },
      { item: 'AquaFilter', chance: 0.08 },
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
    unlock: {},
    rewards: [
      { item: 'FeatherTufts', chance: 1.0 },
      { item: 'JungleResin', chance: 0.1 },
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
      requiredProgress: StoryProgression.MetruNuiDiscovered,
    },
    rewards: [
      { item: 'ChuteGrease', chance: 1.0 },
      { item: 'TransportCoreFragment', chance: 0.05 },
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
    unlock: {},
    rewards: [
      { item: 'StoneBlock', chance: 1.0 },
      { item: 'GemShard', chance: 0.1 },
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
      requiredProgress: StoryProgression.MetruNuiDiscovered,
    },
    rewards: [
      { item: 'StatueParts', chance: 1.0 },
      { item: 'CarvingTool', chance: 0.05 },
    ],
  },
  [MatoranJob.GlowWormTender]: {
    label: '💡 Glow Worm Tender',
    description: 'Raises glow worms for illumination in Onu-Koro caves.',
    elementAffinity: {
      favored: [ElementTribe.Earth],
      opposed: [],
    },
    rate: 1,
    unlock: {},
    rewards: [
      { item: 'GlowWormSlime', chance: 1.0 },
      { item: 'BiolumeThread', chance: 0.1 },
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
      requiredProgress: StoryProgression.ArchivesUnlocked,
    },
    rewards: [
      { item: 'StasisSeal', chance: 1.0 },
      { item: 'CryoCore', chance: 0.05 },
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
    unlock: {},
    rewards: [
      { item: 'IceChip', chance: 1.0 },
      { item: 'FrostChisel', chance: 0.1 },
    ],
  },
  [MatoranJob.KnowledgeScribe]: {
    label: '📚 Knowledge Scribe',
    description:
      'Records prophecies and research in Ko-Metru knowledge towers.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [],
    },
    unlock: {
      requiredProgress: StoryProgression.KnowledgeTowersActive,
    },
    rewards: [
      { item: 'DataTablet', chance: 1.0 },
      { item: 'CipherKey', chance: 0.08 },
    ],
  },
};
