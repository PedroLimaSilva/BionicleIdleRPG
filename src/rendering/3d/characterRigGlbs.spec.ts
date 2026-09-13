import { MatoranStage } from '../../types/Matoran';
import {
  allCharacterRigGlbUrls,
  characterRigGlbUrl,
  characterRigGlbUrlsForProgress,
  MATORAN_MASTER_GLB,
  REBUILT_GLB,
} from './characterRigGlbs';

describe('characterRigGlbUrl', () => {
  test('uses the Mata path with a leading slash (matches TahuMataModel useGLTF)', () => {
    expect(characterRigGlbUrl({ id: 'Toa_Tahu', stage: MatoranStage.ToaMata })).toBe(
      '/BionicleIdleRPG//Toa_Mata/tahu.glb'
    );
  });

  test('uses the Nuva path without a leading slash (matches TahuNuvaModel useGLTF)', () => {
    expect(characterRigGlbUrl({ id: 'Toa_Tahu_Nuva', stage: MatoranStage.ToaNuva })).toBe(
      '/BionicleIdleRPG/Toa_Nuva/tahu.glb'
    );
  });

  test('shares one diminished rig across village matoran', () => {
    expect(characterRigGlbUrl({ id: 'Jala', stage: MatoranStage.Diminished })).toBe(
      MATORAN_MASTER_GLB
    );
    expect(characterRigGlbUrl({ id: 'Hahli', stage: MatoranStage.Diminished })).toBe(
      MATORAN_MASTER_GLB
    );
  });

  test('returns null for Rahi without a GLB', () => {
    expect(characterRigGlbUrl({ id: 'muaka', stage: MatoranStage.Rahi })).toBeNull();
  });

  test('uses the custom Toa rig selected on the recruited character', () => {
    expect(
      characterRigGlbUrl({
        customMataModelId: 'Toa_Gali',
        id: 'custom_0',
        stage: MatoranStage.ToaMata,
      })
    ).toBe('/BionicleIdleRPG//Toa_Mata/gali.glb');
  });
});

describe('characterRigGlbUrlsForProgress', () => {
  test('preloads recruited rig plus shop-unlocked Toa Mata neighbors', () => {
    const urls = characterRigGlbUrlsForProgress({
      completedQuests: ['story_toa_arrival'],
      recruitedCharacters: [{ exp: 0, id: 'Toa_Tahu' }],
    });
    expect(urls).toEqual(
      expect.arrayContaining([
        '/BionicleIdleRPG//Toa_Mata/tahu.glb',
        '/BionicleIdleRPG//Toa_Mata/gali.glb',
        '/BionicleIdleRPG//Toa_Mata/kopaka.glb',
        '/BionicleIdleRPG//Toa_Mata/lewa.glb',
        '/BionicleIdleRPG//Toa_Mata/onua.glb',
        '/BionicleIdleRPG//Toa_Mata/pohatu.glb',
      ])
    );
    expect(urls.some((url) => url.includes('Toa_Nuva'))).toBe(false);
  });

  test('preloads Nuva evolution target once the story quest is complete', () => {
    const urls = characterRigGlbUrlsForProgress({
      completedQuests: ['story_toa_arrival', 'bohrok_evolve_toa_nuva'],
      recruitedCharacters: [{ exp: 0, id: 'Toa_Tahu', stage: MatoranStage.ToaMata }],
    });
    expect(urls).toEqual(
      expect.arrayContaining([
        '/BionicleIdleRPG//Toa_Mata/tahu.glb',
        '/BionicleIdleRPG/Toa_Nuva/tahu.glb',
      ])
    );
  });

  test('preloads rebuilt form when that upgrade is story-unlocked', () => {
    const urls = characterRigGlbUrlsForProgress({
      completedQuests: ['bohrok_kal_naming_day'],
      recruitedCharacters: [{ exp: 0, id: 'Kapura', stage: MatoranStage.Diminished }],
    });
    expect(urls).toEqual(expect.arrayContaining([MATORAN_MASTER_GLB, REBUILT_GLB]));
  });
});

describe('allCharacterRigGlbUrls', () => {
  test('includes Mata, Nuva, and shared enemy rigs once each', () => {
    const urls = allCharacterRigGlbUrls();
    const tahuMata = urls.filter((url) => url.endsWith('/Toa_Mata/tahu.glb'));
    const tahuNuva = urls.filter((url) => url.endsWith('Toa_Nuva/tahu.glb'));
    const bohrok = urls.filter((url) => url.endsWith('bohrok_master.glb'));
    expect(tahuMata).toHaveLength(1);
    expect(tahuNuva).toHaveLength(1);
    expect(bohrok).toHaveLength(1);
  });
});
