import { JobDetails, MatoranJob } from '../types/Jobs';
import { ElementTribe } from '../types/Matoran';
import { MatoranStage } from '../types/Matoran';

export const PROTODERMIS_RATE = 0.1;

export const JOB_DETAILS: Record<MatoranJob, JobDetails> = {
  [MatoranJob.AlgaeHarvester]: {
    description: 'Collects medicinal algae and aquatic plants in Ga-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    label: '🌿 Algae Harvester',
    rate: 1,
    unlock: {
      requiredProgress: ['mnog_ga_koro_sos'],
    },
  },
  [MatoranJob.CharcoalMaker]: {
    description: 'Produces charcoal from wood and volcanic matter in Ta-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    label: '🔥 Charcoal Maker',
    rate: 1,
    unlock: {},
  },
  [MatoranJob.ChuteController]: {
    description: 'Tests and monitors Le-Metru’s high-speed chute transport systems.',
    elementAffinity: {
      favored: [ElementTribe.Air],
      opposed: [],
    },
    label: '🚀 Chute Test Driver',
    rate: 2,
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
  },
  [MatoranJob.GaKoroRebuilder]: {
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
    description: 'Restores lily-pad platforms and repairs water systems in Ga-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    label: '🌊 Ga-Koro Rebuilder',
    rate: 1.5,
    unlock: { requiredProgress: ['bohrok_assistants'] },
  },
  [MatoranJob.HydroTechnician]: {
    description: 'Manages purified protodermis flow in Ga-Metru research systems.',
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    label: '💧 Hydro Technician',
    rate: 2,
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
  },
  [MatoranJob.KnowledgeScribe]: {
    description: 'Records prophecies and research in Ko-Metru knowledge towers.',
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [],
    },
    label: '📚 Knowledge Scribe',
    rate: 2,
    unlock: {
      requiredProgress: ['activate_knowledge_towers'],
    },
  },
  [MatoranJob.KoKoroRebuilder]: {
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
    description: 'Repairs ice structures and restores village buildings in Ko-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [ElementTribe.Fire],
    },
    label: '❄️ Ko-Koro Rebuilder',
    rate: 1.5,
    unlock: { requiredProgress: ['bohrok_assistants'] },
  },
  [MatoranJob.LeKoroRebuilder]: {
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
    description: 'Rebuilds tree-dwellings and restores village structures in Le-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Air],
      opposed: [],
    },
    label: '🌲 Le-Koro Rebuilder',
    rate: 1.5,
    unlock: { requiredProgress: ['bohrok_assistants'] },
  },
  [MatoranJob.LightStoneMiner]: {
    description: 'Mines Light Stone crystals for illumination in Onu-Koro caves.',
    elementAffinity: {
      favored: [ElementTribe.Earth],
      opposed: [],
    },
    label: '💡 Light Stone Miner',
    rate: 1,
    unlock: { requiredProgress: ['mnog_arrive_onu_koro'] },
  },
  [MatoranJob.MaskMaker]: {
    description: 'Forges Kanohi masks in the foundries of Ta-Metru.',
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    label: '🎭 Mask Maker',
    rate: 2,
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
  },
  [MatoranJob.OnuKoroRebuilder]: {
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
    description: 'Reinforces tunnel supports and restores mine passages in Onu-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Earth],
      opposed: [],
    },
    label: '⛏️ Onu-Koro Rebuilder',
    rate: 1.5,
    unlock: { requiredProgress: ['bohrok_assistants'] },
  },
  [MatoranJob.PoKoroRebuilder]: {
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
    description: 'Repairs carvings and restores desert structures in Po-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    label: '🪨 Po-Koro Rebuilder',
    rate: 1.5,
    unlock: { requiredProgress: ['bohrok_assistants'] },
  },
  [MatoranJob.ProtodermisSmelter]: {
    description: 'Operates high-temperature smelting units in Ta-Metru.',
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    label: '⚙️ Protodermis Smelter',
    rate: 2,
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
  },
  [MatoranJob.RahiNestWatcher]: {
    description: 'Observes and documents flying Rahi behavior in Le-Wahi.',
    elementAffinity: {
      favored: [ElementTribe.Air],
      opposed: [],
    },
    label: '🦜 Rahi Nest Watcher',
    rate: 1,
    unlock: {
      requiredProgress: ['mnog_meet_taipu'],
    },
  },
  [MatoranJob.SanctumGuard]: {
    description: 'Patrols the drifts and guards the Sanctum of Ko-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Ice],
      opposed: [ElementTribe.Fire],
    },
    label: '🛡️ Sanctum Guard',
    rate: 1,
    unlock: {
      requiredProgress: ['mnog_arrive_ko_koro'],
    },
  },
  [MatoranJob.SculptureOperator]: {
    description: 'Builds large-scale statues and carvings in Po-Metru.',
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    label: '🗿 Sculpture Operator',
    rate: 2,
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
  },
  [MatoranJob.StasisTechnician]: {
    description: 'Catalogues artifacts and maintains stasis chambers in the Metru Nui Archives.',
    elementAffinity: {
      favored: [ElementTribe.Earth],
      opposed: [],
    },
    label: '🔒 Stasis Technician',
    rate: 2,
    unlock: {
      requiredProgress: ['unlock_archives'],
    },
  },
  [MatoranJob.StoneMason]: {
    description: 'Builds stone structures and sculputres in Po-Wahi.',
    elementAffinity: {
      favored: [ElementTribe.Stone],
      opposed: [],
    },
    label: '🪨 Stone Mason',
    rate: 1,
    unlock: {
      requiredProgress: ['mnog_po_koro_sickness'],
    },
  },
  // Bohrok Koro rebuild jobs - require recruitment quest, Bohrok only
  [MatoranJob.TaKoroRebuilder]: {
    allowedStages: [MatoranStage.Bohrok, MatoranStage.BohrokKal],
    description: 'Repairs lava-damaged structures and reinforces village walls in Ta-Koro.',
    elementAffinity: {
      favored: [ElementTribe.Fire],
      opposed: [ElementTribe.Ice],
    },
    label: '🏠 Ta-Koro Rebuilder',
    rate: 1.5,
    unlock: { requiredProgress: ['bohrok_assistants'] },
  },
  [MatoranJob.Teacher]: {
    description: 'Instructs students in the schools and labs of Ga-Metru.',
    elementAffinity: {
      favored: [ElementTribe.Water],
      opposed: [],
    },
    label: '📖 Teacher',
    rate: 2,
    unlock: {
      requiredProgress: ['settle_metru_nui'],
    },
  },
};
