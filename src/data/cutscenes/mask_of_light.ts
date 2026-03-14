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
        position: 'right',
        text: `Takua! The kolhii match is about to start! Where are you?`,
      },
      {
        type: 'narration',
        text: `Jaller finds Takua in a lava runoff tunnel beneath the Wall of History, crossing a river of lava to reach a stone totem on a pedestal.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `Takua! What are you doing down here?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Oh, yeah, sorry, Jaller. Hang on a sec, I just want to check out that totem.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `You’re hopping across lava to look at a stupid warning totem?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I got curious,`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `Do you know what Turaga Vakama would say?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Can’t say exactly, but I’m betting the word irresponsible would come up.`,
      },
      {
        type: 'narration',
        text: `Takua makes his way across the lava to the totem. Once he picks it up, the ground shakes and the stepping stones sink. The totem slips from his hands into the lava.`,
      },
      {
        type: 'narration',
        text: `From beneath the molten rock, a golden Kanohi rises to the surface, glowing with a light unlike anything Takua has seen. He grabs it—and sees a strange inscription on the inside.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `Takua, get out of there!`,
      },
      {
        type: 'narration',
        text: `A huge wave of lava rushes toward Takua. He uses his lava board to try to ride across the lava river but loses momentum mid-way.`,
      },
      {
        type: 'narration',
        text: `Toa Tahu Tahu surfs across the lava and grabs Takua just in time. He drops Takua next to Jaller.`,
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
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `(What an embarrasment! I couldn't even score one goal!)`,
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
        text: `This is the legendary Mask of Light—the Kanohi Avohkii. Destined to be worn only by the Seventh Toa, the Toa of Light, who will free the island of Makuta's shadow.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Onewa',
        portraitType: 'avatar',
        position: 'left',
        text: `Unlike the other six Toa, who arrived on the island in the past, this Toa must be found.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Nokama',
        portraitType: 'avatar',
        position: 'left',
        text: `The Mask of Light chose who would find it, perhaps it also chose who would deliver it to its master.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Wait, at the stadium, there was a sign! The mask threw all its light upon one Matoran. He must be the Herald of the Seventh Toa!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `B-but I didn't... Tell them the truth, Takua! Say something!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `(I know what you want, Jaller. To tell the truth. But I'm not going to take responsibility for this. Who knows how I would mess up such an important quest! No, this is a job for someone responsible. Someone mature. Someone like Jaller.)`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Hail Jaller! Herald of the Seventh Toa! All hail Jaller!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: `Captain of the Guard! Approach! It seems the mask has chosen you, will you seek the Seventh Toa?`,
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
        text: `Riding Pewku, Jaller and Takua wander through the jungles of Le-Wahi.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Ugh. I hate the jungle. It's all sticky and... full of bugs.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `How can you say that? It's incredible! Is there any place on Mata Nui where you do feel at home?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I don't complain about Ta-Koro.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `But you wander off every chance you get, looking for stories. What about your story?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I don't have a story.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Only 'cause you won't stand still long enough to make one. We all have a destiny, you know.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `You know me. Always different.`,
      },
      {
        type: 'narration',
        text: `Suddenly, Graalok the Ash Bear crashes through the undergrowth, trying to frighten them away.`,
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
        text: `Lewa frees the Ash Bear and sends them on their way.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Ever windfly a Gukko bird?`,
      },

      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `N-no way! I've never even flown on a Gukko before...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Well, I've been a passenger once... but I’ve never really flown one myself.`,
      },
      {
        type: 'narration',
        text: `Lewa suddenly scoops up Takua and Jaller and lifts them onto the Gukko bird. The two Matoran land behind the bird’s head—Takua in the front.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Then today’s for quicklearnin’! Stay sharp, and follow-well!`,
      },
      {
        type: 'narration',
        text: `The Matoran yelp in surprise as Lewa spreads his arms, the air katana blades locking into his shoulders. He leaps into the air beside them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Wait. The Le-Koro drums... they bring darkbad news. Ta-Koro has been destroyed. By Rahkshi, the Makuta sons.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `My village, in trouble? I should have been there! I must return!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Sorry, firespitter. Past-late to help now. The mask most needs you.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Takua will continue in my place.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Uh-uh, no way! You accepted this duty.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `I accepted *your* duty!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Stop! What's this dutyquarrel? We all have a duty to Mata Nui. No time to infight.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `I must go be with the Toa. But then I'll go to your village, Jaller. Heartpromise.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `I... can't thank you enough, Toa.`,
      },
    ],
  },

  mol_ko_wahi_arrival: {
    id: 'mol_ko_wahi_arrival',
    background: { type: 'gradient', from: '#e3e3ff', to: '#1a1a4a' },
    steps: [
      {
        type: 'narration',
        text: `Dark storm clouds gathered over the mountain peaks as Jaller and Takua struggled through the snowdrifts. On a ridge overlooking the valley, a dark shape watched their progress. Jaller and Takua never noticed it as they clambered through the icy drifts.`,
      },
      {
        type: 'narration',
        text: `Amid the whirling snow, Takua spotted an odd-looking stone with writing carved on it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Stop!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Does something look familiar here?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `You mean besides everything?`,
      },
      {
        type: 'narration',
        text: `Jaller gazed around at the whiteout conditions, panting.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I mean this. We've passed this at least a million times. And look...`,
      },
      {
        type: 'narration',
        text: `Takua pointed at the stone, then at footprints in the snow leading ahead.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Those are either our footprints or the steps to a Le-Matoran dance.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Well, don’t blame me! I’m following the mask.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Fine! Let’s all freeze to death because the mask says to.`,
      },
      {
        type: 'narration',
        text: `Jaller turned and kept walking. Neither he nor Takua noticed as the mask gradually dimmed.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Well, maybe our path would be straighter if the real Herald had the mask.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `The real Herald has the mask. I couldn’t find water if I fell out of a canoe.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Well, what do you think I can find? I– oof!`,
      },
      {
        type: 'narration',
        text: `Jaller's words cut off as he slammed into a tall white figure, almost hidden in the blowing snow.`,
      },
      {
        type: 'narration',
        text: `Takua’s eyes widened as the ominous shapes of six white creatures towered over them.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Uh, so far you’re good at big scary… Bohrok!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `They're... frozen...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `What could do this to them?`,
      },
      {
        type: 'narration',
        text: `Suddenly, one of the Bohrok lurched forward. Jaller and Takua jumped in fright. The Bohrok crashed to the ground… revealing a very different figure standing behind it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Kopaka! Toa of Ice! H-how did you find us?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `It was you who were following me.`,
      },
      {
        type: 'narration',
        text: `Kopaka’s icy voice was full of suspicion. Jaller kept a nervous eye on the Toa’s ice blade.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `We were?`,
      },
      {
        type: 'narration',
        text: `Kopaka finally put his blade away. He turned and walked off without another word.`,
      },
      {
        type: 'narration',
        text: `Takua and Jaller exchanged a glance. Both were thinking the same thing — the Toa of Ice would make a very useful guide in this frozen wasteland. They hurried after him.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `We didn’t mean to!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `We were lost.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `We’re on a mission!`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `We’ve been sent to find the Seventh Toa. You see, Takua here was in the tunnel where the lava break is, where he’s not supposed to be, by the way, and I told him—`,
      },
      {
        type: 'narration',
        text: `Kopaka halted, silencing Jaller with an upraised hand.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Ulp. Sorry.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `You are the Chronicler.`,
      },
      {
        type: 'narration',
        text: `Takua was a bit unnerved by the Toa’s icy gaze.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Uh, yes.`,
      },
      {
        type: 'narration',
        text: `Kopaka looked thoughtful.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Your stories have aided the Toa in the past. I will take you to my village of Ko-Koro. State your purpose to the Turaga.`,
      },
      {
        type: 'narration',
        text: `He strode off, not bothering to look and see if they were following.`,
      },
    ],
  },
  mol_tahu_worsens: {
    id: 'mol_tahu_worsens',
    background: { type: 'gradient', from: '#e3e3ff', to: '#1a1a4a' },
    steps: [
      {
        type: 'narration',
        text: `At the main temple, Lewa glided to a landing in front of Tahu and Gali. He held up his fist, which Tahu clanked with his own in greeting.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        maskOverride: Mask.HauNuvaInfected,
        maskColorOverride: LegoColor.White,
        position: 'left',
        text: `Ta-Koro is gone, Lewa. Buried by the very lava that sustained it.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `Tahu...`,
      },
      {
        type: 'narration',
        text: `Gali's gaze rested on Tahu. She reached out to touch the scratch on his mask, which appeared to be spreading.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        maskOverride: Mask.HauNuvaInfected,
        maskColorOverride: LegoColor.White,
        position: 'left',
        text: `You worry about scratches? My village is gone! Your power was nothing! My power was...`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        maskOverride: Mask.HauNuvaInfected,
        maskColorOverride: LegoColor.White,
        position: 'left',
        text: `Nothing.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `We are samehearted, brother. And that heart will quicken us to stop the evilspread.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: `But first we must be united. Together we are strong.`,
      },
      {
        type: 'narration',
        text: `Without answering either of them, Tahu turned and stalked away.`,
      },
    ],
  },
  mol_ko_wahi_pursuit: {
    id: 'mol_ko_wahi_pursuit',
    background: { type: 'gradient', from: '#e3e3ff', to: '#1a1a4a' },
    steps: [
      {
        type: 'narration',
        text: `Takua, Jaller, and Kopaka rounded a hill of ice. Before them spread a snowy valley. Steep cliffs rose on the far side. Set into one of the cliffs was a village, accessible only by a bridge of ice.`,
      },

      {
        type: 'narration',
        text: `But something was wrong. The village wall had fallen. Huts were in shambles, and smoke rose from the ruins. There was no one in sight.`,
      },

      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Stop! Something is wrong.`,
      },

      {
        type: 'narration',
        text: `Jaller and Takua blinked, confused, as the Toa tossed his shield facedown onto the snow beside them. Suddenly realizing what Kopaka meant for them to do, Jaller shook his head.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: `The Captain of the Guard never runs away!`,
      },
      {
        type: 'narration',
        text: `His last word was lost in a cry of terror as Takua pushed him onto the shield and jumped aboard himself. The momentum carried the shield skidding toward the cliff. It toppled on the edge, then tipped down, sliding faster and faster along the impossibly steep incline.`,
      },

      {
        type: 'narration',
        text: `Kopaka hardly heard their fading screams. He faced the Rahkshi as they closed in on him.`,
      },
      {
        type: 'narration',
        text: `The Fragmenter-Rahkshi sent yet another bolt of energy arcing toward him. Kopaka somersaulted away, dodging the bolt. As he came down, he tossed his twin blades onto the snow. He landed on them, turning them into power ice skates, on which he glided down the cliff face.`,
      },
      {
        type: 'narration',
        text: `Kopaka caught up to the shield-sled just as it reached the bottom of the cliff. He grabbed the edge and pulled it behind him as he veered into a ravine.`,
      },
      {
        type: 'narration',
        text: `An arc of dark energy smashed into the snow right in Kopaka’s path. The shock waves knocked him off his feet, sending him rolling into the snow.`,
      },
      {
        type: 'narration',
        text: `The shield flipped over, dumping Takua and Jaller as well. They tumbled head over heels, landing on the very edge of the lake.`,
      },

      {
        type: 'narration',
        text: `The Fragmenter-Rahkshi hissed triumphantly as it hovered down toward him. The other two Rahkshi were right behind the first. The creatures hovered right past Kopaka, who appeared to be unconscious, heading straight for the two Matoran.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `Why us? What did we do?`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `The mask!`,
      },
      {
        type: 'narration',
        text: `He grabbed the mask, which started glowing brighter than ever. Pushing Kopaka’s shield onto the cold water of the lake, he jumped on, using the mask as a paddle.`,
      },

      {
        type: 'narration',
        text: `Left behind, Jaller watched nervously as the Rahkshi approached. He dove out of the way as they hovered toward him. But they didn’t even glance his way. Their glowing eyes were focused on Takua. They hovered out over the water, following him.`,
      },

      {
        type: 'narration',
        text: `Takua paddled as hard as he could. But with every glance back, he saw the Rahkshi gaining on him. Finally they were close enough to reach out for him with their clawed arms.`,
      },

      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `I guess this is the end`,
      },

      {
        type: 'narration',
        text: `Just then his gaze caught motion back on the lakeshore. Kopaka was awake – he was swinging his ice blade overhead. A second later a blast of elemental ice spun through the air, heading straight for the Rahkshi!`,
      },

      {
        type: 'narration',
        text: `The icy blast hit the Fragmenter-Rahkshi and knocked it off balance. It crashed into the other two creatures, and all three of them toppled and landed in the lake with a splash.`,
      },

      {
        type: 'narration',
        text: `Kopaka twirled his blade, then stabbed the point into the edge of the lake. The water crystallized instantly into ice, the deep freeze spreading rapidly until the entire lake was frozen solid. The Rahkshi, who were just reaching the surface, were trapped in place.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Good moves.`,
      },

      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Even I get lucky sometimes.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: `Not luck, it's what you do that makes a hero. I need to tend to my village.`,
      },
      {
        type: 'narration',
        text: `Kopaka left, leaving Takua and Jaller alone on the ice. Takua offerd the mask to Jaller. `,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Here.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: `You were looking pretty Herald-like back there. Sure you don't want to hang on to it?`,
      },
      {
        type: 'narration',
        text: `Takua slapped the mask against Jaller’s chest. As Jaller held it, the mask's glow slowly faded.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Tempting, but no.`,
      },
    ],
  },
  mol_onu_koro_highway: {
    id: 'mol_onu_koro_highway',
    background: { type: 'gradient', from: '#2a1a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: `Takua, Jaller, and Pewku stopped beside a small tunnel entrance dug out of an icy mountainside. Takua leaned closer to read the writing on a battered old totem that marked the entrance.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: `Onu-Koro. It doesn’t look like it’s been used in a while. And we don’t have a lightstone.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'right',
        text: 'Who needs lightstones? We have a Mask. of. Light.',
      },
      {
        type: 'narration',
        text: 'Jaller led the way into the tunnel. Pewku followed. Takua hesitated, then climbed down into the darkness after them',
      },
      {
        type: 'narration',
        text: 'Takua…',
      },
      {
        type: 'narration',
        text: 'Takua stopped short. Was he hearing things? He peered into the darkness behind him. But there was no sign of life or movement.',
      },
      {
        type: 'narration',
        text: 'By the time he turned around, Jaller and Pewku had disappeared.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Uh, guys? Where’d you go?',
      },
      { text: 'Takua…', type: 'narration' },
      {
        text: 'Takua gulped. That time he’d definitely heard it. But who? Where? Why?',
        type: 'narration',
      },
      {
        text: 'In the blinding dark, he crashed into a wall and fell. Suddenly an eerie red glow lit up the tunnel. A pair of red eyes appeared in the dimness.',
        type: 'narration',
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: 'Shadows are everywhere. And where they are, so am I.',
      },
      {
        text: 'Takua backed away from the eyes. His heart was pounding. The Makuta. It had to be.',
        type: 'narration',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'I know who you are. I-I’m not afraid.',
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: 'Even my shadows cannot hide your fear, or the truth.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'What truth?',
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: 'That you will not find the Seventh Toa. And deep down, you know it.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'So I won’t. Maybe Jaller will.',
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: 'And if he doesn’t? He will die, because of you. Bring me the mask, Takua. Bring it to me and you won’t lose your friend.',
      },
      {
        text: 'Takua was horrified. Was this his choice? Betray all of Mata Nui – or allow Jaller to die?',
        type: 'narration',
      },
      {
        text: '(Makuta is said to be the master of lies. Maybe this choice is a lie, too…)',
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'N-no! I won’t let everyone down.',
      },
      {
        type: 'dialogue',
        speakerId: 'Makuta',
        portraitType: 'avatar',
        position: 'left',
        text: 'You fail them more if you refuse, For the mask, your villages and Jaller will be spared. Don’t be a fool.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'N-no, I can’t…',
      },
      {
        type: 'narration',
        text: 'Suddenly a flash of light flooded the tunnel. Jaller’s voice called from somewhere ahead. A second later he and Pewku appeared.',
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'Keep up, kolhii-head, I found some better tunnels!',
      },
      {
        text: 'Takua stared around wildly. But there was no sign of Makuta. Unable to speak, he merely followed as Jaller and Pewku turned and headed down the tunnel again.',
        type: 'narration',
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'So where’d you wander off to?',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Jaller, Um, about the mask…',
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'What about it? You ready to take it? Finally?',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'I can’t… go with you. I… can’t explain.',
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'Oh, that’s just great, First you stick me with your duty and then you ditch me?',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'My duty is to myself. I quit. Just take the mask and go.',
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'Fine, But I won’t give up. I will find the Seventh Toa, whether you’re the true Herald or not.',
      },
      {
        type: 'narration',
        text: 'Pewku stood still, staring first after Takua and then Jaller. She turned and followed Takua.',
      },
    ],
  },
  mol_onu_koro_battle: {
    id: 'mol_onu_koro_battle',
    background: { type: 'gradient', from: '#2a1a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: 'Onua and Pohatu were conferring in the center courtyard of Onu-Koro when they heard steps approaching from one of the tunnels.',
      },

      {
        type: 'narration',
        text: 'Pohatu saw an exhausted-looking Ussal crab trotting toward him. His eyes widened in surprise as he recognized the figure riding atop the Ussal’s back.',
      },

      {
        type: 'dialogue',
        speakerId: 'Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: 'Chronicler! Pohatu exclaimed as Takua and Pewku made their way toward the Toa. “Where is the Herald?”',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Uh, we got… separated. After we met the Rahkshi.',
      },
      {
        type: 'narration',
        text: 'Before Takua could continue, the ground shuddered. The villagers around them cried out in alarm. Suddenly the cavern wall burst open – and three tall, horrifying figures leaped into view, hissing angrily.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Those! “Except… different ones.',
      },
      {
        type: 'dialogue',
        speakerId: 'Onua',
        portraitType: 'avatar',
        position: 'left',
        text: 'Clear the cave! And close the tunnel behind you!',
      },
      {
        type: 'narration',
        text: 'The Onu-Matoran scattered, racing for the tunnels leading away from the cavern. Meanwhile Onua and Pohatu faced the three Rahkshi.',
      },
      {
        type: 'dialogue',
        speakerId: 'Onua',
        portraitType: 'avatar',
        position: 'left',
        text: 'Let me show you a real Onu-Koro welcome. *slams his  onto the ground, creating an elemental tidal wave of earth and stone. The wave rippled toward the Rahkshi and swallowed them*',
      },
      {
        type: 'narration',
        text: 'But when the wave had passed, the Rahkshi rose up again, unharmed.',
      },
      {
        type: 'dialogue',
        speakerId: 'Onua',
        portraitType: 'avatar',
        position: 'left',
        text: 'Onua grunted in surprise. The Hunger-Rahkshi leaped toward him, wielding its staff. Onua grabbed at the staff, trying to pull it away.',
      },
      {
        type: 'narration',
        text: 'Meanwhile Pohatu raced toward the Fear-Rahkshi. The creature raised its staff, sending dark energy waves rippling out from it. As soon as Pohatu hit the circle of energy, he stopped in midstride, his eyes filled with fear.',
      },
      {
        type: 'dialogue',
        speakerId: 'Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: 'No… Water, sinking, drowning…!',
      },
      {
        type: 'narration',
        text: 'The Hunger-Rahkshi hissed at Onua as they struggled over the staff. The creature activated the staff. Hunger flooded into Onua, instantly draining him of power, channeling it instead back into the Rahkshi’s staff.',
      },
      {
        type: 'dialogue',
        speakerId: 'Onua',
        portraitType: 'avatar',
        position: 'left',
        text: 'My strength. My power…',
      },

      {
        type: 'narration',
        text: 'His eyes dimmed and he fell over backward, landing with a mighty crash. He couldn’t move – his energy was completely gone, replaced by a gnawing, devastating hunger.',
      },
      {
        type: 'narration',
        text: 'Still imprisoned by a wall of fear, Pohatu was unable to help. And the more he struggled against it, the more the terror overwhelmed him – until, with a final moan of helplessness, he collapsed to the ground.',
      },

      {
        type: 'narration',
        text: 'Takua tried to avoid the fleeing villagers as he and Pewku searched for escape as well. The three Rahkshi turned and spotted him in the crowds. Knocking other Matoran out of the way, they stalked after him with a hiss.',
      },
      {
        type: 'narration',
        text: 'Pewku found her way to a tunnel while the Rahkshi were still halfway back across the large cavern. Takua breathed out in relief. They were going to make it!',
      },
      {
        type: 'narration',
        text: 'Then he turned and saw the scene behind him. The Rahkshi were stomping on huts and shoving aside terrified Onu-Matoran. Onua and Pohatu were still sprawled motionless on the cavern floor.',
      },
      {
        type: 'narration',
        text: 'This is my fault, Takua realized. They’re destroying everything in their path – to get to me.',
      },
      {
        type: 'narration',
        text: 'His eyes hardened with resolve. Grabbing a kolhii stick that was leaning against a hut nearby, he turned Pewku to face the approaching Rahkshi.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Yah, Pewku! Yah!',
      },
      {
        type: 'narration',
        text: 'Pewku tried to do as he said. But so many villagers were fleeing, flowing around them in their race for the tunnel, that they could hardly move forward. Finally Takua gave up. Slumping to the ground, he closed his eyes and waited for the Rahkshi to reach him.',
      },

      {
        type: 'narration',
        text: 'Pewku whined frantically, trying to get him to move. But he pushed her claw aside.',
      },

      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Go find a real hero, he mumbled miserably. What can I do?',
      },
    ],
  },

  mol_onu_koro_part2: {
    id: 'mol_onu_koro_part2',
    background: { type: 'gradient', from: '#2a1a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: 'Tahu, Lewa, and Gali raced through a tunnel, heading toward the main cavern of Onu-Koro. They skidded to a stop as they reached the end of the tunnel and saw the mayhem in the cavern.',
      },
      {
        type: 'narration',
        text: 'Tahu’s eyes flashed with anger as he took it in. The poison taint, which had spread to cover half of his face, glowed angrily as well.',
      },
      {
        type: 'narration',
        text: 'He leaped into the cavern without a word. Racing toward the creatures, he charged at the Anger-Rahkshi first.',
      },
      {
        type: 'narration',
        text: 'The Anger-Rahkshi banged its staff on the ground. A ring of dark energy rippled across the cavern floor, hitting Tahu and knocking him off of his feet.',
      },
      {
        type: 'narration',
        text: 'The Fire Toa landed with a grunt on the hard ground. Gali and Lewa leaped out of the tunnel and raced toward the action. Lewa spotted a small figure huddled on the ground near the Rahkshi.',
      },

      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'The Chronicler! And his crab friend, Pewku. Looks like they’re in badneed of a rescue.',
      },
      {
        type: 'narration',
        text: 'He glided toward them, grabbing Takua in one arm and Pewku in the other.',
      },
      {
        type: 'narration',
        text: 'The Rahkshi hissed in frustration as they saw their quarry fly away across the cavern. They turned and stalked after him.',
      },
      {
        type: 'narration',
        text: 'Tahu’s eyes glowed dark, anger-energy flashing across them. The poison taint had spread once again and now covered his entire mask.',
      },
      {
        type: 'narration',
        text: 'He leaped to his feet. Gali gasped as she saw that it wasn’t just Tahu’s mask that was poisoned now. The taint had spread across his entire body!',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: '(The Rahkshi’s anger-energy must have caused it to spread more rapidly) Brother!',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'FIRE HAS NO BROTHERS! FIRE CONSUMES ALL!',
      },
      {
        type: 'narration',
        text: 'He slammed his swords into the ground. Jagged fissures of lava burst into life and tore across the ground in all directions. Gali balanced on a pillar of earth as fire consumed the ground on either side.',
      },
      {
        type: 'narration',
        text: 'Tahu looked at her, but there was no recognition in his eyes – only anger. He slammed his swords down again, sending another fissure of lava right at Gali. She somersaulted away just in time as the ground exploded into flame.',
      },

      {
        type: 'narration',
        text: 'Across the cavern, Lewa glided down and deposited Takua and Pewku beside Onua and Pohatu.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'No thought-thinking. Quickspeed to Jaller. Warn him!',
      },
      {
        type: 'narration',
        text: 'Takua and Pewku raced toward an escape tunnel. But a few strides away, the Ussal veered suddenly, heading through a narrow foundry doorway instead.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Pewku! Where are you going?',
      },
      {
        type: 'narration',
        text: 'He followed her. A moment later, the Rahkshi disappeared through the foundry door as well.',
      },

      {
        type: 'narration',
        text: 'At that moment back in the cavern, Pohatu finally came to and sat up. He glanced at Onua, who was pushing himself upright nearby.',
      },
      {
        type: 'dialogue',
        speakerId: 'Pohatu',
        portraitType: 'avatar',
        position: 'left',
        text: 'Rise and shine, brother.',
      },

      {
        type: 'narration',
        text: 'The heat rolled over Takua in waves as he followed Pewku into the depths of the foundry. Several fires blazed beneath narrow exhaust chimneys cut into the rock ceiling. Mine-cars loaded with lightstones sat on their tracks, waiting to move out.',
      },

      {
        type: 'narration',
        text: 'Dead end, Takua realized as he stared around the chamber. There’s no way out except the way we came… and we can’t go that way.',
      },

      {
        type: 'narration',
        text: 'The trio of Rahkshi emerged from the entry tunnel into the foundry chamber with a loud hiss. Pewku raced toward one of the chimneys. She grunted urgently at Takua and leaped up, scrambling for a hold on the rough rock sides.',
      },

      {
        type: 'narration',
        text: 'Takua took a deep breath. What choice did he have? He leaped up, following the Ussal into the soot-blackened chimney.',
      },

      {
        type: 'narration',
        text: 'As he struggled to climb up the chimney, he heard the Rahkshi hissing directly beneath him. He tried to climb faster, but it was no use – the Fear-Rahkshi was right behind him. It lunged up, grabbing for his foot.',
      },

      {
        type: 'narration',
        text: 'Suddenly a claw spun into view, pinning the Fear-Rahkshi’s arm to the wall just before its clawed hand closed around Takua’s leg. It was one of Toa Pohatu’s mighty climbing claws!',
      },

      {
        type: 'narration',
        text: 'The other two Rahkshi charged toward the Toa. Onua slammed his fists outward into the cavern walls. The section of ceiling directly over the Rahkshi collapsed, piling rocks and stone dust over them.',
      },

      {
        type: 'narration',
        text: 'Breathing a sigh of relief, Takua pulled himself up to safety.',
      },
    ],
  },

  mol_tahu_poisoned: {
    id: 'mol_tahu_poisoned',
    background: { type: 'gradient', from: '#1a4a00', to: '#0a0a0a' },
    steps: [
      {
        type: 'narration',
        text: 'In the courtyard cavern, Tahu swiped his swords at Lewa, who dodged them easily. Tahu lunged at Lewa again.',
      },
      {
        type: 'narration',
        text: 'Rocks rained down on him from the ceiling, mixed with snow. Suddenly a stream of water struck Tahu from behind.',
      },
      {
        type: 'narration',
        text: 'Howling with anger, he turned to find Gali behind him.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'Tahu, she called. Remember who you are! Remember your destiny. She unleashed another stream of water. Tahu’s armor steamed as the cool water hit it.',
      },

      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'I HAVE NO DESTINY! I – agh?',
      },

      {
        type: 'narration',
        text: 'He jumped in surprise as a shape plummeted to the ground behind him. Kopaka! The Ice Toa touched his blade to the ground. A layer of frost washed over the ground, trapping Tahu in a thick coating of ice.',
      },

      {
        type: 'narration',
        text: 'Lewa stepped forward. He and Kopaka each took one of the frozen Tahu’s arms, carrying him toward an exit tunnel.',
      },

      {
        type: 'narration',
        text: 'Gali looked around for the others as she raced after them. She saw Onua’s quake-breakers smash through the stone of a collapsed foundry entrance and breathed out with relief as he and Pohatu emerged into the courtyard chamber.',
      },

      {
        type: 'narration',
        text: 'Lewa and Kopaka carried the unconscious Tahu into a tunnel. Gali followed. Once inside the tunnel, she turned back to check on the others’ progress. Pohatu and Onua raced across the chamber toward her. They were steps from safety when there was an ominous rumble. A split second later, the entire cavern collapsed on top of them.',
      },

      {
        type: 'narration',
        text: 'Gali gasped in horror as rocks and earth rained down, burying everything in a deep layer of debris.',
      },

      {
        type: 'narration',
        text: 'She tried to leap out, to go help. But Kopaka stopped her.',
      },

      {
        type: 'narration',
        text: 'He gave her a somber look. Gali returned the look for a long moment, then glanced out at the caved-in courtyard area. There was no sound, no movement except the settling dust.',
      },

      {
        type: 'narration',
        text: `Outside the caverns of Onu-Koro, Tahu is chained upon a stone, writhing. The poison from Lerahk's scar, aggravated by Kurahk's anger, has spread through his body.`,
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
      {
        type: 'dialogue',
        speakerId: 'Toa_Lewa_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'Sister, he is openeyed!',
      },
      {
        type: 'narration',
        text: 'Gali hurried back to the clearing. Tahu was sitting up, unwrapping the vines from his wrists.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'Brother! Are you well?',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'No, I am not well. But I am alive and in your debt… my sister.',
      },
      {
        type: 'narration',
        text: 'He tentatively lifted his fist toward her. Gali smiled and gently clanked it with her own.',
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
        text: 'No way! We’ve been all over the island, just to wind up here?',
      },

      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'Why not? It’s a sacred place,',
      },
      {
        type: 'narration',
        text: 'Takua grabbed the mask, which immediately glowed brightly again.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'You sure you’re working this right?',
      },
      {
        type: 'narration',
        text: 'At that moment a beam of brilliant light shot out of the mask. It landed on the giant stone head. The ground quaked, shaking loose countless years’ worth of dirt and grime from the carving. As the outlines of a mask began to be visible underneath, the sun dipped beneath the horizon, plunging the temple into dusky dimness.',
      },

      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'Wow, this is it! The Seventh Toa must be here.',
      },

      {
        type: 'narration',
        text: 'An ominous hiss rose nearby. Takua and Jaller turned toward the sound in fear. Three Rahkshi stepped out from behind a rock – Fragmenter, Disintegrator, and Poison.',
      },

      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'Give me the mask, Takua!',
      },

      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Jaller, no! We both know the mask chose me. I am the true Herald.',
      },
      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'Are you sure, even now?',
      },

      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Yes! I’m the Herald. And I say… run!',
      },
      {
        type: 'narration',
        text: 'Takua, Jaller, and Pewku raced down toward the lower plateau. The ground quaked again at the base of the steps. A fissure erupted in a shower of rocks and earth, and three more Rahkshi burst out of the ground!',
      },
      {
        type: 'narration',
        text: 'Takua and Jaller turned to race back up the steps. But the first trio of Rahkshi were already descending from the top. They were trapped!',
      },
      {
        type: 'narration',
        text: 'Suddenly a flare of brilliant fire rocketed overhead, illuminating the entire temple.',
      },
      {
        type: 'narration',
        text: 'The Rahkshi shielded their faces against the glare. An urn atop the enormous stone head ignited, illuminating Lewa and Gali, who stood on either side. Tahu stepped in from the shadows, the fire reflecting off of his bright red armor.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'Great! You can get us out of here!',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'We are done running.',
      },
      {
        type: 'narration',
        text: 'The Fragmenter-Rahkshi hissed, unleashing an arc of dark energy from its staff. Tahu lifted his shield, enveloping all of the Toa and Matoran in a protective force field. He staggered backward as the Rahkshi’s bolt hit, but recovered quickly.',
      },

      {
        type: 'narration',
        text: '“We will not be broken!” the Fire Toa shouted defiantly.',
      },

      {
        type: 'narration',
        text: 'He and Lewa stood side by side as the Fragmenter-, Poison-, and Disintegrator-Rahkshi approached. Behind them, Gali led Takua and Jaller down the steps toward the lower temple.',
      },

      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'This way!',
      },

      {
        type: 'narration',
        text: 'Lewa summoned a whirlwind, sending it spinning down to grab the sand from the Amaja Circle. The sand cycloned feverishly, enveloping the advancing Rahkshi. Tahu crossed his swords, sending a blast of fire into the swirling sandstorm. The sand particles glowed red, then white-hot. When Tahu and Lewa both lowered their arms, their creation remained – the Rahkshi were trapped from the neck down in a prison of glass!',
      },
      {
        type: 'narration',
        text: 'In the lower temple, the other three Rahkshi moved toward Gali and her charges, cutting off their escape. The ground between them suddenly rumbled and exploded. Three figures erupted out of the quake, landing beside Gali and the others.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'Brothers! We thought we lost you!',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'You might have, but for our frosty friend,',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'It was… on the way.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'Kopaka had to dig out the chief miner?',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Onua_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'Well, he needs to get his hands dirty from time to time.',
      },
      {
        type: 'narration',
        text: 'The Hunger-, Anger-, and Fear-Rahkshi had recovered from the surprise of the Toa’s arrival. They advanced again, hissing menacingly.',
      },
      {
        type: 'narration',
        text: 'The Anger-Rahkshi banged its staff on the ground, sending a ring of dark anger energy toward the Toa. But the energy passed right through them, leaving them untouched. The Rahkshi hissed in surprise.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'Our anger is no more, Rahkshi. We are united!',
      },

      {
        type: 'narration',
        text: 'Lewa and Pohatu leaped into action, somersaulting around the three Rahkshi faster than the eye could follow. The creatures swung their staffs wildly at their tumbling foes – but wound up striking one another instead!',
      },

      {
        type: 'narration',
        text: 'The Fear-Rahkshi squealed in dismay as the Hunger-Rahkshi’s staff hit it. Its fear energy drained from its body, sending it tumbling helplessly to the ground.',
      },

      {
        type: 'narration',
        text: 'The Hunger-Rahkshi hissed. Turning away from the circling Toa, it leaped toward Takua and Jaller. In the blink of an eye, Tahu and Gali joined together and summoned their elemental powers. A blast of steam burst from their tools, catching the Hunger-Rahkshi in its mighty stream and lifting it into the air.',
      },

      {
        type: 'narration',
        text: 'The Toa moved in on the Anger-Rahkshi. The creature backed away, hissing in frustration.',
      },

      {
        type: 'narration',
        text: 'Behind the Toa, the Fear-Rahkshi stirred. Its eyes began to glow as energy flowed back into its body. The creature climbed to its feet and started up the steps toward Takua and Jaller. The Toa didn’t notice. All of their attention was focused on the Anger-Rahkshi in front of them. ',
      },

      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'Now! As one!',
      },

      {
        type: 'narration',
        text: 'Onua slammed the ground, sending a wave of earth toward the Anger-Rahkshi.',
      },
      {
        type: 'narration',
        text: 'Pohatu transformed the rolling wave of earth into a wave of boulders.',
      },

      {
        type: 'narration',
        text: 'Tahu transformed the boulders into a wave of lava, which broke over the Rahkshi, enveloping it.',
      },

      {
        type: 'narration',
        text: 'The Anger-Rahkshi tried to escape the lava. But suddenly the jet of steam dissipated, sending the Hunger-Rahkshi plunging back to earth – right on top of the Anger-Rahkshi!',
      },

      {
        type: 'narration',
        text: 'Kopaka jumped forward, striking the lava with his sword and instantly freezing it solid. Both the Hunger- and Anger-Rahkshi were frozen along with it.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Tahu_Nuva',
        portraitType: 'avatar',
        position: 'left',
        text: 'They’ve been trapped before and were still able to escape.',
      },
      {
        type: 'narration',
        text: 'Kopaka leaned in, yanking the kraata out of the Rahkshi’s armored bodies.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Kopaka_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'Not this time.',
      },

      {
        type: 'narration',
        text: 'A frightened squeal erupted from somewhere above. Glancing up, the Toa were just in time to see Pewku tumble down the steps, tossed aside by the Fear-Rahkshi. The creature turned with a hiss, backing Takua and Jaller up the steps.',
      },
      {
        type: 'dialogue',
        speakerId: 'Toa_Gali_Nuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'Hang on!',
      },

      {
        type: 'narration',
        text: 'Takua looked down, trying to see the Toa. Instead, his gaze caught the beam of dark fear energy emanating from the Rahkshi’s staff. He fell to his knees, instantly transfixed.',
      },

      {
        type: 'narration',
        text: 'The Fear-Rahkshi rose up on its long legs, towering over Takua. It swung its staff toward the helpless Matoran.',
      },

      {
        type: 'narration',
        text: 'But Jaller had seen what was happening. He leaped forward, swinging the kolhii stick he was holding.',
      },

      {
        type: 'narration',
        text: 'Takua snapped out of his fear trance as Jaller intercepted the Rahkshi’s blow. He screamed as dark energy sizzled through his friend’s body.',
      },

      {
        type: 'narration',
        text: 'The Fear-Rahkshi turned toward him, its eyes glittering wickedly. But before it could strike again, Gali and Pohatu leaped in and grabbed it by the arms.',
      },

      {
        type: 'dialogue',
        speakerId: 'Takua',
        portraitType: 'avatar',
        position: 'right',
        text: 'What have you done? I’m supposed to make the sacrifice! I’m the Herald!',
      },

      {
        type: 'dialogue',
        speakerId: 'Jaller',
        portraitType: 'avatar',
        position: 'left',
        text: 'No. The duty was mine. You know… who you are. You were always different.',
      },
      {
        type: 'narration',
        text: 'Jaller’s hand dropped limply onto the stone. Gently lowering his friend’s head to the ground, Takua stood, lifting the mask. It glowed more brightly than ever.',
      },
    ],
  },

  mol_takanuva_rises: {
    id: 'mol_takanuva_rises',
    background: { type: 'gradient', from: '#ffe28e', to: '#ffffff' },
    steps: [
      {
        type: 'narration',
        text: 'Takua turned the mask over in his hands again. His eyes narrowed purposefully. As he lifted it to his face, the mask’s glow brightened again. As it made contact with his own mask, it burst forth with brilliant beams of white light.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'I am Takanuva, Toa of Light!',
      },
      {
        type: 'narration',
        text: 'A burst of white light shot from his staff and into the Fear-Rahkshi, disabling it.',
      },
      {
        type: 'narration',
        text: 'As the white light bursting from him illuminated the entire temple, he bent and picked up Jaller’s body. He carried it down the steps past the other Toa. Each of them raised his or her weapon in salute, then followed the Toa of Light with their heads solemnly bowed.',
      },
      {
        type: 'narration',
        text: 'The next morning, Takanuva stood gazing down at the suva-style grave dome that had been raised in a quiet spot overlooking the Kini-Nui temple. A memorial pillar rose from the top of the dome, and Jaller’s mask rested upon it.',
      },

      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: 'You have finally found your own story, and still you seek answers.',
      },

      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'All this, just to discover who I am?',
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: 'Mata Nui is wiser than all. The path you walked was not to be in this place… but to discover your own duty and unlock our destiny.',
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
        text: `Takanuva sheathes his Staff of Light, jumps on Makuta, and grasps the Mask of Shadow, trying to tear it off. They grapple—and both fall into the pool of energized protodermis.`,
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
        text: `Takutanuva grasps the bottom of the gate and lifts it. The Matoran pass through. Hahli runs in with Jaller's mask. Takutanuva revives Jaller with part of his own life force. But the gate is too heavy. It crashes down lifting a huge cloud of dust.`,
      },
    ],
  },

  mol_rediscovery_of_metru_nui: {
    id: 'mol_rediscovery_of_metru_nui',
    background: { type: 'gradient', from: '#0d1f2d', to: '#ffe28e' },
    steps: [
      {
        type: 'narration',
        text: `As the dust clears, Takanuva stands, the Mask of Light glowing brightly over his face.`,
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: 'Let us awaken the Great Spirit.',
      },
      {
        type: 'narration',
        text: 'Hahli, Jaller, and Takanuva followed the Turaga to the far end of the new chamber. There, a ledge plunged away into dark nothingness.',
      },
      {
        type: 'dialogue',
        speakerId: 'Turaga_Vakama',
        portraitType: 'avatar',
        position: 'left',
        text: 'Unity! Duty! Destiny!',
      },
      {
        type: 'narration',
        text: 'As he spoke, Takanuva’s power illuminated his companions and himself. Their light shone down into the abyss, revealing what lay below.',
      },
      {
        type: 'narration',
        text: 'The Matoran gasped in amazement as they saw a strange new world stretching out below them. The chamber at the bottom of the cliff was indescribably huge – it stretched farther than the eye could see. Strange structures dotted the landscape, and flashes of energy danced here and there.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'This is it. Soon we will understand everything. Who we are. Where we come from. Who sent us.',
      },
      {
        type: 'dialogue',
        speakerId: 'Takanuva',
        portraitType: 'avatar',
        position: 'right',
        text: 'Our destiny.',
      },
    ],
  },
};
