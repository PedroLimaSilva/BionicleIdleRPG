import { JobDetails, MatoranJob } from '../types/Jobs';
import { ElementTribe } from '../types/Matoran';
import { MatoranStage } from '../types/Matoran';

export const PROTODERMIS_RATE = 0.1;

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
  },
  [MatoranJob.LightStoneMiner]: {
    label: '💡 Light Stone Miner',
    description: 'Mines Light Stone crystals for illumination in Onu-Koro caves.',
    elementAffinity: {
      favored: [ElementTribe.Earth],
      opposed: [],
    },
    rate: 1,
    unlock: { requiredProgress: ['mnog_arrive_onu_koro'] },
  },
  [MatoranJob.StasisTechnician]: {
    label: '🔒 Stasis Technician',
    description: 'Maintains Rahi stasis chambers in Metru Nui Archives.',
    rate: 2,
    elementAffinity: {
      favored: [ElementTribe.Earth],
      opposed: [],
    },
    unlock: {
      requiredProgress: ['unlock_archives'],
    },
  },
  [MatoranJob.SanctumGuard]: {
    label: '🛡️ Sanctum Guard',
    description: 'Patrols the drifts and guards the Sanctum of Ko-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [ElementTribe.Fire],
    },
    rate: 1,
    unlock: {
      requiredProgress: ['mnog_arrive_ko_koro'],
    },
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
  },
  // Bohrok Koro rebuild jobs - require recruitment quest, Bohrok only
  [MatoranJob.TaKoroRebuilder]: {
    label: '🏠 Ta-Koro Rebuilder',
    description: 'Repairs lava-damaged structures and reinforces village walls in Ta-Koro.',
    rate: 1.5,
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    unlock: { requiredProgress: ['bohrok_assistants'] },
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
  },
  [MatoranJob.GaKoroRebuilder]: {
    label: '🌊 Ga-Koro Rebuilder',
    description: 'Restores lily-pad platforms and repairs water systems in Ga-Koro.',
    rate: 1.5,
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    unlock: { requiredProgress: ['bohrok_assistants'] },
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
  },
  [MatoranJob.LeKoroRebuilder]: {
    label: '🌲 Le-Koro Rebuilder',
    description: 'Rebuilds tree-dwellings and restores village structures in Le-Koro.',
    rate: 1.5,
    elementAffinity: {
      favored: [ElementTribe.Air],
      opposed: [],
    },
    unlock: { requiredProgress: ['bohrok_assistants'] },
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
  },
  [MatoranJob.PoKoroRebuilder]: {
    label: '🪨 Po-Koro Rebuilder',
    description: 'Repairs carvings and restores desert structures in Po-Koro.',
    rate: 1.5,
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    unlock: { requiredProgress: ['bohrok_assistants'] },
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
  },
  [MatoranJob.OnuKoroRebuilder]: {
    label: '⛏️ Onu-Koro Rebuilder',
    description: 'Reinforces tunnel supports and restores mine passages in Onu-Koro.',
    rate: 1.5,
    elementAffinity: {
      favored: [ElementTribe.Earth],
      opposed: [],
    },
    unlock: { requiredProgress: ['bohrok_assistants'] },
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
  },
  [MatoranJob.KoKoroRebuilder]: {
    label: '❄️ Ko-Koro Rebuilder',
    description: 'Repairs ice structures and restores village buildings in Ko-Koro.',
    rate: 1.5,
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [ElementTribe.Fire],
    },
    unlock: { requiredProgress: ['bohrok_assistants'] },
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
  },
};
