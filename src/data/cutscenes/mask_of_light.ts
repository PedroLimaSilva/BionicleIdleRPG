import { LegoColor } from '../../types/Colors';
import type { VisualNovelCutscene } from '../../types/Cutscenes';
import { Mask } from '../../types/Matoran';

export const MASK_OF_LIGHT_CUTSCENES: Record<string, VisualNovelCutscene> = {
  mol_discovery_of_avohkii: {
    id: 'mol_discovery_of_avohkii',
    background: { type: 'gradient', from: '#8b0000', to: '#ff6a00' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua! The kolhii match is about to start! Where are you?`,
      },
      {
        type: 'narration',
        text: `Jaller finds Takua in a lava runoff tunnel beneath the Wall of History, crossing a river of lava to reach a stone totem on a pedestal. Takua removes the totem, triggering a booby trap. The ground shakes. The stepping stones sink. The totem slips from his hands into the lava.`,
      },
      {
        type: 'narration',
        text: `From beneath the molten rock, a golden Kanohi rises to the surface, glowing with a light unlike anything Takua has seen. He grabs it—and sees a strange inscription on the inside. Then the earth trembles. A huge wave of lava rushes toward them.`,
      },
      {
        type: 'narration',
        text: `Toa Nuva Tahu surfs across the lava, grabs Takua, and thrusts his Magma Swords into the cliff face to stop their fall. He uses his Hau Nuva to shield them from a stream of falling lava. They climb back up to Jaller.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Careless, Chronicler. Show that mask to Turaga Vakama. Now get to the kolhii field—both of you.`,
      },
      {
        type: 'narration',
        text: `Tahu surfs away. Jaller stores the golden mask in his backpack, and the two Matoran rush back to Ta-Koro.`,
      },
    ],
  },

  mol_kolhii_tournament: {
    id: 'mol_kolhii_tournament',
    background: { type: 'gradient', from: '#8b0000', to: '#ff6a00' },
    steps: [
      {
        type: 'narration',
        text: `The Toa Nuva, Turaga, and villagers from Po-Koro, Ga-Koro, and Ta-Koro fill the stands of the Ta-Koro kolhii field. Three teams take the field: Takua and Jaller, Hewkii and Hafu, and Hahli and Macku.`,
      },
      {
        type: 'narration',
        text: `Takua attempts a difficult move but fails spectacularly—the ball ricochets off his stick and hits Turaga Vakama square in the mask. The crowd winces. Ga-Koro, led by Hahli, emerge victorious.`,
      },
      {
        type: 'narration',
        text: `As the three teams bow to the Turaga and Toa, the golden mask slips out of Jaller's bag and clatters onto the field at Takua's feet. He discreetly shifts the mask and it begins to shine on Jaller.`,
      },
    ],
  },

  mol_avohkii_prophecy: {
    id: 'mol_avohkii_prophecy',
    background: { type: 'gradient', from: '#ffe28e', to: '#5b3e0b' },
    steps: [
      {
        type: 'narration',
        text: `A special meeting is held at Tahu's suva to discuss the mask.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Nokama',
        portraitType: 'avatar',
        position: 'left',
        text: `I can read the inscription using my Rau. This is the legendary Mask of Light—the Kanohi Avohkii. Destined to be worn only by the Seventh Toa, the Toa of Light, who will free the island of Makuta's shadow.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Unlike the other six Toa, who arrived on the island in the past, this Toa must be found. The Avohkii shone its light on Jaller. You are the Herald of the Seventh Toa.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `I accept. But Takua should come with me—he found the mask. He is the Chronicler. He should record the journey.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Wait, I didn't—`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Agreed. Follow the mask's light. And be warned—Makuta will not ignore this discovery for long.`,
      },
      {
        type: 'narration',
        text: `Jaller and Takua leave Ta-Koro on Pewku, following the beam of the Avohkii.`,
      },
    ],
  },

  mol_fall_of_ta_koro: {
    id: 'mol_fall_of_ta_koro',
    background: { type: 'gradient', from: '#4a0000', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: `At Kini-Nui, Gali meditates and spots a new Spirit Star—representing the Seventh Toa's arrival. But deep below, Makuta has sensed the Avohkii. He releases the Rahkshi Guurahk, Lerahk, and Panrahk.`,
      },
      {
        type: 'narration',
        text: `The three Rahkshi blast through Kini-Nui's floor and Gali hides, observing. The Toa of Water flees and swims to the Mangai Volcano, arriving just before the Rahkshi reach Ta-Koro.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Tahu! Three creatures—they destroyed the suva at Kini-Nui! They are heading here!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        maskOverride: Mask.HauNuva,
        position: 'left',
        text: `Then let them come.`,
      },
      {
        type: 'narration',
        text: `The Rahkshi arrive and easily overpower Tahu and Gali. They tear through Ta-Koro searching for the Mask of Light—which has already left with Takua and Jaller. The village's supports give way. Ta-Koro sinks into the Lake of Fire.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        maskOverride: Mask.HauNuvaInfected,
        maskColorOverride: LegoColor.White,
        position: 'left',
        text: `Ta-Koro... gone. Everything we rebuilt after the Bohrok, gone in minutes.`,
      },
      {
        type: 'narration',
        text: `The Toa escape safely, but Tahu bears a new scar on his mask from Lerahk's staff—a wound that will fester.`,
      },
    ],
  },

  mol_le_wahi_ash_bear: {
    id: 'mol_le_wahi_ash_bear',
    background: { type: 'gradient', from: '#2d5a1e', to: '#0a1a00' },
    steps: [
      {
        type: 'narration',
        text: `Riding Pewku, Jaller and Takua wander through the jungles of Le-Wahi. Suddenly, Graalok the Ash Bear crashes through the undergrowth, trying to frighten them away.`,
      },
      {
        type: 'narration',
        text: `Jaller climbs a tree and jumps down on top of the Ash Bear. Before anyone gets hurt, Toa Nuva Lewa appears and entangles the creature in vines.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Easy, little Matoran. She is a mother. No need for fightclash.`,
      },
      {
        type: 'narration',
        text: `Lewa offers a Gukko bird as a ride and leads them in flight toward Ko-Koro, where the mask's light shines. But Pewku is too heavy to fly. They leave her behind and land roughly on a glacier above Le-Koro.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Wait. The Le-Koro drums... they bring darkbad news. Ta-Koro has been destroyed.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `What?! No—I have to go back!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Jaller, there's nothing to go back to. The best thing we can do is find the Seventh Toa.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `The Chronicler speaks true. Keep following the mask. I must go—my brothers need me.`,
      },
      {
        type: 'narration',
        text: `Lewa departs. Jaller and Takua press onward toward Ko-Koro, alone.`,
      },
    ],
  },

  mol_ko_wahi_pursuit: {
    id: 'mol_ko_wahi_pursuit',
    background: { type: 'gradient', from: '#e3e3ff', to: '#1a1a4a' },
    steps: [
      {
        type: 'narration',
        text: `In a Ko-Koro snowstorm, Jaller and Takua meet Toa Nuva Kopaka. He leads them toward the village, but probing ahead with his Akaku Nuva, he spots the three Rahkshi waiting inside.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Take my shield. Slide down the mountain. Do not stop.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jala',
        portraitType: 'avatar',
        position: 'left',
        text: `What about you?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I will be right behind you.`,
      },
      {
        type: 'narration',
        text: `Kopaka pushes the shield carrying the Matoran down the slope. He blocks a hit from Panrahk, then leaps after them using his Ice Blades as skates. A hard blow from the Rahkshi knocks Kopaka unconscious. The Matoran fall off the shield.`,
      },
      {
        type: 'narration',
        text: `Takua grabs the shield and crosses a frozen lake, using it as a raft and the Mask of Light as a paddle, luring the Rahkshi away from Jaller. The Rahkshi ignore Jaller and race toward Takua—but Kopaka recovers just in time, plunges his Ice Blades into the ice, and freezes the lake over, trapping the Rahkshi.`,
      },
      {
        type: 'narration',
        text: `Pewku arrives, having followed her master across the island. The Matoran continue their journey into the Onu-Koro Highway.`,
      },
    ],
  },

  mol_onu_koro_highway: {
    id: 'mol_onu_koro_highway',
    background: { type: 'gradient', from: '#2a1a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: `In the darkness of the Onu-Koro Highway, Takua is separated from Jaller and Pewku.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Jaller?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua...`,
      },
      {
        type: 'narration',
        text: `In the darkness, Makuta's glowing red eyes peer through the shadows.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `Shadows are everywhere. And where they are, so am I.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I know who you are. I am not afraid.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `Not even my shadows can hide your fear. Or the truth. That you will not find the seventh Toa. And deep down, you know it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `So I won't, maybe Jaller will.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `And if he doesn't, he will die because of you. Bring *me* the mask, Takua. Bring it to me and you won't lose your friend.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `No! I won't let everyone down.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `You'll fail them more if you refuse. For the mask, your villages and Jaller will be spared. Don't be a fool.`,
      },
      {
        type: 'narration',
        text: `The glowing red eyes of Makuta fade away. Jaller approaches Takua.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua! The mask is pointing this way! Are you coming?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `No... I can't go with you... `,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `What? Why? First you put this duty on me and now you abandon me?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I can't explain. I quit. Take the mask and go.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Fine! But I wont't give up, even if we both know you're the true Herald.`,
      },
      {
        type: 'narration',
        text: `With his first three Rahkshi trapped in ice, Makuta releases three more: Vorahk, Kurahk, and Turahk.`,
      },
    ],
  },

  mol_onu_koro_battle: {
    id: 'mol_onu_koro_battle',
    background: { type: 'gradient', from: '#2a1a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: `In Onu-Koro, Pohatu and Onua are spreading word of the Avohkii when the three new Rahkshi burst through the walls. Vorahk drains Onua's power. Turahk strikes Pohatu with fear. Takua attacks Kurahk with his kolhii stick but is beaten aside.`,
      },
      {
        type: 'narration',
        text: `Tahu arrives. Kurahk strikes him with anger, which aggravates the poison from Lerahk's scar. Tahu turns on Gali and Kopaka freezes him. Takua flees though a chimney with Rahkshi on his tail. Onua, desperate, brings the ceiling down on his village, burying the Sons of Makuta. Onu-Koro is destroyed.`,
      },
    ],
  },

  mol_tahu_poisoned: {
    id: 'mol_tahu_poisoned',
    background: { type: 'gradient', from: '#1a4a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: `Tahu is chained upon a stone, writhing. The poison from Lerahk's scar, aggravated by Kurahk's anger, has spread through his body.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Lewa, Kopaka—lay your weapons across his chest. Combine your powers. I will do the rest.`,
      },
      {
        type: 'narration',
        text: `Lewa and Kopaka lay their weapons across Tahu's chest and activate their powers. Gali creates a sphere of water that surrounds Tahu and sinks beneath his armor, cleansing him of the poison. The dark veins shatter.`,
      },
      {
        type: 'narration',
        text: `Gali collapses from exhaustion. Kopaka carries her to a lake to rejuvenate.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Maybe the Turaga were right. We are losing our unity. The Toa have forgotten how much we need each other.`,
      },
      {
        type: 'narration',
        text: `Having spotted something with his Akaku Nuva, Kopaka leaves Gali, in silence.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Kopaka?`,
      },
    ],
  },

  mol_takua_jaller_reunion: {
    id: 'mol_takua_jaller_reunion',
    background: { type: 'gradient', from: '#4a6741', to: '#1a1a0a' },
    steps: [
      {
        type: 'narration',
        text: `Jaller, alone, attempts to scale a cliff. Slipping from a ledge, he is caught by Takua—who has come back for him.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I'm sorry I left, Jaller. I was afraid.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `You came back. That's what matters. What changed your mind?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `The Rahkshi attacked Onu-Koro. The mask was never there. They are looking for the Herald.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `So they are looking for you?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `...`,
      },
      {
        type: 'narration',
        text: `Reunited, they continue their journey, following the mask's light.`,
      },
    ],
  },

  mol_battle_of_kini_nui: {
    id: 'mol_battle_of_kini_nui',
    background: { type: 'gradient', from: '#4a0000', to: '#1a0a2e' },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `No way, we've been all over the island just to end up here?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `No way, we've been all over the island just to end up here? Are you sure the mask is working right?`,
      },
      {
        type: 'narration',
        text: `Frustrated, Takua takes the mask from Jaller and shakes it. The Avohkii fires a beam that partially destroys a statue, revealing another statue behind it.`,
      },
      {
        type: 'narration',
        text: `At that moment, all six Rahkshi ambush them. The Matoran retreat toward the Amaja Circle—and the six Toa Nuva arrive. Tahu shields everyone with his Hau Nuva. Uniting their powers at last, the Toa engage the Rahkshi.`,
      },
      {
        type: 'narration',
        text: `Guurahk, Panrahk, and Lerahk are trapped in glass. Vorahk and Kurahk are frozen after being showered with lava. Five Rahkshi fall.`,
      },
      {
        type: 'narration',
        text: `Turahk, unnoticed by the Toa, rises from the rubble. It approaches Jaller and Takua.`,
      },
      {
        type: 'narration',
        text: `Striking Takua with fear, Turahk lifts its staff to kill the Matoran. Jaller sees it. He grabs onto Turahk's staff, trying to stop it. The Rahkshi floods Jaller with more fear than any being can endure, then swings him off.`,
      },
      {
        type: 'narration',
        text: `The Toa Nuva subdue Turahk. But the damage is done.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Jaller! No—hold on—`,
      },
      {
        type: 'narration',
        text: `Jaller passes the mask to Takua.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `You know who you are. You were always different.`,
      },
      {
        type: 'narration',
        text: `Jaller's heartlight fades.`,
      },
    ],
  },

  mol_takanuva_rises: {
    id: 'mol_takanuva_rises',
    background: { type: 'gradient', from: '#ffe28e', to: '#ffffff' },
    steps: [
      {
        type: 'narration',
        text: `Takua holds the Avohkii. He looks down at his fallen friend. Then he accepts his destiny.`,
      },
      {
        type: 'narration',
        text: `He places the Mask of Light on his face. Light explodes outward. His body grows. His armor reshapes into gold and white. Where a Matoran knelt, a Toa now stands.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I am Takanuva, Toa of Light.`,
      },
      {
        type: 'narration',
        text: `Takanuva, shoots a beam of light that stuns Turahk and destroys it. He fires a laser at the stone statue at Kini-Nui, completely revealing a carving of Takua's mask hidden beneath. He picks up Jaller's body and silently walks away.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Do not grieve, Toa of Light. Mata Nui knows best.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `My duty is clear. Jaller's sacrifice will not be in vain.`,
      },
    ],
  },

  mol_defeat_of_makuta: {
    id: 'mol_defeat_of_makuta',
    background: { type: 'gradient', from: '#0a0a0a', to: '#3d0066' },
    steps: [
      {
        type: 'narration',
        text: `Takanuva and the Toa Nuva assemble the Ussanui from Rahkshi parts and place a Kraata inside. Hahli places Jaller's Hau on the vehicle for good luck. Pohatu notes it won't carry all of them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: `It is my destiny alone to destroy the Makuta. You can catch up later.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Hahli',
        portraitType: 'avatar',
        position: 'right',
        text: `Someone needs to be your chronicler now, take me with you.`,
      },

      {
        type: 'narration',
        text: `Takanuva races through the tunnels to Mangaia. He and Hahli jump from the Ussanui just before it slams into the stone gate, creating a hole.`,
      },
      {
        type: 'narration',
        text: `Inside, Takanuva enters a chamber with three pools of energized protodermis forming the Three Virtues symbol, and a large Hau-shaped gate. He throws down the Kraata. It slithers into the shadows.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `I am the shadow that guards the gate. You will not pass.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `But I will offer you a game. Kolhii. If you win, you may try the gate. If you lose—I take the Mask of Light.`,
      },
      {
        type: 'narration',
        text: `The game begins. Two titans hurl spheres of Light and Shadow energy from their staffs. During the match, the Matoran, Turaga, and Toa arrive. Makuta mocks Takanuva and brings the ceiling down behind the spectators.`,
      },
      {
        type: 'narration',
        text: `Angered, Takanuva executes the move he had failed in the kolhii tournament—grabbing a shadow sphere, turning it to light, and hurling it directly into Makuta's chest, throwing him backward.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: `I must protect Mata Nui from the Toa. Sleep spares him pain.`,
      },
      {
        type: 'narration',
        text: `Takanuva sheathes his Staff of Light, jumps on Makuta, and grasps the Kraahkan, trying to tear it off. They grapple—and both fall into the pool of energized protodermis.`,
      },
      {
        type: 'narration',
        text: `From the pool rises Takutanuva—a fusion of the Toa of Light and the Master of Shadows.`,
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
        text: `Takutanuva grasps the bottom of the gate and lifts it. The Matoran pass through. Hahli runs in with Jaller's mask. Takutanuva revives Jaller with part of his own life force. But the gate is too heavy. It crashes down. The Avohkii slides out from under it. Takanuva appears to be gone.`,
      },
    ],
  },

  mol_rediscovery_of_metru_nui: {
    id: 'mol_rediscovery_of_metru_nui',
    background: { type: 'gradient', from: '#0d1f2d', to: '#ffe28e' },
    steps: [
      {
        type: 'narration',
        text: `Vakama picks up the Avohkii and walks toward a Three Virtues symbol on a ledge nearby.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Jaller—step onto the symbol representing Duty. Hahli—step on the symbol representing Unity.`,
      },
      {
        type: 'narration',
        text: `Vakama places the Mask of Light on the symbol representing Destiny. Light shines through the symbols. Takanuva is revived.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `Takua?!`,
      },
      {
        type: 'narration',
        text: `Takanuva activates his mask and sends a beam of light off into the Silver Sea, revealing a great city in the distance: Metru Nui.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `United, we embraced our duty. Light found itself and illuminated our destiny. The City of the Great Spirit, my island home, refound. New legends awake, but old lessons must be remembered.`,
      },
    ],
  },
};
