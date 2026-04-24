import type { VisualNovelCutscene } from '../../types/Cutscenes';
import { videoOnly } from './shared';

export const STORY_CUTSCENES: Record<string, VisualNovelCutscene> = {
  story_kini_nui_descent: videoOnly('story_kini_nui_descent', 'oken0zw1D-U'),

  story_kini_nui_gathering: {
    background: { from: '#4a6741', to: '#1a1a0a', type: 'gradient' },
    id: 'story_kini_nui_gathering',
    steps: [
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `This is the place. I can feel the power of the temple—and something darker, far below.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `Makuta. He knows we're coming. Good. Let him wait.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `We should place our Golden Kanohi on the Suva. The legends say they will unlock the way.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Pohatu',
        text: `Brothers, before we go down there... it's been an honor. Whatever happens below—`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `Save the speeches for after we win, Pohatu.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Lewa',
        text: `Kopaka is right for once! Let's facefight this Makuta and be done with it!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `The Chronicler's Company will guard this temple while we descend. If anything tries to follow us down—or seal us in—they'll hold the line.`,
        type: 'dialogue',
      },
      {
        text: `Six pairs of eyes meet. Six Toa nod in unison. Together, they prepare to descend into the darkness beneath Kini-Nui.`,
        type: 'narration',
      },
    ],
  },

  story_nui_jaga_nest: {
    background: { from: '#1a3a1a', to: '#0a0a0a', type: 'gradient' },
    id: 'story_nui_jaga_nest',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `Here's the plan. At dawn, we go in. I'll take point, Onua and Pohatu on the flanks. Gali and Lewa cover the rear. Kopaka—do whatever you want, you will anyway.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `That isn't a plan, it's a charge. We don't know how deep the nest goes or what else is in there. Nui-Jaga hate smoke and water—we could flush them out and fight in the open.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `Gali has a point. We should know what we're walking into.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Pohatu',
        text: `Come on—we've handled worse. A few scorpions can't be that much trouble.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Lewa',
        text: `What does brother Kopaka thinksay?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `I think... that "Charge!" is not a plan.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `Enough! I am tired of debating every move! We need action, not—`,
        type: 'dialogue',
      },
      {
        text: `In his frustration, Tahu hurls a fireball into the brush. The dry undergrowth ignites—and thick smoke billows into the nest. Seconds later, a swarm of enraged Nui-Jaga bursts from every tunnel.`,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Gali',
        text: `Well. You flushed them out. Happy now?`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `...It worked, didn't it? Toa—fight!`,
        type: 'dialogue',
      },
      {
        text: `Despite their disagreements, the six Toa fight as one—fire, water, ice, stone, earth, and air striking together. The Nui-Jaga fall before their combined might.`,
        type: 'narration',
      },
    ],
  },

  story_toa_arrival: {
    background: {
      from: '#1a3a4a',
      to: '#0d1f2d',
      type: 'gradient',
    },
    id: 'story_toa_arrival',
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

  story_toa_council: {
    background: { from: '#5b3e0b', to: '#0a0a0a', type: 'gradient' },
    id: 'story_toa_council',
    steps: [
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Pohatu',
        text: `
          Mind if we join the party?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `
          I am Tahu, Toa of Fire. Who are you?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Pohatu',
        text: `
          I'm Pohatu, Toa of Stone. My talkative friend there is the Ice Toa, Kopaka.
        `,
        type: 'dialogue',
      },
      {
        text: `
          Introductions are made and the Toa share stories of their journeys. Kopaka stays silent, listening to the others.
        `,
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          (This Fire Toa is full of hot air. Will he be prepared for the heat of battle, or will he burn out quickly?)
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          (Onua, the Toa of Earth. He speaks less than the others. Does that subdued exterior hide a busy mind, or an empty one?)
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          (Lewa, the Toa of Air. So much energy. But it blows out of him uncontrolled, in all directions, like the wind. Not exactly someone I'd want to trust my life to in a tough spot.)
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          (Pohatu, the Toa of Stone. He was so quick to trust me, a stranger. I'm not sure I can trust him back.)
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          (Gali, the Toa of Water. That one I can't read. She's looking at me like she sees right through me. But that's not possible, right?)
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Gali',
        text: `
          Well, brothers, I suppose that's enough talk of the past. We should start discussing what comes next, yes? For despite all the interesting elemental powers we may have, I expect that our best weapon is our minds.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `
          You're right, Gali, we need to find these masks we seek, as quickly as possible. The Turaga of my village told me they will give us great powers. I know my own mask gives me the powers of protection or shielding...
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Pohatu',
        text: `
          That's right! Brother Kopaka has found a Mask of Shielding, too.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Tahu',
        text: `
          Yes... Well, there are five more masks out there for each of us.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          (Is Tahu upset he wasn't the first to find a mask? That pleases me.)
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `
          According to my Turaga, the masks are hidden all over the island and Makuta has set his Rahi creatures to guard them. So our quest won't be easy.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `
          Fine, fine. Anyway, the important thing is to find them - fast. We'll split into smaller groups. Gali and Lewa, you can search the jungle and beaches together. Onua and Kopaka can check the caves of Onu-Wahi. And Pohatu, you can come with –
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Lewa',
        text: `
          Hold on a quicksecond, brother Tahu. If speed is what we're after, why bother with the pairmaking? Why not each of us journeysearch on our own?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `
          Our fiery brother has a good plan. Working in pairs makes sense. It strikes a balance between speed and caution.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Gali',
        text: `
          Brothers, we have been brought together for a reason. I think we ought to stick together, at least until we know exactly what we're up against.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Pohatu',
        text: `
          She's right. Trust me, these Rahi creatures are nothing to face alone. But if we travel together they should give us little trouble. Right, Kopaka?
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `
          I can't agree, Toa of Stone. We should split up. As I already told you, I prefer to work alone.
        `,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `
          Enough of this bickering, we will accomplish nothing by standing here and having a debate. The decision is made - we split into small groups. It's the best of both worlds, can't you see that?
        `,
        type: 'dialogue',
      },
      {
        text: `
          Because of all the arguing, each Toa eventually goes their own way.
        `,
        type: 'narration',
      },
    ],
  },

  story_toa_second_council: {
    background: { from: '#3b2f1a', to: '#0a0a0a', type: 'gradient' },
    id: 'story_toa_second_council',
    steps: [
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `Thank you for coming. I know some of you would rather be out hunting masks alone. But we need to talk about what's been happening—honestly.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `I had a vision. Two towering beings—Akamai and Wairuha—locked in battle. And I was struck down in Ta-Wahi by unnatural ice. Someone—or something—is manipulating us.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Gali',
        text: `I saw the same vision in Po-Wahi. Whatever we are meant to become, we cannot reach it divided.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Tahu',
        text: `We split up. We struggled. Some of us nearly died. Maybe it's time we admit the Turaga were right—we're stronger together.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Lewa',
        text: `Strongagree! Solo-hunting through the deepwood was no laughfun. Nearly got swallowed by a Nui-Jaga twice!`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Pohatu',
        text: `I've been saying this from the start. Unity isn't weakness—it's the whole point.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Toa_Kopaka',
        text: `I still believe in efficiency. But... I will concede that having Lewa drag me out of Ta-Wahi was preferable to dying there.`,
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Toa_Onua',
        text: `Then we agree. From now on, we hunt as a team. The remaining masks will be found together.`,
        type: 'dialogue',
      },
      {
        text: `For the first time since their arrival on Mata Nui, the six Toa speak as one. Unity will be their path forward.`,
        type: 'narration',
      },
    ],
  },
};
