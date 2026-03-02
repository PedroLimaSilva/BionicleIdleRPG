import { Quest } from '../../types/Quests';

export const MOL_TAKANUVA_RISES_QUEST_ID = 'mol_takanuva_rises';
export const MOL_DEFEAT_OF_MAKUTA_QUEST_ID = 'mol_defeat_of_makuta';

export const MASK_OF_LIGHT_QUEST_LINE: Quest[] = [
  // ---------------------------------------------------------------------------
  // TALES OF THE MASKS
  // ---------------------------------------------------------------------------
  {
    id: 'tales_turaga_and_matoro',
    name: 'Secrets Beneath the Ice',
    description:
      'Turaga Vakama summons Matoro to the Sanctum, away from the other Matoran. He speaks of ancient secrets the Turaga have kept. He asks Matoro to translate for Nuju at a private Turaga council, where they will decide whether the time has come to reveal the truth.',
    durationSeconds: 8 * 60,
    requirements: { matoran: ['Matoro'], minLevel: 20, items: [] },
    rewards: { xpPerMatoran: 2000, currency: 3000, loot: {} },
    unlockedAfter: ['bohrok_kal_naming_day'],
    section: 'Tales of the Masks',
  },
  {
    id: 'tales_kanohi_nuva_hunt',
    name: 'Quest for the Kanohi Nuva',
    description:
      'With their powers restored and new armor, the Toa Nuva set out to find six Kanohi Nuva masks. Each Toa faces trials alone: Tahu battles through volcanic caverns, Gali dives into sunken temples, Kopaka scales impossible peaks, Lewa braves the deepwood traps of Le-Wahi, Onua navigates collapsing mine shafts, and Pohatu crosses the scorching wastelands of Po-Wahi. Their newfound strength is tested at every turn, and tensions rise as each Toa pushes ahead on their own.',
    durationSeconds: 20 * 60,
    requirements: {
      matoran: [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 21,
      items: [],
    },
    rewards: { xpPerMatoran: 2500, currency: 3500, loot: {} },
    unlockedAfter: ['tales_turaga_and_matoro'],
    section: 'Tales of the Masks',
  },

  // ---------------------------------------------------------------------------
  // MASK OF LIGHT
  // ---------------------------------------------------------------------------
  {
    id: 'mol_discovery_of_avohkii',
    name: 'The Lava Tunnels',
    description:
      'Jaller searches for Takua in Ta-Wahi before the upcoming kolhii game. He finds him crossing a river of lava to reach a stone totem. Takua removes the totem from its pedestal, triggering a booby trap that causes the ground to shake and the stepping stones to sink into the lava. Takua drops the totem into the lava, revealing a golden Kanohi hidden within. He grabs the mask, but a huge wave of lava rushes toward him. Toa Nuva Tahu surfs across the lava, grabs him, and thrusts his Magma Swords into the cliff to stop their fall. Tahu uses his Hau Nuva to shield them from a falling stream of lava. Tahu studies the golden mask briefly, tells Jaller to show it to Turaga Vakama, and surfs away. Jaller stores the mask in his backpack.',
    durationSeconds: 8 * 60,
    requirements: { matoran: ['Takua', 'Jala'], minLevel: 21, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_discovery_of_avohkii' },
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['tales_kanohi_nuva_hunt'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_kolhii_tournament',
    name: 'The Kolhii Tournament',
    description:
      "The Toa Nuva, Turaga, and villagers from Po-Koro, Ga-Koro, and Ta-Koro watch from the stands of the Ta-Koro kolhii field. The teams—Takua and Jaller, Hewkii and Hafu, and Hahli and Macku—play the match. Takua attempts a difficult move but fails spectacularly as the ball hits Vakama. Ga-Koro emerge victorious. As the three teams bow to the Turaga and Toa, the mask slips out of Jaller's bag and shines on Takua. Takua discreetly shifts the mask to shine on Jaller instead.",
    durationSeconds: 10 * 60,
    requirements: { matoran: ['Jala', 'Takua', 'Hahli', 'Huki'], minLevel: 21, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_kolhii_tournament' },
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['mol_discovery_of_avohkii'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_avohkii_prophecy',
    name: 'The Prophecy of the Seventh Toa',
    description:
      "A special meeting is held at Tahu's suva. Nokama, using her Noble Kanohi Rau, translates the inscription on the mask: it is the legendary Mask of Light, the Kanohi Avohkii, destined to be worn only by the Seventh Toa—the Toa of Light—who will free the island of Makuta's shadow. Because the Avohkii appeared to shine its light on Jaller, the Turaga designate him as the Herald of the Seventh Toa and charge him with searching for this Toa. After some persuasion from Jaller, Takua is sent along as the Chronicler. Tahu stays in Ta-Koro, Pohatu leaves for Onu-Koro to spread word, and Gali travels to Kini-Nui. After a warning from Vakama, Jaller and Takua leave Ta-Koro on Pewku, following the mask's light.",
    durationSeconds: 8 * 60,
    requirements: { matoran: ['Takua', 'Jala'], minLevel: 21, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_avohkii_prophecy' },
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['mol_kolhii_tournament'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_fall_of_ta_koro',
    name: 'The Fall of Ta-Koro',
    description:
      "While Gali meditates at Kini-Nui, she spots a new Spirit Star representing the Seventh Toa. Meanwhile, Makuta releases the Rahkshi Guurahk, Lerahk, and Panrahk. The three Rahkshi blast through Kini-Nui's floor and immediately engage Gali in battle. Overpowered, Gali flees and swims to the Mangai Volcano, arriving just before the Rahkshi. She warns the village. Tahu prepares for battle, but the Rahkshi easily defeat him and proceed to destroy Ta-Koro in search of Takua and Jaller. The village sinks into the Lake of Fire. The Toa escape safely, though Tahu receives a scar on his mask from Lerahk's staff.",
    durationSeconds: 15 * 60,
    requirements: { matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva'], minLevel: 22, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_fall_of_ta_koro' },
      xpPerMatoran: 3000,
      currency: 4500,
      loot: {},
    },
    unlockedAfter: ['mol_avohkii_prophecy'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_le_wahi_ash_bear',
    name: 'The Ash Bear',
    description:
      "Riding Pewku, Jaller and Takua make their way toward Le-Koro. In the jungles of Le-Wahi, they encounter Graalok the Ash Bear. Jaller jumps on top of the bear. Before anyone gets hurt, Toa Nuva Lewa appears and entangles the Ash Bear in vines. Lewa offers the Matoran a Gukko as a ride and leads them in flight toward Ko-Koro, where the mask's light is shining. They are forced to leave Pewku behind. Landing on a glacier, Lewa hears the Le-Koro drums and tells them that Ta-Koro has been destroyed. Jaller despairs, but Takua and Lewa dissuade him from going back. Lewa departs to rejoin his brothers.",
    durationSeconds: 10 * 60,
    requirements: { matoran: ['Takua', 'Jala'], minLevel: 22, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_le_wahi_ash_bear' },
      xpPerMatoran: 2800,
      currency: 4000,
      loot: {},
    },
    unlockedAfter: ['mol_fall_of_ta_koro'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_ko_wahi_pursuit',
    name: 'The Frozen Lake',
    description:
      'Jaller and Takua meet Toa Nuva Kopaka in a Ko-Koro snowstorm. Using his Akaku Nuva, Kopaka spots the three Rahkshi in the village. He gives Jaller his Ice Shield and pushes them down the mountain slope while he stays to fight. A hard blow knocks Kopaka unconscious. Takua crosses a frozen lake using the shield as a raft and the Mask of Light as a paddle, luring the Rahkshi away from Jaller. Kopaka recovers just in time, plunges his Ice Blades into the ice, and freezes the lake over, trapping the Rahkshi. Pewku arrives, having followed her master, and the Matoran continue their journey.',
    durationSeconds: 12 * 60,
    requirements: { matoran: ['Takua', 'Jala', 'Toa_Kopaka_Nuva'], minLevel: 22, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_ko_wahi_pursuit' },
      xpPerMatoran: 3000,
      currency: 4500,
      loot: {},
    },
    unlockedAfter: ['mol_le_wahi_ash_bear'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_onu_koro_battle',
    name: 'The Shadow in the Tunnels',
    description:
      "In the Onu-Koro Highway, Takua is separated from Jaller and comes face to face with Makuta's glowing red eyes. Makuta threatens Jaller's death and demands the mask. Takua refuses but is so frightened he abandons Jaller and the quest. Makuta releases three more Rahkshi: Vorahk, Kurahk, and Turahk. In Onu-Koro, Pohatu and Onua are announcing the discovery of the Avohkii when the new Rahkshi burst through the walls. Vorahk drains Onua's power. Turahk strikes Pohatu with fear. Takua attacks Kurahk with his kolhii stick. Tahu arrives, but Kurahk strikes him with anger, aggravating the poison from Lerahk's scar. Tahu turns on Gali. Lewa flies Takua out, telling him to warn Jaller. Onua brings the ceiling down, burying Rahkshi and Toa alike. Onu-Koro is destroyed.",
    durationSeconds: 15 * 60,
    requirements: {
      matoran: ['Takua', 'Toa_Pohatu_Nuva', 'Toa_Onua_Nuva'],
      minLevel: 22,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_onu_koro_battle' },
      xpPerMatoran: 3500,
      currency: 5000,
      loot: {},
    },
    unlockedAfter: ['mol_ko_wahi_pursuit'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_tahu_poisoned',
    name: 'Healing the Fire',
    description:
      "Tahu is chained to a stone, writhing. The poison from Lerahk's scar, aggravated by Kurahk's anger, has spread through his body. Gali instructs Lewa and Kopaka to combine their powers. The two Toa lay their weapons across Tahu's chest and activate their powers. Gali creates a sphere of water that surrounds Tahu and sinks beneath his armor, cleansing him of the poison. Exhausted, Gali collapses. Kopaka takes her to a lake to rejuvenate. Gali ponders whether the Turaga were right that the Toa are losing their unity.",
    durationSeconds: 12 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Kopaka_Nuva', 'Toa_Lewa_Nuva'],
      minLevel: 22,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_tahu_poisoned' },
      xpPerMatoran: 3500,
      currency: 5000,
      loot: {},
    },
    unlockedAfter: ['mol_onu_koro_battle'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_takua_destiny',
    name: 'Reunion',
    description:
      "Jaller, alone, attempts to scale a cliff. Slipping from a ledge, he is rescued by Takua. Reunited, the two follow the mask's light to Kini-Nui. Takua, annoyed at this end to their long journey, impatiently shakes the mask. The Kanohi releases a powerful beam of light that partially destroys a statue, revealing another statue behind it. At that moment, all six Rahkshi ambush them. The Matoran retreat toward the Amaja Circle and are relieved by the arrival of the six Toa Nuva. Tahu shields everyone with his Hau Nuva. Uniting their powers, the Toa engage the Rahkshi and defeat five of them—Guurahk, Panrahk, and Lerahk trapped in glass, Vorahk and Kurahk frozen after being showered with lava.",
    durationSeconds: 20 * 60,
    requirements: {
      matoran: [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
        'Takua',
        'Jala',
      ],
      minLevel: 23,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_takua_destiny' },
      xpPerMatoran: 4000,
      currency: 5500,
      loot: {},
    },
    unlockedAfter: ['mol_tahu_poisoned'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_battle_of_kini_nui',
    name: "Jaller's Sacrifice",
    description:
      'Turahk, unnoticed by the Toa, rises from the rubble and approaches Jaller and Takua. Striking Takua with fear, Turahk lifts his staff to kill the Matoran. Jaller grabs onto Turahk\'s staff in an attempt to stop the Rahkshi, but is continuously stricken with fear—far too much for him to handle. Turahk swings the weakened Jaller off its staff. The Toa Nuva temporarily subdue the Rahkshi. Takua hurries to his dying best friend. Jaller passes the mask to Takua, and as his heartlight fades, tells him: "You know who you are."',
    durationSeconds: 10 * 60,
    requirements: { matoran: ['Takua', 'Jala'], minLevel: 23, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_battle_of_kini_nui' },
      xpPerMatoran: 4000,
      currency: 5500,
      loot: {},
    },
    unlockedAfter: ['mol_takua_destiny'],
    section: 'Mask of Light',
  },
  {
    id: MOL_TAKANUVA_RISES_QUEST_ID,
    name: 'The Seventh Toa',
    description:
      "Takua, determined to avenge his friend, accepts his destiny and dons the Kanohi Avohkii, transforming into Takanuva, the Toa of Light. He shoots a beam of light that stuns Turahk and defeats it. He then fires a laser which completely reveals a carving of Takua's mask under the stone statue at Kini-Nui. He picks up Jaller's body and silently leaves. Later, Turaga Vakama walks up to the grieving Toa and rebukes him, saying that Mata Nui knows best. Takanuva reaffirms that his duty is clear, and vows that Jaller's sacrifice will not be in vain.",
    durationSeconds: 8 * 60,
    requirements: { matoran: ['Takua'], minLevel: 23, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_takanuva_rises' },
      xpPerMatoran: 5000,
      currency: 6000,
      evolution: { Takua: 'Takanuva' },
      loot: {},
    },
    unlockedAfter: ['mol_battle_of_kini_nui'],
    section: 'Mask of Light',
  },
  {
    id: MOL_DEFEAT_OF_MAKUTA_QUEST_ID,
    name: 'Into the Darkness',
    description:
      "Takanuva and the Toa Nuva assemble the Ussanui and place a Kraata inside. Hahli places Jaller's Hau on the vehicle for good luck. Pohatu remarks the Ussanui will not carry them all. Takanuva explains it is his destiny alone to destroy Makuta and departs. He races through the tunnels to Mangaia, flipping off the Ussanui just before it slams into the stone gate. Hahli emerges from a compartment where she secretly stowed away and becomes his Chronicler. In Mangaia, Takanuva enters a chamber with three pools of energized protodermis and a Hau-shaped gate. Makuta challenges him to a game of kolhii—the Mask of Light against Takanuva's exit. They hurl spheres of Light and Shadow. Takanuva executes the kolhii move he failed in the tournament, hitting Makuta. Makuta claims sleep spares Mata Nui pain. Takanuva grasps the Kraahkan and both fall into the protodermis. Takutanuva rises, lifts the gate, and revives Jaller. The gate crashes down. Takanuva reforms alone.",
    durationSeconds: 30 * 60,
    requirements: { matoran: ['Takanuva', 'Hahli'], minLevel: 24, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_defeat_of_makuta' },
      xpPerMatoran: 6000,
      currency: 7000,
      loot: {},
    },
    unlockedAfter: [MOL_TAKANUVA_RISES_QUEST_ID],
    section: 'Mask of Light',
  },
  {
    id: 'mol_rediscovery_of_metru_nui',
    name: 'The City of Legends',
    description:
      'Vakama picks up the Avohkii and walks toward a Three Virtues symbol on a ledge. He tells Jaller to step on the symbol representing Duty, Hahli to step on the symbol representing Unity, and places the Mask of Light on the symbol representing Destiny. As light shines through, Takanuva is revived. He activates his mask and sends a beam of light off into the Silver Sea, revealing the city of Metru Nui. Vakama narrates: "United, we embraced our duty. Light found itself and illuminated our destiny. The City of the Great Spirit, my island home, refound. New legends awake, but old lessons must be remembered. This is the way of the Bionicle."',
    durationSeconds: 12 * 60,
    requirements: { matoran: ['Takanuva', 'Hahli', 'Jala'], minLevel: 24, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_rediscovery_of_metru_nui' },
      xpPerMatoran: 4000,
      currency: 5000,
      loot: {},
    },
    unlockedAfter: [MOL_DEFEAT_OF_MAKUTA_QUEST_ID],
    section: 'Mask of Light',
  },
];
