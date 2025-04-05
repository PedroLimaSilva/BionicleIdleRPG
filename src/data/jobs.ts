import { StoryProgression } from '../game/story';
import { JobDetails, MatoranJob } from '../types/Jobs';
import { ElementTribe } from '../types/Matoran';

export const JOB_DETAILS: Record<MatoranJob, JobDetails> = {
  [MatoranJob.CharcoalMaker]: {
    label: '🔥 Charcoal Maker',
    description: 'Produces charcoal from wood and volcanic matter in Ta-Koro.',
    rate: 0.9,
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    unlock: {},
  },
  [MatoranJob.ProtodermisSmelter]: {
    label: '⚙️ Protodermis Smelter',
    description: 'Operates high-temperature smelting units in Ta-Metru.',
    rate: 1.2,
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    unlock: {
      requiredProgress: StoryProgression.MetruNuiDiscovered,
    },
  },
  [MatoranJob.AlgaeHarvester]: {
    label: '🌿 Algae Harvester',
    description: 'Collects medicinal algae and aquatic plants in Ga-Koro.',
    rate: 0.8,
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    unlock: {},
  },
  [MatoranJob.HydroTechnician]: {
    label: '💧 Hydro Technician',
    description:
      'Manages purified protodermis flow in Ga-Metru research systems.',
    rate: 1.1,
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    unlock: {
      requiredProgress: StoryProgression.MetruNuiDiscovered,
    },
  },
  [MatoranJob.RahiNestWatcher]: {
    label: '🦜 Rahi Nest Watcher',
    description: 'Observes and documents flying Rahi behavior in Le-Wahi.',
    elementAffinity: {
      favored: [ElementTribe.Air],
      opposed: [],
    },
    rate: 0.9,
    unlock: {},
  },
  [MatoranJob.ChuteController]: {
    label: '🚀 Chute Controller',
    description: 'Manages Le-Metru’s high-speed chute transport systems.',
    rate: 1.2,
    elementAffinity: {
      favored: [ElementTribe.Air],
      opposed: [],
    },
    unlock: {
      requiredProgress: StoryProgression.MetruNuiDiscovered,
    },
  },
  [MatoranJob.QuarryRunner]: {
    label: '🪨 Quarry Runner',
    description: 'Extracts and transports quarried stone from Po-Wahi.',
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    rate: 1.0,
    unlock: {},
  },
  [MatoranJob.SculptureOperator]: {
    label: '🗿 Sculpture Operator',
    description: 'Builds large-scale statues and carvings in Po-Metru.',
    rate: 1.2,
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    unlock: {
      requiredProgress: StoryProgression.MetruNuiDiscovered,
    },
  },
  [MatoranJob.GlowWormTender]: {
    label: '💡 Glow Worm Tender',
    description: 'Raises glow worms for illumination in Onu-Koro caves.',
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    rate: 0.7,
    unlock: {},
  },
  [MatoranJob.StasisTechnician]: {
    label: '🔒 Stasis Technician',
    description: 'Maintains Rahi stasis chambers in Metru Nui Archives.',
    rate: 1.1,
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    unlock: {
      requiredProgress: StoryProgression.ArchivesUnlocked,
    },
  },
  [MatoranJob.IceSculptor]: {
    label: '❄️ Ice Sculptor',
    description: 'Carves artistic ice structures in Ko-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [ElementTribe.Fire],
    },
    rate: 0.8,
    unlock: {},
  },
  [MatoranJob.KnowledgeScribe]: {
    label: '📚 Knowledge Scribe',
    description:
      'Records prophecies and research in Ko-Metru knowledge towers.',
    rate: 1.1,
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [],
    },
    unlock: {
      requiredProgress: StoryProgression.KnowledgeTowersActive,
    },
  },
};
