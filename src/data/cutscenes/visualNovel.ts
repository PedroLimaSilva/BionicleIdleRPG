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
  story_toa_arrival: videoOnly('story_toa_arrival', 'Fk47EDfWK10'),
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

  // Mixed dialogue + video cutscenes
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
