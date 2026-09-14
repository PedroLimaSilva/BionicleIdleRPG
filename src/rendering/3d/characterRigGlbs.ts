import { CHARACTER_DEX } from '../../data/dex';
import { getBuyableCharacters } from '../../game/recruitment/Recruitment';
import { getAvailableEvolution } from '../../game/evolution/CharacterEvolution';
import { MatoranStage, type RecruitedCharacterData } from '../../types/Matoran';
import { resolveCustomToaBuildId } from './customToaBuild';
import { usesNujuToaMetruRig } from './metruMatoran';

/**
 * Same value as Vite `base` / `import.meta.env.BASE_URL`. Kept literal so this
 * module can run under ts-jest (commonjs has no `import.meta`).
 */
const BASE = '/BionicleIdleRPG/';

/** Must match each model's `useGLTF(...)` string exactly so drei's cache hits. */
export const MATORAN_MASTER_GLB = BASE + 'matoran_master.glb';
export const REBUILT_GLB = BASE + 'rebuilt.glb';
export const METRU_MATORAN_GLB = BASE + 'matoran_metru.glb';
export const BOHROK_MASTER_GLB = BASE + 'bohrok_master.glb';
export const VAHKI_GLB = BASE + 'Vahki.glb';
export const RAHKSHI_GLB = BASE + 'rahkshi.glb';
export const NUI_RAMA_GLB = BASE + 'Rahi/NuiRama.glb';

const MATA_GLB_BY_BUILD_ID: Record<string, string> = {
  Toa_Gali: BASE + '/Toa_Mata/gali.glb',
  Toa_Kopaka: BASE + '/Toa_Mata/kopaka.glb',
  Toa_Lewa: BASE + '/Toa_Mata/lewa.glb',
  Toa_Onua: BASE + '/Toa_Mata/onua.glb',
  Toa_Pohatu: BASE + '/Toa_Mata/pohatu.glb',
  Toa_Tahu: BASE + '/Toa_Mata/tahu.glb',
};

const NUVA_GLB_BY_BUILD_ID: Record<string, string> = {
  Takanuva: BASE + 'Toa_Nuva/takanuva.glb',
  Toa_Gali_Nuva: BASE + 'Toa_Nuva/gali.glb',
  Toa_Kopaka_Nuva: BASE + 'Toa_Nuva/kopaka.glb',
  Toa_Lewa_Nuva: BASE + 'Toa_Nuva/lewa.glb',
  Toa_Onua_Nuva: BASE + 'Toa_Nuva/onua.glb',
  Toa_Pohatu_Nuva: BASE + 'Toa_Nuva/pohatu.glb',
  Toa_Tahu_Nuva: BASE + 'Toa_Nuva/tahu.glb',
};

const METRU_TOA_GLB_BY_BUILD_ID: Record<string, string> = {
  Toa_Lhikan: BASE + 'Toa_Metru/Lhikan.glb',
  Toa_Matau: BASE + 'Toa_Metru/Matau.glb',
  Toa_Nokama: BASE + 'Toa_Metru/Nokama.glb',
  Toa_Nuju: BASE + 'Toa_Metru/Nuju.glb',
  Toa_Onewa: BASE + 'Toa_Metru/Onewa.glb',
  Toa_Vakama: BASE + 'Toa_Metru/Vakama.glb',
  Toa_Whenua: BASE + 'Toa_Metru/Whenua.glb',
};

export type CharacterRigRef = Pick<RecruitedCharacterData, 'id' | 'customMataModelId' | 'stage'>;

export type StoryProgressForRigs = {
  completedQuests: string[];
  recruitedCharacters: RecruitedCharacterData[];
};

/** GLB URL for the rig CharacterScene would load, or null if there is no GLB. */
export function characterRigGlbUrl(matoran: CharacterRigRef): string | null {
  const stage = matoran.stage ?? CHARACTER_DEX[matoran.id]?.stage;
  if (!stage) return null;

  switch (stage) {
    case MatoranStage.ToaMata:
      return MATA_GLB_BY_BUILD_ID[resolveCustomToaBuildId({ ...matoran, stage })] ?? null;
    case MatoranStage.ToaNuva:
      return NUVA_GLB_BY_BUILD_ID[resolveCustomToaBuildId({ ...matoran, stage })] ?? null;
    case MatoranStage.ToaMetru: {
      const buildId = resolveCustomToaBuildId({ ...matoran, stage });
      if (usesNujuToaMetruRig(buildId)) return METRU_TOA_GLB_BY_BUILD_ID.Toa_Nuju ?? null;
      return METRU_TOA_GLB_BY_BUILD_ID[buildId] ?? null;
    }
    case MatoranStage.Diminished:
      return MATORAN_MASTER_GLB;
    case MatoranStage.Rebuilt:
      return REBUILT_GLB;
    case MatoranStage.Metru:
      return METRU_MATORAN_GLB;
    case MatoranStage.Bohrok:
    case MatoranStage.BohrokKal:
      return BOHROK_MASTER_GLB;
    case MatoranStage.Vahki:
      return VAHKI_GLB;
    case MatoranStage.Rahkshi:
      return RAHKSHI_GLB;
    case MatoranStage.Rahi:
      return matoran.id === 'nui_rama' ? NUI_RAMA_GLB : null;
    default:
      return null;
  }
}

function addUrl(urls: Set<string>, matoran: CharacterRigRef): void {
  const url = characterRigGlbUrl(matoran);
  if (url) urls.add(url);
}

/**
 * Unique character-rig GLBs the player can open soon: recruited (current stage),
 * shop-unlocked roster, and story-unlocked evolution targets.
 */
export function characterRigGlbUrlsForProgress(progress: StoryProgressForRigs): string[] {
  const urls = new Set<string>();

  for (const recruited of progress.recruitedCharacters) {
    const base = CHARACTER_DEX[recruited.id];
    if (!base) continue;
    const current: CharacterRigRef = {
      customMataModelId: recruited.customMataModelId,
      id: recruited.id,
      stage: recruited.stage ?? base.stage,
    };
    addUrl(urls, current);

    const evolution = getAvailableEvolution(recruited, progress.completedQuests);
    if (evolution?.evolvedId) {
      const evolved = CHARACTER_DEX[evolution.evolvedId];
      if (evolved) {
        addUrl(urls, {
          id: evolved.id,
          stage: evolved.stage,
        });
      }
    } else if (evolution?.stageOverride) {
      addUrl(urls, { ...current, stage: evolution.stageOverride });
    }
  }

  for (const listed of getBuyableCharacters(
    progress.completedQuests,
    progress.recruitedCharacters
  )) {
    const base = CHARACTER_DEX[listed.id];
    if (base) addUrl(urls, { id: base.id, stage: base.stage });
  }

  return [...urls].sort();
}

/** Every unique rig used by the static + runtime dex (Character Dex ignores recruitment). */
export function allCharacterRigGlbUrls(): string[] {
  const urls = new Set<string>();
  for (const entry of Object.values(CHARACTER_DEX)) {
    addUrl(urls, { id: entry.id, stage: entry.stage });
  }
  return [...urls].sort();
}
