import type { ChronicleEntry } from '../types/Chronicle';

/** Chronicle IDs - one per character whose story persists across evolutions. Use unique names only (e.g. tahu, not Toa_Tahu). */
export const CHRONICLE_IDS = {
  AHKMOU: 'ahkmou',
  GALI: 'gali',
  HAFU: 'hafu',
  HAHLI: 'hahli',
  HUKI: 'huki',
  JALA: 'jala',
  KAPURA: 'kapura',
  KIVI: 'kivi',
  KONGU: 'kongu',
  KOPAKA: 'kopaka',
  KOPEKE: 'kopeke',
  LEWA: 'lewa',
  LUMI: 'lumi',
  MAKU: 'maku',
  MATORO: 'matoro',
  NUPARU: 'nuparu',
  ONEPU: 'onepu',
  ONUA: 'onua',
  POHATU: 'pohatu',
  TAHU: 'tahu',
  TAIPU: 'taipu',
  TAKUA: 'takua',
  TAMARU: 'tamaru',
} as const;

export type ChronicleId = (typeof CHRONICLE_IDS)[keyof typeof CHRONICLE_IDS];

/** Chronicle entries declared once per chronicle ID, reused by all forms of that character */
export const CHRONICLES_BY_ID: Record<ChronicleId, ChronicleEntry[]> = {
  [CHRONICLE_IDS.AHKMOU]: [
    {
      description:
        'Ahkmou awakens amid the sun-baked dunes of Po-Wahi, his memory erased but his connection to stone instinctive.',
      id: 'ahkmou_arrival_mata_nui',
      section: 'Mata Nui',
      title: 'Awakening in the Desert',
      unlockCondition: {
        questId: 'story_toa_arrival',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'A strange illness falls upon the Matoran of Po-Koro. Other Po-Matoran accused Ahkmou of poisoning them with his corrupted Koli balls, but he claims he did nothing wrong.',
      id: 'ahkmou_poisoned_comet',
      section: 'Mata Nui',
      title: 'The Poisoned Comet',
      unlockCondition: {
        questId: 'mnog_po_koro_sickness',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.GALI]: [
    {
      description:
        'Gali awakens beneath the waves off Ga-Wahi and swims ashore, vowing to shield the seas and villages of Mata Nui.',
      id: 'gali_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Rising from the Depths',
      unlockCondition: {
        questId: 'story_toa_arrival',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Answering the villagers' pleas, Gali fights to save Ga-Koro and sees how deeply Makuta's corruption has seeped into the waters.",
      id: 'gali_guardian_ga_koro',
      section: 'Arrival on Mata Nui',
      title: 'Guardian of Ga-Koro',
      unlockCondition: {
        questId: 'mnog_restore_ga_koro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'In the canyons of Po-Wahi, Gali and Tahu battle side by side, and her brush with the Miru brings a glimpse of a power greater than any single Toa.',
      id: 'gali_miru_and_visions',
      section: 'Arrival on Mata Nui',
      title: 'Visions in the Ravine',
      unlockCondition: {
        questId: 'maskhunt_gali_rescue',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'United with the others at Kini-Nui, Gali descends into the dark tunnels, trusting in Unity to carry them toward their confrontation with Makuta.',
      id: 'gali_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Faith Beneath the Temple',
      unlockCondition: {
        questId: 'story_kini_nui_descent',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Fresh from the depths, the Toa expect peace, but instead they find villages under attack from mechanical swarms. Gali joins the others rushing to Ta-Koro, clashing with the Bohrok for the first time.',
      id: 'gali_bohrok_awakening',
      section: 'Bohrok War',
      title: 'Beware the Bohrok',
      unlockCondition: {
        questId: 'bohrok_swarm_intro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Heeding Vakama's warning, Gali returns to Ga-Wahi to battle the Bohrok and tear the Krana from their heads. Only a full set will unlock the path into the nests.",
      id: 'gali_krana_hunt',
      section: 'Bohrok War',
      title: 'Hunt for the Krana',
      unlockCondition: {
        questId: 'bohrok_krana_hunt',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'With the Krana gathered, the Toa descend into the Bohrok nest beneath the island. Gali trusts in Unity as they advance toward the queens of the swarm.',
      id: 'gali_into_bohrok_nest',
      section: 'Bohrok War',
      title: 'Into the Bohrok Nest',
      unlockCondition: {
        questId: 'bohrok_into_the_bohrok_nest',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Deep in the nest, the Toa don Exo-Toa armor and confront the Bahrag. By combining their elemental powers, they imprison the twins, only to be plunged into energized protodermis. Gali emerges transformed, a Toa Nuva.',
      id: 'gali_dawn_of_nuva',
      section: 'Bohrok War',
      title: 'Dawn of the Toa Nuva',
      unlockCondition: {
        questId: 'bohrok_evolve_toa_nuva',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "The Bohrok Kal steal the Nuva symbols from the Suvas. Gali's elemental power vanishes. Nearly drowned by a tidal wave she can no longer control, she is alone and helpless.",
      id: 'gali_symbols_stolen',
      section: 'Bohrok Kal',
      title: 'Power Stripped Away',
      unlockCondition: {
        questId: 'bohrok_kal_stolen_symbols',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "At the last moment, Tahu summons the Vahi and slows time around the Kal. The Toa feed power to the symbols, and the Kal's own powers spiral out of control, destroying them. The symbols are reclaimed. Gali's power returns.",
      id: 'gali_at_nuva_cube',
      section: 'Bohrok Kal',
      title: 'At the Nuva Cube',
      unlockCondition: {
        questId: 'bohrok_kal_final_confrontation',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.HAFU]: [
    {
      description:
        'Hafu is a master carver of Po-Koro, creating sculptures and works of art from the stone of the desert. His carvings are treasured throughout the village.',
      id: 'hafu_carver',
      section: 'Po-Koro',
      title: 'Carver of Stone',
      unlockCondition: {
        questId: 'mnog_summon_chroniclers_company',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Chosen by Turaga Onewa to represent Po-Koro, Hafu joined the Chronicler's Company. He brought his strength and skill to the journey—and would soon need both.",
      id: 'hafu_chroniclers_company',
      section: "Chronicler's Company",
      title: 'The Journey to Kini-Nui',
      unlockCondition: {
        questId: 'mnog_journey_to_kini_nui_1',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'When a rockslide blocked the path to Kini-Nui, Hafu put his carving tools to unexpected use, helping the Company clear a way through the rubble.',
      id: 'hafu_rockslide',
      section: "Chronicler's Company",
      title: 'Rockslide Ahead',
      unlockCondition: {
        questId: 'mnog_journey_to_kini_nui_3',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "When the Tahnok swarm threatened Po-Koro, Hafu stood with Huki at the village gates. To slow the Bohrok, Hafu toppled his own carvings, his life's work, to block the tunnels and buy time for the villagers to flee.",
      id: 'hafu_bohrok_sacrifice',
      section: 'Bohrok War',
      title: 'Sacrifice at the Gates',
      unlockCondition: {
        questId: 'bohrok_po_koro_defense',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Hafu takes the field alongside Hewkii as Po-Koro's kolhii team at the great tournament in Ta-Koro. The match ends in shock when a golden mask—the Avohkii—reveals itself, changing the course of Mata Nui's history.",
      id: 'hafu_kolhii_tournament',
      section: 'Mask of Light',
      title: 'The Kolhii Tournament',
      unlockCondition: {
        questId: 'mol_kolhii_tournament',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.HAHLI]: [
    {
      description:
        'Hahli is a Ga-Matoran who calls the lily-pad village of Ga-Koro home. Like her fellow villagers, she tends to the waters and looks to Turaga Nokama for guidance.',
      id: 'hahli_ga_koro_villager',
      section: 'Ga-Koro',
      title: 'Villager of the Waters',
      unlockCondition: {
        questId: 'mnog_restore_ga_koro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'When Ga-Koro was attacked and its villagers trapped underwater, Hahli was among those rescued by Takua and Gali. The experience deepened her gratitude for the Toa and the Chronicler.',
      id: 'hahli_liberated',
      section: 'Ga-Koro',
      title: 'Freed from the Depths',
      unlockCondition: {
        questId: 'mnog_restore_ga_koro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Hahli and Macku represent Ga-Koro in the great kolhii tournament at Ta-Koro. During the match, the Mask of Light tumbles from Jaller's pack and lands at Takua's feet, shining with a golden glow.",
      id: 'hahli_kolhii_tournament',
      section: 'Mask of Light',
      title: 'The Kolhii Tournament',
      unlockCondition: {
        questId: 'mol_kolhii_tournament',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Chosen by Takanuva as his herald, Hahli rides the Ussanui with him into Mangaia. There she witnesses the final confrontation with Makuta and the revelation of a world below: the lost city of Metru Nui.',
      id: 'hahli_into_the_darkness',
      section: 'Mask of Light',
      title: 'Into the Darkness',
      unlockCondition: {
        questId: 'mol_defeat_of_makuta',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.HUKI]: [
    {
      description:
        'Huki is known across Po-Koro as a champion Koli player—a sport beloved by the Po-Matoran. His skill on the field has made him a village favorite.',
      id: 'huki_koli_champion',
      section: 'Po-Koro',
      title: 'Champion of the Stone',
      unlockCondition: {
        questId: 'mnog_po_koro_sickness',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Huki and many Po-Matoran fell ill after using corrupted Koli balls in recent matches. The source was traced to a Rahi nest.',
      id: 'huki_corrupted_koli',
      section: 'Po-Koro',
      title: 'The Sickness',
      unlockCondition: {
        questId: 'mnog_po_koro_cave_investigation',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "With the cave of corrupted Koli balls sealed by Takua and Pohatu, Huki recovered. Inspired by Takua's courage, he offered to join the journey ahead.",
      id: 'huki_recovered',
      section: 'Po-Koro',
      title: 'Koli Champion Recovered',
      unlockCondition: {
        questId: 'mnog_recruit_hewkii',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'When the Tahnok swarm threatened Po-Koro, Huki stood with Hafu at the village gates. Together they held the line as fire Bohrok swept across the desert.',
      id: 'huki_bohrok_defense',
      section: 'Bohrok War',
      title: 'Hold the Stone Village',
      unlockCondition: {
        questId: 'bohrok_po_koro_defense',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'At Kini-Nui, the Turaga teach the Matoran to rebuild themselves. For his heroism during the Bohrok crisis, Huki is honored with a new name: Hewkii.',
      id: 'huki_naming_day',
      section: 'Bohrok Kal',
      title: 'The Naming Day',
      unlockCondition: {
        questId: 'bohrok_kal_naming_day',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Hewkii and Hafu represent Po-Koro in the great kolhii tournament at Ta-Koro. Though the match is fierce, the game is overshadowed when a golden mask tumbles onto the field and shines with an ancient light.',
      id: 'huki_kolhii_tournament',
      section: 'Mask of Light',
      title: 'The Kolhii Tournament',
      unlockCondition: {
        questId: 'mol_kolhii_tournament',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.JALA]: [
    {
      description:
        'Jala serves as captain of the Ta-Koro guard, responsible for the safety of the village and its Matoran. His courage and leadership make him a natural defender of the flame.',
      id: 'jala_captain_ta_koro',
      section: 'Ta-Koro',
      title: 'Captain of the Guard',
      unlockCondition: {
        questId: 'mnog_find_canister_beach',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'When strange smoke rises where none should be, Kapura joins Jala to investigate the disturbance in the Ta-Wahi forest. They ambush what they believe is causing trouble, only to find the prophesied Toa Tahu',
      id: 'jala_investigate_disturbance',
      section: 'Ta-Koro',
      title: 'Smoke in the Forest',
      unlockCondition: {
        questId: 'mnog_tahu_unlock_01',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'When the Bohrok Kohrak strike Ta-Koro, Jala rallies the village guard to hold the line. With the Toa still en route, he leads the defense with flame and courage until reinforcements arrive.',
      id: 'jala_bohrok_defense',
      section: 'Bohrok War',
      title: "Jala's Stand",
      unlockCondition: {
        questId: 'bohrok_swarm_intro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'As Tahu arrives to push the Kohrak into the lava moat, Jala and his guard fight alongside the Toa of Fire. The siege proves that Matoran and Toa must stand together against the swarms.',
      id: 'jala_siege_ta_koro',
      section: 'Bohrok War',
      title: 'Siege of Ta-Koro',
      unlockCondition: {
        questId: 'bohrok_ta_koro_defense',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'At Kini-Nui, the Turaga reveal Jala and Takua rebuilt into taller forms. For his heroism during the Bohrok crisis, Jala is honored with a new name: Jaller.',
      id: 'jala_naming_day',
      section: 'Bohrok Kal',
      title: 'The Naming Day',
      unlockCondition: {
        questId: 'bohrok_kal_naming_day',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Jaller searches for Takua in the lava tunnels beneath Ta-Koro and finds him clutching a strange glowing mask. Together they bring it to the surface, not knowing it will change both their lives forever.',
      id: 'jala_discovery_avohkii',
      section: 'Mask of Light',
      title: 'The Mask in the Lava',
      unlockCondition: {
        questId: 'mol_discovery_of_avohkii',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "During the kolhii match at Ta-Koro, the mask tumbles from Jaller's pack and shines upon him. Named Herald of the Seventh Toa, Jaller nominates Takua to chronicle his journey.",
      id: 'jala_kolhii_tournament',
      section: 'Mask of Light',
      title: 'The Kolhii Tournament',
      unlockCondition: {
        questId: 'mol_kolhii_tournament',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'At Kini-Nui, the Rahkshi Turahk turns its fear power on Takua. Jaller leaps between them and takes the blow meant for his friend. As his light fades, he whispers to Takua: "You know who you are." His sacrifice awakens the true herald.',
      id: 'jala_sacrifice',
      section: 'Mask of Light',
      title: "Jaller's Sacrifice",
      unlockCondition: {
        questId: 'mol_battle_of_kini_nui',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'After Takanuva defeats Makuta and the gate to Metru Nui is opened, the Toa of Light uses the last of his power to revive Jaller. The Captain of the Guard wakes to a new world—and a new chapter.',
      id: 'jala_revived',
      section: 'Mask of Light',
      title: 'Revived by the Light',
      unlockCondition: {
        questId: 'mol_defeat_of_makuta',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.KAPURA]: [
    {
      description:
        'Encouraged by Turaga Vakama, he spends most of his time practicing his art of moving slowly. His unconventional ways set him apart, but his loyalty to the village runs deep.',
      id: 'kapura_ta_koro_life',
      section: 'Ta-Koro',
      title: 'The Slow Walker',
      unlockCondition: {
        questId: 'mnog_find_canister_beach',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'When strange smoke rises where none should be, Kapura joins Jala to investigate the disturbance in the Ta-Wahi forest. They ambush what they believe is causing trouble, only to find the prophesied Toa Tahu',
      id: 'kapura_disturbance_forest',
      section: 'Ta-Koro',
      title: 'Into the Smoky Forest',
      unlockCondition: {
        questId: 'mnog_tahu_unlock_01',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'After years of practice, Kapura discovers that by walking very slowly he can move great distances. Chosen by Turaga Vakama to represent Ta-Koro, Kapura finds Takua to join him on the sacred journey to Kini-Nui.',
      id: 'kapura_chroniclers_company',
      section: "Chronicler's Company",
      title: 'The Call to Kini-Nui',
      unlockCondition: {
        questId: 'mnog_summon_chroniclers_company',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "While the Toa descend into darkness, Kapura stands with the Chronicler's Company at Kini-Nui, facing wave after wave of Rahi in Makuta's final assault on the surface.",
      id: 'kapura_defense_kini_nui',
      section: "Chronicler's Company",
      title: 'Holding the Line',
      unlockCondition: {
        questId: 'mnog_kini_nui_defense',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.KIVI]: [
    {
      description:
        'Kivi is a Po-Matoran who tended to the sick when the corrupted Koli balls brought illness to Po-Koro. His care helped the afflicted villagers through the worst of the outbreak.',
      id: 'kivi_po_koro',
      section: 'Po-Koro',
      title: 'Stone Village Healer',
      unlockCondition: {
        questId: 'mnog_po_koro_sickness',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.KONGU]: [
    {
      description:
        'Kongu is a skilled Kahu rider, navigating the treetops of Le-Wahi with confidence. When the Nui-Rama abducted the Le-Matoran, he was among the few who remained to plan the rescue.',
      id: 'kongu_le_koro_pilot',
      section: 'Le-Koro',
      title: 'Pilot of the Canopy',
      unlockCondition: {
        questId: 'mnog_flight_to_hive',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Kongu joined Takua and Tamaru on a daring Kahu flight to the Nui-Rama hive. Their mission: rescue the captive Le-Matoran, including Taipu, from Makuta's corrupted creatures.",
      id: 'kongu_rescue_hive',
      section: 'Le-Koro',
      title: 'Flight to the Hive',
      unlockCondition: {
        questId: 'mnog_rescue_from_hive',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Inside the hive, Kongu's Kahu was downed and he was trapped with the others. After Toa Onua helped Toa Lewa be freed from the infected mask, Kongu and the Le-Matoran were able to be rescued.",
      id: 'kongu_trapped_hive',
      section: 'Le-Koro',
      title: 'Trapped in the Hive',
      unlockCondition: {
        questId: 'mnog_lewa_v_onua',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.KOPAKA]: [
    {
      description:
        'Kopaka rises alone in the frozen silence of Ko-Wahi, content to trust only his own skill against the dangers ahead.',
      id: 'kopaka_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Awakening in the Snow',
      unlockCondition: {
        questId: 'story_toa_arrival',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Investigating Rahi threats along an icy precipice, Kopaka reluctantly fights beside Pohatu, proving that even he cannot always stand alone.',
      id: 'kopaka_cliffside_alliance',
      section: 'Arrival on Mata Nui',
      title: 'Paths Cross at the Cliff',
      unlockCondition: {
        questId: 'maskhunt_kopaka_matoro_icecliff',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Following faint traces in the snow, Kopaka helps Takua find Matoro, seeing how Makuta's influence reaches even the most secluded drifts.",
      id: 'kopaka_rescue_matoro',
      section: 'Arrival on Mata Nui',
      title: 'Rescue in the White Silence',
      unlockCondition: {
        questId: 'mnog_search_for_matoro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "A searing vision during his hunt for the Pakari shakes Kopaka's certainty, hinting that Makuta's hand may already be twisting their path.",
      id: 'kopaka_heat_of_insight',
      section: 'Arrival on Mata Nui',
      title: 'The Heat of Insight',
      unlockCondition: {
        questId: 'maskhunt_kopaka_pakari',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Haunted by what he has seen, Kopaka still walks with the other Toa beneath Kini-Nui, blade drawn as they advance toward Makuta's lair.",
      id: 'kopaka_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Doubt in the Darkness',
      unlockCondition: {
        questId: 'story_kini_nui_descent',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Fresh from the depths, the Toa expect peace, but instead they find villages under attack from mechanical swarms. Kopaka joins the others rushing to Ta-Koro, clashing with the Bohrok for the first time.',
      id: 'kopaka_bohrok_awakening',
      section: 'Bohrok War',
      title: 'Beware the Bohrok',
      unlockCondition: {
        questId: 'bohrok_swarm_intro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Heeding Vakama's warning, Kopaka returns to Ko-Wahi to battle the Bohrok and tear the Krana from their heads. Only a full set will unlock the path into the nests.",
      id: 'kopaka_krana_hunt',
      section: 'Bohrok War',
      title: 'Hunt for the Krana',
      unlockCondition: {
        questId: 'bohrok_krana_hunt',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Following the trail of the Bohrok Va, Kopaka discovers the hidden entrance to the nest. With the Krana gathered, the Toa descend, Kopaka's blade ready for whatever lies below.",
      id: 'kopaka_into_bohrok_nest',
      section: 'Bohrok War',
      title: 'Into the Bohrok Nest',
      unlockCondition: {
        questId: 'bohrok_into_the_bohrok_nest',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Deep in the nest, the Toa don Exo-Toa armor and confront the Bahrag. By combining their elemental powers, they imprison the twins, only to be plunged into energized protodermis. Kopaka emerges transformed, a Toa Nuva.',
      id: 'kopaka_dawn_of_nuva',
      section: 'Bohrok War',
      title: 'Dawn of the Toa Nuva',
      unlockCondition: {
        questId: 'bohrok_evolve_toa_nuva',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "The Bohrok Kal steal the Nuva symbols from the Suvas. Kopaka's elemental power vanishes. He falls from an ice bridge without his power. Alone and without his elemental powers, he is helpless.",
      id: 'kopaka_symbols_stolen',
      section: 'Bohrok Kal',
      title: 'Power Stripped Away',
      unlockCondition: {
        questId: 'bohrok_kal_stolen_symbols',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "At the last moment, Tahu summons the Vahi and slows time around the Kal. The Toa feed power to the symbols, and the Kal's own powers spiral out of control, destroying them. The symbols are reclaimed. Kopaka's power returns.",
      id: 'kopaka_at_nuva_cube',
      section: 'Bohrok Kal',
      title: 'At the Nuva Cube',
      unlockCondition: {
        questId: 'bohrok_kal_final_confrontation',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.KOPEKE]: [
    {
      description:
        'Kopeke is a Ko-Matoran who rarely speaks. His quiet nature fits the solemn atmosphere of Ko-Koro, and his loyalty runs deep.',
      id: 'kopeke_ko_koro_silent',
      section: 'Ko-Koro',
      title: 'The Silent One',
      unlockCondition: {
        questId: 'mnog_arrive_ko_koro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Turaga Nuju chose Kopeke to represent Ko-Koro in the Chronicler's Company. Together with Takua, he journeyed to gather the other Matoran before the sacred trek to Kini-Nui.",
      id: 'kopeke_chroniclers_company',
      section: "Chronicler's Company",
      title: 'Chosen for Ko-Koro',
      unlockCondition: {
        questId: 'mnog_summon_chroniclers_company',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "At the great stone gate on the path to Kini-Nui, the Chronicler's Company needed to unlock a hidden mechanism. Kopeke's patience and observation helped the group find a way through.",
      id: 'kopeke_silent_gate',
      section: "Chronicler's Company",
      title: 'The Silent Gate',
      unlockCondition: {
        questId: 'mnog_journey_to_kini_nui_4',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Kopeke stood with the Chronicler's Company at Kini-Nui, defending the sacred temple while the Toa descended. In silence, he fought—and held.",
      id: 'kopeke_defense_kini_nui',
      section: "Chronicler's Company",
      title: 'Holding the Shrine',
      unlockCondition: {
        questId: 'mnog_kini_nui_defense',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.LEWA]: [
    {
      description:
        'Lewa bursts from his canister into the canopies of Le-Wahi, reveling in the freedom of the wind and the song of the trees.',
      id: 'lewa_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'First Breath of the Jungle',
      unlockCondition: {
        questId: 'story_toa_arrival',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Diving into Onu-Wahi's caverns in search of the Pakari, Lewa learns that agility and wit are not always enough against Makuta's twisted beasts.",
      id: 'lewa_pakari_caverns',
      section: 'Arrival on Mata Nui',
      title: 'Strength Below the Surface',
      unlockCondition: {
        questId: 'maskhunt_lewa_pakari',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "In a shadowed subterranean lake, Lewa risks everything to claim new masks, feeling Makuta's presence stirring beneath the still water.",
      id: 'lewa_kakama_komau',
      section: 'Arrival on Mata Nui',
      title: 'Echoes Beneath the Lake',
      unlockCondition: {
        questId: 'maskhunt_lewa_kakama_komau',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Lewa and the Le-Matoran are trapped in a Nui-Rama nest and his mask has been replaced with an infected one. Alone, he cannot control his own body but thankfully, Onua finds him and helps him regain control.',
      id: 'lewa_nui_rama_nest',
      section: 'Arrival on Mata Nui',
      title: 'Rescue from the Hive',
      unlockCondition: {
        questId: 'mnog_lewa_v_onua',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Even far from open sky, Lewa brings the spirit of Le-Wahi with him as the Toa descend beneath Kini-Nui toward their first true clash with Makuta.',
      id: 'lewa_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Wind in the Depths',
      unlockCondition: {
        questId: 'story_kini_nui_descent',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Fresh from the depths, the Toa expect peace, but instead they find villages under attack from mechanical swarms. Lewa joins the others rushing to Ta-Koro, clashing with the Bohrok for the first time.',
      id: 'lewa_bohrok_awakening',
      section: 'Bohrok War',
      title: 'Beware the Bohrok',
      unlockCondition: {
        questId: 'bohrok_swarm_intro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "During the hunt for Krana, a Bohrok attaches its Krana to Lewa's face, and he is no longer himself. Compelled by the swarm's will, he turns against his brothers. Onua pursues him into the jungle and, through patience and strength, pries the Krana free. Lewa returns to his senses.",
      id: 'lewa_freed_from_krana',
      section: 'Bohrok War',
      title: 'Freed from the Krana',
      unlockCondition: {
        questId: 'bohrok_lewa_krana_rescue',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Heeding Vakama's warning, Lewa returns to Le-Wahi to battle the Bohrok and tear the Krana from their heads. Only a full set will unlock the path into the nests.",
      id: 'lewa_krana_hunt',
      section: 'Bohrok War',
      title: 'Hunt for the Krana',
      unlockCondition: {
        questId: 'bohrok_krana_hunt',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'With the Krana gathered, the Toa descend into the Bohrok nest beneath the island. Lewa brings the spirit of Le-Wahi even into the depths, toward the queens of the swarm.',
      id: 'lewa_into_bohrok_nest',
      section: 'Bohrok War',
      title: 'Into the Bohrok Nest',
      unlockCondition: {
        questId: 'bohrok_into_the_bohrok_nest',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Deep in the nest, the Toa don Exo-Toa armor and confront the Bahrag. By combining their elemental powers, they imprison the twins, only to be plunged into energized protodermis. Lewa emerges transformed, a Toa Nuva.',
      id: 'lewa_dawn_of_nuva',
      section: 'Bohrok War',
      title: 'Dawn of the Toa Nuva',
      unlockCondition: {
        questId: 'bohrok_evolve_toa_nuva',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "The Bohrok Kal steal the Nuva symbols from the Suvas. Lewa's elemental power vanishes. His airborne display is cut short miles above Mata Nui. Kongu rescues him on a Gukko. Alone and without his elemental powers, he is helpless.",
      id: 'lewa_symbols_stolen',
      section: 'Bohrok Kal',
      title: 'Power Stripped Away',
      unlockCondition: {
        questId: 'bohrok_kal_stolen_symbols',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "At the last moment, Tahu summons the Vahi and slows time around the Kal. The Toa feed power to the symbols, and the Kal's own powers spiral out of control, destroying them. The symbols are reclaimed. Lewa's power returns.",
      id: 'lewa_at_nuva_cube',
      section: 'Bohrok Kal',
      title: 'At the Nuva Cube',
      unlockCondition: {
        questId: 'bohrok_kal_final_confrontation',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.LUMI]: [
    {
      description:
        'Lumi is a Ko-Matoran who dwells in the silent village of Ko-Koro, high in the frozen peaks of Ko-Wahi. He finds peace in the snow and the wisdom of Turaga Nuju.',
      id: 'lumi_ko_koro',
      section: 'Ko-Koro',
      title: 'Villager of the Ice',
      unlockCondition: {
        questId: 'mnog_arrive_ko_koro',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.MAKU]: [
    {
      description:
        'When Ga-Koro came under attack, Maku sailed to Ta-Wahi to plead for aid. She found Takua at the coast and moved him with her urgency, setting in motion the journey that would save her village.',
      id: 'maku_plea_help',
      section: 'Ga-Koro',
      title: 'A Call for Help',
      unlockCondition: {
        questId: 'mnog_ga_koro_sos',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "After Ga-Koro was restored, Maku was chosen to represent her village in the Chronicler's Company. She joined Takua and the others on the sacred journey to Kini-Nui.",
      id: 'maku_chroniclers_company',
      section: "Chronicler's Company",
      title: 'Chosen for the Company',
      unlockCondition: {
        questId: 'mnog_recruit_hewkii',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Maku stood with the Chronicler's Company at Kini-Nui, facing the Rahi waves while the Toa descended into darkness. Her courage helped hold the line until the battle below was won.",
      id: 'maku_defense_kini_nui',
      section: "Chronicler's Company",
      title: 'Defense of the Temple',
      unlockCondition: {
        questId: 'mnog_kini_nui_defense',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'At Kini-Nui, the Turaga reveal Takua and Jala rebuilt into taller forms. For her heroism during the Bohrok crisis, Maku is honored with a new name: Macku.',
      id: 'maku_naming_day',
      section: 'Bohrok Kal',
      title: 'The Naming Day',
      unlockCondition: {
        questId: 'bohrok_kal_naming_day',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.MATORO]: [
    {
      description:
        'Matoro serves as translator for Turaga Nuju, who speaks only in gesture and whistle. Without Matoro, the wisdom of the icy Turaga would remain locked in silence.',
      id: 'matoro_translator',
      section: 'Ko-Koro',
      title: "Nuju's Voice",
      unlockCondition: {
        questId: 'mnog_arrive_ko_koro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Matoro went missing in the icy wastes of Ko-Wahi, hunted by Rahi. Takua and Kopaka followed faint traces in the snow until they found him—and brought him home to his village.',
      id: 'matoro_lost_snow',
      section: 'Ko-Koro',
      title: 'Lost in the White',
      unlockCondition: {
        questId: 'mnog_search_for_matoro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Turaga Vakama summons Matoro to the Sanctum for a private task. The Turaga have kept ancient secrets for a thousand years, and once more they need Matoro to translate for Nuju at a private council—one that will decide whether the time has come to reveal the truth.',
      id: 'matoro_secrets_beneath_ice',
      section: 'Tales of the Masks',
      title: 'Secrets Beneath the Ice',
      unlockCondition: {
        questId: 'tales_turaga_and_matoro',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.NUPARU]: [
    {
      description:
        'Nuparu works the tunnels of Onu-Koro as a miner, but his true passion is invention. He studies ancient machinery and dreams of creations that could protect the Matoran.',
      id: 'nuparu_miner_inventor',
      section: 'Onu-Koro',
      title: 'Miner and Dreamer',
      unlockCondition: {
        questId: 'mnog_arrive_onu_koro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "When lava blocked Onu-Koro's main tunnel, Nuparu witnessed Takua redirect the flow using ancient pumps. The encounter with old technology sparked new ideas in the young inventor.",
      id: 'nuparu_lava_redirect',
      section: 'Onu-Koro',
      title: 'When the Tunnels Flood',
      unlockCondition: {
        questId: 'mnog_onu_koro_lava_problem',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Trapped with Onepu and Taipu as the Gahlok flooded Onu-Koro, Nuparu refused to yield. He scavenged Bohrok shells and ancient machinery to create the Boxor, a walking exo-suit that let the Matoran fight back and reclaim their home.',
      id: 'nuparu_boxor',
      section: 'Bohrok War',
      title: 'The Invention of the Boxor',
      unlockCondition: {
        questId: 'bohrok_onu_koro_boxor',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.ONEPU]: [
    {
      description:
        "Onepu is a prominent member of the Ussalry—Onu-Koro's mounted guard who ride Ussal crabs through the tunnels. He takes pride in defending the underground village.",
      id: 'onepu_ussalry',
      section: 'Onu-Koro',
      title: 'Rider of the Ussal',
      unlockCondition: {
        questId: 'mnog_arrive_onu_koro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'When the water Bohrok Gahlok flooded Onu-Koro, Onepu was trapped with Nuparu and Taipu. Cut off from escape, he fought beside them as Nuparu built the Boxor to reclaim their home.',
      id: 'onepu_gahlok_trap',
      section: 'Bohrok War',
      title: 'Trapped in the Flood',
      unlockCondition: {
        questId: 'bohrok_onu_koro_boxor',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.ONUA]: [
    {
      description:
        'Onua claws his way out of the underground tunnels of Onu-Wahi, already listening to the whispers of stone and soil.',
      id: 'onua_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Awakening Beneath the Earth',
      unlockCondition: {
        questId: 'story_toa_arrival',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Guided by the earth itself, Onua delves into caverns and roots out hidden Kanohi, learning how Makuta's shadow twists the tunnels below.",
      id: 'onua_depths_and_masks',
      section: 'Arrival on Mata Nui',
      title: 'Masks in the Deep',
      unlockCondition: {
        questId: 'maskhunt_onua_matatu_hau',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Hearing of Le-Matoran trapped in a Nui-Rama nest, Onua turns from his own quest to aid them, revealing the compassion beneath his quiet strength.',
      id: 'onua_jungle_rumor',
      section: 'Arrival on Mata Nui',
      title: 'The Rumor from the Canopy',
      unlockCondition: {
        questId: 'maskhunt_onua_jungle_rumor',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Burdened by what he has seen, Onua summons the other Toa to a second council, urging them to pursue the Masks of Power together instead of apart.',
      id: 'onua_second_council',
      section: 'Arrival on Mata Nui',
      title: 'Calling the Second Council',
      unlockCondition: {
        questId: 'story_toa_second_council',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'As the Toa descend under Kini-Nui, Onua leads the way through stone and darkness, guiding the team along the hidden veins of the island toward Makuta.',
      id: 'onua_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Earth Beneath Kini-Nui',
      unlockCondition: {
        questId: 'story_kini_nui_descent',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Fresh from the depths, the Toa expect peace, but instead they find villages under attack from mechanical swarms. Onua joins the others rushing to Ta-Koro, clashing with the Bohrok for the first time.',
      id: 'onua_bohrok_awakening',
      section: 'Bohrok War',
      title: 'Beware the Bohrok',
      unlockCondition: {
        questId: 'bohrok_swarm_intro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "When a Bohrok attaches its Krana to Lewa's face, the Toa of Air turns against his brothers. Onua, steady and grounded, pursues him into the jungle. Through patience and strength, he pries the Krana free and restores Lewa to his senses.",
      id: 'onua_freed_lewa',
      section: 'Bohrok War',
      title: 'Freed from the Krana',
      unlockCondition: {
        questId: 'bohrok_lewa_krana_rescue',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Heeding Vakama's warning, Onua returns to Onu-Wahi to battle the Bohrok and tear the Krana from their heads. Only a full set will unlock the path into the nests.",
      id: 'onua_krana_hunt',
      section: 'Bohrok War',
      title: 'Hunt for the Krana',
      unlockCondition: {
        questId: 'bohrok_krana_hunt',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'With the Krana gathered, the Toa descend into the Bohrok nest beneath the island. Onua leads the way through stone and darkness toward the queens of the swarm.',
      id: 'onua_into_bohrok_nest',
      section: 'Bohrok War',
      title: 'Into the Bohrok Nest',
      unlockCondition: {
        questId: 'bohrok_into_the_bohrok_nest',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Deep in the nest, the Toa don Exo-Toa armor and confront the Bahrag. By combining their elemental powers, they imprison the twins, only to be plunged into energized protodermis. Onua emerges transformed, a Toa Nuva.',
      id: 'onua_dawn_of_nuva',
      section: 'Bohrok War',
      title: 'Dawn of the Toa Nuva',
      unlockCondition: {
        questId: 'bohrok_evolve_toa_nuva',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "The Bohrok Kal steal the Nuva symbols from the Suvas. Onua's elemental power vanishes. The Toa of Earth, who once moved through stone like water, is alone and helpless.",
      id: 'onua_symbols_stolen',
      section: 'Bohrok Kal',
      title: 'Power Stripped Away',
      unlockCondition: {
        questId: 'bohrok_kal_stolen_symbols',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "At the last moment, Tahu summons the Vahi and slows time around the Kal. The Toa feed power to the symbols, and the Kal's own powers spiral out of control, destroying them. The symbols are reclaimed. Onua's power returns.",
      id: 'onua_at_nuva_cube',
      section: 'Bohrok Kal',
      title: 'At the Nuva Cube',
      unlockCondition: {
        questId: 'bohrok_kal_final_confrontation',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.POHATU]: [
    {
      description:
        'Pohatu awakens amid the dunes of Po-Wahi, quickly turning exploration into a sprint to protect the villages he comes to love.',
      id: 'pohatu_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Runner of the Wahi',
      unlockCondition: {
        questId: 'story_toa_arrival',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Chasing Rahi tracks from the desert into Ko-Wahi, Pohatu collides, literally and figuratively, with Kopaka as they uncover a mask on a perilous cliffside.',
      id: 'pohatu_cliffside_encounter',
      section: 'Arrival on Mata Nui',
      title: 'Footfalls on the Ice Cliff',
      unlockCondition: {
        questId: 'maskhunt_kopaka_matoro_icecliff',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'With Kopaka and Lewa, Pohatu scales the highest bluff in Po-Wahi, proving that speed and sure footing can carry the team where sheer strength cannot.',
      id: 'pohatu_kaukau_bluff',
      section: 'Arrival on Mata Nui',
      title: 'Ascent to the Kaukau',
      unlockCondition: {
        questId: 'maskhunt_pohatu_kaukau_bluff',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'At the Nui-Jaga nest, Pohatu finds the source of the poison that is affecting the Matoran of Po-Koro.',
      id: 'pohatu_nui_jaga_nest',
      section: 'Arrival on Mata Nui',
      title: 'Poison in the Nest',
      unlockCondition: {
        questId: 'story_nui_jaga_nest',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "When the path to Mangaia opens, Pohatu brings his unshakable footing and humor to steady the team as they descend toward Makuta's domain.",
      id: 'pohatu_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Stones on the Sacred Path',
      unlockCondition: {
        questId: 'story_kini_nui_descent',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Fresh from the depths, the Toa expect peace, but instead they find villages under attack from mechanical swarms. Pohatu joins the others rushing to Ta-Koro, clashing with the Bohrok for the first time.',
      id: 'pohatu_bohrok_awakening',
      section: 'Bohrok War',
      title: 'Beware the Bohrok',
      unlockCondition: {
        questId: 'bohrok_swarm_intro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Heeding Vakama's warning, Pohatu returns to Po-Wahi to battle the Bohrok and tear the Krana from their heads. Only a full set will unlock the path into the nests.",
      id: 'pohatu_krana_hunt',
      section: 'Bohrok War',
      title: 'Hunt for the Krana',
      unlockCondition: {
        questId: 'bohrok_krana_hunt',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'With the Krana gathered, the Toa descend into the Bohrok nest beneath the island. Pohatu brings his unshakable footing to the descent toward the queens of the swarm.',
      id: 'pohatu_into_bohrok_nest',
      section: 'Bohrok War',
      title: 'Into the Bohrok Nest',
      unlockCondition: {
        questId: 'bohrok_into_the_bohrok_nest',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Deep in the nest, the Toa don Exo-Toa armor and confront the Bahrag. By combining their elemental powers, they imprison the twins, only to be plunged into energized protodermis. Pohatu emerges transformed, a Toa Nuva.',
      id: 'pohatu_dawn_of_nuva',
      section: 'Bohrok War',
      title: 'Dawn of the Toa Nuva',
      unlockCondition: {
        questId: 'bohrok_evolve_toa_nuva',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "The Bohrok Kal steal the Nuva symbols from the Suvas. Pohatu's elemental power vanishes. The Toa of Stone, who once ran faster than the wind, is alone and helpless.",
      id: 'pohatu_symbols_stolen',
      section: 'Bohrok Kal',
      title: 'Power Stripped Away',
      unlockCondition: {
        questId: 'bohrok_kal_stolen_symbols',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "At the last moment, Tahu summons the Vahi and slows time around the Kal. The Toa feed power to the symbols, and the Kal's own powers spiral out of control, destroying them. The symbols are reclaimed. Pohatu's power returns.",
      id: 'pohatu_at_nuva_cube',
      section: 'Bohrok Kal',
      title: 'At the Nuva Cube',
      unlockCondition: {
        questId: 'bohrok_kal_final_confrontation',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.TAHU]: [
    {
      description:
        'Tahu emerges from his canister on the scorched shores of Ta-Wahi, grasping only fragments of who he was and a sense of burning purpose.',
      id: 'tahu_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Awakening in Fire and Ash',
      unlockCondition: {
        questId: 'story_toa_arrival',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Guided by Vakama and the villagers of Ta-Koro, Tahu tests his power against the wilds and Rahi that stalk the lava fields.',
      id: 'tahu_first_trials',
      section: 'Arrival on Mata Nui',
      title: 'First Steps into Ta-Wahi',
      unlockCondition: {
        questId: 'mnog_tahu_unlock_01',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Near Mount Ihu, Tahu joins the other Toa as they agree to seek the Masks of Power before daring to face Makuta himself.',
      id: 'tahu_council_mount_ihu',
      section: 'Arrival on Mata Nui',
      title: 'Council at the Mountain',
      unlockCondition: {
        questId: 'story_toa_council',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'With every Kanohi gathered, Tahu leads the united Toa down beneath Kini-Nui, firelight cutting through the dark on the path to Makuta.',
      id: 'tahu_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Descent Toward the Shadow',
      unlockCondition: {
        questId: 'story_kini_nui_descent',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Fresh from the depths, the Toa expect peace, but instead they find villages under attack from mechanical swarms. Rushing to Ta-Koro, Tahu clashes with the Bohrok for the first time and realizes a new threat has awakened.',
      id: 'tahu_bohrok_awakening',
      section: 'Bohrok War',
      title: 'Beware the Bohrok',
      unlockCondition: {
        questId: 'bohrok_swarm_intro',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'As the Kohrak besiege his village, Tahu ambushes the swarm and drives them into the lava moat. Vakama, seeing the mechanical invaders firsthand, recognizes them from the old legends. The awakening he feared has come.',
      id: 'tahu_siege_ta_koro',
      section: 'Bohrok War',
      title: 'Siege of Ta-Koro',
      unlockCondition: {
        questId: 'bohrok_ta_koro_defense',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Heeding Vakama's warning, Tahu returns to Ta-Wahi to battle the Bohrok and tear the Krana from their heads. Only a full set will unlock the path into the nests.",
      id: 'tahu_krana_hunt',
      section: 'Bohrok War',
      title: 'Hunt for the Krana',
      unlockCondition: {
        questId: 'bohrok_krana_hunt',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'With the Krana gathered, the Toa descend into the Bohrok nest beneath the island. Tahu leads the way into the darkness, toward the queens of the swarm.',
      id: 'tahu_into_bohrok_nest',
      section: 'Bohrok War',
      title: 'Into the Bohrok Nest',
      unlockCondition: {
        questId: 'bohrok_into_the_bohrok_nest',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Deep in the nest, the Toa don Exo-Toa armor and confront the Bahrag. By combining their elemental powers, they imprison the twins, only to be plunged into energized protodermis. Tahu emerges transformed, as Toa Nuva.',
      id: 'tahu_dawn_of_nuva',
      section: 'Bohrok War',
      title: 'Dawn of the Toa Nuva',
      unlockCondition: {
        questId: 'bohrok_evolve_toa_nuva',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'While Ta-Koro repairs, a strange symbol appears on the Toa Suva. Vakama recognizes it and gives Tahu the Vahi, the Mask of Time But he must keep it secret and use only it in the direst emergency.',
      id: 'tahu_vahi_entrusted',
      section: 'Bohrok Kal',
      title: 'The Vahi Entrusted',
      unlockCondition: {
        questId: 'bohrok_kal_reconstruction',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "The Bohrok Kal steal the Nuva symbols from the Suvas. Tahu's elemental power vanishes. Buried by rubble when he tries to stop one of the Kal. Alone and without his elemental powers, he is helpless.",
      id: 'tahu_symbols_stolen',
      section: 'Bohrok Kal',
      title: 'Power Stripped Away',
      unlockCondition: {
        questId: 'bohrok_kal_stolen_symbols',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "At the last moment, Tahu summons the Vahi and slows time around the Kal. Their Krana-Kal turn silver and project a force field. The Toa feed power to the symbols, and the Kal's own powers spiral out of control, destroying them. The symbols are reclaimed. Tahu's power returns.",
      id: 'tahu_at_nuva_cube',
      section: 'Bohrok Kal',
      title: 'At the Nuva Cube',
      unlockCondition: {
        questId: 'bohrok_kal_final_confrontation',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.TAIPU]: [
    {
      description:
        'Taipu is an Onu-Matoran with a restless spirit. When he finally opened the tunnels to Le-Wahi, Taipu was eager to join Takua and see the world beyond the underground.',
      id: 'taipu_eager_explorer',
      section: 'Onu-Koro',
      title: 'Eager to Explore',
      unlockCondition: {
        questId: 'mnog_meet_taipu',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'A Nui-Rama ambushed Takua and Taipu in Le-Wahi, snatching Taipu and carrying him to the hive. Forced to work alongside the captive Le-Matoran, he awaited rescue.',
      id: 'taipu_nui_rama_capture',
      section: "Chronicler's Company",
      title: 'Taken by the Hive',
      unlockCondition: {
        questId: 'mnog_enter_le_wahi',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Takua, Tamaru, and Kongu flew to the Nui-Rama hive and found Taipu among the captives. Rescued from bondage, Taipu joined the Chronicler's Company for the journey to Kini-Nui.",
      id: 'taipu_rescued',
      section: "Chronicler's Company",
      title: 'Rescue from the Hive',
      unlockCondition: {
        questId: 'mnog_rescue_from_hive',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "When the Gahlok flooded Onu-Koro, Taipu was trapped with Onepu and Nuparu. He witnessed Nuparu's invention of the Boxor and fought alongside his friends to reclaim their home.",
      id: 'taipu_gahlok_trap',
      section: 'Bohrok War',
      title: 'Trapped with the Inventor',
      unlockCondition: {
        questId: 'bohrok_onu_koro_boxor',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.TAKUA]: [
    {
      description:
        'After being banished from Ta-Koro, Takua is tasked by Turaga Vakama to find a way to summon the Toa. The time of prophecy is upon us.',
      id: 'takua_summon_the_toa',
      section: "Chronicler's Duty",
      title: 'A call for help',
      unlockCondition: {
        questId: 'mnog_find_canister_beach',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'On the black sands of Ta-Wahi, Takua discovers a strange canister washed ashore, its trail of molten footprints leading into the jungle.',
      id: 'takua_canister_on_shore',
      section: "Chronicler's Duty",
      title: 'The Canister on the Shore',
      unlockCondition: {
        questId: 'mnog_find_canister_beach',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Entrusted by Turaga Nuju, Takua travels across Mata Nui to gather a band of brave Matoran who will stand with him at Kini-Nui.',
      id: 'takua_chroniclers_company',
      section: "Chronicler's Duty",
      title: 'Summoning the Company',
      unlockCondition: {
        questId: 'mnog_summon_chroniclers_company',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "While the Toa descend into darkness, Takua and his companions hold the line at the great temple, facing wave after wave of Rahi in Makuta's last assault.",
      id: 'takua_defense_kini_nui',
      section: "Chronicler's Duty",
      title: 'Defense of Kini-Nui',
      unlockCondition: {
        questId: 'mnog_kini_nui_defense',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Takua is summoned by Gali to witness the battle between the Toa and Makuta. As Makuta is defeated and the Toa return to the surface, Takua finds an ominous chamber holding an even bigger threat.',
      id: 'takua_witness_makuta_battle',
      section: "Chronicler's Duty",
      title: 'Witness the Battle',
      unlockCondition: {
        questId: 'mnog_gali_call',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'As the Kohrak besiege Ta-Koro, Takua fights alongside Tahu. Together they push the swarm into the lava moat. Vakama, seeing the mechanical invaders firsthand, recognizes them from the old legends.',
      id: 'takua_siege_ta_koro',
      section: 'Bohrok War',
      title: 'Siege of Ta-Koro',
      unlockCondition: {
        questId: 'bohrok_ta_koro_defense',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'At Kini-Nui, the Turaga reveal Takua and Jala rebuilt into taller forms. The Matoran cheer as they learn to rebuild themselves. Takua stands among the honored at the Naming Day ceremony.',
      id: 'takua_naming_day',
      section: 'Bohrok Kal',
      title: 'The Naming Day',
      unlockCondition: {
        questId: 'bohrok_kal_naming_day',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'While he should be preparing for the kolhii match, Takua is exploring the lava caves beneath Ta-Koro and stumbles upon a glowing mask unlike any he has ever seen. Jaller finds him just in time, and together they bring the mask to the surface.',
      id: 'takua_discovery_avohkii',
      section: 'Mask of Light',
      title: 'The Mask in the Lava',
      unlockCondition: {
        questId: 'mol_discovery_of_avohkii',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "During the great kolhii match at Ta-Koro, the mysterious mask tumbles from Jaller's pack and lands at Takua's feet, bathing Jaller in golden light. Turaga Nokama names it the Avohkii—the Mask of Light—and declares that Jaller must find the Seventh Toa.",
      id: 'takua_kolhii_tournament',
      section: 'Mask of Light',
      title: 'The Kolhii Tournament',
      unlockCondition: {
        questId: 'mol_kolhii_tournament',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Reluctant but bound by duty, Takua sets out with Jaller across Mata Nui, following the Avohkii's light from village to village. Everywhere they go, the shadow of Makuta follows.",
      id: 'takua_search_seventh_toa',
      section: 'Mask of Light',
      title: "The Herald's Journey",
      unlockCondition: {
        questId: 'mol_avohkii_prophecy',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'When Jaller falls protecting him from the Rahkshi, Takua finally accepts his destiny. He dons the Avohkii and is transformed into Takanuva, Toa of Light—the Seventh Toa the mask was meant for all along.',
      id: 'takua_becomes_takanuva',
      section: 'Mask of Light',
      title: 'The Seventh Toa',
      unlockCondition: {
        questId: 'mol_takanuva_rises',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Takanuva descends into Mangaia and challenges Makuta to a final contest. In the clash of light and shadow, both are consumed—and from their fusion emerges a being of twilight who opens the gate to Metru Nui, the city of legends.',
      id: 'takua_defeat_of_makuta',
      section: 'Mask of Light',
      title: 'Light Against Shadow',
      unlockCondition: {
        questId: 'mol_defeat_of_makuta',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
  [CHRONICLE_IDS.TAMARU]: [
    {
      description:
        'Tamaru is a Le-Matoran who fears heights, a difficult burden in a village built in the treetops. Yet when the Nui-Rama took his people, he found the courage to fly.',
      id: 'tamaru_afraid_heights',
      section: 'Le-Koro',
      title: 'Brave Despite Fear',
      unlockCondition: {
        questId: 'mnog_flight_to_hive',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        'Tamaru joined Kongu and Takua on the Kahu flight to the Nui-Rama hive. Overcoming his fear of heights, he helped rescue the captive Le-Matoran and Taipu.',
      id: 'tamaru_rescue_flight',
      section: 'Le-Koro',
      title: 'Flight to the Hive',
      unlockCondition: {
        questId: 'mnog_rescue_from_hive',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "When the Chronicler's Company reached a deep ravine on the path to Kini-Nui, Tamaru proposed a daring method to cross. His knowledge of Le-Wahi and his courage helped the company press onward.",
      id: 'tamaru_ravine_crossing',
      section: "Chronicler's Company",
      title: 'The Ravine Crossing',
      unlockCondition: {
        questId: 'mnog_journey_to_kini_nui_2',
        type: 'QUEST_COMPLETED',
      },
    },
    {
      description:
        "Tamaru stood with the Chronicler's Company at Kini-Nui, holding the line against Rahi while the Toa descended. His bravery—despite his fear of heights—proved that courage comes in many forms.",
      id: 'tamaru_defense_kini_nui',
      section: "Chronicler's Company",
      title: 'Defense of Kini-Nui',
      unlockCondition: {
        questId: 'mnog_kini_nui_defense',
        type: 'QUEST_COMPLETED',
      },
    },
  ],
};
