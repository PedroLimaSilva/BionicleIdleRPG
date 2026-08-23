import { LegoColor } from '../../../../types/Colors';
import { TOA_DEX } from '../../../../data/dex/toa';
import { normalizeKitMaterialSlotEntry } from '../../kitMaterialUtils';
import { LHIKAN_KIT_2004_ATTACHMENTS } from './lhikan';

describe('Toa Lhikan kit palettes', () => {
  test('dex authors gold/red per limb instead of kit Main/Secondary swaps', () => {
    const { colors } = TOA_DEX.Toa_Lhikan;
    expect(colors.body.main).toBe(LegoColor.DarkRed);
    expect(colors.body.secondary).toBe(LegoColor.DarkRed);
    expect(colors.arms.main).toBe(LegoColor.FlatDarkGold);
    expect(colors.arms.secondary).toBe(LegoColor.DarkRed);
    expect(colors.legs?.main).toBe(LegoColor.DarkRed);
    expect(colors.legs?.secondary).toBe(LegoColor.FlatDarkGold);
    expect(colors.feet.main).toBe(LegoColor.FlatDarkGold);
    expect(colors.feet.secondary).toBe(LegoColor.DarkRed);
    expect(colors.mask).toBe(LegoColor.FlatDarkGold);
    expect(colors.weapon?.glow).toBe(LegoColor.Orange);
  });

  test('arm, chest lid, leg, and foot sockets bind part slots rather than hardcoded gold', () => {
    const arm = LHIKAN_KIT_2004_ATTACHMENTS.ArmLowerL_1.materialColors;
    const chestLid = LHIKAN_KIT_2004_ATTACHMENTS.MetruChestLid.materialColors;
    const foot = LHIKAN_KIT_2004_ATTACHMENTS.MetruFootFootL.materialColors;
    const leg = LHIKAN_KIT_2004_ATTACHMENTS.MetruLegLegLowerL.materialColors;
    const sword = LHIKAN_KIT_2004_ATTACHMENTS.LhikanSwordWeaponL.materialColors;
    const torso = LHIKAN_KIT_2004_ATTACHMENTS.MetruTorsoChest.materialColors;

    expect(normalizeKitMaterialSlotEntry(arm!.Main!).color).toEqual({
      kind: 'part',
      part: 'arms',
      slot: 'main',
    });
    expect(normalizeKitMaterialSlotEntry(arm!.Secondary!).color).toEqual({
      kind: 'part',
      part: 'arms',
      slot: 'secondary',
    });
    expect(normalizeKitMaterialSlotEntry(leg!.Main!).color).toEqual({
      kind: 'part',
      part: 'legs',
      slot: 'main',
    });
    expect(normalizeKitMaterialSlotEntry(leg!.Secondary!).color).toEqual({
      kind: 'part',
      part: 'legs',
      slot: 'secondary',
    });
    expect(normalizeKitMaterialSlotEntry(foot!.Main!).color).toEqual({
      kind: 'part',
      part: 'feet',
      slot: 'main',
    });
    expect(normalizeKitMaterialSlotEntry(chestLid!.Main!).color).toEqual({
      kind: 'part',
      part: 'feet',
      slot: 'main',
    });
    expect(normalizeKitMaterialSlotEntry(torso!.Main!).color).toEqual({
      kind: 'part',
      part: 'feet',
      slot: 'main',
    });
    expect(normalizeKitMaterialSlotEntry(sword!.Glow!).emissive).toEqual({
      kind: 'part',
      part: 'weapon',
      slot: 'glow',
    });

    const serialized = JSON.stringify({ arm, chestLid, foot, leg, sword, torso });
    expect(serialized).not.toContain(LegoColor.FlatDarkGold);
  });
});
