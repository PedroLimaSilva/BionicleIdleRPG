import { LegoColor } from './Colors';
import { JobAssignment, MatoranJob } from './Jobs';
import type { BodyPartId, BodyPartSlot } from './KitParts';
import { Quest } from './Quests';

export const enum Mask {
  Avohkii = 'Avohkii',
  Hau = 'Hau',
  Kaukau = 'Kaukau',
  Kakama = 'Kakama',
  Akaku = 'Akaku',
  Pakari = 'Pakari',
  Miru = 'Miru',
  HauNuva = 'Hau_Nuva',
  HauNuvaInfected = 'Hau_Nuva_Infected',
  KaukauNuva = 'Kaukau_Nuva',
  KakamaNuva = 'Kakama_Nuva',
  AkakuNuva = 'Akaku_Nuva',
  PakariNuva = 'Pakari_Nuva',
  MiruNuva = 'Miru_Nuva',
  Huna = 'Huna',
  Ruru = 'Ruru',
  Komau = 'Komau',
  Rau = 'Rau',
  Matatu = 'Matatu',
  Mahiki = 'Mahiki',
  HauGreat = 'Hau_Great',
  HunaGreat = 'Huna_Great',
  KomauGreat = 'Komau_Great',
  MahikiGreat = 'Mahiki_Great',
  MatatuGreat = 'Matatu_Great',
  RauGreat = 'Rau_Great',
  RuruGreat = 'Ruru_Great',
  Vahi = 'Vahi',
  Kraahkan = 'Kraahkan',
  Krana = 'Krana',
}

export enum ElementTribe {
  Water = 'Water',
  Fire = 'Fire',
  Air = 'Air',
  Ice = 'Ice',
  Stone = 'Stone',
  Earth = 'Earth',
  Light = 'Light',
  Shadow = 'Shadow',
}

export const enum MatoranTag {
  ChroniclersCompany = 'ChroniclersCompany',
  Custom = 'Custom',
  /** Metru-era matoran carrying a Great Disk (disk launcher + Kanoka on the rig). */
  MetruGreatDisk = 'MetruGreatDisk',
}

/** ID prefix for player-created custom characters (e.g. "custom_0"). */
export const CUSTOM_CHARACTER_ID_PREFIX = 'custom_';

export function isCustomCharacterId(id: string): boolean {
  return id.startsWith(CUSTOM_CHARACTER_ID_PREFIX);
}

/** Special sentinel id used in the buyable list to represent the "create a new matoran" slot. */
export const CREATE_CUSTOM_CHARACTER_ID = 'create_custom_matoran';

/** Protodermis cost to create or recruit a custom matoran. */
export const CUSTOM_CHARACTER_COST = 500;

export const enum MatoranStage {
  Turaga = 'Turaga',
  ToaMata = 'Toa Mata',
  ToaNuva = 'Toa Nuva',
  ToaMetru = 'Toa Metru',
  Diminished = 'Diminished',
  Rebuilt = 'Rebuilt',
  Metru = 'Metru',
  Bohrok = 'Bohrok',
  BohrokKal = 'BohrokKal',
  Makuta = 'Makuta',
}

/** Kit material slots a body part can author in the dex. */
export type BodyPartPalette = {
  main: LegoColor;
  secondary?: LegoColor;
  metal?: LegoColor;
  glow?: LegoColor;
};

/**
 * Character colors. Mask / eyes / face stay flat (avatar + Kanohi). Limb and armor
 * pieces use per-part palettes so kit Main/Secondary/Metal/Glow map 1:1.
 */
export type MatoranColors = {
  mask: LegoColor;
  eyes: LegoColor;
  face: LegoColor;
  body: BodyPartPalette;
  arms: BodyPartPalette;
  feet: BodyPartPalette;
  legs?: BodyPartPalette;
  weapon?: BodyPartPalette;
};

export type ColorTabId = 'mask' | 'eyes' | 'face' | BodyPartId;

export type BodyPartSlotName = BodyPartSlot;

// Static data for any Matoran
export type BaseMatoran = {
  id: string;
  name: string;
  mask: Mask;
  element: ElementTribe;
  isMaskTransparent?: boolean;
  stage: MatoranStage;
  colors: MatoranColors;
  tags?: MatoranTag[];
  /** Reference to shared chronicle set - multiple matoran entries can share the same chronicle ID */
  chronicleId?: string;
  /** Canonical Metru-era day job before becoming Toa; limits job assignments while in Metru stage. */
  metruProfession?: MatoranJob;
};

export type ListedCharacterData = {
  id: string;
  cost: number;
};

export type RecruitedCharacterData = {
  id: string;
  exp: number;
  assignment?: JobAssignment;
  quest?: Quest['id'];
  maskOverride?: Mask;
  /** Overrides stage from CHARACTER_DEX when present (e.g. Rebuilt after Naming Day). */
  stage?: MatoranStage;
  /**
   * For custom characters at Toa Mata: which Mata dex rig/kit GLB to render (`Toa_Tahu`, `Toa_Gali`, …).
   */
  customMataModelId?: string;
};
