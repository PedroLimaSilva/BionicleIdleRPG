import type { VisualNovelCutscene } from '../../types/Cutscenes';

/** Helper: create a cutscene with a single video step (replaces legacy YouTube-only cutscenes) */
function videoOnly(id: string, videoId: string): VisualNovelCutscene {
  return {
    id,
    background: { type: 'gradient', from: '#0a0a0a', to: '#1a1a1a' },
    steps: [{ type: 'video', videoId }],
  };
}

/**
 * Registry of visual novel cutscenes by ID.
 * Add new cutscenes here and reference them in quest rewards via
 * cutscene: { type: 'visual_novel', cutsceneId: 'your_id' }
 *
 * Steps can mix dialogue and video - use { type: 'video', videoId } for YouTube embeds.
 */
export const VISUAL_NOVEL_CUTSCENES: Record<string, VisualNovelCutscene> = {
  // Video-only cutscenes (converted from legacy YouTube refs)
  story_kini_nui_descent: videoOnly('story_kini_nui_descent', 'oken0zw1D-U'),
  mnog_po_koro_cave_investigation: videoOnly('mnog_po_koro_cave_investigation', 'EZdYj1GQR4s'),
  mnog_enter_le_wahi: {
    id: 'mnog_enter_le_wahi',
    background: { type: 'gradient', from: '#2d5a1e', to: '#0a1a00' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `Look at all these trees! I've never seen so much green! Onu-Koro is nothing like this!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Stay close, Taipu. The Le-Matoran say there are dangerous Rahi in these jungles.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `Don't worry! I am very strong. Nothing can—`,
      },
      {
        type: 'narration',
        text: `A massive Nui-Rama dives from the canopy. Before Takua can react, the insect snatches Taipu in its claws and rockets upward through the trees.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `TAKUAAAA!!!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `TAIPU! No! I have to find Le-Koro—someone there will know how to help!`,
      },
      { type: 'video', videoId: 'vM0lWqZ9uD4' },
    ],
  },
  mnog_flight_to_hive: {
    id: 'mnog_flight_to_hive',
    background: { type: 'gradient', from: '#2d5a1e', to: '#1a3a1a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Tamaru',
        portraitType: 'avatar',
        position: 'left',
        text: `Groundwalker! You made it! We feared the Rama had taken you too.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `They took my friend Taipu! What happened here? Where is everyone?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Tamaru',
        portraitType: 'avatar',
        position: 'left',
        text: `The Nui-Rama have been swarming for weeks. They took Turaga Matau and most of Le-Koro. In last rainfall, Kongu on patrol saw the Rama-hive growing topleaf-high, far in the dark forest.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kongu',
        portraitType: 'avatar',
        position: 'right',
        text: `I am Kongu, Captain of the Gukko Force—what's left of it. We have Kahu birds readied for a rescue flight, but we haven't had the numbers for a mission. Until now.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I'll go. Taipu is in there—and your people too. Let's fly.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Tamaru',
        portraitType: 'avatar',
        position: 'left',
        text: `I... I cannot fly. I was never strong enough for the Gukko Force. But I will not let that stop me. I'm coming too.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kongu',
        portraitType: 'avatar',
        position: 'right',
        text: `Then mount up, both of you. This will be a rough ride.`,
      },
      { type: 'video', videoId: '3feiWoDhKzo' },
    ],
  },
  mnog_rescue_from_hive: {
    id: 'mnog_rescue_from_hive',
    background: { type: 'gradient', from: '#3a2a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Kongu',
        portraitType: 'avatar',
        position: 'right',
        text: `The Kahu won't go any further—something in the hive is repelling them! We'll have to continue on foot!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Tamaru',
        portraitType: 'avatar',
        position: 'left',
        text: `The buzzing... it's everywhere. I can feel it in my mask.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `There—deeper in! I can see cells... and Matoran inside them!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Tamaru',
        portraitType: 'avatar',
        position: 'left',
        text: `Those are our villagers! And look—there's Taipu! He's still alive!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Let's get them out. Quietly—before the Nui-Rama notice us.`,
      },
      { type: 'video', videoId: 'dsSugRBjusI' },
    ],
  },
  mnog_lewa_v_onua: {
    id: 'mnog_lewa_v_onua',
    background: { type: 'gradient', from: '#3a2a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua! You came for me! I knew you would!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Of course, Taipu. Are you hurt?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `They made me carry things. Heavy things! But I am strong, so it was okay. But we can't get out—the Nui-Rama have sealed every tunnel.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kongu',
        portraitType: 'avatar',
        position: 'right',
        text: `We're trapped. The Kahu are gone and every exit is swarming with Rama. We need a miracle.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Tamaru',
        portraitType: 'avatar',
        position: 'left',
        text: `Wait—listen! Something is happening above us... fighting! I can hear it—wind and earth clashing!`,
      },
      {
        type: 'narration',
        text: `The ceiling of the hive shudders. Chunks of resin crack and fall as two massive figures battle above—Toa Lewa, possessed by an infected mask, and Toa Onua, who has come to free him.`,
      },
      { type: 'video', videoId: 'tggBKXjwPow' },
    ],
  },
  mnog_search_for_matoro: videoOnly('mnog_search_for_matoro', 'vp9RVeTHNfA'),
  mnog_journey_to_kini_nui_1: videoOnly('mnog_journey_to_kini_nui_1', 'HJI0snTJetM'),
  mnog_journey_to_kini_nui_2: videoOnly('mnog_journey_to_kini_nui_2', 'gx8dUv8I3-Y'),
  mnog_journey_to_kini_nui_3: videoOnly('mnog_journey_to_kini_nui_3', 'qXCfYwpGBqY'),
  mnog_journey_to_kini_nui_4: videoOnly('mnog_journey_to_kini_nui_4', 'lts_AXCvj60'),
  mnog_kini_nui_arrival: videoOnly('mnog_kini_nui_arrival', 'xfM3OOL7NJU'),
  mnog_kini_nui_defense: videoOnly('mnog_kini_nui_defense', 'ISmkk9Vg8IM'),
  mnog_gali_call: videoOnly('mnog_gali_call', 'In1jZ3pZE9k'),
  mnog_witness_makuta_battle: videoOnly('mnog_witness_makuta_battle', 'kQbHb3eNzzs'),
  mnog_return_to_shore: videoOnly('mnog_return_to_shore', 'h0KeJl6i7Ns'),

  story_toa_arrival: {
    id: 'story_toa_arrival',
    background: {
      type: 'gradient',
      from: '#1a3a4a',
      to: '#0d1f2d',
    },
    steps: [
      {
        type: 'video',
        videoId: 'Zu5KdOB1D3M',
      },
      {
        type: 'video',
        videoId: 'UI8EUiBfksU',
      },
    ],
  },
  maskhunt_kopaka_matoro_icecliff: {
    id: 'maskhunt_kopaka_matoro_icecliff',
    background: {
      type: 'gradient',
      from: '#1a3a4a',
      to: '#e3e3ff',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          I have slept for so long, I can only rememeber my name.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          I am Kopaka.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          My mask let's me see through the ice. And I see I am not alone.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Come out, little one, before you catch a chill.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Who are you, and why were you spying on me?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Matoro',
        portraitType: 'avatar',
        position: 'left',
        text: `
          I... I am Matoro, a matoran. I saw you come ashore and assemble yourself. We've been waiting for you.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          "We"? Who's "we"?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Matoro',
        portraitType: 'avatar',
        position: 'left',
        text: `
          All of us here, on Mata Nui have been waiting for you. You and the other Toa.
          Now you need to find the masks of power!
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          What others? What masks? Where are they?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Matoro',
        portraitType: 'avatar',
        position: 'left',
        text: `
          The masks are hidden all over Mata Nui. Turaga Nuju will know more.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Take me to this Turaga Nuju.
        `,
      },
      {
        type: 'narration',
        text: `
          Matoro leads Toa Kopaka to Turaga Nuju.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Matoro',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Turaga Nuju! He's come! This is Toa Kopaka!
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Nuju',
        portraitType: 'avatar',
        position: 'left',
        text: `
          *click* *whistle* *peep*
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Is he cross-wired?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Matoro',
        portraitType: 'avatar',
        position: 'right',
        text: `
          No, this is how he communicates. I'm his translator. He welcomes you, Toa Kopaka.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Pardon me Turaga. Can you help me with my quest?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Matoro',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Turaga Nuju says that you are powerful as Toa of Ice, but your power alone is not enough to defeat Makuta. You need to find the masks of power scattered all over Mata Nui.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Matoro',
        portraitType: 'avatar',
        position: 'right',
        text: `
          And even with the masks, you will need to find the other Toa and work with them to defeat Makuta.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Where can I begin looking for the masks?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Matoro',
        portraitType: 'avatar',
        position: 'right',
        text: `
          You'll find a mask in the Place of Far-Seeing.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Thank you Turaga Nuju. I will go now.
        `,
      },
    ],
  },
  maskhunt_kopaka_pohatu_icecliff: {
    id: 'maskhunt_kopaka_pohatu_icecliff',
    background: {
      type: 'gradient',
      from: '#1a3a4a',
      to: '#e3e3ff',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          The sky has darkened. And though I sense no storm rising, I hear the rumble of thunder...
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          *RUMBLE* WHATCH OUT!!! *CRASH*
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          Sorry about that! I was practicing. Are you all right?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          I would be, if you weren't standing on me.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          I'm sorry. Let me help you out of this rubble.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          No need, I can do it myself.
        `,
      },
      {
        type: 'narration',
        text: `
          Focusing his energy, Toa Kopaka channeled it through his Ice Blade. A thrill ran through him as the rock around him froze solid, becoming brittle and glassy. Bringing the blade down, he smashed the icy boulder into smithereens, freeing himself.
        `,
      },
      {
        type: 'narration',
        text: `
          Kopaka stood up and turned around to continue his quest, alone.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          Hey! Wait! Are you a Toa? I've been looking for you - I am Pohatu, Toa of Stone.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Kopaka... Ice. And if you don't mind, I'm in the middle of something. See you later.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `
           Wait! Listen, I have a feeling we're both here for the same reason. Why not team up? It might make things easier.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          I work alone.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          By choice? Or just because no one can stand you?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          All right, come along. After all, I might need a mountain moved - or the island lifted.
        `,
      },
      {
        type: 'narration',
        text: `
          Toa Kopaka and Toa Pohatu reach the peak of the mountain.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          This place is Far-Seeing, alright! There's the mask of power! Go ahead - claim your prize, brother.
        `,
      },
      {
        type: 'narration',
        text: `
          Kopaka picked up the mask and placed it over his own. Immediately, he felt the Power of the mask of Shielding flow through him, like a cushion protecting him.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          I can feel the power of the mask of shielding, but the powers of the Mask of Vision are still mine to use..
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          We have company, let's go.
        `,
      },
    ],
  },
  story_toa_council: {
    id: 'story_toa_council',
    background: { type: 'gradient', to: '#0a0a0a', from: '#5b3e0b' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Mind if we join the party?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          I am Tahu, Toa of Fire. Who are you?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'right',
        text: `
          I'm Pohatu, Toa of Stone. My talkative friend there is the Ice Toa, Kopaka.
        `,
      },
      {
        type: 'narration',
        text: `
          Introductions are made and the Toa share stories of their journeys. Kopaka stays silent, listening to the others.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          (This Fire Toa is full of hot air. Will he be prepared for the heat of battle, or will he burn out quickly?)
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          (Onua, the Toa of Earth. He speaks less than the others. Does that subdued exterior hide a busy mind, or an empty one?)
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          (Lewa, the Toa of Air. So much energy. But it blows out of him uncontrolled, in all directions, like the wind. Not exactly someone I'd want to trust my life to in a tough spot)
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          (Pohatu, the Toa of Stone. He was so quick to trust me, a stranger. I'm not sure I can trust him back.)
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          (Gali, the Toa of Water. That one I cant read. She's looking at me like she sees right through me. But that's not possible, right?)
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'left',
        text: `
          Well, brothers, I suppose that's enough talk of the past. We should start discussing what comes next, yes? For despite all the interesting elemental powers we may have, I expect that our best weapon is our minds.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          You're right, Gali, we need to find these masks we seek, as quickly as possible. The Turaga of my village told me they will give us great powers. I know my own mask gives me the powers of protection or shielding...
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'right',
        text: `
          That's right! Brother Kopaka has found a Mask of Shielding, too.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'right',
        text: `
          Yes... Well, there are five more masks out there for each of us.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          (Is Tahu upset he wasn't the first to find a mask? That pleases me.)
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `
          According to my Turaga, the masks are hidden all over the island and Makuta has set his Rahi creatures to guard them. So our quest won't be easy.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          Fine, fine. Anyway, the important thing is to find them - fast. We'll split into smaller groups. Gali and Lewa, you can search the jungle and beaches together. Onua and Kopaka can check the caves of Onu-Wahi. And Pohatu, you can come with –
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'left',
        text: `
          Hold on a quicksecond, brother Tahu. If speed is what we're after, why bother with the pairmaking? Why not each of us journeysearch on our own?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `
          Our fiery brother has a good plan. Working in pairs makes sense. It strikes a balance between speed and caution.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'left',
        text: `
          Brothers, we have been brought together for a reason. I think we ought to stick together, at least until we know exactly what we're up against.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'right',
        text: `
          She's right. Trust me, these Rahi creatures are nothing to face alone. But if we travel together they should give us little trouble. Right, Kopaka?
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `
          I can't agree, Toa of Stone. We should split up. As I already told you, I prefer to work alone.
        `,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `
          Enough of this bickering, we will accomplish nothing by standing here and having a debate. The decision is made - we split into small groups. It's the best of both worlds, can't you see that?
        `,
      },
      {
        type: 'narration',
        text: `
          Because of all the arguing, each Toa eventually goes their own way.
        `,
      },
    ],
  },
  mnog_canister_beach: {
    id: 'mnog_canister_beach',
    background: {
      type: 'gradient',
      from: '#1a3a4a',
      to: '#0d1f2d',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          What is that? A large canister... washed ashore.
          And those footprints... they lead toward Ta-Wahi.
        `,
        position: 'left',
      },
      {
        type: 'video',
        videoId: 'u0DYYVupuGQ',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          Who was that? I don't recognize that Matoran,
          maybe someone in Ta-Koro knows what is going on.
        `,
        position: 'left',
      },
    ],
  },
  mnog_takua_meets_kapura: {
    id: 'mnog_takua_meets_kapura',
    background: { type: 'gradient', to: '#0a0a0a', from: '#e31a1a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          Are you lost?
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Kapura',
        portraitType: 'avatar',
        text: `
          I am Kapura.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Kapura',
        portraitType: 'avatar',
        text: `
          Are you the Makuta?
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          *Notices that Kapura is walking really slowly,
          so slowly that, from a distance, he looked like we
          was standing still*
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          What is the Makuta?
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Kapura',
        portraitType: 'avatar',
        text: `
          If you don't know what the Makuta is,
          then you are probably not it.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Kapura',
        portraitType: 'avatar',
        text: `
          That is good.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Kapura',
        portraitType: 'avatar',
        text: `
          Jala says I have to be careful of the Makuta when I am in the forest.
          He says the Makuta is everywhere. He means Rahi. Monsters.
          Things you can see. But I know the Makuta is here now,
          in these burnt trees, and in the dead soil.
          All of these things were destroyed by the Makuta,
          but the Makuta never left them. That is how he becomes strong.
          That is what the Makuta does. He destroys things.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          What are you doing?
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Kapura',
        portraitType: 'avatar',
        text: `
          I am practicing.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Kapura',
        portraitType: 'avatar',
        text: `
          Turaga Vakama says that even though I am slow,
          I may be faster than all the others, and travel very far.
          He says I must practice. Jala says I am being silly.
          I practice often.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          Where am I? I am lost.
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Kapura',
        portraitType: 'avatar',
        text: `
          You are where you are.
          If I practice, I can be where I am not. I think I can feel it.
          It is hot here where I am, but where I am not is cold,
          and I think I can feel it. I must practice more.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          Ok, take care.
        `,
        position: 'right',
      },
    ],
  },
  mnog_tahu_unlock_01: {
    id: 'mnog_tahu_unlock_01',
    background: { type: 'gradient', to: '#0a0a0a', from: '#5b3e0b' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        text: `
          Greetings Takua, you've come back at an eventful time.
          The Toa have come, and I found Tahu in the forest just a
          few moments ago.
        `,
        position: 'left',
      },
      {
        type: 'video',
        videoId: 'Cn5jxci0RiQ',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          Tahu? Who is he?
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        text: `
          He is the protector of Ta-Koro, our village.
          He is speaking with Turaga Vakama right now.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        text: `
          In the meantime, I've received a distress call from Ga-Koro,
          but I cannot send anyone to help, as we are dealing with rahi
          attacks in Ta-Wahi too.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          I can go help them.
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        text: `
          Thank you Takua, safe travels.
        `,
        position: 'left',
      },
    ],
  },
  mnog_ga_koro_sos: {
    id: 'mnog_ga_koro_sos',
    background: {
      type: 'gradient',
      from: '#0d2847',
      to: '#051a2e',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Maku',
        portraitType: 'avatar',
        text: `
          Takua! Ga-Koro is under attack!
          A Rahi has trapped our people in a hut and sunk it!
        `,
        position: 'left',
      },
      {
        type: 'video',
        videoId: 'qRVxnc26NDI',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          Jala sent me. I will help. Tell me what I need to do.
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Maku',
        portraitType: 'avatar',
        text: "Come with me, I'll sail us there.",
        position: 'left',
      },
    ],
  },
  mnog_restore_ga_koro: {
    id: 'mnog_restore_ga_koro',
    background: {
      type: 'gradient',
      from: '#0d2847',
      to: '#051a2e',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          I see a collapsed hut under the water.
          I can see people trapped inside.
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Hahli',
        portraitType: 'avatar',
        text: `
          Help us! There is a water pump that can raise the hut again!
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          I see it! *click*
        `,
        position: 'right',
      },
      {
        type: 'video',
        videoId: 'Fud_TgE_GTs',
      },
    ],
  },
  mnog_po_wahi_desert: {
    id: 'mnog_po_wahi_desert',
    background: {
      type: 'gradient',
      from: '#2c84e9',
      to: '#ffe28e',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          I see a stone carver at that fork in the road.
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Hafu',
        portraitType: 'avatar',
        text: `
          Another Hafu original... *gestures toward his work*
          Wow... Sometimes I impress myself! Can you guess what it is yet?
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          No.
        `,
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Hafu',
        portraitType: 'avatar',
        text: `
          *sigh* If you’re looking for Po-Koro, traveler,
          take the right road. My right. Or is it your right?
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          Thank you.
        `,
        position: 'right',
      },
    ],
  },
  mnog_po_koro_sickness: {
    id: 'mnog_po_koro_sickness',
    background: {
      type: 'gradient',
      from: '#2c84e9',
      to: '#ffe28e',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Ahkmou',
        portraitType: 'avatar',
        text: `
          Hello, stranger!
          Are you looking for a good Koli ball?
          Let me recommend the Comet, our most popular model.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          What is a Koli ball?
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Ahkmou',
        portraitType: 'avatar',
        text: `
          Why, Koli balls are for playing Koli, of course!
          You’d want a Comet - our most popular model.
          Trading for two Husi Pecking Birds, or the equivalent.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          Where do you get your Koli balls?
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Ahkmou',
        portraitType: 'avatar',
        text: `
          Well, now, that’s privileged information, my friend.
          Let’s just say I have a secret source...
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          I don't have anything to trade.
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Ahkmou',
        portraitType: 'avatar',
        text: `
          Come back anytime… Our Comet balls are the best in Mata Nui.
          Everyone wants one!
          Don’t be the only Matoran in Po-Koro without a Comet!
        `,
        position: 'left',
      },
    ],
  },
  mnog_recruit_hewkii: {
    id: 'mnog_recruit_hewkii',
    background: {
      type: 'gradient',
      from: '#2c84e9',
      to: '#ffe28e',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Huki',
        portraitType: 'avatar',
        text: `
          I will soon be fit enough to return to Koli, and to Maku.
          If you see her in your travels, tell her I am well!”
        `,
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        text: `
          I will.
        `,
        position: 'right',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // MASK HUNT – multi-character cutscenes
  // ---------------------------------------------------------------------------

  maskhunt_gali_rescue: {
    id: 'maskhunt_gali_rescue',
    background: { type: 'gradient', from: '#8b4513', to: '#cd5c5c' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Need a hand, sister?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `Tahu! Your timing is impeccable—for once.`,
      },
      {
        type: 'narration',
        text: `Fire and water surge through the ravine in tandem, driving the Rahi back. The two Toa fight side by side, their elements complementing each other in the confined space.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `You know, we make a pretty good team when you're not lecturing me.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `And you make a tolerable ally when you're not setting things on fire.`,
      },
      {
        type: 'narration',
        text: `As the last beast falls, Gali staggers. A blinding vision floods her mind—two towering figures, one of fire and valor, one of water and wisdom, merged into beings greater than any single Toa.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `I saw something, Tahu. Two great beings—Akamai and Wairuha. We are meant to become more than we are.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Visions? Are you sure it's not the heat getting to you?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `I am certain. There is a power beyond what any of us can wield alone. Remember that, brother.`,
      },
    ],
  },

  story_toa_second_council: {
    id: 'story_toa_second_council',
    background: { type: 'gradient', from: '#3b2f1a', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `Thank you for coming. I know some of you would rather be out hunting masks alone. But we need to talk about what's been happening—honestly.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `I had a vision. Two towering beings—Akamai and Wairuha—locked in battle. And I was struck down in Ta-Wahi by unnatural ice. Someone—or something—is manipulating us.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'left',
        text: `I saw the same vision in Po-Wahi. Whatever we are meant to become, we cannot reach it divided.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `We split up. We struggled. Some of us nearly died. Maybe it's time we admit the Turaga were right—we're stronger together.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `Strongagree! Solo-hunting through the deepwood was no laughfun. Nearly got swallowed by a Nui-Jaga twice!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'right',
        text: `I've been saying this from the start. Unity isn't weakness—it's the whole point.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `I still believe in efficiency. But... I will concede that having Lewa drag me out of Ta-Wahi was preferable to dying there.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `Then we agree. From now on, we hunt as a team. The remaining masks will be found together.`,
      },
      {
        type: 'narration',
        text: `For the first time since their arrival on Mata Nui, the six Toa speak as one. Unity will be their path forward.`,
      },
    ],
  },

  maskhunt_tahu_miru: {
    id: 'maskhunt_tahu_miru',
    background: { type: 'gradient', from: '#0d2847', to: '#051a2e' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'left',
        text: `There—the shrine. Stay close. The currents here are treacherous.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `I see movement behind the rocks. Something large.`,
      },
      {
        type: 'narration',
        text: `A massive Tarakava erupts from the shadows, its armored fists slamming into the water. The beast is territorial and enraged.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `I'll hold it! Gali, direct the currents—pin it against the reef!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'left',
        text: `On it! Kopaka—freeze the water around its arms!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `Done.`,
      },
      {
        type: 'narration',
        text: `With the Tarakava immobilized, Gali swims to the shrine and retrieves the Kanohi Miru. The Mask of Levitation pulses with energy in her hands.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'left',
        text: `I have it. Let's surface before this beast breaks free.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `That went well. Tahu will be pleased—though he'll never admit he couldn't get it himself.`,
      },
    ],
  },

  maskhunt_pohatu_kaukau_bluff: {
    id: 'maskhunt_pohatu_kaukau_bluff',
    background: { type: 'gradient', from: '#c2a366', to: '#4a3728' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `A Water Breathing mask... on top of a mountain. The irony is not lost on me.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `Highclimbing is what I do best! Follow my lead, brothers!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `The wind is too strong for reckless climbing. We need a plan.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `I can kick footholds into the cliff face. Lewa, you keep the wind off us. Kopaka, freeze any loose rock so it holds.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `Acceptable.`,
      },
      {
        type: 'narration',
        text: `Stone shatters under Pohatu's kicks, carving handholds into the cliff. Lewa deflects the worst gusts while Kopaka locks every foothold in ice. Step by step, the three Toa ascend.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `Almost there! I can sightspot the mask!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `Got it! The Kanohi Kaukau—the Mask of Water Breathing. Now I just need to find some water to use it in.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `One problem at a time.`,
      },
    ],
  },

  maskhunt_forest_tahu_kakama: {
    id: 'maskhunt_forest_tahu_kakama',
    background: { type: 'gradient', from: '#2d5a1e', to: '#8b2500' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `Too bad brother Lewa isn't here to play monkey for us. Can you levitate it down, Tahu?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `I have a faster way.`,
      },
      {
        type: 'narration',
        text: `Before anyone can object, Tahu hurls a concentrated blast of fire at the tree trunk. The ancient wood erupts in flame—and the fire begins spreading to the canopy around it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `Tahu! What have you done?! The whole jungle is catching fire!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `I— it wasn't supposed to spread that fast—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `Gali, can you stop it?`,
      },
      {
        type: 'narration',
        text: `Gali raises her hooks skyward and summons a torrential downpour. Rain hammers the canopy, hissing against scorched bark until the last ember dies.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `You didn't think, Tahu. You never think. Innocent rahi lived in that tree. Plants depended on it. You didn't care about any of that—you just wanted your mask.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `I got the mask, didn't I? That's what matters.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `No. How you get it matters too. I expected more from a Toa.`,
      },
      {
        type: 'narration',
        text: `Gali turns and walks away into the rain-soaked jungle. Onua watches her go, then looks at Tahu—but says nothing.`,
      },
    ],
  },

  story_nui_jaga_nest: {
    id: 'story_nui_jaga_nest',
    background: { type: 'gradient', from: '#1a3a1a', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Here's the plan. At dawn, we go in. I'll take point, Onua and Pohatu on the flanks. Gali and Lewa cover the rear. Kopaka—do whatever you want, you will anyway.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `That isn't a plan, it's a charge. We don't know how deep the nest goes or what else is in there. Nui-Jaga hate smoke and water—we could flush them out and fight in the open.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `Gali has a point. We should know what we're walking into.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'right',
        text: `Come on—we've handled worse. A few scorpions can't be that much trouble.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `What does brother Kopaka thinksay?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `I think... that "Charge!" is not a plan.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Enough! I am tired of debating every move! We need action, not—`,
      },
      {
        type: 'narration',
        text: `In his frustration, Tahu hurls a fireball into the brush. The dry undergrowth ignites—and thick smoke billows into the nest. Seconds later, a swarm of enraged Nui-Jaga bursts from every tunnel.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `Well. You flushed them out. Happy now?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `...It worked, didn't it? Toa—fight!`,
      },
      {
        type: 'narration',
        text: `Despite their disagreements, the six Toa fight as one—fire, water, ice, stone, earth, and air striking together. The Nui-Jaga fall before their combined might.`,
      },
    ],
  },

  maskhunt_final_collection: {
    id: 'maskhunt_final_collection',
    background: { type: 'gradient', from: '#2a1f4e', to: '#0d0d1a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `We've mapped the remaining locations. Volcanic caves, ice ridges, jungle canopy, desert shrines. Each region holds masks for multiple Toa.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `No one goes alone. We clear each site together and move on.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `Agreed. There will be time to be alone after Makuta is defeated.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `That's the spirit, ice-brother! Almost sounds like you enjoy our company!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `Don't push it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `Let's finish this. The sooner we collect every mask, the sooner we face what's beneath the island.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `Unity, duty, destiny. Remember those words, brothers. We will need them.`,
      },
    ],
  },

  story_kini_nui_gathering: {
    id: 'story_kini_nui_gathering',
    background: { type: 'gradient', from: '#4a6741', to: '#1a1a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `This is the place. I can feel the power of the temple—and something darker, far below.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Makuta. He knows we're coming. Good. Let him wait.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `We should place our Golden Kanohi on the Suva. The legends say they will unlock the way.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'right',
        text: `Brothers, before we go down there... it's been an honor. Whatever happens below—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `Save the speeches for after we win, Pohatu.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `Kopaka is right for once! Let's facefight this Makuta and be done with it!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `The Chronicler's Company will guard this temple while we descend. If anything tries to follow us down—or seal us in—they'll hold the line.`,
      },
      {
        type: 'narration',
        text: `Six pairs of eyes meet. Six Toa nod in unison. Together, they prepare to descend into the darkness beneath Kini-Nui.`,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // MNOG – multi-character cutscenes
  // ---------------------------------------------------------------------------

  mnog_arrive_onu_koro: {
    id: 'mnog_arrive_onu_koro',
    background: { type: 'gradient', from: '#2a1a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Onepu',
        portraitType: 'avatar',
        position: 'left',
        text: `Halt! Who goes there? Ah—a traveler from the surface. Welcome to Onu-Koro, city of earth. I am Onepu, Captain of the Ussalry Regiment, Champion of Ussal Racing, and Special Aide to Turaga Whenua.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I'm Takua. I've come from Po-Koro. What's happening down here? The tunnels felt... wrong.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Onepu',
        portraitType: 'avatar',
        position: 'left',
        text: `You have good instincts. The mines have been troubled—lava flows have blocked our main tunnels, and Kofo-Jaga raids are getting worse. The lightstones keep failing, and without light, we can't hold them back.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Nuparu',
        portraitType: 'avatar',
        position: 'right',
        text: `I've been studying the lava flow patterns. If we can redirect the streams through the old pump system, we could reopen the blocked routes. But someone would need to cross the lava to reach the controls.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I have a lava board from Ta-Wahi. I could try.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Nuparu',
        portraitType: 'avatar',
        position: 'right',
        text: `A lava board? That's... unconventional. But it might just work. I'm Nuparu, by the way—engineer.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Onepu',
        portraitType: 'avatar',
        position: 'left',
        text: `If you can reopen those tunnels, Onu-Koro will owe you a great debt, Takua.`,
      },
    ],
  },

  mnog_meet_taipu: {
    id: 'mnog_meet_taipu',
    background: { type: 'gradient', from: '#2a1a00', to: '#1a2a00' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `Hello! Are you from the surface? I've never been to the surface! Is it true that the ceiling up there goes on forever?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `It does. They call it the sky. Who are you?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `I'm Taipu! I work in the mines. Turaga Whenua says I'm not the brightest Lightstone in Onu-Koro... but my strength is equaled only by my heart!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `This tunnel leads to Le-Wahi. I'm heading that way.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `Le-Wahi?! The jungle?! Oh, please let me come with you! I've always wanted to go on an adventure! I can carry things! Heavy things!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `All right, Taipu. But stay close—I don't know what's out there.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'left',
        text: `You won't regret it! This is the best day of my life!`,
      },
    ],
  },

  mnog_arrive_ko_koro: {
    id: 'mnog_arrive_ko_koro',
    background: { type: 'gradient', from: '#a0c4e8', to: '#e3e3ff' },
    steps: [
      {
        type: 'narration',
        text: `After a long ascent through the frozen peaks of Ko-Wahi, Takua finds a Matoran encased in ice near an abandoned outpost. Using a Heatstone, he frees the villager, who silently leads him through a hidden passage to Ko-Koro.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Thank you for leading me here. What's your name?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kopeke',
        portraitType: 'avatar',
        position: 'left',
        text: `...Kopeke.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I was sent by Jala. Ta-Koro hasn't heard from Ko-Koro in a long time. He wanted to warn you—Rahi attacks are increasing across the island.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kopeke',
        portraitType: 'avatar',
        position: 'left',
        text: `...we know.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I need to speak to your Turaga—Nuju. But I've heard he speaks only in gestures and whistles?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kopeke',
        portraitType: 'avatar',
        position: 'left',
        text: `Matoro translates. But Matoro is... missing.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Missing? Then I need to find him. Where was he last seen?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kopeke',
        portraitType: 'avatar',
        position: 'left',
        text: `...the drifts. Be careful.`,
      },
    ],
  },

  mnog_summon_chroniclers_company: {
    id: 'mnog_summon_chroniclers_company',
    background: { type: 'gradient', from: '#a0c4e8', to: '#e3e3ff' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Kopeke',
        portraitType: 'avatar',
        position: 'left',
        text: `...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I know you're quiet, Kopeke. But Turaga Nuju chose you for a reason. Will you come with me?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kopeke',
        portraitType: 'avatar',
        position: 'left',
        text: `...yes.`,
      },
      {
        type: 'narration',
        text: `One by one, Takua visits each village. Each Turaga releases a Matoran to the Chronicler's call. Hafu from Po-Koro. Maku from Ga-Koro. Tamaru from Le-Koro. Taipu from Onu-Koro. Kapura from Ta-Koro. And Kopeke from Ko-Koro.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `The Company is assembled. The Toa need us to protect Kini-Nui while they face Makuta. Are you all ready?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Kopeke',
        portraitType: 'avatar',
        position: 'left',
        text: `Ready.`,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // BOHROK SWARM – multi-character cutscenes
  // ---------------------------------------------------------------------------

  bohrok_swarm_intro: {
    id: 'bohrok_swarm_intro',
    background: { type: 'gradient', from: '#4a0000', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `What is this?! We just defeated Makuta—the island should be safe!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `These creatures... they're not Rahi. They move with purpose—like a swarm following orders.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `I can feel them beneath the ground too. They are coming from below—from deeper than even Makuta's lair.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `They're heading for the villages. All of them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `Le-Koro! My home—the trees are being uptalked—uprooted!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `We can't fight them all at once. We need to protect the Matoran first.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `To Ta-Koro—now! We face this new threat together!`,
      },
    ],
  },

  bohrok_ta_koro_defense: {
    id: 'bohrok_ta_koro_defense',
    background: { type: 'gradient', from: '#8b0000', to: '#1a0a00' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Tahu! They're breaching the eastern wall!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `I see them! Drive them toward the moat—let the lava do the work!`,
      },
      {
        type: 'narration',
        text: `Tahu channels a wall of flame, herding the Kohrak toward the edge. Several topple into the molten rock, hissing and sparking as they sink.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `It's working! But there are so many...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Then we fight until there are none left. This is our village, Chronicler. We don't yield.`,
      },
      {
        type: 'narration',
        text: `As the last Kohrak falls, Turaga Vakama emerges from the village. His eyes widen at the sight of the mechanical shells.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `No... the Bohrok. They are real. We prayed the legends were wrong, but the swarms have awakened beneath the island.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `You know what these things are?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `I know more than I wish to. Come, Chronicler. We must speak with the Toa—and quickly.`,
      },
    ],
  },

  bohrok_po_koro_defense: {
    id: 'bohrok_po_koro_defense',
    background: { type: 'gradient', from: '#c2a366', to: '#4a0000' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Huki',
        portraitType: 'avatar',
        position: 'left',
        text: `They're coming through the pass. Dozens of them. Hafu—we can't hold the gates forever.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hafu',
        portraitType: 'avatar',
        position: 'right',
        text: `I know. I have an idea—but you're not going to like it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Huki',
        portraitType: 'avatar',
        position: 'left',
        text: `What idea?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hafu',
        portraitType: 'avatar',
        position: 'right',
        text: `My statues. The ones lining the canyon approach. If I topple them into the pass, they'll block the tunnel and buy us time to evacuate.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Huki',
        portraitType: 'avatar',
        position: 'left',
        text: `Your statues? Hafu, those are your life's work—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hafu',
        portraitType: 'avatar',
        position: 'right',
        text: `And the villagers are more important. Another Hafu original... this time, a barricade. Stand back.`,
      },
      {
        type: 'narration',
        text: `With a great heave, Hafu shatters the base of his finest carving. The massive stone figure crashes across the tunnel entrance, blocking the Tahnok's advance. The villagers flee to safety behind the rubble wall.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Huki',
        portraitType: 'avatar',
        position: 'left',
        text: `That was the bravest thing I've ever seen, Hafu.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hafu',
        portraitType: 'avatar',
        position: 'right',
        text: `I can always carve more statues. Can't carve more Matoran.`,
      },
    ],
  },

  bohrok_onu_koro_boxor: {
    id: 'bohrok_onu_koro_boxor',
    background: { type: 'gradient', from: '#2a1a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Onepu',
        portraitType: 'avatar',
        position: 'left',
        text: `The water's rising. We have maybe an hour before this chamber floods too.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'right',
        text: `Can't we dig through the wall? I'm strong—let me try!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Nuparu',
        portraitType: 'avatar',
        position: 'left',
        text: `Wait. Look at these parts... the Bohrok shell is hinged. It's designed like a cockpit. If I strip out the Krana control system and rig manual controls...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Onepu',
        portraitType: 'avatar',
        position: 'left',
        text: `You want to build a machine? Now?!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Nuparu',
        portraitType: 'avatar',
        position: 'left',
        text: `Not just a machine—a fighting vehicle. A Matoran-sized exo-suit. Taipu, hand me that joint assembly. Onepu, I need the pistons from that leg.`,
      },
      {
        type: 'narration',
        text: `Working frantically as water seeps under the door, Nuparu assembles an ungainly but functional walking machine from Bohrok parts and ancient mining equipment.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Nuparu',
        portraitType: 'avatar',
        position: 'left',
        text: `I call it... the Boxor. One of you climb in. Let's take back our home.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Taipu',
        portraitType: 'avatar',
        position: 'right',
        text: `I'll do it! Let me at those Bohrok!`,
      },
      {
        type: 'narration',
        text: `The Boxor smashes through the flooded tunnel, its mechanical fists scattering Gahlok like leaves. For the first time, the Matoran can fight back.`,
      },
    ],
  },

  bohrok_legend_of_krana: {
    id: 'bohrok_legend_of_krana',
    background: { type: 'gradient', from: '#5b3e0b', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `I know the answers you seek, though I wish I did not.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `What are those creatures, Turaga? They're not like any Rahi we've seen.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `They are called Bohrok. We have known the legends for centuries, and we prayed they were only legends. But the Bohrok are real—all too real. And they are swarming over all of Mata Nui.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `What controls them? We pulled a glowing thing from one of their heads.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `That is a Krana—the mind of the swarm. Each Bohrok carries one. There are eight types of Krana, and six breeds of Bohrok. The legends say that only when all forty-eight Krana are collected can the path to the Bohrok nest be unlocked.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `And what's in the nest?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `The Bahrag—twin queens who command every Bohrok on this island. If the Toa can reach them and defeat them, the swarms will stop. But be warned: the Krana are dangerous. If one attaches to a living being's face... it will control them utterly.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I'll make sure the Toa know. Thank you, Turaga.`,
      },
    ],
  },

  bohrok_lewa_krana_rescue: {
    id: 'bohrok_lewa_krana_rescue',
    background: { type: 'gradient', from: '#2d5a1e', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `Lewa's mask... he would never leave this behind willingly. Something is very wrong.`,
      },
      {
        type: 'narration',
        text: `A figure drops from the canopy. It is Lewa—but his movements are rigid, mechanical. A Krana clings to his face where his mask should be. His eyes glow with alien purpose.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `The swarm is everything. The swarm will cleanse the island. You cannot stop what must be.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `That's not you talking, brother. Fight it!`,
      },
      {
        type: 'narration',
        text: `Lewa attacks with devastating wind blasts, but Onua endures. The Toa of Earth is patient and immovable, letting each gust break against him like waves on a cliff.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `You are Lewa—Toa of Air. You love the wind and the trees. You are not a puppet. Remember who you are!`,
      },
      {
        type: 'narration',
        text: `Onua lunges forward, grabs the Krana, and tears it from Lewa's face in a single motion. Lewa collapses, gasping.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `Onua... I could hear myself screaming inside my own head, but my body wouldn't listenheed. Thank you, brother.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `That's what brothers are for. Now—let's make sure this never happens to anyone else.`,
      },
    ],
  },

  bohrok_krana_hunt: {
    id: 'bohrok_krana_hunt',
    background: { type: 'gradient', from: '#1a3a4a', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Forty-eight Krana. Eight types, six breeds. That's what we need.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `We should each return to our own region. We know the terrain, and the swarms are concentrated around the villages.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'left',
        text: `Be careful. Lewa's possession proved these Krana are dangerous. Remove them quickly—don't let them touch your face.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `Trust me—I will never let one of those things near me again.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `Then it's settled. Hunt hard, stay safe, and bring back every last Krana.`,
      },
    ],
  },

  bohrok_into_the_bohrok_nest: {
    id: 'bohrok_into_the_bohrok_nest',
    background: { type: 'gradient', from: '#1a0a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `The tunnel goes deeper than I can see—even with the Akaku. The Bohrok Va have been using this path.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Then this is it. The heart of the swarm is down there.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `I can feel something deep below... something ancient and powerful. Two presences, entwined.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `The Bahrag. The queens of the swarm. If the legends are true, they are what drives every Bohrok on the island.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa',
        portraitType: 'avatar',
        position: 'right',
        text: `Last time we went deep-underground, we fought Makuta. This keeps getting better and better.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `At least this time we know what we're getting into.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `Together, then. Let's end this.`,
      },
    ],
  },

  bohrok_evolve_toa_nuva: {
    id: 'bohrok_evolve_toa_nuva',
    background: { type: 'gradient', from: '#3d0066', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu',
        portraitType: 'avatar',
        position: 'left',
        text: `The armor is limiting our elemental power! We can't channel through it properly!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
        portraitType: 'avatar',
        position: 'right',
        text: `Then we shed the armor. Our elements are what make us Toa—not machines!`,
      },
      {
        type: 'narration',
        text: `One by one, the Toa discard the Exo-Toa suits. Unshackled, their elemental powers surge—fire, water, ice, air, earth, and stone blazing in concert.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua',
        portraitType: 'avatar',
        position: 'left',
        text: `Together—now! Trap them!`,
      },
      {
        type: 'narration',
        text: `Six elemental streams converge on the Bahrag, encasing the twin queens in a prison of solid protodermis. The swarm shudders—and falls silent across the island.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: `We did it! They're—wait—the floor!`,
      },
      {
        type: 'narration',
        text: `The ground cracks open and the six Toa plunge into a pool of silvery, energized protodermis. Power tears through them—reshaping armor, enhancing elements, rewriting their very essence.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `What... what has happened to us?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `We have changed. I can feel it—our power is greater than before. We are... Toa Nuva.`,
      },
    ],
  },

  bohrok_assistants: {
    id: 'bohrok_assistants',
    background: { type: 'gradient', from: '#2a1a00', to: '#1a2a00' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Nuparu',
        portraitType: 'avatar',
        position: 'left',
        text: `Onepu, look at these Bohrok shells. The Krana are inert, but the mechanical systems are intact. If I remove the Krana and install manual control rigs—like the Boxor, but simpler—we could repurpose them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Onepu',
        portraitType: 'avatar',
        position: 'right',
        text: `Repurpose the things that nearly destroyed our homes? The other Matoran won't like it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Nuparu',
        portraitType: 'avatar',
        position: 'left',
        text: `They'll like the free labor. These shells can haul stone, clear rubble, dig tunnels—everything we need for reconstruction. We turn our enemy's weapons into tools.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Onepu',
        portraitType: 'avatar',
        position: 'right',
        text: `You're mad. But you were mad when you built the Boxor too, and that saved us all. Fine—let's get to work.`,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // BOHROK KAL – multi-character cutscenes
  // ---------------------------------------------------------------------------

  bohrok_kal_reconstruction: {
    id: 'bohrok_kal_reconstruction',
    background: { type: 'gradient', from: '#5b3e0b', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Tahu. Come with me. There is something I must show you—away from the others.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `What is it, Turaga? You look troubled.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `The Nuva Symbol that appeared on the Suva... it is a sign of your transformation. Your power is now tied to it. Guard it well.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `But that is not why I called you here. I have kept a secret—one that weighs heavily on an old Turaga's conscience. Take this.`,
      },
      {
        type: 'narration',
        text: `Vakama reaches into his cloak and produces a mask unlike any Tahu has seen. Its surface shimmers, distorting the light around it as if time itself bends in its presence.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `What... what is this mask?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `The Kanohi Vahi. The Great Mask of Time. It is the most dangerous mask ever forged. With it, you can slow or hasten the flow of time itself.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Why give it to me?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Because a day may come when all other options fail. When that day arrives, you—and only you—must decide whether to use it. But know this: if the Vahi is damaged, time itself could unravel. All of reality could cease to exist.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I understand. I will keep it secret. And I will use it only in the direst emergency.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `I pray that day never comes. Now go, Toa Nuva. Your brothers and sisters need you.`,
      },
    ],
  },

  bohrok_kal_scattered_aid: {
    id: 'bohrok_kal_scattered_aid',
    background: { type: 'gradient', from: '#1a3a4a', to: '#0d1f2d' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `The Bohrok left a trail of destruction across the island. Our people need us—not as warriors, but as builders.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Agreed. Ga-Koro's platforms were damaged by the Pahrak. I should return and help the repairs.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Ko-Koro's walls need reinforcing. I will see to it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Le-Koro was hit hard. Time to replant what the swarm tore down.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Then we go to our homes. Let's give our people something to celebrate.`,
      },
    ],
  },

  bohrok_kal_stolen_symbols: {
    id: 'bohrok_kal_stolen_symbols',
    background: { type: 'gradient', from: '#1a0a2e', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'tahnok_kal',
        portraitType: 'avatar',
        position: 'left',
        text: `Stand aside, Toa Nuva. You are in our way.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `What are you?! You're not like the other Bohrok—`,
      },
      {
        type: 'dialogue',
        speakerId: 'nuhvok_kal',
        portraitType: 'avatar',
        position: 'left',
        text: `We are the Bohrok-Kal. We search for Cahdok and Gahdok, queens of the swarms. Tell us where you have hidden the Bahrag, and then stand aside. We have no wish to harm helpless foes.`,
      },
      {
        type: 'narration',
        text: `Before Tahu can respond, the six Bohrok-Kal strike simultaneously—each ripping a Nuva Symbol from its Suva shrine. Across the island, the Toa Nuva's elemental powers vanish in an instant.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `My fire—it's gone! I tried to stop one of them and it buried me under rubble like I was nothing!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I was crossing an ice bridge when my power failed. I nearly fell into the chasm.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I was highflying above Le-Wahi when my air control just... stopped. Kongu had to rescue me on a Gukko. Miles above the ground!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `A tidal wave I had been shaping collapsed on top of me. Without my power I couldn't stop it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `These Kal are not ordinary Bohrok. They spoke to me—they said they seek the Bahrag. They want to free them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Without our elements, how do we stop them?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `We still have our masks, our weapons, and each other. We find the Kal, we take back our symbols. There is no other option.`,
      },
    ],
  },

  bohrok_kal_sighting: {
    id: 'bohrok_kal_sighting',
    background: { type: 'gradient', from: '#c2a366', to: '#1a0a2e' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Two of the Bohrok-Kal were spotted heading through Po-Wahi. If we move now, we can intercept them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Good. We split into two groups—three to pursue the Kal, three to investigate the Bahrag's prison. We need to know if the cage still holds.`,
      },
      {
        type: 'narration',
        text: `The Toa intercept Pahrak-Kal and Kohrak-Kal in a narrow Po-Wahi canyon. The two Kal halt and turn to face them—not with aggression, but with calm certainty.`,
      },
      {
        type: 'dialogue',
        speakerId: 'pahrak_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `You are too late, Toa. Already, the Bohrok-Kal have learned where the Bahrag are hidden.`,
      },
      {
        type: 'dialogue',
        speakerId: 'kohrak_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `We will free Cahdok and Gahdok—and the swarms will be free again. You cannot stop what must be.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `They believe in their mission as fervently as we do in ours. That makes them dangerous.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Then we cannot afford to underestimate them. These are not mindless drones—they are elite.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Elite or not, they have what belongs to us. Let's move.`,
      },
    ],
  },

  bohrok_kal_race_to_nest: {
    id: 'bohrok_kal_race_to_nest',
    background: { type: 'gradient', from: '#1a0a00', to: '#0d0d1a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `The Exo-Toa suits are still down there from our last battle. Without our elements, we'll need every advantage we can get.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I remember those clunkysuits—they held back our powers last time. But without powers to hold back...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `They have weapons and raw strength. It may be enough.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `It had better be. If the Kal place our symbols on the Nuva Cube and free the Bahrag, the swarm returns—and this time we'll be powerless to stop it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Then there's no time to waste. Downward.`,
      },
    ],
  },

  bohrok_kal_final_confrontation: {
    id: 'bohrok_kal_final_confrontation',
    background: { type: 'gradient', from: '#3d0066', to: '#0a0a0a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'tahnok_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `You are too late, Toa. The symbols are ours. The queens will be free—and the swarm will cleanse this island as it was always meant to.`,
      },
      {
        type: 'dialogue',
        speakerId: 'gahlok_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `Your Exo-Toa armor is useless against us. Lay down your weapons. This is over.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `We have no choice. I must use this.`,
      },
      {
        type: 'narration',
        text: `Tahu pulls forth the Vahi—the legendary Mask of Time, entrusted to him in secret by Turaga Vakama.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `The Vahi! Tahu—do you know what you are doing? If you fail, more than Mata Nui will be lost. This entire reality could unravel!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `We have no choice. I must use this power... master it... or all is lost.`,
      },
      {
        type: 'narration',
        text: `Time slows around the Bohrok-Kal. Their movements crawl to near-stillness. But their Krana-Kal turn silver and project an impenetrable force field. Even frozen in time, they cannot be touched.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `I cannot... maintain this... much longer...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Wait—the symbols! We're still connected to them. If we push our willpower through the connection—feed the Kal more power than they can handle—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Overload them with their own stolen energy. It's brilliant—or insane.`,
      },
      {
        type: 'narration',
        text: `The six Toa Nuva reach out with their minds, pouring raw willpower into the Nuva Symbols. The Bohrok-Kal convulse as power spirals beyond their control.`,
      },
      {
        type: 'dialogue',
        speakerId: 'lehvak_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `What is happening?! The vacuum—it's pulling outward—I can't contain—`,
      },
      {
        type: 'narration',
        text: `Lehvak-Kal's vacuum power inverts into a violent thrust. The Kal is launched skyward, rocketing through the cavern ceiling and into the atmosphere—lost to the void above Mata Nui.`,
      },
      {
        type: 'dialogue',
        speakerId: 'nuhvok_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `The gravity... it's folding inward... everything is collapsing... into me...`,
      },
      {
        type: 'narration',
        text: `Nuhvok-Kal's gravity field spirals out of control. The Kal crumples into itself, crushed into an impossibly dense point—a black hole that swallows its own shell before winking out of existence.`,
      },
      {
        type: 'dialogue',
        speakerId: 'pahrak_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `Too much heat... the plasma... my shell is... melting...`,
      },
      {
        type: 'narration',
        text: `Pahrak-Kal's plasma burns white-hot, liquefying its own armor. The molten mass sinks through the stone floor, boring deeper and deeper until the glow fades to nothing.`,
      },
      {
        type: 'dialogue',
        speakerId: 'tahnok_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `No—the electricity—it won't stop arcing—I am... trapped in my own cage...`,
      },
      {
        type: 'narration',
        text: `Arcs of lightning encase Tahnok-Kal in a crackling prison of its own making. The electricity fuses its joints solid, locking it in place forever—a monument to its own overloaded power.`,
      },
      {
        type: 'dialogue',
        speakerId: 'gahlok_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `The magnetism—everything is pulling toward me—the Exo-Toa debris—I can't repel it—`,
      },
      {
        type: 'narration',
        text: `Every shard of metal in the cavern hurtles toward Gahlok-Kal. Exo-Toa wreckage, discarded tools, and raw ore slam into the Kal from all directions, burying it under tons of magnetically attracted debris.`,
      },
      {
        type: 'dialogue',
        speakerId: 'kohrak_kal',
        portraitType: 'avatar',
        position: 'right',
        text: `The sonics... the frequency is rising... my own shell is vibrating apart—`,
      },
      {
        type: 'narration',
        text: `A piercing shriek fills the cavern as Kohrak-Kal's sonic power reaches a frequency beyond endurance. Its armor shatters from within, disintegrating into dust. The silence that follows is absolute.`,
      },
      {
        type: 'narration',
        text: `The six Nuva Symbols clatter to the ground, unclaimed. The force field dissolves. The Bahrag remain sealed in their protodermis prison.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Pohatu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Our power... I can feel it returning!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `The Bahrag remain imprisoned. The Kal are gone. It's over.`,
      },
    ],
  },

  bohrok_kal_naming_day: {
    id: 'bohrok_kal_naming_day',
    background: { type: 'gradient', from: '#4a6741', to: '#ffe28e' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'left',
        text: `What's happening? Why are the Turaga calling everyone here?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'right',
        text: `They said it's time for the Matoran to be rebuilt—stronger, taller, better prepared for whatever comes next.`,
      },
      {
        type: 'narration',
        text: `The Turaga teach the assembled Matoran how to rebuild themselves into sturdier forms. Then, one by one, they call forth heroes to be renamed in honor of their deeds.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Huki',
        portraitType: 'avatar',
        position: 'left',
        text: `I am... Hewkii now? It feels different. Stronger.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Maku',
        portraitType: 'avatar',
        position: 'right',
        text: `And I am Macku. A new name for a new era.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'right',
        text: `Jaller. They're calling me Jaller now. Captain Jaller of the Ta-Koro Guard. Has a good ring to it.`,
      },
      {
        type: 'narration',
        text: `Cheers ring across Kini-Nui as every Matoran is rebuilt and renewed. The island has weathered Makuta, the Bohrok, and the Bohrok-Kal. But the Matoran stand taller now—ready for whatever comes next.`,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // MASK OF LIGHT – main story cutscenes
  // ---------------------------------------------------------------------------

  mol_kolhii_tournament: {
    id: 'mol_kolhii_tournament',
    background: { type: 'gradient', from: '#8b0000', to: '#ff6a00' },
    steps: [
      {
        type: 'narration',
        text: `The great Kolhii stadium of Ta-Koro is packed. Matoran from every village have gathered to watch the championship match. The air shimmers with volcanic heat.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua! Where have you been? The match is about to start! You're supposed to be on the field with me!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Sorry, Jaller! I was, uh... exploring.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `You're always exploring! Get your Kolhii stick—we're up against Ga-Koro. Hahli and Macku have been training hard.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Huki',
        portraitType: 'avatar',
        position: 'right',
        text: `Don't worry about Ga-Koro. Worry about Po-Koro! Hafu and I have been practicing a new move.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hahli',
        portraitType: 'avatar',
        position: 'left',
        text: `Let your Kolhii sticks do the talking, Hewkii. Ga-Koro plays to win.`,
      },
      {
        type: 'narration',
        text: `The match is fierce. Ta-Koro's fire, Po-Koro's stone, and Ga-Koro's water clash on the field. In the end, Hahli scores the winning goal for Ga-Koro with a masterful strike that leaves the crowd cheering.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Nice shot, Hahli! I mean... I wasn't paying attention because I was busy—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `Busy losing? You were staring at the lava pit the entire third round, Takua.`,
      },
      {
        type: 'narration',
        text: `As the crowd celebrates, a sudden tremor shakes the stadium. A crack splits the ground near the Kolhii field, and from the molten rock beneath, something rises—a mask, gleaming with golden light.`,
      },
    ],
  },

  mol_avohkii_discovery: {
    id: 'mol_avohkii_discovery',
    background: { type: 'gradient', from: '#ffe28e', to: '#5b3e0b' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `What... what is that? A mask? It's glowing!`,
      },
      {
        type: 'narration',
        text: `Takua reaches into the crack and pulls out a mask of brilliant gold. The moment he touches it, a beam of light erupts from the mask and shines directly on him, illuminating the entire stadium.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `The Avohkii! The Great Mask of Light! The prophecy... it is real.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'right',
        text: `What prophecy, Turaga?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `It is written that when the Mask of Light is found, a seventh Toa will arise—a Toa of Light who will challenge the darkness and awaken the Great Spirit Mata Nui. The mask has chosen its herald. The light shines upon... Takua.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Me?! No, no—I think the light was pointing at Jaller. He was standing right next to me! Right, Jaller?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'right',
        text: `...It was pointing at you, Takua.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `You must seek the seventh Toa and deliver the Avohkii to its rightful bearer. Follow where the mask's light leads. The fate of Mata Nui depends on it.`,
      },
    ],
  },

  mol_herald_journey: {
    id: 'mol_herald_journey',
    background: { type: 'gradient', from: '#4a6741', to: '#1a3a4a' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `You're not going alone, Takua. The Turaga chose you as herald, but the Captain of the Guard goes where the danger is. That's me.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Jaller, you don't have to—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `I'm not asking. Besides, someone needs to keep you focused. Left to yourself, you'd wander into every cave and ruin between here and Ko-Wahi.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `That's... probably true.`,
      },
      {
        type: 'narration',
        text: `Takua lifts the Avohkii. Its light pulses gently, casting a beam southward—toward the jungles of Le-Wahi. With Pewku the Ussal crab carrying their supplies, the two Matoran leave Ta-Koro behind.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua... do you think this seventh Toa is out there? Waiting for us?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I hope so. Because if not, we're just two Matoran walking into the wild with a glowing mask and no plan.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `Wouldn't be the first time for you.`,
      },
    ],
  },

  mol_rahkshi_attack_ta_koro: {
    id: 'mol_rahkshi_attack_ta_koro',
    background: { type: 'gradient', from: '#4a0000', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: `Deep in Mangaia, Makuta senses the discovery of the Avohkii. His rage shakes the caverns. From pools of antidermis and shadow, he creates six sons—the Rahkshi. Three he sends first: Turahk, the fear; Guurahk, the disintegrator; Lerahk, the poison.`,
      },
      {
        type: 'narration',
        text: `The Rahkshi erupt from the ground beneath Ta-Koro. Their staffs cleave through stone. The lava moat—once the village's greatest defense—becomes its grave as the platforms crack and tilt.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `What are these things?! They cut through Bohrok armor like it was nothing!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `They came from below—from Makuta's lair. Tahu, they're after the Mask of Light!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `The village is sinking! We have to evacuate—now!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Get the Matoran out! I'll hold them off!`,
      },
      {
        type: 'narration',
        text: `Tahu fights with everything he has, but the Rahkshi are relentless. Guurahk shatters the central platform. Ta-Koro—home of the fire Matoran since the great migration—groans, cracks, and sinks into the molten lake. The village is gone.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Tahu... I'm sorry. We saved the Matoran, but the village...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `We'll rebuild. But first, we hunt. These creatures will pay for every stone that fell.`,
      },
    ],
  },

  mol_ko_wahi_ambush: {
    id: 'mol_ko_wahi_ambush',
    background: { type: 'gradient', from: '#e3e3ff', to: '#1a1a4a' },
    steps: [
      {
        type: 'narration',
        text: `The Avohkii's light leads Takua and Jaller into the frozen mountains of Ko-Wahi. Snow swirls around them, obscuring the path. Then—a sound. The chatter of Rahkshi staffs cutting through ice.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua—behind us! Two of those creatures!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `The bridge! If we can get across—`,
      },
      {
        type: 'narration',
        text: `The ice bridge splinters beneath their feet. Jaller slips—and Takua catches his arm, hauling him back just as the bridge collapses into the chasm behind them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Move. Now.`,
      },
      {
        type: 'narration',
        text: `Kopaka Nuva appears from nowhere, raising a wall of ice between the Matoran and the Rahkshi. The creatures pound against it, cracks spiderwebbing through the frozen barrier.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `That wall won't hold long. Keep moving east—follow the gorge. I'll slow them down.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `Thank you, Toa Kopaka.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Don't thank me. Find the seventh Toa. That's the only way this ends.`,
      },
    ],
  },

  mol_tahu_poisoned: {
    id: 'mol_tahu_poisoned',
    background: { type: 'gradient', from: '#1a4a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: `In the jungles of Le-Wahi, the Toa Nuva track two Rahkshi. Lerahk's staff cuts Tahu across the arm—a shallow wound, but the poison of shadow seeps in immediately.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `It's nothing. Just a scratch. I can still fight—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Brother, your eyes... they're going dark. That's not a scratch—it's spreading!`,
      },
      {
        type: 'narration',
        text: `Dark veins crawl up Tahu's arm and across his mask. His flames turn from orange to sickly green. He turns on his brothers, swinging his magma swords with savage fury.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Stay back! All of you! I don't need your help—I don't need ANYONE!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `The poison is in his mind—it's turning his anger against us! Kopaka, I need you! If we combine ice and water, we can freeze the venom before it reaches his heartlight!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Hold him still. This will hurt.`,
      },
      {
        type: 'narration',
        text: `Lewa pins Tahu with cyclone winds while Gali and Kopaka channel water and ice directly through the wound. The shadow venom crystallizes and shatters. Tahu collapses, gasping.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `I... I could feel it inside me. Rage. Hatred. It felt... right. If you hadn't stopped me...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `That's Makuta's weapon. He doesn't need to defeat us—just divide us. Remember that, brother.`,
      },
    ],
  },

  mol_takua_destiny: {
    id: 'mol_takua_destiny',
    background: { type: 'gradient', from: '#2d5a1e', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: `Night falls on a ruined campsite. The Rahkshi struck again—this time in Onu-Koro, collapsing tunnels and scattering Matoran. Everywhere Takua goes, destruction follows.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I can't do this, Jaller. Everywhere we take this mask, the Rahkshi come. People get hurt. Maybe... maybe if I just got rid of the Avohkii—buried it somewhere—they'd stop.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `And then what? Makuta wins? The seventh Toa never rises? The Great Spirit never wakes up?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Maybe the mask chose wrong! I'm not a hero, Jaller—I'm a wanderer. I find things. I run from things. That's what I do.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `You ran TO Ga-Koro when it was drowning. You ran INTO the Nui-Rama hive. You ran to every village on this island when they needed help. Don't tell me you're a coward—I won't believe it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `The mask didn't choose wrong, Takua. You're just scared. And that's fine—I'm scared too. But we don't stop. That's not who we are.`,
      },
      {
        type: 'narration',
        text: `Takua looks at the Avohkii in his hands. Its light pulses steadily, warm and patient, as though it has been waiting for him all along.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `...All right. We keep going.`,
      },
    ],
  },

  mol_battle_of_kini_nui: {
    id: 'mol_battle_of_kini_nui',
    background: { type: 'gradient', from: '#4a0000', to: '#1a0a2e' },
    steps: [
      {
        type: 'narration',
        text: `All six Rahkshi converge on Kini-Nui. Makuta has sent his full might. The Toa Nuva stand ready, weapons drawn, but they are battered from days of running battles across the island.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `This is it. All six of them. No more running—we end this here.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Together. As one.`,
      },
      {
        type: 'narration',
        text: `The battle is brutal. Pohatu and Onua shatter Panrahk's armor. Lewa and Kopaka bring down Guurahk in a storm of wind and ice. Gali drowns Lerahk in a torrent. Tahu faces Kurahk and Vorahk alone, his flames burning hotter than ever.`,
      },
      {
        type: 'narration',
        text: `But Turahk—the Rahkshi of Fear—slips past the Toa. It sees Takua clutching the Avohkii and raises its staff, channeling a blast of pure terror.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'right',
        text: `TAKUA!`,
      },
      {
        type: 'narration',
        text: `Jaller throws himself between Takua and the blast. The fear-energy strikes him full in the chest. He staggers... and falls.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `JALLER! No—no, no, no—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `You know... who the... seventh Toa is... don't you... Takua?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `No... Jaller, stay with me—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `It was always... you.`,
      },
      {
        type: 'narration',
        text: `Jaller's eyes dim. The Captain of the Guard, the bravest Matoran on Mata Nui, lies still. The battlefield falls silent.`,
      },
    ],
  },

  mol_takanuva_rises: {
    id: 'mol_takanuva_rises',
    background: { type: 'gradient', from: '#ffe28e', to: '#ffffff' },
    steps: [
      {
        type: 'narration',
        text: `Takua kneels beside Jaller, the Avohkii in his trembling hands. All around him, the Toa Nuva stand in silence. Even Kopaka has no words.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `You were right, Jaller. About everything. I was running. I was afraid. But I'm not afraid anymore.`,
      },
      {
        type: 'narration',
        text: `Takua lifts the Avohkii. Its light blazes—not a beam, but a radiance that swallows the battlefield. He places the Mask of Light on his face.`,
      },
      {
        type: 'narration',
        text: `Power surges through him. His body grows, his armor reshapes, his heartlight burns with the brilliance of a star. Where a Matoran stood, a Toa now rises—tall, golden, and burning with inner light.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I am Takanuva—Toa of Light. And Makuta... you will answer for what you've done.`,
      },
      {
        type: 'narration',
        text: `Takanuva turns toward the remaining Rahkshi. A single sweep of his staff unleashes a column of pure light that shatters Turahk where it stands. The other Rahkshi scatter.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `The seventh Toa... the prophecy was true.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua... you were the herald AND the Toa. The mask wasn't searching—it was waiting for you to accept your destiny.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `My name is Takanuva now. And I have a score to settle beneath Kini-Nui.`,
      },
    ],
  },

  mol_defeat_of_makuta: {
    id: 'mol_defeat_of_makuta',
    background: { type: 'gradient', from: '#0a0a0a', to: '#3d0066' },
    steps: [
      {
        type: 'narration',
        text: `From the wreckage of the Rahkshi, Takanuva builds a vehicle—the Ussanui—and rides it down through Kini-Nui into the deepest cavern of Mangaia. Hahli follows as the new Chronicler, bearing witness.`,
      },
      {
        type: 'narration',
        text: `In the heart of darkness, Makuta waits. He is vast. He is shadow given form. His voice echoes from every wall.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `So... the Matoran sends a Toa of Light to challenge me. How quaint. You are too late, little Toa. The darkness is all there is.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I know you, Makuta. You've hidden in the dark long enough. Face me.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `You would challenge me? Very well... but not with weapons. Let us play a game—Kolhii. After all, isn't that what you Matoran do best? Play games while the world crumbles around you?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `A game. Light against shadow. If I win, you open the gate to what lies beyond.`,
      },
      {
        type: 'narration',
        text: `The game begins. Light and shadow clash across a field of protodermis. Takanuva strikes with precision and fury. Makuta is cunning, twisting the shadows themselves. But Takanuva is relentless.`,
      },
      {
        type: 'narration',
        text: `In the final exchange, Takanuva tackles Makuta—and both plunge into the pool of energized protodermis. Light and darkness merge.`,
      },
      {
        type: 'narration',
        text: `From the pool rises a single towering figure—Takutanuva. Two beings fused as one, light and shadow in impossible balance.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hahli',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua?! What happened to you?!`,
      },
      {
        type: 'narration',
        text: `The merged being speaks with two voices.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Light has revealed the will of Mata Nui. Our brother must be awakened.`,
      },
      {
        type: 'narration',
        text: `Takutanuva lifts the massive gate—a door sealed since the great migration. Beyond it, a passage leads downward into a vast, silent world. With the last of his merged strength, Takutanuva pours life energy into Jaller's still form. The Captain of the Guard stirs... and breathes.`,
      },
      {
        type: 'narration',
        text: `The gate's weight becomes too much. It crashes down, and in the impact, Makuta's darkness is expelled. Takanuva reforms alone, weakened but alive. The Toa of Light stands before the open passage, victorious.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `Where... where am I? Takua—?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Welcome back, Jaller. You're safe now. It's over.`,
      },
    ],
  },

  mol_rediscovery_of_metru_nui: {
    id: 'mol_rediscovery_of_metru_nui',
    background: { type: 'gradient', from: '#0d1f2d', to: '#ffe28e' },
    steps: [
      {
        type: 'narration',
        text: `The Toa Nuva, Takanuva, and the Matoran gather at the open gate. Beyond the passage, an underground sea stretches into darkness—and on its far shore, the towers of a great city gleam faintly in the distance.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hahli',
        portraitType: 'avatar',
        position: 'left',
        text: `What is that place? Those towers... I've never seen anything like them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `That... is Metru Nui. The city we came from. The city we have kept secret since the day we brought you all to this island.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'right',
        text: `Secret? You knew about this place? All this time?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `We were not always Turaga, Jaller. We were once Toa—the Toa Metru—and Metru Nui was our home. When Makuta betrayed the Great Spirit and plunged the city into darkness, we carried the Matoran to safety on the island above. But you lost your memories in the journey. We chose to let you build new lives rather than burden you with the old.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `You were Toa? All six of you?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Yes. We sacrificed our Toa power to save the Matoran—and became Turaga. It was a price we paid willingly.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hahli',
        portraitType: 'avatar',
        position: 'left',
        text: `Then that city... is where we truly belong?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Metru Nui is your birthright. And now, at last, the path home is open. But beware—the city has been empty for a long time. We do not know what waits for us in its shadows.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Then we go together. Light will lead the way.`,
      },
      {
        type: 'narration',
        text: `The Matoran of Mata Nui gaze across the underground sea at the towers of Metru Nui—the City of Legends. Their true home, waiting in the darkness below. A new chapter begins.`,
      },
    ],
  },
};
