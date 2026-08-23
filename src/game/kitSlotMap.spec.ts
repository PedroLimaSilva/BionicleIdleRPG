import { LegoColor } from '../types/Colors';
import { MatoranStage } from '../types/Matoran';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../types/KitParts';
import {
  applyKitSlotMapToAttachments,
  compactKitSlotMap,
  defaultJointsColorForStage,
  inferKitColorRegion,
  kitSlotMapsEquivalent,
  remapMaterialColorsForSlotMap,
  resolveBindingsForRegion,
  resolveKitSlotMap,
  stageUsesKitSlotEditor,
  withPaletteDefaults,
} from './kitSlotMap';

describe('kitSlotMap', () => {
  describe('stageUsesKitSlotEditor', () => {
    test('exposes the editor on Toa and Metru kits only', () => {
      expect(stageUsesKitSlotEditor(MatoranStage.ToaMata)).toBe(true);
      expect(stageUsesKitSlotEditor(MatoranStage.ToaNuva)).toBe(true);
      expect(stageUsesKitSlotEditor(MatoranStage.Metru)).toBe(true);
      expect(stageUsesKitSlotEditor(MatoranStage.ToaMetru)).toBe(true);
      expect(stageUsesKitSlotEditor(MatoranStage.Diminished)).toBe(false);
      expect(stageUsesKitSlotEditor(MatoranStage.Rebuilt)).toBe(false);
    });
  });

  describe('withPaletteDefaults', () => {
    const base = {
      arms: LegoColor.Red,
      body: LegoColor.Blue,
      eyes: LegoColor.TransNeonOrange,
      face: LegoColor.DarkGray,
      feet: LegoColor.Green,
      mask: LegoColor.Yellow,
    };

    test('fills metal, joints, and weaponGlow without mutating provided colors', () => {
      const resolved = withPaletteDefaults(base, MatoranStage.ToaMata);
      expect(resolved.metal).toBe(LegoColor.LightGray);
      expect(resolved.joints).toBe(LegoColor.LightGray);
      expect(resolved.weaponGlow).toBe(LegoColor.TransNeonYellow);
      expect(base).not.toHaveProperty('metal');
    });

    test('Metru joints default to DarkGray to match current limb Main', () => {
      expect(defaultJointsColorForStage(MatoranStage.Metru)).toBe(LegoColor.DarkGray);
      expect(withPaletteDefaults(base, MatoranStage.ToaMetru).joints).toBe(LegoColor.DarkGray);
    });

    test('preserves explicitly stored optional colors', () => {
      const resolved = withPaletteDefaults(
        { ...base, joints: LegoColor.White, metal: LegoColor.FlatDarkGold },
        MatoranStage.Metru
      );
      expect(resolved.metal).toBe(LegoColor.FlatDarkGold);
      expect(resolved.joints).toBe(LegoColor.White);
    });
  });

  describe('inferKitColorRegion', () => {
    test.each([
      ['MataChest', 'torso'],
      ['MataAbdomen', 'torso'],
      ['MetruMatoranTorsoBody', 'torso'],
      ['NuvaBicepsL', 'arms'],
      ['NuvaForearmArmorR', 'arms'],
      ['MetruMatoranLimbShinArmLowerL', 'arms'],
      ['MetruMatoranLimbPistonArmUpperR', 'arms'],
      ['NuvaCalfL', 'legs'],
      ['MataLegModThigh', 'legs'],
      ['MetruMatoranLimbShinLegUpperL', 'legs'],
      ['MetruMatoranLimbPistonLegLowerR', 'legs'],
      ['MataFootL', 'feet'],
      ['Bohrok_FootFootR', 'feet'],
      ['MataFace', 'head'],
      ['MataGlowingEyes', 'head'],
      ['MataBrainHead', 'head'],
      ['LightSpear', 'weapon'],
      ['MagmaBladeL', 'weapon'],
      ['Disk_LauncherWeapon_Holster', 'weapon'],
      ['Axle6L', 'torso'],
    ] as const)('%s → %s', (socket, region) => {
      expect(inferKitColorRegion(socket)).toBe(region);
    });
  });

  describe('resolve / compact', () => {
    test('omitted map equals stage defaults', () => {
      const resolved = resolveKitSlotMap(MatoranStage.ToaNuva, undefined);
      expect(resolved.torso?.Main).toBe('body');
      expect(resolved.torso?.Secondary).toBe('arms');
      expect(resolved.torso?.Metal).toBe('metal');
      expect(resolved.weapon?.Glow).toBe('weaponGlow');
      expect(kitSlotMapsEquivalent(MatoranStage.ToaNuva, undefined, {})).toBe(true);
    });

    test('Metru defaults bind limb Main to joints and feet Main to feet', () => {
      const resolved = resolveKitSlotMap(MatoranStage.Metru, undefined);
      expect(resolved.arms?.Main).toBe('joints');
      expect(resolved.arms?.Secondary).toBe('arms');
      expect(resolved.feet?.Main).toBe('feet');
    });

    test('compact drops identity overrides so old saves stay equivalent', () => {
      const compact = compactKitSlotMap(MatoranStage.ToaMata, {
        torso: { Glow: 'eyes', Main: 'body', Metal: 'metal', Secondary: 'arms' },
      });
      expect(compact).toBeUndefined();
    });

    test('compact keeps Takanuva-style limb remaps', () => {
      const compact = compactKitSlotMap(MatoranStage.ToaNuva, {
        arms: { Main: 'joints', Metal: 'metal', Secondary: 'body' },
        legs: { Main: 'joints', Secondary: 'body' },
      });
      expect(compact).toEqual({
        arms: { Main: 'joints', Secondary: 'body' },
        legs: { Main: 'joints', Secondary: 'body' },
      });
    });

    test('resolveBindingsForRegion merges a single override', () => {
      const bindings = resolveBindingsForRegion(MatoranStage.ToaNuva, 'legs', {
        legs: { Main: 'joints', Secondary: 'body' },
      });
      expect(bindings.Main).toBe('joints');
      expect(bindings.Secondary).toBe('body');
      expect(bindings.Metal).toBe('metal');
      expect(bindings.Glow).toBe('eyes');
    });
  });

  describe('remapMaterialColorsForSlotMap', () => {
    const plastics: Partial<Record<string, KitMaterialSlotEntry>> = {
      Glow: { emissive: { key: 'eyes', kind: 'palette' }, weathered: false },
      Main: { key: 'body', kind: 'palette' },
      Metal: {
        color: { key: 'metal', kind: 'palette' },
        metalness: 0.95,
      },
      Secondary: { key: 'arms', kind: 'palette' },
    };

    test('rewrites palette keys and keeps metal PBR', () => {
      const remapped = remapMaterialColorsForSlotMap(plastics, {
        Main: 'joints',
        Secondary: 'body',
      });
      expect(remapped).toEqual({
        Glow: plastics.Glow,
        Main: { color: { key: 'joints', kind: 'palette' } },
        Metal: plastics.Metal,
        Secondary: { color: { key: 'body', kind: 'palette' } },
      });
    });

    test('does not rewrite hardcoded lego slots (black pins)', () => {
      const pins = { Main: { kind: 'lego' as const, value: LegoColor.Black } };
      expect(remapMaterialColorsForSlotMap(pins, { Main: 'body' })).toBe(pins);
    });

    test('leaves unspecified maps untouched', () => {
      expect(remapMaterialColorsForSlotMap(plastics, undefined)).toBe(plastics);
      expect(remapMaterialColorsForSlotMap(plastics, {})).toBe(plastics);
    });
  });

  describe('applyKitSlotMapToAttachments', () => {
    const attachments: Record<string, KitSocketAttachment> = {
      AxleBlack: {
        kitNodeName: 'Axle',
        materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
      },
      NuvaCalfL: {
        kitNodeName: 'NuvaCalf',
        materialColors: {
          Main: { key: 'body', kind: 'palette' },
          Secondary: { key: 'arms', kind: 'palette' },
        },
      },
      NuvaForearmArmorL: {
        kitNodeName: 'NuvaForearmArmor',
        materialColors: {
          Main: { key: 'body', kind: 'palette' },
        },
      },
    };

    test('applies only stored overrides for the inferred region', () => {
      const next = applyKitSlotMapToAttachments(attachments, {
        arms: { Main: 'joints' },
        legs: { Main: 'joints', Secondary: 'body' },
      });
      expect(next.NuvaCalfL.materialColors).toEqual({
        Main: { color: { key: 'joints', kind: 'palette' } },
        Secondary: { color: { key: 'body', kind: 'palette' } },
      });
      expect(next.NuvaForearmArmorL.materialColors).toEqual({
        Main: { color: { key: 'joints', kind: 'palette' } },
      });
      expect(next.AxleBlack).toBe(attachments.AxleBlack);
    });

    test('returns the same object when nothing remaps (legacy customs)', () => {
      expect(applyKitSlotMapToAttachments(attachments, undefined)).toBe(attachments);
      expect(applyKitSlotMapToAttachments(attachments, {})).toBe(attachments);
    });
  });
});
