import { Quest } from '../../types/Quests';

// Mask of Light arc quest IDs
export const MOL_TAKANUVA_RISES_QUEST_ID = 'mol_takanuva_rises';
export const MOL_DEFEAT_OF_MAKUTA_QUEST_ID = 'mol_defeat_of_makuta';

// Tales of the Masks (brief transitional arc) + Mask of Light story line.
// Covers: Turaga hint at their hidden past, the Toa Nuva collect Kanohi Nuva,
// the Kolhii tournament, discovery of the Avohkii, the Rahkshi attacks,
// Jaller's sacrifice, Takua becoming Takanuva, the defeat of Makuta,
// and the rediscovery of Metru Nui.
export const MASK_OF_LIGHT_QUEST_LINE: Quest[] = [
  // ---------------------------------------------------------------------------
  // TALES OF THE MASKS – brief transitional arc
  // ---------------------------------------------------------------------------
  {
    id: 'tales_turaga_and_matoro',
    name: 'Secrets Beneath the Ice',
    description:
      'Turaga Vakama summons Matoro to the Sanctum, away from the other Matoran. He speaks of ancient secrets the Turaga have kept. He asks Matoro to translate for Nuju at a private Turaga council, where they will decide whether the time has come to reveal the truth.',
    durationSeconds: 8 * 60,
    requirements: {
      matoran: ['Matoro'],
      minLevel: 20,
      items: [],
    },
    rewards: {
      xpPerMatoran: 2000,
      currency: 3000,
      loot: {},
    },
    unlockedAfter: ['bohrok_kal_naming_day'],
    section: 'Tales of the Masks',
  },
  {
    id: 'tales_kanohi_nuva_hunt',
    name: 'Quest for the Kanohi Nuva',
    description:
      'With new powers and new armor, the Toa Nuva set out to find six Kanohi Nuva masks—the most powerful masks on the island. Each Toa faces trials alone: Tahu battles through volcanic caverns, Gali dives into sunken temples, Kopaka scales impossible peaks, Lewa braves the deepwood traps of Le-Wahi, Onua navigates collapsing mine shafts, and Pohatu crosses the scorching wastelands of Po-Wahi. Their newfound strength is tested at every turn, and tensions rise as each Toa pushes ahead on their own.',
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
    rewards: {
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['tales_turaga_and_matoro'],
    section: 'Tales of the Masks',
  },

  // ---------------------------------------------------------------------------
  // MASK OF LIGHT – main story arc
  // ---------------------------------------------------------------------------
  {
    id: 'mol_kolhii_tournament',
    name: 'The Kolhii Tournament',
    description:
      "Peace has returned to Mata Nui. To celebrate, a great Kolhii tournament is held in Ta-Koro, with teams from every village competing. Ga-Koro fields its newest team—Hahli and Macku—against Po-Koro champions Hewkii and Hafu, and Ta-Koro's own Jaller and Takua.",
    durationSeconds: 10 * 60,
    requirements: {
      matoran: ['Jala', 'Takua', 'Hahli', 'Huki'],
      minLevel: 21,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_kolhii_tournament' },
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['tales_kanohi_nuva_hunt'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_avohkii_discovery',
    name: 'The Mask of Light',
    description:
      'After the tournament, Takua discovers a glowing mask buried in a lava flow. Turaga Vakama identifies it as the Avohkii—the legendary Mask of Light. According to prophecy, it will be worn by a seventh Toa who will defeat the darkness. The mask shines its light on Takua, marking him as the herald who must find this Toa.',
    durationSeconds: 8 * 60,
    requirements: {
      matoran: ['Takua', 'Jala'],
      minLevel: 21,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_avohkii_discovery' },
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['mol_kolhii_tournament'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_herald_journey',
    name: "The Herald's Journey",
    description:
      'Jaller insists on accompanying Takua on his quest to find the seventh Toa. Together with Pewku the Ussal crab, they set out across Mata Nui, following the light of the Avohkii. But Takua is uneasy—he fears the mask has chosen the wrong Matoran.',
    durationSeconds: 10 * 60,
    requirements: {
      matoran: ['Takua', 'Jala'],
      minLevel: 21,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_herald_journey' },
      xpPerMatoran: 2800,
      currency: 4000,
      loot: {},
    },
    unlockedAfter: ['mol_avohkii_discovery'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_rahkshi_attack_ta_koro',
    name: 'The Fall of Ta-Koro',
    description:
      "Makuta senses the discovery of the Avohkii and unleashes three Rahkshi—Turahk, Guurahk, and Lerahk—to seize the mask and destroy its herald. The creatures strike Ta-Koro with devastating force. Despite the Toa Nuva's defense, the Rahkshi tear through the village. The lava walls collapse, and Ta-Koro sinks into the molten lake.",
    durationSeconds: 15 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Jala'],
      minLevel: 22,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_rahkshi_attack_ta_koro' },
      xpPerMatoran: 3000,
      currency: 4500,
      loot: {},
    },
    unlockedAfter: ['mol_herald_journey'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_ko_wahi_ambush',
    name: 'Ambush in the Drifts',
    description:
      "Takua and Jaller follow the Avohkii's light into the frozen wastes of Ko-Wahi. The Rahkshi track them there. In the blinding snow, Rahkshi Turahk and Panrahk corner the two Matoran on a crumbling ice bridge. Kopaka Nuva arrives just in time, shielding them with walls of ice.",
    durationSeconds: 12 * 60,
    requirements: {
      matoran: ['Takua', 'Jala', 'Toa_Kopaka_Nuva'],
      minLevel: 22,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_ko_wahi_ambush' },
      xpPerMatoran: 3000,
      currency: 4500,
      loot: {},
    },
    unlockedAfter: ['mol_rahkshi_attack_ta_koro'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_tahu_poisoned',
    name: "Tahu's Poison",
    description:
      "While the Toa Nuva battle the Rahkshi across the island, Lerahk's poison blade strikes Tahu Nuva. The venom of shadow spreads through him, twisting his thoughts and turning him against his brothers. Only Kopaka and Gali, working together, can freeze and purge the corruption before it consumes him entirely.",
    durationSeconds: 15 * 60,
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
    unlockedAfter: ['mol_ko_wahi_ambush'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_takua_destiny',
    name: 'Flight from Destiny',
    description:
      "The weight of the quest crushes Takua. Everywhere he goes, the Rahkshi follow, and people suffer. Convinced the mask chose wrong, he tries to abandon the Avohkii. Jaller, furious and afraid, confronts him—reminding him that running from your destiny doesn't make it go away.",
    durationSeconds: 10 * 60,
    requirements: {
      matoran: ['Takua', 'Jala'],
      minLevel: 22,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_takua_destiny' },
      xpPerMatoran: 3000,
      currency: 4000,
      loot: {},
    },
    unlockedAfter: ['mol_tahu_poisoned'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_battle_of_kini_nui',
    name: 'Battle at Kini-Nui',
    description:
      "Makuta sends all six Rahkshi to Kini-Nui for a final assault. The Toa Nuva engage them in a desperate battle. In the chaos, Turahk targets Takua with a blast of pure fear. Jaller throws himself in front of the attack—and falls. His sacrifice shatters Takua's doubt forever.",
    durationSeconds: 25 * 60,
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
      'Holding his fallen friend, Takua finally understands. The Avohkii was never meant for someone else—it was always meant for him. He places the Mask of Light on his face and is transformed by its power into Takanuva, the Toa of Light.',
    durationSeconds: 8 * 60,
    requirements: {
      matoran: ['Takua'],
      minLevel: 23,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_takanuva_rises' },
      xpPerMatoran: 5000,
      currency: 6000,
      evolution: {
        Takua: 'Takanuva',
      },
      loot: {},
    },
    unlockedAfter: ['mol_battle_of_kini_nui'],
    section: 'Mask of Light',
  },
  {
    id: MOL_DEFEAT_OF_MAKUTA_QUEST_ID,
    name: 'Into the Darkness',
    description:
      "Takanuva builds the Ussanui—a vehicle forged from Rahkshi parts—and descends alone into Mangaia, Makuta's lair. Hahli follows as the new Chronicler. In the heart of darkness, Takanuva challenges Makuta to a game of Kolhii: light against shadow, with the fate of Mata Nui as the prize.",
    durationSeconds: 30 * 60,
    requirements: {
      matoran: ['Takanuva', 'Hahli'],
      minLevel: 24,
      items: [],
    },
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
      "The gate to the world below stands open. Beyond it lies something none of the Matoran expected—a vast underground city, silent and waiting. Turaga Vakama steps forward and, at last, speaks the name the Turaga have hidden for so long: Metru Nui. The city where they all once lived, before Makuta's betrayal brought them to the island above.",
    durationSeconds: 12 * 60,
    requirements: {
      matoran: ['Takanuva', 'Hahli', 'Jala'],
      minLevel: 24,
      items: [],
    },
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
