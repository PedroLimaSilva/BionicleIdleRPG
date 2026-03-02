import type { VisualNovelCutscene } from '../../types/Cutscenes';
import { videoOnly } from './shared';

export const MNOG_CUTSCENES: Record<string, VisualNovelCutscene> = {
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
    steps: [{ type: 'video', videoId: 'dsSugRBjusI' }],
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
        text: `We're trapped. Every exit is swarming with Rama. We need a miracle.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Tamaru',
        portraitType: 'avatar',
        position: 'left',
        text: `Wait—listen! Something is happening above us... fighting! I can hear it—wind and earth clashing!`,
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
};
