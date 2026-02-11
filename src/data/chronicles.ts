import type { ChronicleEntry } from '../types/Chronicle';

/** Chronicle IDs - one per character whose story persists across evolutions. Use unique names only (e.g. tahu, not Toa_Tahu). */
export const CHRONICLE_IDS = {
  TAHU: 'tahu',
  GALI: 'gali',
  POHATU: 'pohatu',
  ONUA: 'onua',
  KOPAKA: 'kopaka',
  LEWA: 'lewa',
  TAKUA: 'takua',
} as const;

export type ChronicleId = (typeof CHRONICLE_IDS)[keyof typeof CHRONICLE_IDS];

/** Chronicle entries declared once per chronicle ID, reused by all forms of that character */
export const CHRONICLES_BY_ID: Record<ChronicleId, ChronicleEntry[]> = {
  [CHRONICLE_IDS.TAHU]: [
    {
      id: 'tahu_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Awakening in Fire and Ash',
      description:
        'Tahu emerges from his canister on the scorched shores of Ta-Wahi, grasping only fragments of who he was and a sense of burning purpose.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_toa_arrival',
      },
    },
    {
      id: 'tahu_first_trials',
      section: 'Arrival on Mata Nui',
      title: 'First Steps into Ta-Wahi',
      description:
        'Guided by Vakama and the villagers of Ta-Koro, Tahu tests his power against the wilds and Rahi that stalk the lava fields.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_tahu_unlock_01',
      },
    },
    {
      id: 'tahu_council_mount_ihu',
      section: 'Arrival on Mata Nui',
      title: 'Council at the Mountain',
      description:
        'Near Mount Ihu, Tahu joins the other Toa as they agree to seek the Masks of Power before daring to face Makuta himself.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_toa_council',
      },
    },
    {
      id: 'tahu_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Descent Toward the Shadow',
      description:
        'With every Kanohi gathered, Tahu leads the united Toa down beneath Kini-Nui, firelight cutting through the dark on the path to Makuta.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_kini_nui_descent',
      },
    },
  ],
  [CHRONICLE_IDS.GALI]: [
    {
      id: 'gali_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Rising from the Depths',
      description:
        'Gali awakens beneath the waves off Ga-Wahi and swims ashore, vowing to shield the seas and villages of Mata Nui.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_toa_arrival',
      },
    },
    {
      id: 'gali_guardian_ga_koro',
      section: 'Arrival on Mata Nui',
      title: 'Guardian of Ga-Koro',
      description:
        "Answering the villagers' pleas, Gali fights to save Ga-Koro and sees how deeply Makuta's corruption has seeped into the waters.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_restore_ga_koro',
      },
    },
    {
      id: 'gali_miru_and_visions',
      section: 'Arrival on Mata Nui',
      title: 'Visions in the Ravine',
      description:
        'In the canyons of Po-Wahi, Gali and Tahu battle side by side, and her brush with the Miru brings a glimpse of a power greater than any single Toa.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_gali_rescue',
      },
    },
    {
      id: 'gali_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Faith Beneath the Temple',
      description:
        'United with the others at Kini-Nui, Gali descends into the dark tunnels, trusting in Unity to carry them toward their confrontation with Makuta.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_kini_nui_descent',
      },
    },
  ],
  [CHRONICLE_IDS.POHATU]: [
    {
      id: 'pohatu_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Runner of the Wahi',
      description:
        'Pohatu awakens amid the dunes of Po-Wahi, quickly turning exploration into a sprint to protect the villages he comes to love.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_toa_arrival',
      },
    },
    {
      id: 'pohatu_cliffside_encounter',
      section: 'Arrival on Mata Nui',
      title: 'Footfalls on the Ice Cliff',
      description:
        'Chasing Rahi tracks from the desert into Ko-Wahi, Pohatu collides—literally and figuratively—with Kopaka as they uncover a mask on a perilous cliffside.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_kopaka_pohatu_icecliff',
      },
    },
    {
      id: 'pohatu_kaukau_bluff',
      section: 'Arrival on Mata Nui',
      title: 'Ascent to the Kaukau',
      description:
        'With Kopaka and Lewa, Pohatu scales the highest bluff in Po-Wahi, proving that speed and sure footing can carry the team where sheer strength cannot.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_pohatu_kaukau_bluff',
      },
    },
    {
      id: 'pohatu_nui_jaga_nest',
      section: 'Arrival on Mata Nui',
      title: 'Poison in the Nest',
      description:
        'At the Nui-Jaga nest, Pohatu finds the source of the poison that is affecting the Matoran of Po-Koro.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_nui_jaga_nest',
      },
    },
    {
      id: 'pohatu_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Stones on the Sacred Path',
      description:
        "When the path to Mangaia opens, Pohatu brings his unshakable footing and humor to steady the team as they descend toward Makuta's domain.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_kini_nui_descent',
      },
    },
  ],
  [CHRONICLE_IDS.ONUA]: [
    {
      id: 'onua_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Awakening Beneath the Earth',
      description:
        'Onua claws his way out of the underground tunnels of Onu-Wahi, already listening to the whispers of stone and soil.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_toa_arrival',
      },
    },
    {
      id: 'onua_depths_and_masks',
      section: 'Arrival on Mata Nui',
      title: 'Masks in the Deep',
      description:
        "Guided by the earth itself, Onua delves into caverns and roots out hidden Kanohi, learning how Makuta's shadow twists the tunnels below.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_onua_matatu_hau',
      },
    },
    {
      id: 'onua_jungle_rumor',
      section: 'Arrival on Mata Nui',
      title: 'The Rumor from the Canopy',
      description:
        'Hearing of Le-Matoran trapped in a Nui-Rama nest, Onua turns from his own quest to aid them, revealing the compassion beneath his quiet strength.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_onua_jungle_rumor',
      },
    },
    {
      id: 'onua_second_council',
      section: 'Arrival on Mata Nui',
      title: 'Calling the Second Council',
      description:
        'Burdened by what he has seen, Onua summons the other Toa to a second council, urging them to pursue the Masks of Power together instead of apart.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_toa_second_council',
      },
    },
    {
      id: 'onua_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Earth Beneath Kini-Nui',
      description:
        'As the Toa descend under Kini-Nui, Onua leads the way through stone and darkness, guiding the team along the hidden veins of the island toward Makuta.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_kini_nui_descent',
      },
    },
  ],
  [CHRONICLE_IDS.KOPAKA]: [
    {
      id: 'kopaka_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'Awakening in the Snow',
      description:
        'Kopaka rises alone in the frozen silence of Ko-Wahi, content to trust only his own skill against the dangers ahead.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_toa_arrival',
      },
    },
    {
      id: 'kopaka_cliffside_alliance',
      section: 'Arrival on Mata Nui',
      title: 'Paths Cross at the Cliff',
      description:
        'Investigating Rahi threats along an icy precipice, Kopaka reluctantly fights beside Pohatu, proving that even he cannot always stand alone.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_kopaka_pohatu_icecliff',
      },
    },
    {
      id: 'kopaka_rescue_matoro',
      section: 'Arrival on Mata Nui',
      title: 'Rescue in the White Silence',
      description:
        "Following faint traces in the snow, Kopaka helps Takua find Matoro, seeing how Makuta's influence reaches even the most secluded drifts.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_search_for_matoro',
      },
    },
    {
      id: 'kopaka_heat_of_insight',
      section: 'Arrival on Mata Nui',
      title: 'The Heat of Insight',
      description:
        "A searing vision during his hunt for the Pakari shakes Kopaka's certainty, hinting that Makuta's hand may already be twisting their path.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_kopaka_pakari',
      },
    },
    {
      id: 'kopaka_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Doubt in the Darkness',
      description:
        "Haunted by what he has seen, Kopaka still walks with the other Toa beneath Kini-Nui, blade drawn as they advance toward Makuta's lair.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_kini_nui_descent',
      },
    },
  ],
  [CHRONICLE_IDS.LEWA]: [
    {
      id: 'lewa_arrival_mata_nui',
      section: 'Arrival on Mata Nui',
      title: 'First Breath of the Jungle',
      description:
        'Lewa bursts from his canister into the canopies of Le-Wahi, reveling in the freedom of the wind and the song of the trees.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_toa_arrival',
      },
    },
    {
      id: 'lewa_pakari_caverns',
      section: 'Arrival on Mata Nui',
      title: 'Strength Below the Surface',
      description:
        "Diving into Onu-Wahi's caverns in search of the Pakari, Lewa learns that agility and wit are not always enough against Makuta's twisted beasts.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_lewa_pakari',
      },
    },
    {
      id: 'lewa_kakama_komau',
      section: 'Arrival on Mata Nui',
      title: 'Echoes Beneath the Lake',
      description:
        "In a shadowed subterranean lake, Lewa risks everything to claim new masks, feeling Makuta's presence stirring beneath the still water.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'maskhunt_lewa_kakama_komau',
      },
    },
    {
      id: 'lewa_nui_rama_nest',
      section: 'Arrival on Mata Nui',
      title: 'Rescue from the Hive',
      description:
        'Lewa and the Le-Matoran are trapped in a Nui-Rama nest and his mask has been replaced with an infected one. Alone, he cannot control his own body but thankfully, Onua finds him and helps him regain control.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_lewa_v_onua',
      },
    },
    {
      id: 'lewa_descent_mangaia',
      section: 'Arrival on Mata Nui',
      title: 'Wind in the Depths',
      description:
        'Even far from open sky, Lewa brings the spirit of Le-Wahi with him as the Toa descend beneath Kini-Nui toward their first true clash with Makuta.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'story_kini_nui_descent',
      },
    },
  ],
  [CHRONICLE_IDS.TAKUA]: [
    {
      id: 'takua_summon_the_toa',
      section: "Chronicler's Duty",
      title: 'A call for help',
      description:
        'After being banished from Ta-Koro, Takua is tasked by Turaga Vakama to find a way to summon the Toa. The time of prophecy is upon us.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_find_canister_beach',
      },
    },
    {
      id: 'takua_canister_on_shore',
      section: "Chronicler's Duty",
      title: 'The Canister on the Shore',
      description:
        'On the black sands of Ta-Wahi, Takua discovers a strange canister washed ashore, its trail of molten footprints leading into the jungle.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_find_canister_beach',
      },
    },
    {
      id: 'takua_chroniclers_company',
      section: "Chronicler's Duty",
      title: 'Summoning the Company',
      description:
        'Entrusted by Turaga Nuju, Takua travels across Mata Nui to gather a band of brave Matoran who will stand with him at Kini-Nui.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_summon_chroniclers_company',
      },
    },
    {
      id: 'takua_defense_kini_nui',
      section: "Chronicler's Duty",
      title: 'Defense of Kini-Nui',
      description:
        "While the Toa descend into darkness, Takua and his companions hold the line at the great temple, facing wave after wave of Rahi in Makuta's last assault.",
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_kini_nui_defense',
      },
    },
    {
      id: 'takua_witness_makuta_battle',
      section: "Chronicler's Duty",
      title: 'Witness the Battle',
      description:
        'Takua is summoned by Gali to witness the battle between the Toa and Makuta. As Makuta is defeated and the Toa return to the surface, Takua finds an ominous chamber holding an even bigger threat.',
      unlockCondition: {
        type: 'QUEST_COMPLETED',
        questId: 'mnog_gali_call',
      },
    },
  ],
};
