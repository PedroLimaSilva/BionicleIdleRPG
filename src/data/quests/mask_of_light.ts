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
      'Jaller searches for Takua, who has gone missing before the big Kolhii championship. He finds him in a lava runoff tunnel beneath the Wall of History, surfing across an active lava flow on a lava board with Pewku. Takua discovers a strange stone totem with an unfamiliar symbol, but an earthquake strikes. The totem falls into the lava—and from beneath the molten rock, a mask of brilliant golden light rises to the surface. Tahu Nuva arrives just in time to shield them from the erupting lava with his Hau Nuva. Together, Jaller and Takua barely escape the tunnels and rush to the Kolhii field, where three teams are waiting.',
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
      'The Kolhii match concludes with Hahli scoring the winning goal for Ga-Koro. During the celebrations, the glowing mask tumbles from Takua\'s pack onto the field. Its light shines directly on Takua. Turaga Nokama reads the ancient inscription: "Among those assembled, a great spirit shall be revealed." But Takua, overwhelmed, lifts the mask on his Kolhii stick and tilts it toward Jaller—"I think it was pointing at him." Vakama names Jaller the Herald of the Seventh Toa and commands him to follow the mask\'s light across the island.',
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
      'Jaller gives his Hau mask to Hahli for safekeeping and departs Ta-Koro with Takua and Pewku. The Avohkii casts a beam of light toward Le-Wahi. In the jungle they encounter a Graalok ash bear—a territorial Rahi that nearly kills them both. Tahu and Lewa arrive separately, each claiming the rescue. Their argument over whether to help or continue the mask hunt almost costs Takua and Jaller their lives. Lewa calms the ash bear while Tahu storms off, dismissing the quest as a waste of time.',
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
      'Deep in Mangaia, Makuta senses the Avohkii. He drops three kraata slugs into vats of energized protodermis, birthing the Rahkshi—Guurahk, Lerahk, and Panrahk. They erupt from beneath Kini-Nui, shattering the Suva dome. Gali Nuva, meditating there, barely escapes their combined attack and flees to warn Ta-Koro. The Rahkshi cross the Lake of Fire and assault the village. Panrahk blasts through the gates. Tahu Nuva fights desperately but the Rahkshi tear through the walls searching for the Avohkii. Guurahk disintegrates the central supports. Ta-Koro groans, splits apart, and sinks into the molten lake. The Matoran escape, but their home is gone.',
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
    name: 'The Frozen Lake',
    description:
      'The Avohkii leads Takua and Jaller to Ko-Wahi, where they find Kopaka Nuva at a frozen lake. Three more Rahkshi—Vorahk, Kurahk, and Turahk—join the hunt. They attack at the lake, shattering the ice. Takua falls through into the freezing water. Kopaka shields the Matoran and fights alone against overwhelming odds, badly injured. He manages to freeze the surface, trapping the Rahkshi temporarily, and pulls Takua from the water. But the Toa of Ice is left weakened, and the Rahkshi will not stay frozen long.',
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
    name: "Lerahk's Poison",
    description:
      "Enraged by the fall of Ta-Koro, Tahu Nuva pursues the Rahkshi alone, ignoring the warnings of his brothers. In a confrontation, Lerahk's staff scratches him—a small wound, but the kraata poison seeps in. Shadow corruption spreads through his body, darkening his armor and twisting his mind. He attacks his own brothers in a blind fury. Lewa pins him with wind, and Kopaka and Gali work together—ice to freeze the poison, water to wash it clean. The corruption shatters. Tahu is saved, but shaken by how easily Makuta's shadow turned him against those he loved.",
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
      'Everywhere Takua carries the Avohkii, the Rahkshi follow, and people suffer. Ta-Koro is destroyed. Onu-Koro tunnels are collapsed. Ko-Wahi is scarred. Takua is convinced the mask chose wrong—he is no hero, just a wanderer who brings trouble. He removes the Avohkii and sets it down, ready to walk away. Jaller confronts him, furious: he reminds Takua of every time he ran toward danger, not away from it. He reminds him that duty is not about being fearless—it is about being afraid and doing what is right anyway.',
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
      'All six Rahkshi converge on Kini-Nui. The Toa Nuva make their stand. The battle is savage—Pohatu and Onua shatter Panrahk. Lewa and Kopaka bring down Guurahk. Gali drowns Lerahk. Tahu faces Vorahk and Kurahk, his flames burning hotter than ever before. But Turahk—the Rahkshi of Fear—slips past the Toa and targets Takua with a blast of pure terror. Jaller sees it. He throws himself between Takua and the blast. The fear-energy strikes the Captain of the Guard full in the chest. He falls. In Takua\'s arms, Jaller whispers his last words: "You know who you are. You were always different."',
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
      'Grief-stricken, Takua cradles his fallen friend. The Avohkii lies beside them, its light steady and patient, as it has been all along. Takua finally understands what Jaller saw from the beginning: the mask was never searching for someone else. He lifts the Avohkii and places it over his own face. Light explodes outward. His body grows, his armor reshapes into gold and white, his heartlight blazes with the brilliance of a star. Where a Matoran knelt, a Toa now stands. He is Takanuva—the Toa of Light. He turns on Turahk and annihilates it with a single blast of pure radiance.',
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
      "From the shattered shells of the Rahkshi, Takanuva constructs the Ussanui—a vehicle powered by kraata. He rides it down through Kini-Nui into Mangaia. Hahli follows as the new Chronicler. In the deepest cavern, Makuta waits. Instead of open combat, the Master of Shadows proposes a game of Kolhii—light against shadow—for the right to open the gate. They play on stone pillars above a pool of energized protodermis, hurling balls of light and shadow energy. In the final exchange, Takanuva tackles Makuta and both plunge into the protodermis. From the pool rises Takutanuva—a being of fused light and shadow. With its combined strength, it lifts the ancient gate and pours life-energy into Jaller's mask, reviving the fallen Captain. The gate crashes down, expelling Makuta's darkness. Takanuva reforms alone. The way below is open.",
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
