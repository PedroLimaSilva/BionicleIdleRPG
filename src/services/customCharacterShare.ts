import { LegoColor } from '../types/Colors';
import {
  BaseMatoran,
  CUSTOM_CHARACTER_ID_PREFIX,
  ElementTribe,
  isCustomCharacterId,
  Mask,
  MatoranStage,
  MatoranTag,
  type BodyPartPalette,
  type MatoranColors,
} from '../types/Matoran';
import { matoranColorsEqual, normalizeMatoranColors } from '../game/matoranColors';

/** URL query param used to share a custom character. Value is a base64-encoded JSON BaseMatoran. */
export const SHARE_QUERY_PARAM = 'recruit';

/**
 * Mask/MatoranStage are const enums (no runtime object). We enumerate their valid string values
 * here so we can reject malformed share tokens. Keep this list in sync with the enum.
 */
const VALID_MASKS = new Set<string>([
  'Avohkii',
  'Hau',
  'Kaukau',
  'Kakama',
  'Akaku',
  'Pakari',
  'Miru',
  'Hau_Nuva',
  'Hau_Nuva_Infected',
  'Kaukau_Nuva',
  'Kakama_Nuva',
  'Akaku_Nuva',
  'Pakari_Nuva',
  'Miru_Nuva',
  'Huna',
  'Ruru',
  'Komau',
  'Rau',
  'Matatu',
  'Mahiki',
  'Vahi',
  'Kraahkan',
  'Krana',
]);

const VALID_ELEMENTS = new Set<string>(Object.values(ElementTribe));

const VALID_STAGES = new Set<string>([
  'Turaga',
  'Toa Mata',
  'Toa Nuva',
  'Toa Metru',
  'Diminished',
  'Rebuilt',
  'Metru',
  'Bohrok',
  'BohrokKal',
  'Makuta',
]);

/** URL-safe base64 (no `=`, `+/` swapped) so the param is link-friendly. */
function b64UrlEncode(str: string): string {
  const b64 = typeof btoa !== 'undefined' ? btoa(str) : Buffer.from(str).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const normalized = padded + pad;
  return typeof atob !== 'undefined'
    ? atob(normalized)
    : Buffer.from(normalized, 'base64').toString();
}

export function encodeCustomCharacterShare(base: BaseMatoran): string {
  return b64UrlEncode(JSON.stringify(base));
}

/** Validates a parsed object as a sharable custom BaseMatoran. Returns null on failure. */
export function parseCustomCharacterShare(token: string): BaseMatoran | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(b64UrlDecode(token));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;

  const obj = parsed as Record<string, unknown>;
  if (typeof obj.id !== 'string' || !isCustomCharacterId(obj.id)) return null;
  if (typeof obj.name !== 'string' || !obj.name.trim()) return null;
  if (typeof obj.mask !== 'string' || !VALID_MASKS.has(obj.mask)) return null;
  if (typeof obj.element !== 'string' || !VALID_ELEMENTS.has(obj.element)) return null;
  if (typeof obj.stage !== 'string' || !VALID_STAGES.has(obj.stage)) return null;
  const colors = parseShareColors(obj.colors, obj.stage as MatoranStage);
  if (!colors) return null;

  return {
    colors,
    element: obj.element as ElementTribe,
    id: obj.id,
    isMaskTransparent: !!obj.isMaskTransparent,
    mask: obj.mask as Mask,
    name: obj.name.trim().slice(0, 32),
    stage: obj.stage as MatoranStage,
    tags: [MatoranTag.Custom],
  };
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
 * Accepts the current per-part palette shape or a pre-refactor flat token
 * (`body`/`arms`/`feet` as hex strings, optional `weaponGlow`/`metal`/`joints`).
 */
function parseShareColors(raw: unknown, stage: MatoranStage): MatoranColors | null {
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

/**
 * True when two customs match as the same shared design (name, element, mask, stage,
 * transparency, colors). Ignores `id` so imports from different saves do not false-dedupe
 * or false-collide on `custom_*` indices alone.
 */
export function areEquivalentSharedCustomMatoran(a: BaseMatoran, b: BaseMatoran): boolean {
  if (a.name.trim() !== b.name.trim()) return false;
  if (a.mask !== b.mask) return false;
  if (a.element !== b.element) return false;
  if (a.stage !== b.stage) return false;
  if (!!a.isMaskTransparent !== !!b.isMaskTransparent) return false;
  return matoranColorsEqual(
    normalizeMatoranColors(a.colors, a.stage),
    normalizeMatoranColors(b.colors, b.stage)
  );
}

/** First custom entry whose share identity matches `candidate`, if any. */
export function findSharedCustomCharacterIdentityMatch(
  customs: BaseMatoran[],
  candidate: BaseMatoran
): BaseMatoran | undefined {
  return customs.find((c) => areEquivalentSharedCustomMatoran(c, candidate));
}

/**
 * Pulls the `recruit` query value from pasted text: full URL, partial path, or raw token.
 * Used when the app cannot read the browser URL (e.g. share link opened in Safari but the
 * player uses the installed PWA, which has separate storage).
 */
export function extractRecruitTokenFromShareInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const decodeSafe = (value: string) => {
    try {
      return decodeURIComponent(value.replace(/\+/g, '%20'));
    } catch {
      return value;
    }
  };

  const fromQueryString = (s: string): string | null => {
    const match = s.match(/(?:^|[?&])recruit=([^&\s#]+)/i);
    if (!match) return null;
    return decodeSafe(match[1]);
  };

  let token = fromQueryString(trimmed);
  if (!token && trimmed.includes('#')) {
    token = fromQueryString(trimmed.slice(trimmed.indexOf('#') + 1));
  }
  if (token) return token;

  try {
    const href =
      trimmed.startsWith('http://') || trimmed.startsWith('https://')
        ? trimmed
        : `https://invalid.invalid${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
    const url = new URL(href);
    const fromSearch = url.searchParams.get(SHARE_QUERY_PARAM);
    if (fromSearch) return fromSearch;
  } catch {
    // ignore
  }

  if (/^[A-Za-z0-9_-]+$/.test(trimmed) && trimmed.length >= 24) {
    return trimmed;
  }
  return null;
}

export function buildCustomCharacterShareUrl(base: BaseMatoran): string {
  const token = encodeCustomCharacterShare(base);
  const { origin, pathname } = window.location;
  // basename is /BionicleIdleRPG/; the shared link should open the app root with the param.
  const basePath = pathname.split('/').slice(0, 2).join('/') || '';
  const cleanBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return `${origin}${cleanBase}?${SHARE_QUERY_PARAM}=${token}`;
}

/** Convenience: builds an id with the prefix from a numeric token (used by tests/utilities). */
export function buildCustomId(token: string): string {
  return `${CUSTOM_CHARACTER_ID_PREFIX}${token}`;
}
