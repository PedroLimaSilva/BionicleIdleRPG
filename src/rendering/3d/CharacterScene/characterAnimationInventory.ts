import { VAHKI_IDLE_SWITCH_CLIP_NAMES } from './idleSwitchConfigs';

/** Jira-style epic grouping for animation authoring and revision work. */
export type AnimationEpicId =
  | 'toa-metru-combat'
  | 'toa-nuva-combat'
  | 'toa-mata-polish'
  | 'vahki-combat'
  | 'rahkshi-defeat'
  | 'village-flavor'
  | 'rebuilt-idle-switch'
  | 'rahi-nui-rama'
  | 'rahi-placeholder'
  | 'bohrok-extras';

export type StoryArcId =
  | 'mask-hunt'
  | 'mnog'
  | 'bohrok-swarm'
  | 'bohrok-kal'
  | 'mask-of-light'
  | 'metru-nui'
  | 'stretch';

export const STORY_ARC_LABELS: Record<StoryArcId, string> = {
  'bohrok-kal': 'Bohrok Kal',
  'bohrok-swarm': 'Bohrok Swarm',
  'mask-hunt': 'Mask Hunt',
  'mask-of-light': 'Mask of Light',
  'metru-nui': 'Metru Nui',
  mnog: 'MNOG',
  stretch: 'Stretch / polish',
};

export type RigRole = 'combat' | 'village' | 'enemy' | 'placeholder';

export type ClipKind = 'idle' | 'combat' | 'flavor' | 'idle-switch' | 'transition' | 'ambient';

/** Manual backlog state when shipped clips still need art or code follow-up. */
export type ClipBacklog = 'missing' | 'revision' | 'unused' | 'complete';

export interface AnimationEpic {
  id: AnimationEpicId;
  title: string;
  /**
   * Authoring priority by story progression — lower numbers appear earlier in the
   * game and should be animated first. See `docs/CHARACTER_ANIMATIONS.md`.
   */
  storyOrder: number;
  storyArc: StoryArcId;
  /** First quest or beat where this rig matters (for traceability). */
  storyBeat: string;
  summary: string;
}

export interface ExpectedClip {
  name: string;
  kind: ClipKind;
  /** When false, the game runs without it (procedural fallback or no-op). */
  required: boolean;
  /** Author intent that automated GLB checks cannot infer. */
  backlog?: ClipBacklog;
  notes?: string;
}

export interface RigInventoryEntry {
  id: string;
  epicId: AnimationEpicId | 'complete';
  glb: string | null;
  displayName: string;
  reactComponent: string;
  role: RigRole;
  expectedClips: ExpectedClip[];
  notes?: string;
}

