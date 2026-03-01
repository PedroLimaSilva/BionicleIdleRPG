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
  mnog_enter_le_wahi: videoOnly('mnog_enter_le_wahi', 'vM0lWqZ9uD4'),
  mnog_flight_to_hive: videoOnly('mnog_flight_to_hive', '3feiWoDhKzo'),
  mnog_rescue_from_hive: videoOnly('mnog_rescue_from_hive', 'dsSugRBjusI'),
  mnog_lewa_v_onua: videoOnly('mnog_lewa_v_onua', 'tggBKXjwPow'),
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
        text: `You didn't think, Tahu. You never think. Animals lived in that tree. Plants depended on it. You didn't care about any of that—you just wanted your mask.`,
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
        text: `As the last Kohrak falls, Turaga Vakama emerges from the village. His eyes widen at the sight of the mechanical shells. He has seen this before—in the old legends.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Turaga Vakama recognized the creatures. He called them "Bohrok." He said the legends spoke of swarms that would one day awaken beneath the island.`,
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
        speakerId: 'Toa_Kopaka',
        portraitType: 'avatar',
        position: 'right',
        text: `What... what has happened to us?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali',
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
        text: `Agreed. Ga-Koro's platforms were damaged by the Gahlok. I should return and help the repairs.`,
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
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `My fire—it's gone! I tried to stop one of the Kal and it buried me under rubble like I was nothing!`,
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
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `When we confronted one of them, it said something disturbing: "We will free the queens. The swarm must cleanse." They believe in their mission as fervently as we do in ours.`,
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
        text: `The six Toa Nuva reach out with their minds, pouring raw willpower into the Nuva Symbols. The Bohrok-Kal convulse as power spirals beyond their control. One by one, each is destroyed by its own element—crushed, melted, blasted, disintegrated. The symbols clatter to the ground, reclaimed.`,
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
};
