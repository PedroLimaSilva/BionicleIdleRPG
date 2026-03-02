import type { VisualNovelCutscene } from '../../types/Cutscenes';

export const MASK_HUNT_CUTSCENES: Record<string, VisualNovelCutscene> = {
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
};