export const ANIMATION_EPICS: Record<AnimationEpicId, AnimationEpic> = {
  'bohrok-extras': {
    id: 'bohrok-extras',
    storyArc: 'stretch',
    storyBeat: 'bohrok_swarm_intro',
    storyOrder: 100,
    summary:
      'bohrok_master.glb includes Ball, Flying, and Flying Pose clips that no code path plays yet. Wire or trim on next Bohrok polish pass.',
    title: 'Bohrok — unused authored clips',
  },
  'rahi-nui-rama': {
    id: 'rahi-nui-rama',
    storyArc: 'mnog',
    storyBeat: 'early_rahi_nui_rama',
    storyOrder: 20,
    summary:
      'Nui-Rama loops the Wings ambient clip during combat. Attack, Hit, and Defeat are procedural on the root group.',
    title: 'Nui-Rama — combat clips',
  },
  'rahi-placeholder': {
    id: 'rahi-placeholder',
    storyArc: 'mask-hunt',
    storyBeat: 'early_rahi_muaka',
    storyOrder: 25,
    summary:
      'RahiPlaceholderModel is a procedural capsule with no GLB. Replace with a shared low-poly Rahi rig when art bandwidth allows.',
    title: 'Generic Rahi — GLB-backed rig',
  },
  'rahkshi-defeat': {
    id: 'rahkshi-defeat',
    storyArc: 'mask-of-light',
    storyBeat: 'mol_fall_of_ta_koro',
    storyOrder: 60,
    summary:
      'Rahkshi Attack and Hit are authored. Defeat uses procedural knockdown so Kraata glow and sink timing stay reliable.',
    title: 'Rahkshi — Defeat clip',
  },
  'rebuilt-idle-switch': {
    id: 'rebuilt-idle-switch',
    storyArc: 'bohrok-kal',
    storyBeat: 'bohrok_kal_naming_day',
    storyOrder: 50,
    summary:
      'Rebuilt Matoran crossfade between Idle and Idle.001 (plus missing Tilt Head flavor). A dedicated transition clip (like Vahki Switch_BQ) would polish the swap.',
    title: 'Rebuilt Matoran — idle & flavor',
  },
  'toa-mata-polish': {
    id: 'toa-mata-polish',
    storyArc: 'mask-hunt',
    storyBeat: 'story_toa_arrival',
    storyOrder: 10,
    summary:
      'Tahu and Pohatu Mata lack Hit clips. Attack and Idle are present; Hit currently uses procedural shake.',
    title: 'Toa Mata — Hit clip gaps',
  },
  'toa-metru-combat': {
    id: 'toa-metru-combat',
    storyArc: 'metru-nui',
    storyBeat: 'metru_great_temple_transformation',
    storyOrder: 90,
    summary:
      'All seven Toa Metru GLBs ship Idle only. Combat uses procedural root motion today; authored Attack / Hit / Defeat clips would match Toa Mata quality.',
    title: 'Toa Metru — skeletal combat clips',
  },
  'toa-nuva-combat': {
    id: 'toa-nuva-combat',
    storyArc: 'bohrok-swarm',
    storyBeat: 'bohrok_evolve_toa_nuva',
    storyOrder: 40,
    summary:
      'Only Tahu and Pohatu Nuva include Attack / Hit. Gali, Kopaka, Lewa, Onua, and Takanuva still fall back to procedural combat motion.',
    title: 'Toa Nuva — combat clip rollout',
  },
  'vahki-combat': {
    id: 'vahki-combat',
    storyArc: 'metru-nui',
    storyBeat: 'metru_vakama_dume_and_the_great_temple',
    storyOrder: 80,
    summary:
      'Vahki idle-switch clips (biped / quadruped + Switch_BQ / Switch_QB) are complete. Attack, Hit, and Defeat are procedural.',
    title: 'Vahki — combat clips',
  },
  'village-flavor': {
    id: 'village-flavor',
    storyArc: 'metru-nui',
    storyBeat: 'story_metru_nui_saga_begin',
    storyOrder: 75,
    summary:
      'Metru-stage village Matoran request Tilt Head flavor overlays; Diminished Matoran already ship this clip.',
    title: 'Metru Matoran — flavor overlays',
  },
};

const COMBAT_CLIPS: ExpectedClip[] = [
  { kind: 'idle', name: 'Idle', required: true },
  { backlog: 'missing', kind: 'combat', name: 'Attack', required: true },
  { backlog: 'missing', kind: 'combat', name: 'Hit', required: true },
  { backlog: 'missing', kind: 'combat', name: 'Defeat', required: true },
];

const VILLAGE_FLAVOR: ExpectedClip[] = [
  { kind: 'idle', name: 'Idle', required: true },
  {
    backlog: 'missing',
    kind: 'flavor',
    name: 'Tilt Head',
    notes: 'Requested by useAnimationController on all three village Matoran stages.',
    required: false,
  },
];

