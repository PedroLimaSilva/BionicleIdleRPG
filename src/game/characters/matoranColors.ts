import { partPalette, simpleLimbColors, uniformLimbPalettes } from '../../data/dex/partPalettes';
import { LegoColor } from '../../types/Colors';
import type { BodyPartId, BodyPartSlot } from '../../types/KitParts';
import {
  BaseMatoran,
  ElementTribe,
  isCustomCharacterId,
  Mask,
  MatoranStage,
  MatoranTag,
  type BodyPartPalette,
  type MatoranColors,
} from '../../types/Matoran';

export { partPalette, simpleLimbColors, uniformLimbPalettes };

const TOA_STAGES = new Set<MatoranStage>([
  MatoranStage.ToaMata,
  MatoranStage.ToaNuva,
  MatoranStage.ToaMetru,
]);

const METRU_STAGES = new Set<MatoranStage>([MatoranStage.Metru, MatoranStage.ToaMetru]);

export function isToaKitStage(stage: MatoranStage): boolean {
  return TOA_STAGES.has(stage);
}

export function isMetruKitStage(stage: MatoranStage): boolean {
  return METRU_STAGES.has(stage);
}

export function stageUsesPartSlots(stage: MatoranStage): boolean {
  return isToaKitStage(stage) || isMetruKitStage(stage);
}

export function isBodyPartPalette(value: unknown): value is BodyPartPalette {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as BodyPartPalette).main === 'string'
  );
}

function defaultMetalForStage(): LegoColor {
  return LegoColor.LightGray;
}

function defaultJointsForStage(stage?: MatoranStage): LegoColor {
  if (stage && METRU_STAGES.has(stage)) return LegoColor.DarkGray;
  return LegoColor.LightGray;
}

function resolvePart(colors: MatoranColors, part: BodyPartId): BodyPartPalette | undefined {
  if (part === 'legs') return colors.legs ?? colors.feet;
  if (part === 'weapon') return colors.weapon ?? colors.body;
  return colors[part];
}

export function getBodyPartSlotColor(
  colors: MatoranColors,
  part: BodyPartId,
  slot: BodyPartSlot
): LegoColor {
  const palette = resolvePart(colors, part) ?? colors.body;
  switch (slot) {
    case 'main':
      return palette.main;
    case 'secondary':
      return palette.secondary ?? palette.main;
    case 'metal':
      return palette.metal ?? LegoColor.LightGray;
    case 'glow':
      return palette.glow ?? colors.eyes;
    default:
      return palette.main;
  }
}

type LegacyFlatColors = {
  mask: LegoColor;
  body: LegoColor;
  arms: LegoColor;
  feet: LegoColor;
  eyes: LegoColor;
  face: LegoColor;
  weaponGlow?: LegoColor;
  metal?: LegoColor;
  joints?: LegoColor;
};

function isLegacyFlatColors(colors: unknown): colors is LegacyFlatColors {
  if (!colors || typeof colors !== 'object') return false;
  const c = colors as Record<string, unknown>;
  return typeof c.body === 'string' && typeof c.arms === 'string' && typeof c.feet === 'string';
}

function parseBodyPartPalette(raw: unknown): BodyPartPalette | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.main !== 'string') return null;
  const next: BodyPartPalette = { main: p.main as LegoColor };
  for (const slot of ['glow', 'metal', 'secondary'] as const) {
    if (p[slot] === undefined) continue;
    if (typeof p[slot] !== 'string') return null;
    next[slot] = p[slot] as LegoColor;
  }
  return next;
}

/**
 * Accepts the current per-part palette shape or a pre-refactor flat save / share
 * token (`body`/`arms`/`feet` as hex strings, optional `weaponGlow`/`metal`/`joints`).
 */
