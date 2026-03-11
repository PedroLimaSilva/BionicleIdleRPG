/**
 * Single source of truth for when characters become recruitable.
 * Used to derive buyable characters from completedQuests + recruitedCharacters,
 * so state stays consistent even if save data is inconsistent.
 *
 * Each recruitable character appears once. For characters that evolve (e.g. Jala → Jaller),
 * only the initial form is listed; recruitment checks use evolution lines so that
 * having Jaller counts as "already have" for Jala.
 */
export interface RecruitmentEntry {
  id: string;
  cost: number;
  unlockedByQuest: string;
}

/** Characters that can be recruited, keyed by character id. */
export const RECRUITMENT_REGISTRY: RecruitmentEntry[] = [
  // Mask hunt / Toa arrival
  { id: 'Toa_Tahu', cost: 250, unlockedByQuest: 'story_toa_arrival' },
  { id: 'Toa_Gali', cost: 250, unlockedByQuest: 'story_toa_arrival' },
  { id: 'Toa_Kopaka', cost: 250, unlockedByQuest: 'story_toa_arrival' },
  { id: 'Toa_Lewa', cost: 250, unlockedByQuest: 'story_toa_arrival' },
  { id: 'Toa_Onua', cost: 250, unlockedByQuest: 'story_toa_arrival' },
  { id: 'Toa_Pohatu', cost: 250, unlockedByQuest: 'story_toa_arrival' },
  // MNOG – Chronicler's Journey
  { id: 'Kapura', cost: 1500, unlockedByQuest: 'mnog_takua_meets_kapura' },
  { id: 'Jala', cost: 2000, unlockedByQuest: 'mnog_tahu_unlock_01' },
  { id: 'Hahli', cost: 5000, unlockedByQuest: 'mnog_restore_ga_koro' },
  { id: 'Hafu', cost: 2500, unlockedByQuest: 'mnog_po_wahi_desert' },
  { id: 'Kivi', cost: 1500, unlockedByQuest: 'mnog_po_koro_sickness' },
  { id: 'Huki', cost: 5000, unlockedByQuest: 'mnog_recruit_hewkii' },
  { id: 'Maku', cost: 3000, unlockedByQuest: 'mnog_recruit_hewkii' },
  { id: 'Nuparu', cost: 5000, unlockedByQuest: 'mnog_arrive_onu_koro' },
  { id: 'Onepu', cost: 3000, unlockedByQuest: 'mnog_arrive_onu_koro' },
  { id: 'Taipu', cost: 3000, unlockedByQuest: 'mnog_meet_taipu' },
  { id: 'Tamaru', cost: 3000, unlockedByQuest: 'mnog_flight_to_hive' },
  { id: 'Kongu', cost: 5000, unlockedByQuest: 'mnog_flight_to_hive' },
  { id: 'Kopeke', cost: 3000, unlockedByQuest: 'mnog_arrive_ko_koro' },
  { id: 'Lumi', cost: 1500, unlockedByQuest: 'mnog_arrive_ko_koro' },
  { id: 'Matoro', cost: 5000, unlockedByQuest: 'mnog_search_for_matoro' },
  // Bohrok Swarm
  { id: 'tahnok', cost: 500, unlockedByQuest: 'bohrok_assistants' },
  { id: 'gahlok', cost: 500, unlockedByQuest: 'bohrok_assistants' },
  { id: 'lehvak', cost: 500, unlockedByQuest: 'bohrok_assistants' },
  { id: 'pahrak', cost: 500, unlockedByQuest: 'bohrok_assistants' },
  { id: 'nuhvok', cost: 500, unlockedByQuest: 'bohrok_assistants' },
  { id: 'kohrak', cost: 500, unlockedByQuest: 'bohrok_assistants' },
];
