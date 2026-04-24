import type { VisualNovelCutscene } from '../../types/Cutscenes';
import { videoOnly } from './shared';

export const MNOG_CUTSCENES: Record<string, VisualNovelCutscene> = {
  mnog_arrive_ko_koro: {
    background: { from: '#a0c4e8', to: '#e3e3ff', type: 'gradient' },
    id: 'mnog_arrive_ko_koro',
    steps: [
      {
        text: `After a long ascent through the frozen peaks of Ko-Wahi, Takua finds a Matoran encased in ice near an abandoned outpost. Using a Heatstone, he frees the villager, who silently leads him through a hidden passage to Ko-Koro.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `Thank you for leading me here. What's your name?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kopeke',
        text: `...Kopeke.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `I was sent by Jala. Ta-Koro hasn't heard from Ko-Koro in a long time. He wanted to warn you—Rahi attacks are increasing across the island.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kopeke',
        text: `...we know.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `I need to speak to your Turaga—Nuju. But I've heard he speaks only in gestures and whistles?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kopeke',
        text: `Matoro translates. But Matoro is... missing.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `Missing? Then I need to find him. Where was he last seen?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kopeke',
        text: `...the drifts. Be careful.`,
        type: 'dialogue',
      },
    ],
  },

  mnog_arrive_onu_koro: {
    background: { from: '#2a1a00', to: '#0a0a0a', type: 'gradient' },
    id: 'mnog_arrive_onu_koro',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Onepu',
        text: `Halt! Who goes there? Ah—a traveler from the surface. Welcome to Onu-Koro, city of earth. I am Onepu, Captain of the Ussalry Regiment, Champion of Ussal Racing, and Special Aide to Turaga Whenua.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `I'm Takua. I've come from Po-Koro. What's happening down here? The tunnels felt... wrong.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Onepu',
        text: `You have good instincts. The mines have been troubled—lava flows have blocked our main tunnels, and Kofo-Jaga raids are getting worse. The lightstones keep failing, and without light, we can't hold them back.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Nuparu',
        text: `I've been studying the lava flow patterns. If we can redirect the streams through the old pump system, we could reopen the blocked routes. But someone would need to cross the lava to reach the controls.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `I have a lava board from Ta-Wahi. I could try.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Nuparu',
        text: `A lava board? That's... unconventional. But it might just work. I'm Nuparu, by the way—engineer.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Onepu',
        text: `If you can reopen those tunnels, Onu-Koro will owe you a great debt, Takua.`,
        type: 'dialogue',
      },
    ],
  },

  mnog_canister_beach: {
    background: {
      from: '#1a3a4a',
      to: '#0d1f2d',
      type: 'gradient',
    },
    id: 'mnog_canister_beach',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Takua',
        text: `
          What is that? A large canister... washed ashore.
          And those footprints... they lead toward Ta-Wahi.
        `,
        type: 'dialogue',
      },
      {
        type: 'video',
        videoId: 'u0DYYVupuGQ',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Takua',
        text: `
          Who was that? I don't recognize that Matoran,
          maybe someone in Ta-Koro knows what is going on.
        `,
        type: 'dialogue',
      },
    ],
  },

  mnog_enter_le_wahi: {
    background: { from: '#2d5a1e', to: '#0a1a00', type: 'gradient' },
    id: 'mnog_enter_le_wahi',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `Look at all these trees! I've never seen so much green! Onu-Koro is nothing like this!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `Stay close, Taipu. The Le-Matoran say there are dangerous Rahi in these jungles.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `Don't worry! I am very strong. Nothing can—`,
        type: 'dialogue',
      },
      {
        text: `A massive Nui-Rama dives from the canopy. Before Takua can react, the insect snatches Taipu in its claws and rockets upward through the trees.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `TAKUAAAA!!!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `TAIPU! No! I have to find Le-Koro—someone there will know how to help!`,
        type: 'dialogue',
      },
      { type: 'video', videoId: 'vM0lWqZ9uD4' },
    ],
  },

  mnog_flight_to_hive: {
    background: { from: '#2d5a1e', to: '#1a3a1a', type: 'gradient' },
    id: 'mnog_flight_to_hive',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Tamaru',
        text: `Groundwalker! You made it! We feared the Rama had taken you too.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `They took my friend Taipu! What happened here? Where is everyone?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Tamaru',
        text: `The Nui-Rama have been swarming for weeks. They took Turaga Matau and most of Le-Koro. In the last rainfall, Kongu on patrol saw the Rama-hive growing topleaf-high, far in the dark forest.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Kongu',
        text: `I am Kongu, Captain of the Gukko Force—what's left of it. We have Kahu birds readied for a rescue flight, but we haven't had the numbers for a mission. Until now.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `I'll go. Taipu is in there—and your people too. Let's fly.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Tamaru',
        text: `I... I cannot fly. I was never strong enough for the Gukko Force. But I will not let that stop me. I'm coming too.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Kongu',
        text: `Then mount up, both of you. This will be a rough ride.`,
        type: 'dialogue',
      },
      { type: 'video', videoId: '3feiWoDhKzo' },
    ],
  },

  mnog_ga_koro_sos: {
    background: {
      from: '#0d2847',
      to: '#051a2e',
      type: 'gradient',
    },
    id: 'mnog_ga_koro_sos',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Maku',
        text: `
          Takua! Ga-Koro is under attack!
          A Rahi has trapped our people in a hut and sunk it!
        `,
        type: 'dialogue',
      },
      {
        type: 'video',
        videoId: 'qRVxnc26NDI',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          Jala sent me. I will help. Tell me what I need to do.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Maku',
        text: "Come with me, I'll sail us there.",
        type: 'dialogue',
      },
    ],
  },

  mnog_gali_call: videoOnly('mnog_gali_call', 'In1jZ3pZE9k'),

  mnog_journey_to_kini_nui_1: videoOnly('mnog_journey_to_kini_nui_1', 'HJI0snTJetM'),

  mnog_journey_to_kini_nui_2: videoOnly('mnog_journey_to_kini_nui_2', 'gx8dUv8I3-Y'),

  mnog_journey_to_kini_nui_3: videoOnly('mnog_journey_to_kini_nui_3', 'qXCfYwpGBqY'),

  mnog_journey_to_kini_nui_4: videoOnly('mnog_journey_to_kini_nui_4', 'lts_AXCvj60'),

  mnog_kini_nui_arrival: videoOnly('mnog_kini_nui_arrival', 'xfM3OOL7NJU'),

  mnog_kini_nui_defense: videoOnly('mnog_kini_nui_defense', 'ISmkk9Vg8IM'),

  mnog_lewa_v_onua: {
    background: { from: '#3a2a00', to: '#0a0a0a', type: 'gradient' },
    id: 'mnog_lewa_v_onua',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `Takua! You came for me! I knew you would!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `Of course, Taipu. Are you hurt?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `They made me carry things. Heavy things! But I am strong, so it was okay. But we can't get out—the Nui-Rama have sealed every tunnel.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Kongu',
        text: `We're trapped. Every exit is swarming with Rama. We need a miracle.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Tamaru',
        text: `Wait—listen! Something is happening above us... fighting! I can hear it—wind and earth clashing!`,
        type: 'dialogue',
      },
      { type: 'video', videoId: 'tggBKXjwPow' },
    ],
  },

  mnog_meet_taipu: {
    background: { from: '#2a1a00', to: '#1a2a00', type: 'gradient' },
    id: 'mnog_meet_taipu',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `Hello! Are you from the surface? I've never been to the surface! Is it true that the ceiling up there goes on forever?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `It does. They call it the sky. Who are you?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `I'm Taipu! I work in the mines. Turaga Whenua says I'm not the brightest Lightstone in Onu-Koro... but my strength is equaled only by my heart!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `This tunnel leads to Le-Wahi. I'm heading that way.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `Le-Wahi?! The jungle?! Oh, please let me come with you! I've always wanted to go on an adventure! I can carry things! Heavy things!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `All right, Taipu. But stay close—I don't know what's out there.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Taipu',
        text: `You won't regret it! This is the best day of my life!`,
        type: 'dialogue',
      },
    ],
  },

  mnog_po_koro_cave_investigation: videoOnly('mnog_po_koro_cave_investigation', 'EZdYj1GQR4s'),

  mnog_po_koro_sickness: {
    background: {
      from: '#2c84e9',
      to: '#ffe28e',
      type: 'gradient',
    },
    id: 'mnog_po_koro_sickness',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Ahkmou',
        text: `
          Hello, stranger!
          Are you looking for a good Koli ball?
          Let me recommend the Comet, our most popular model.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Takua',
        text: `
          What is a Koli ball?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Ahkmou',
        text: `
          Why, Koli balls are for playing Koli, of course!
          You’d want a Comet - our most popular model.
          Trading for two Husi Pecking Birds, or the equivalent.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Takua',
        text: `
          Where do you get your Koli balls?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Ahkmou',
        text: `
          Well, now, that’s privileged information, my friend.
          Let’s just say I have a secret source...
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Takua',
        text: `
          I don't have anything to trade.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Ahkmou',
        text: `
          Come back anytime… Our Comet balls are the best in Mata Nui.
          Everyone wants one!
          Don’t be the only Matoran in Po-Koro without a Comet!
        `,
        type: 'dialogue',
      },
    ],
  },

  mnog_po_wahi_desert: {
    background: {
      from: '#2c84e9',
      to: '#ffe28e',
      type: 'gradient',
    },
    id: 'mnog_po_wahi_desert',
    steps: [
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          I see a stone carver at that fork in the road.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Hafu',
        text: `
          Another Hafu original... *gestures toward his work*
          Wow... Sometimes I impress myself! Can you guess what it is yet?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          No.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Hafu',
        text: `
          *sigh* If you’re looking for Po-Koro, traveler,
          take the right road. My right. Or is it your right?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          Thank you.
        `,
        type: 'dialogue',
      },
    ],
  },

  mnog_recruit_hewkii: {
    background: {
      from: '#2c84e9',
      to: '#ffe28e',
      type: 'gradient',
    },
    id: 'mnog_recruit_hewkii',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Huki',
        text: `
          I will soon be fit enough to return to Koli, and to Maku.
          If you see her in your travels, tell her I am well!
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          I will.
        `,
        type: 'dialogue',
      },
    ],
  },

  mnog_rescue_from_hive: {
    background: { from: '#3a2a00', to: '#0a0a0a', type: 'gradient' },
    id: 'mnog_rescue_from_hive',
    steps: [{ type: 'video', videoId: 'dsSugRBjusI' }],
  },

  mnog_restore_ga_koro: {
    background: {
      from: '#0d2847',
      to: '#051a2e',
      type: 'gradient',
    },
    id: 'mnog_restore_ga_koro',
    steps: [
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          I see a collapsed hut under the water.
          I can see people trapped inside.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Hahli',
        text: `
          Help us! There is a water pump that can raise the hut again!
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          I see it! *click*
        `,
        type: 'dialogue',
      },
      {
        type: 'video',
        videoId: 'Fud_TgE_GTs',
      },
    ],
  },

  mnog_return_to_shore: videoOnly('mnog_return_to_shore', 'h0KeJl6i7Ns'),

  mnog_search_for_matoro: videoOnly('mnog_search_for_matoro', 'vp9RVeTHNfA'),

  mnog_summon_chroniclers_company: {
    background: { from: '#a0c4e8', to: '#e3e3ff', type: 'gradient' },
    id: 'mnog_summon_chroniclers_company',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kopeke',
        text: `...`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `I know you're quiet, Kopeke. But Turaga Nuju chose you for a reason. Will you come with me?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kopeke',
        text: `...yes.`,
        type: 'dialogue',
      },
      {
        text: `One by one, Takua visits each village. Each Turaga releases a Matoran to the Chronicler's call. Hafu from Po-Koro. Maku from Ga-Koro. Tamaru from Le-Koro. Taipu from Onu-Koro. Kapura from Ta-Koro. And Kopeke from Ko-Koro.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `The Company is assembled. The Toa need us to protect Kini-Nui while they face Makuta. Are you all ready?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kopeke',
        text: `Ready.`,
        type: 'dialogue',
      },
    ],
  },

  mnog_tahu_unlock_01: {
    background: { from: '#5b3e0b', to: '#0a0a0a', type: 'gradient' },
    id: 'mnog_tahu_unlock_01',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Jala',
        text: `
          Greetings Takua, you've come back at an eventful time.
          The Toa have come, and I found Tahu in the forest just a
          few moments ago.
        `,
        type: 'dialogue',
      },
      {
        type: 'video',
        videoId: 'Cn5jxci0RiQ',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          Tahu? Who is he?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Jala',
        text: `
          He is the protector of Ta-Koro, our village.
          He is speaking with Turaga Vakama right now.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Jala',
        text: `
          In the meantime, I've received a distress call from Ga-Koro,
          but I cannot send anyone to help, as we are dealing with Rahi
          attacks in Ta-Wahi too.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          I can go help them.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Jala',
        text: `
          Thank you Takua, safe travels.
        `,
        type: 'dialogue',
      },
    ],
  },

  mnog_takua_meets_kapura: {
    background: { from: '#e31a1a', to: '#0a0a0a', type: 'gradient' },
    id: 'mnog_takua_meets_kapura',
    steps: [
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          Are you lost?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kapura',
        text: `
          I am Kapura.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kapura',
        text: `
          Are you the Makuta?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          *Notices that Kapura is walking really slowly,
          so slowly that, from a distance, he looked like he
          was standing still*
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          What is the Makuta?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kapura',
        text: `
          If you don't know what the Makuta is,
          then you are probably not it.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kapura',
        text: `
          That is good.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kapura',
        text: `
          Jala says I have to be careful of the Makuta when I am in the forest.
          He says the Makuta is everywhere. He means Rahi. Monsters.
          Things you can see. But I know the Makuta is here now,
          in these burnt trees, and in the dead soil.
          All of these things were destroyed by the Makuta,
          but the Makuta never left them. That is how he becomes strong.
          That is what the Makuta does. He destroys things.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          What are you doing?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kapura',
        text: `
          I am practicing.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kapura',
        text: `
          Turaga Vakama says that even though I am slow,
          I may be faster than all the others, and travel very far.
          He says I must practice. Jala says I am being silly.
          I practice often.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          Where am I? I am lost.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Kapura',
        text: `
          You are where you are.
          If I practice, I can be where I am not. I think I can feel it.
          It is hot here where I am, but where I am not is cold,
          and I think I can feel it. I must practice more.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takua',
        text: `
          Ok, take care.
        `,
        type: 'dialogue',
      },
    ],
  },

  mnog_witness_makuta_battle: videoOnly('mnog_witness_makuta_battle', 'kQbHb3eNzzs'),
};