export function parseMatoranColors(raw: unknown, stage?: MatoranStage): MatoranColors | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const c = raw as Record<string, unknown>;
  if (typeof c.mask !== 'string' || typeof c.eyes !== 'string' || typeof c.face !== 'string') {
    return null;
  }

  if (typeof c.body === 'string') {
    for (const key of ['arms', 'feet']) {
      if (typeof c[key] !== 'string') return null;
    }
    if (c.weaponGlow !== undefined && typeof c.weaponGlow !== 'string') return null;
    if (c.metal !== undefined && typeof c.metal !== 'string') return null;
    if (c.joints !== undefined && typeof c.joints !== 'string') return null;
    return normalizeMatoranColors(c, stage);
  }

  const body = parseBodyPartPalette(c.body);
  const arms = parseBodyPartPalette(c.arms);
  const feet = parseBodyPartPalette(c.feet);
  if (!body || !arms || !feet) return null;
  const colors: MatoranColors = {
    arms,
    body,
    eyes: c.eyes as LegoColor,
    face: c.face as LegoColor,
    feet,
    mask: c.mask as LegoColor,
  };
  if (c.legs !== undefined) {
    const legs = parseBodyPartPalette(c.legs);
    if (!legs) return null;
    colors.legs = legs;
  }
  if (c.weapon !== undefined) {
    const weapon = parseBodyPartPalette(c.weapon);
    if (!weapon) return null;
    colors.weapon = weapon;
  }
  return normalizeMatoranColors(colors, stage);
}

function migrateStoredCustomCharacter(raw: unknown): BaseMatoran | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.id !== 'string' || !isCustomCharacterId(obj.id)) return null;
  if (typeof obj.name !== 'string' || !obj.name.trim()) return null;
  if (typeof obj.mask !== 'string') return null;
  if (typeof obj.element !== 'string') return null;
  if (typeof obj.stage !== 'string') return null;
  const colors = parseMatoranColors(obj.colors, obj.stage as MatoranStage);
  if (!colors) return null;

  const next: BaseMatoran = {
    colors,
    element: obj.element as ElementTribe,
    id: obj.id,
    mask: obj.mask as Mask,
    name: obj.name,
    stage: obj.stage as MatoranStage,
  };
  if (obj.isMaskTransparent === true) next.isMaskTransparent = true;
  if (typeof obj.chronicleId === 'string') next.chronicleId = obj.chronicleId;
  if (Array.isArray(obj.tags)) next.tags = obj.tags as MatoranTag[];
  return next;
}

/** One-pass load migration: expand legacy palettes and drop leftover `kitSlotMap`. */
export function migrateCustomCharacters(raw: unknown): BaseMatoran[] {
  if (!Array.isArray(raw)) return [];
  const next: BaseMatoran[] = [];
  for (const entry of raw) {
    const migrated = migrateStoredCustomCharacter(entry);
    if (migrated) next.push(migrated);
  }
  return next;
}

/**
 * Accepts the current dex shape or a pre-refactor flat custom save / share token.
 * Legacy `kitSlotMap` is ignored — slot colors now live on each body part.
 */
export function normalizeMatoranColors(
  colors: MatoranColors | LegacyFlatColors | Record<string, unknown>,
  stage?: MatoranStage
): MatoranColors {
  if (isLegacyFlatColors(colors)) {
    return expandLegacyFlatColors(colors, stage);
  }
  const c = colors as MatoranColors;
  return {
    arms: { ...c.arms },
    body: { ...c.body },
    eyes: c.eyes,
    face: c.face,
    feet: { ...c.feet },
    mask: c.mask,
    ...(c.legs ? { legs: { ...c.legs } } : {}),
    ...(c.weapon ? { weapon: { ...c.weapon } } : {}),
  };
}

