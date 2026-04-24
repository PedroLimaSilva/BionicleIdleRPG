import type { VisualNovelCutscene } from '../../types/Cutscenes';

export const MASK_HUNT_CUTSCENES: Record<string, VisualNovelCutscene> = {
  maskhunt_final_collection: {
    background: { from: '#2a1f4e', to: '#0d0d1a', type: 'gradient' },
    id: 'maskhunt_final_collection',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `We've mapped the remaining locations. Volcanic caves, ice ridges, jungle canopy, desert shrines. Each region holds masks for multiple Toa.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `No one goes alone. We clear each site together and move on.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `Agreed. There will be time to be alone after Makuta is defeated.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Lewa',
        text: `That's the spirit, ice-brother! Almost sounds like you enjoy our company!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `Don't push it.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `Let's finish this. The sooner we collect every mask, the sooner we face what's beneath the island.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `Unity, duty, destiny. Remember those words, brothers. We will need them.`,
        type: 'dialogue',
      },
    ],
  },

  maskhunt_forest_tahu_kakama: {
    background: { from: '#2d5a1e', to: '#8b2500', type: 'gradient' },
    id: 'maskhunt_forest_tahu_kakama',
    steps: [
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `Too bad brother Lewa isn't here to play monkey for us. Can you levitate it down, Tahu?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `I have a faster way.`,
        type: 'dialogue',
      },
      {
        text: `Before anyone can object, Tahu hurls a concentrated blast of fire at the tree trunk. The ancient wood erupts in flame—and the fire begins spreading to the canopy around it.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `Tahu! What have you done?! The whole jungle is catching fire!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `I— it wasn't supposed to spread that fast—`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `Gali, can you stop it?`,
        type: 'dialogue',
      },
      {
        text: `Gali raises her hooks skyward and summons a torrential downpour. Rain hammers the canopy, hissing against scorched bark until the last ember dies.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `You didn't think, Tahu. You never think. Innocent Rahi lived in that tree. Plants depended on it. You didn't care about any of that—you just wanted your mask.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `I got the mask, didn't I? That's what matters.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `No. How you get it matters too. I expected more from a Toa.`,
        type: 'dialogue',
      },
      {
        text: `Gali turns and walks away into the rain-soaked jungle. Onua watches her go, then looks at Tahu—but says nothing.`,
        type: 'narration',
      },
    ],
  },

  maskhunt_gali_rescue: {
    background: { from: '#8b4513', to: '#cd5c5c', type: 'gradient' },
    id: 'maskhunt_gali_rescue',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `Need a hand, sister?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `Tahu! Your timing is impeccable—for once.`,
        type: 'dialogue',
      },
      {
        text: `Fire and water surge through the ravine in tandem, driving the Rahi back. The two Toa fight side by side, their elements complementing each other in the confined space.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `You know, we make a pretty good team when you're not lecturing me.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `And you make a tolerable ally when you're not setting things on fire.`,
        type: 'dialogue',
      },
      {
        text: `As the last beast falls, Gali staggers. A blinding vision floods her mind—two towering figures, one of fire and valor, one of water and wisdom, merged into beings greater than any single Toa.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `I saw something, Tahu. Two great beings—Akamai and Wairuha. We are meant to become more than we are.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `Visions? Are you sure it's not the heat getting to you?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `I am certain. There is a power beyond what any of us can wield alone. Remember that, brother.`,
        type: 'dialogue',
      },
    ],
  },

  maskhunt_kopaka_matoro_icecliff: {
    background: {
      from: '#1a3a4a',
      to: '#e3e3ff',
      type: 'gradient',
    },
    id: 'maskhunt_kopaka_matoro_icecliff',
    steps: [
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          I have slept for so long, I can only remember my name.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          I am Kopaka.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          My mask lets me see through the ice. And I see I am not alone.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          Come out, little one, before you catch a chill.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          Who are you, and why were you spying on me?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Matoro',
        text: `
          I... I am Matoro, a Matoran. I saw you come ashore and assemble yourself. We've been waiting for you.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          "We"? Who's "we"?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Matoro',
        text: `
          All of us here, on Mata Nui have been waiting for you. You and the other Toa.
          Now you need to find the masks of power!
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          What others? What masks? Where are they?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Matoro',
        text: `
          The masks are hidden all over Mata Nui. Turaga Nuju will know more.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          Take me to this Turaga Nuju.
        `,
        type: 'dialogue',
      },
      {
        text: `
          Matoro leads Toa Kopaka to Turaga Nuju.
        `,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Matoro',
        text: `
          Turaga Nuju! He's come! This is Toa Kopaka!
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Turaga_Nuju',
        text: `
          *click* *whistle* *peep*
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          Is he cross-wired?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Matoro',
        text: `
          No, this is how he communicates. I'm his translator. He welcomes you, Toa Kopaka.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          Pardon me Turaga. Can you help me with my quest?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Matoro',
        text: `
          Turaga Nuju says that you are powerful as Toa of Ice, but your power alone is not enough to defeat Makuta. You need to find the masks of power scattered all over Mata Nui.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Matoro',
        text: `
          And even with the masks, you will need to find the other Toa and work with them to defeat Makuta.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          Where can I begin looking for the masks?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Matoro',
        text: `
          You'll find a mask in the Place of Far-Seeing.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          Thank you Turaga Nuju. I will go now.
        `,
        type: 'dialogue',
      },
    ],
  },

  maskhunt_kopaka_pohatu_icecliff: {
    background: {
      from: '#1a3a4a',
      to: '#e3e3ff',
      type: 'gradient',
    },
    id: 'maskhunt_kopaka_pohatu_icecliff',
    steps: [
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          The sky has darkened. And though I sense no storm rising, I hear the rumble of thunder...
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `
          *RUMBLE* WATCH OUT!!! *CRASH*
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `
          Sorry about that! I was practicing. Are you all right?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          I would be, if you weren't standing on me.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `
          I'm sorry. Let me help you out of this rubble.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          No need, I can do it myself.
        `,
        type: 'dialogue',
      },
      {
        text: `
          Focusing his energy, Toa Kopaka channeled it through his Ice Blade. A thrill ran through him as the rock around him froze solid, becoming brittle and glassy. Bringing the blade down, he smashed the icy boulder into smithereens, freeing himself.
        `,
        type: 'narration',
      },
      {
        text: `
          Kopaka stood up and turned around to continue his quest, alone.
        `,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `
          Hey! Wait! Are you a Toa? I've been looking for you - I am Pohatu, Toa of Stone.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          Kopaka... Ice. And if you don't mind, I'm in the middle of something. See you later.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `
           Wait! Listen, I have a feeling we're both here for the same reason. Why not team up? It might make things easier.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          I work alone.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `
          By choice? Or just because no one can stand you?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          All right, come along. After all, I might need a mountain moved - or the island lifted.
        `,
        type: 'dialogue',
      },
      {
        text: `
          Toa Kopaka and Toa Pohatu reach the peak of the mountain.
        `,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `
          This place is Far-Seeing, alright! There's the mask of power! Go ahead - claim your prize, brother.
        `,
        type: 'dialogue',
      },
      {
        text: `
          Kopaka picked up the mask and placed it over his own. Immediately, he felt the power of the Mask of Shielding flow through him, like a cushion protecting him.
        `,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          I can feel the power of the Mask of Shielding, but the powers of the Mask of Vision are still mine to use.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          We have company, let's go.
        `,
        type: 'dialogue',
      },
    ],
  },

  maskhunt_pohatu_kaukau_bluff: {
    background: { from: '#c2a366', to: '#4a3728', type: 'gradient' },
    id: 'maskhunt_pohatu_kaukau_bluff',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `A Water Breathing mask... on top of a mountain. The irony is not lost on me.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Lewa',
        text: `Highclimbing is what I do best! Follow my lead, brothers!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `The wind is too strong for reckless climbing. We need a plan.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `I can kick footholds into the cliff face. Lewa, you keep the wind off us. Kopaka, freeze any loose rock so it holds.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `Acceptable.`,
        type: 'dialogue',
      },
      {
        text: `Stone shatters under Pohatu's kicks, carving handholds into the cliff. Lewa deflects the worst gusts while Kopaka locks every foothold in ice. Step by step, the three Toa ascend.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Lewa',
        text: `Almost there! I can sightspot the mask!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Pohatu',
        text: `Got it! The Kanohi Kaukau—the Mask of Water Breathing. Now I just need to find some water to use it in.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `One problem at a time.`,
        type: 'dialogue',
      },
    ],
  },

  maskhunt_tahu_miru: {
    background: { from: '#0d2847', to: '#051a2e', type: 'gradient' },
    id: 'maskhunt_tahu_miru',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Gali',
        text: `There—the shrine. Stay close. The currents here are treacherous.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `I see movement behind the rocks. Something large.`,
        type: 'dialogue',
      },
      {
        text: `A massive Tarakava erupts from the shadows, its armored fists slamming into the water. The beast is territorial and enraged.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `I'll hold it! Gali, direct the currents—pin it against the reef!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Gali',
        text: `On it! Kopaka—freeze the water around its arms!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `Done.`,
        type: 'dialogue',
      },
      {
        text: `With the Tarakava immobilized, Gali swims to the shrine and retrieves the Kanohi Miru. The Mask of Levitation pulses with energy in her hands.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Gali',
        text: `I have it. Let's surface before this beast breaks free.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `That went well. Tahu will be pleased—though he'll never admit he couldn't get it himself.`,
        type: 'dialogue',
      },
    ],
  },
};