/** Canonical rig list — update when adding GLBs or changing clip contracts in code. */
export const RIG_INVENTORY: RigInventoryEntry[] = [
  // --- Complete reference rigs ---
  {
    displayName: 'Bohrok / Bohrok-Kal (shared chassis)',
    epicId: 'complete',
    expectedClips: [
      { backlog: 'complete', kind: 'idle', name: 'Idle', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Attack', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Hit', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Defeat', required: true },
      {
        backlog: 'unused',
        kind: 'ambient',
        name: 'Ball',
        notes: 'Authored but not referenced in code.',
        required: false,
      },
      {
        backlog: 'unused',
        kind: 'ambient',
        name: 'Flying',
        notes: 'Authored but not referenced in code.',
        required: false,
      },
      {
        backlog: 'unused',
        kind: 'ambient',
        name: 'Flying Pose',
        notes: 'Authored but not referenced in code.',
        required: false,
      },
    ],
    glb: 'bohrok_master.glb',
    id: 'bohrok',
    notes: 'Shared rig for all twelve Bohrok and Bohrok-Kal variants.',
    reactComponent: 'BohrokModel',
    role: 'combat',
  },

  // --- Toa Mata ---
  ...(['gali', 'kopaka', 'lewa', 'onua'] as const).map(
    (name): RigInventoryEntry => ({
      displayName: `Toa ${name.charAt(0).toUpperCase()}${name.slice(1)} Mata`,
      epicId: 'complete',
      expectedClips: [
        { backlog: 'complete', kind: 'idle', name: 'Idle', required: true },
        { backlog: 'complete', kind: 'combat', name: 'Attack', required: true },
        { backlog: 'complete', kind: 'combat', name: 'Hit', required: true },
      ],
      glb: `Toa_Mata/${name}.glb`,
      id: `toa-mata-${name}`,
      reactComponent: `${name.charAt(0).toUpperCase()}${name.slice(1)}MataModel`,
      role: 'combat',
    })
  ),
  {
    displayName: 'Toa Pohatu Mata',
    epicId: 'toa-mata-polish',
    expectedClips: [
      { backlog: 'complete', kind: 'idle', name: 'Idle', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Attack', required: true },
      { backlog: 'missing', kind: 'combat', name: 'Hit', required: true },
    ],
    glb: 'Toa_Mata/pohatu.glb',
    id: 'toa-mata-pohatu',
    reactComponent: 'PohatuMataModel',
    role: 'combat',
  },
  {
    displayName: 'Toa Tahu Mata',
    epicId: 'toa-mata-polish',
    expectedClips: [
      { backlog: 'complete', kind: 'idle', name: 'Idle', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Attack', required: true },
      { backlog: 'missing', kind: 'combat', name: 'Hit', required: true },
    ],
    glb: 'Toa_Mata/tahu.glb',
    id: 'toa-mata-tahu',
    reactComponent: 'TahuMataModel',
    role: 'combat',
  },

  // --- Toa Nuva ---
  {
    displayName: 'Toa Tahu Nuva',
    epicId: 'complete',
    expectedClips: [
      { backlog: 'complete', kind: 'idle', name: 'Idle', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Attack', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Hit', required: true },
    ],
    glb: 'Toa_Nuva/tahu.glb',
    id: 'toa-nuva-tahu',
    reactComponent: 'TahuNuvaModel',
    role: 'combat',
  },
  {
    displayName: 'Toa Pohatu Nuva',
    epicId: 'complete',
    expectedClips: [
      { backlog: 'complete', kind: 'idle', name: 'Idle', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Attack', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Hit', required: true },
    ],
    glb: 'Toa_Nuva/pohatu.glb',
    id: 'toa-nuva-pohatu',
    notes: 'Also ships Idle.001 and Idle.002 — not wired in code yet.',
    reactComponent: 'PohatuNuvaModel',
    role: 'combat',
  },
  ...(['gali', 'kopaka', 'onua', 'takanuva'] as const).map(
    (name): RigInventoryEntry => ({
      displayName: `Toa ${name === 'takanuva' ? 'Takanuva' : name.charAt(0).toUpperCase() + name.slice(1)} Nuva`,
      epicId: 'toa-nuva-combat',
      expectedClips: COMBAT_CLIPS,
      glb: `Toa_Nuva/${name}.glb`,
      id: `toa-nuva-${name}`,
      reactComponent:
        name === 'takanuva'
          ? 'TakanuvaModel'
          : `${name.charAt(0).toUpperCase()}${name.slice(1)}NuvaModel`,
      role: 'combat',
    })
  ),
  {
    displayName: 'Toa Lewa Nuva',
    epicId: 'toa-nuva-combat',
    expectedClips: [
      ...COMBAT_CLIPS,
      {
        backlog: 'unused',
        kind: 'idle-switch',
        name: 'Idle.001',
        notes: 'Second idle pose exists in GLB but no idle-switch config yet.',
        required: false,
      },
    ],
    glb: 'Toa_Nuva/lewa.glb',
    id: 'toa-nuva-lewa',
    reactComponent: 'LewaNuvaModel',
    role: 'combat',
  },

  // --- Toa Metru ---
  ...(
    [
      ['Lhikan', 'LhikanModel'],
      ['Matau', 'MatauModel'],
      ['Nokama', 'NokamaModel'],
      ['Nuju', 'NujuModel'],
      ['Onewa', 'OnewaModel'],
      ['Vakama', 'VakamaModel'],
      ['Whenua', 'WhenuaModel'],
    ] as const
  ).map(
    ([name, component]): RigInventoryEntry => ({
      displayName: name === 'Lhikan' ? 'Toa Lhikan' : `Toa ${name} Metru`,
      epicId: 'toa-metru-combat',
      expectedClips: COMBAT_CLIPS,
      glb: `Toa_Metru/${name}.glb`,
      id: `toa-metru-${name.toLowerCase()}`,
      reactComponent: component,
      role: 'combat',
    })
  ),

  // --- Enemies ---
  {
    displayName: 'Vahki (all hives)',
    epicId: 'vahki-combat',
    expectedClips: [
      ...VAHKI_IDLE_SWITCH_CLIP_NAMES.map(
        (name): ExpectedClip => ({
          backlog: 'complete',
          kind: name.startsWith('Switch_') ? 'transition' : 'idle-switch',
          name,
          required: true,
        })
      ),
      { backlog: 'missing', kind: 'combat', name: 'Attack', required: true },
      { backlog: 'missing', kind: 'combat', name: 'Hit', required: true },
      { backlog: 'missing', kind: 'combat', name: 'Defeat', required: true },
    ],
    glb: 'Vahki.glb',
    id: 'vahki',
    reactComponent: 'VahkiModel',
    role: 'combat',
  },
  {
    displayName: 'Rahkshi (shared rig)',
    epicId: 'rahkshi-defeat',
    expectedClips: [
      {
        backlog: 'complete',
        kind: 'idle',
        name: 'Empty',
        notes: 'Pre-Kraata glow pose.',
        required: true,
      },
      {
        backlog: 'complete',
        kind: 'idle',
        name: 'Idle',
        notes: 'Post-Kraata glow pose.',
        required: true,
      },
      { backlog: 'complete', kind: 'combat', name: 'Attack', required: true },
      { backlog: 'complete', kind: 'combat', name: 'Hit', required: true },
      { backlog: 'missing', kind: 'combat', name: 'Defeat', required: true },
    ],
    glb: 'rahkshi.glb',
    id: 'rahkshi',
    reactComponent: 'Rahkshi',
    role: 'combat',
  },
  {
    displayName: 'Nui-Rama',
    epicId: 'rahi-nui-rama',
    expectedClips: [
      { backlog: 'complete', kind: 'ambient', name: 'Wings', required: true },
      { backlog: 'missing', kind: 'combat', name: 'Attack', required: true },
      { backlog: 'missing', kind: 'combat', name: 'Hit', required: true },
      { backlog: 'missing', kind: 'combat', name: 'Defeat', required: true },
    ],
    glb: 'Rahi/NuiRama.glb',
    id: 'nui-rama',
    reactComponent: 'NuiRamaModel',
    role: 'enemy',
  },
  {
    displayName: 'Generic Rahi placeholder',
    epicId: 'rahi-placeholder',
    expectedClips: COMBAT_CLIPS,
    glb: null,
    id: 'rahi-placeholder',
    notes: 'Procedural capsule — no GLB. All combat motion is root-group procedural.',
    reactComponent: 'RahiPlaceholderModel',
    role: 'placeholder',
  },

  // --- Village Matoran ---
  {
    displayName: 'Diminished Matoran (2001)',
    epicId: 'complete',
    expectedClips: [
      { backlog: 'complete', kind: 'idle', name: 'Idle', required: true },
      { backlog: 'complete', kind: 'flavor', name: 'Tilt Head', required: false },
    ],
    glb: 'matoran_master.glb',
    id: 'matoran-diminished',
    reactComponent: 'DiminishedMatoranModel',
    role: 'village',
  },
  {
    displayName: 'Metru Matoran',
    epicId: 'village-flavor',
    expectedClips: VILLAGE_FLAVOR,
    glb: 'matoran_metru.glb',
    id: 'matoran-metru',
    reactComponent: 'MetruMatoranModel',
    role: 'village',
  },
  {
    displayName: 'Rebuilt Matoran',
    epicId: 'rebuilt-idle-switch',
    expectedClips: [
      { backlog: 'complete', kind: 'idle-switch', name: 'Idle', required: true },
      { backlog: 'complete', kind: 'idle-switch', name: 'Idle.001', required: true },
      {
        backlog: 'missing',
        kind: 'transition',
        name: 'Switch_Idle',
        notes: 'Suggested name for a future one-shot transition clip (Vahki Switch_* pattern).',
        required: false,
      },
      ...VILLAGE_FLAVOR.filter((clip) => clip.name !== 'Idle'),
    ],
    glb: 'rebuilt.glb',
    id: 'matoran-rebuilt',
    reactComponent: 'RebuiltMatoranModel',
    role: 'village',
  },
];

/** Idle clip names validated in CI — derived from inventory combat + village rigs. */
export function getRequiredIdleClips(): Record<string, string> {
  const map: Record<string, string> = {};

  for (const rig of RIG_INVENTORY) {
    if (!rig.glb) continue;

    if (rig.id === 'rahkshi') {
      map[rig.glb] = 'Empty';
      continue;
    }

    if (rig.id === 'vahki') {
      map[rig.glb] = 'Idle_Biped';
      continue;
    }

    const idleClip =
      rig.expectedClips.find((clip) => clip.kind === 'idle' && clip.required) ??
      rig.expectedClips.find((clip) => clip.kind === 'idle-switch' && clip.required);

    if (idleClip) {
      map[rig.glb] = idleClip.name;
    }
  }

  return map;
}

/** Combat rigs that should eventually ship all three combat clips (Dex preview contract). */
export const COMBAT_PREVIEW_CLIPS = ['Attack', 'Hit', 'Defeat'] as const;

export function getRigsByEpic(epicId: AnimationEpicId): RigInventoryEntry[] {
  return RIG_INVENTORY.filter((rig) => rig.epicId === epicId);
}

export function getOpenEpics(): AnimationEpic[] {
  return sortEpicIdsByStory(
    (Object.keys(ANIMATION_EPICS) as AnimationEpicId[]).filter((id) =>
      RIG_INVENTORY.some((rig) => rig.epicId === id)
    )
  ).map((id) => ANIMATION_EPICS[id]);
}

/** Sort epic ids by `storyOrder` (earlier game content first). */
export function sortEpicIdsByStory(ids: readonly AnimationEpicId[]): AnimationEpicId[] {
  return [...ids].sort((a, b) => ANIMATION_EPICS[a].storyOrder - ANIMATION_EPICS[b].storyOrder);
}

/** Resolve a rig inventory row from a `public/` relative GLB path (tolerant of prefixes). */
export function findRigByGlb(glbPath: string): RigInventoryEntry | undefined {
  const normalized = glbPath
    .replace(/\\/g, '/')
    .replace(/^public\//, '')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');

  return RIG_INVENTORY.find((rig) => rig.glb === normalized);
}

/** True when every required clip is marked complete (or optional clips are absent). */
export function isRigAnimationComplete(
  rig: RigInventoryEntry,
  shippedClipNames: string[]
): boolean {
  return rig.expectedClips
    .filter((clip) => clip.required)
    .every((clip) => shippedClipNames.includes(clip.name));
}

/** Clips present in the GLB that are not listed in the rig's expected inventory. */
export function getUnexpectedShippedClips(
  rig: RigInventoryEntry,
  shippedClipNames: string[]
): string[] {
  const expected = new Set(rig.expectedClips.map((clip) => clip.name));
  return shippedClipNames.filter((name) => !expected.has(name));
}