function expandLegacyFlatColors(c: LegacyFlatColors, stage?: MatoranStage): MatoranColors {
  const metal = c.metal ?? defaultMetalForStage();
  const joints = c.joints ?? defaultJointsForStage(stage);

  if (stage && METRU_STAGES.has(stage)) {
    const limb: BodyPartPalette = {
      main: joints,
      metal,
      secondary: c.arms,
    };
    return {
      arms: { ...limb },
      body: { main: c.body, metal },
      eyes: c.eyes,
      face: c.face,
      feet: { main: c.feet, metal },
      legs: { ...limb },
      mask: c.mask,
      ...(c.weaponGlow ? { weapon: { glow: c.weaponGlow, main: c.body, metal } } : {}),
    };
  }

  if (stage && TOA_STAGES.has(stage)) {
    const part: BodyPartPalette = {
      glow: c.eyes,
      main: c.body,
      metal,
      secondary: c.arms,
    };
    return {
      arms: { ...part },
      body: { ...part },
      eyes: c.eyes,
      face: c.face,
      feet: { ...part },
      legs: { ...part },
      mask: c.mask,
      weapon: {
        ...part,
        glow: c.weaponGlow ?? c.eyes,
      },
    };
  }

  return {
    arms: { main: c.arms },
    body: { main: c.body },
    eyes: c.eyes,
    face: c.face,
    feet: { main: c.feet },
    mask: c.mask,
    ...(c.weaponGlow ? { weapon: { glow: c.weaponGlow, main: c.body } } : {}),
  };
}

export function bodyPartPalettesEqual(a: BodyPartPalette, b: BodyPartPalette): boolean {
  return (
    a.main === b.main &&
    (a.secondary ?? null) === (b.secondary ?? null) &&
    (a.metal ?? null) === (b.metal ?? null) &&
    (a.glow ?? null) === (b.glow ?? null)
  );
}

export function matoranColorsEqual(a: MatoranColors, b: MatoranColors): boolean {
  if (a.mask !== b.mask || a.eyes !== b.eyes || a.face !== b.face) return false;
  if (!bodyPartPalettesEqual(a.body, b.body)) return false;
  if (!bodyPartPalettesEqual(a.arms, b.arms)) return false;
  if (!bodyPartPalettesEqual(a.feet, b.feet)) return false;
  if (!bodyPartPalettesEqual(a.legs ?? a.feet, b.legs ?? b.feet)) return false;
  const aW = a.weapon;
  const bW = b.weapon;
  if (!aW && !bW) return true;
  if (!aW || !bW) return (aW?.glow ?? null) === (bW?.glow ?? null);
  return bodyPartPalettesEqual(aW, bW);
}

export function setBodyPartSlot(
  colors: MatoranColors,
  part: BodyPartId,
  slot: BodyPartSlot,
  value: LegoColor
): MatoranColors {
  const current = resolvePart(colors, part) ?? { main: colors.body.main };
  const nextPart: BodyPartPalette = { ...current, [slot]: value };
  if (part === 'body') return { ...colors, body: nextPart };
  if (part === 'arms') return { ...colors, arms: nextPart };
  if (part === 'feet') return { ...colors, feet: nextPart };
  if (part === 'legs') return { ...colors, legs: nextPart };
  return { ...colors, weapon: nextPart };
}

/**
 * When a custom first reaches a kit stage (Toa / Metru), fill per-part slots the way
 * the old flat palette + kit defaults would have looked.
 */
export function expandToKitStage(colors: MatoranColors, stage: MatoranStage): MatoranColors {
  const metal = defaultMetalForStage();
  if (isMetruKitStage(stage)) {
    const limb: BodyPartPalette = {
      main: defaultJointsForStage(stage),
      metal,
      secondary: colors.arms.main,
    };
    return {
      arms: { ...limb },
      body: { main: colors.body.main, metal, secondary: colors.body.secondary },
      eyes: colors.eyes,
      face: colors.face,
      feet: { main: colors.feet.main, metal, secondary: colors.feet.secondary },
      legs: { ...limb },
      mask: colors.mask,
      weapon: colors.weapon ?? { glow: colors.eyes, main: colors.body.main, metal },
    };
  }
  if (isToaKitStage(stage)) {
    const part: BodyPartPalette = {
      glow: colors.eyes,
      main: colors.body.main,
      metal,
      secondary: colors.arms.main,
    };
    return {
      ...uniformLimbPalettes(part),
      eyes: colors.eyes,
      face: colors.face,
      mask: colors.mask,
      weapon: {
        ...part,
        glow: colors.weapon?.glow ?? colors.eyes,
      },
    };
  }
  return colors;
}
