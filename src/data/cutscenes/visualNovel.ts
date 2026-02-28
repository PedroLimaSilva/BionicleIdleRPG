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
          We have to company, let's go.
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
};
