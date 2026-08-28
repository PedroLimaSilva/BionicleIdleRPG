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
  { cost: 250, id: 'Toa_Tahu', unlockedByQuest: 'story_toa_arrival' },
  { cost: 250, id: 'Toa_Gali', unlockedByQuest: 'story_toa_arrival' },
  { cost: 250, id: 'Toa_Kopaka', unlockedByQuest: 'story_toa_arrival' },
  { cost: 250, id: 'Toa_Lewa', unlockedByQuest: 'story_toa_arrival' },
  { cost: 250, id: 'Toa_Onua', unlockedByQuest: 'story_toa_arrival' },
  { cost: 250, id: 'Toa_Pohatu', unlockedByQuest: 'story_toa_arrival' },
  // MNOG – Chronicler's Journey
  // Costs kept at or below default protodermisCap (2000) so recruits stay affordable
  // without raising the cap first.
  { cost: 750, id: 'Kapura', unlockedByQuest: 'mnog_takua_meets_kapura' },
  { cost: 2000, id: 'Jala', unlockedByQuest: 'mnog_tahu_unlock_01' },
  { cost: 1000, id: 'Hahli', unlockedByQuest: 'mnog_restore_ga_koro' },
  { cost: 500, id: 'Hafu', unlockedByQuest: 'mnog_po_wahi_desert' },
  { cost: 750, id: 'Kivi', unlockedByQuest: 'mnog_po_koro_sickness' },
  { cost: 1000, id: 'Huki', unlockedByQuest: 'mnog_recruit_hewkii' },
  { cost: 600, id: 'Maku', unlockedByQuest: 'mnog_recruit_hewkii' },
  { cost: 1000, id: 'Nuparu', unlockedByQuest: 'mnog_arrive_onu_koro' },
  { cost: 600, id: 'Onepu', unlockedByQuest: 'mnog_arrive_onu_koro' },
  { cost: 600, id: 'Taipu', unlockedByQuest: 'mnog_meet_taipu' },
  { cost: 600, id: 'Tamaru', unlockedByQuest: 'mnog_flight_to_hive' },
  { cost: 1000, id: 'Kongu', unlockedByQuest: 'mnog_flight_to_hive' },
  { cost: 600, id: 'Kopeke', unlockedByQuest: 'mnog_arrive_ko_koro' },
  { cost: 750, id: 'Lumi', unlockedByQuest: 'mnog_arrive_ko_koro' },
  { cost: 1000, id: 'Matoro', unlockedByQuest: 'mnog_search_for_matoro' },
  // Bohrok Swarm
  { cost: 500, id: 'tahnok', unlockedByQuest: 'bohrok_assistants' },
  { cost: 500, id: 'gahlok', unlockedByQuest: 'bohrok_assistants' },
  { cost: 500, id: 'lehvak', unlockedByQuest: 'bohrok_assistants' },
  { cost: 500, id: 'pahrak', unlockedByQuest: 'bohrok_assistants' },
  { cost: 500, id: 'nuhvok', unlockedByQuest: 'bohrok_assistants' },
  { cost: 500, id: 'kohrak', unlockedByQuest: 'bohrok_assistants' },
  // Metru Nui
  { cost: 3000, id: 'Toa_Lhikan', unlockedByQuest: 'story_metru_nui_saga_begin' },
  { cost: 1500, id: 'Vakama', unlockedByQuest: 'story_metru_nui_saga_begin' },
  { cost: 1500, id: 'Nokama', unlockedByQuest: 'story_metru_nui_saga_begin' },
  { cost: 1500, id: 'Nuju', unlockedByQuest: 'story_metru_nui_saga_begin' },
  { cost: 1500, id: 'Onewa', unlockedByQuest: 'story_metru_nui_saga_begin' },
  { cost: 1500, id: 'Matau', unlockedByQuest: 'story_metru_nui_saga_begin' },
  { cost: 1500, id: 'Whenua', unlockedByQuest: 'story_metru_nui_saga_begin' },
  // Vahki — unlock after Vakama’s encounter with Turaga Dume
  { cost: 500, id: 'bordakh', unlockedByQuest: 'metru_vakama_dume_and_the_great_temple' },
  { cost: 500, id: 'nuurakh', unlockedByQuest: 'metru_vakama_dume_and_the_great_temple' },
  { cost: 500, id: 'vorzakh', unlockedByQuest: 'metru_vakama_dume_and_the_great_temple' },
  { cost: 500, id: 'zadakh', unlockedByQuest: 'metru_vakama_dume_and_the_great_temple' },
  { cost: 500, id: 'rorzakh', unlockedByQuest: 'metru_vakama_dume_and_the_great_temple' },
  { cost: 500, id: 'keerakh', unlockedByQuest: 'metru_vakama_dume_and_the_great_temple' },
  // Great Disk guides — unlocked by each Toa Metru's disk quest
  { cost: 1200, id: 'Vhisola', unlockedByQuest: 'metru_nokama_great_disk' },
];
