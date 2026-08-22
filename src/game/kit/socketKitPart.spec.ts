import {
  LHIKAN_KIT_2001_ATTACHMENTS,
  LHIKAN_KIT_2003_ATTACHMENTS,
  LHIKAN_KIT_2004_ATTACHMENTS,
  LHIKAN_KIT_PART_ALIASES,
  LHIKAN_KIT_SOCKET_NAMES,
  buildLhikanKitAttachments,
} from './attachments/Toa Metru/lhikan';
import { KIT_2001_NODES } from './nodes/kit2001Nodes';
import { KIT_2003_NODES } from './nodes/kit2003Nodes';
import { KIT_2004_NODES } from './nodes/kit2004Nodes';
import { kitPartFromSocketName, sanitizeKitSocketName } from './socketKitPart';

describe('sanitizeKitSocketName', () => {
  test('strips dots the way Three.js sanitizes Blender socket names', () => {
    expect(sanitizeKitSocketName('AxleMod2L.ArmUpper.L')).toBe('AxleMod2LArmUpperL');
    expect(sanitizeKitSocketName('Socket.Foot.L')).toBe('SocketFootL');
    expect(sanitizeKitSocketName('LhikanSword.Weapon.L')).toBe('LhikanSwordWeaponL');
    expect(sanitizeKitSocketName('Axle6L.001')).toBe('Axle6L001');
  });
});

describe('kitPartFromSocketName', () => {
  const aliases = LHIKAN_KIT_PART_ALIASES;

  test('uses the token before the first dot as the kit part', () => {
    expect(kitPartFromSocketName('AxleMod2L.ArmUpper.L', aliases)).toEqual({
      kit: '2001',
      kitNodeName: KIT_2001_NODES.AxleMod2L,
    });
    expect(kitPartFromSocketName('MetruFoot.Foot.R', aliases)).toEqual({
      kit: '2004',
      kitNodeName: KIT_2004_NODES.MetruFoot,
    });
    expect(kitPartFromSocketName('MetruBrain', aliases)).toEqual({
      kit: '2004',
      kitNodeName: KIT_2004_NODES.MetruBrain,
    });
  });

  test('prefers SocketDouble1L over Socket', () => {
    expect(kitPartFromSocketName('SocketDouble1L.ArmUpper.L', aliases)).toEqual({
      kit: '2004',
      kitNodeName: KIT_2004_NODES.SocketDouble1L,
    });
    expect(kitPartFromSocketName('Socket.Hand.L', aliases)).toEqual({
      kit: '2001',
      kitNodeName: KIT_2001_NODES.Socket,
    });
  });

  test('matches sanitized runtime names by longest kit prefix', () => {
    expect(kitPartFromSocketName('AxleMod2LArmUpperL', aliases)?.kitNodeName).toBe(
      KIT_2001_NODES.AxleMod2L
    );
    expect(kitPartFromSocketName('Pin3LChestR', aliases)).toEqual({
      kit: '2003',
      kitNodeName: KIT_2003_NODES.Pin3L,
    });
    expect(kitPartFromSocketName('LhikanSwordWeaponL', aliases)?.kitNodeName).toBe(
      KIT_2004_NODES.LhikanSword
    );
  });

  test('applies Lhikan aliases for hips and arm sockets', () => {
    expect(kitPartFromSocketName('MetruHip.Hip', aliases)?.kitNodeName).toBe(
      KIT_2004_NODES.MetruHips
    );
    expect(kitPartFromSocketName('ArmLower.L', aliases)?.kitNodeName).toBe(KIT_2004_NODES.MetruArm);
    expect(kitPartFromSocketName('ArmLowerL_1', aliases)?.kitNodeName).toBe(
      KIT_2004_NODES.MetruArm
    );
  });

  test('ignores armature bones that are not kit sockets', () => {
    expect(kitPartFromSocketName('Hip', aliases)).toBeUndefined();
    expect(kitPartFromSocketName('Masks', aliases)).toBeUndefined();
    expect(kitPartFromSocketName('LHIKAN', aliases)).toBeUndefined();
    expect(kitPartFromSocketName('Weapon_Holster', aliases)).toBeUndefined();
  });
});

describe('buildLhikanKitAttachments', () => {
  test('resolves every documented Lhikan kit socket', () => {
    for (const socket of LHIKAN_KIT_SOCKET_NAMES) {
      expect(kitPartFromSocketName(socket, LHIKAN_KIT_PART_ALIASES)).toEqual(
        expect.objectContaining({ kitNodeName: expect.any(String) })
      );
    }
  });

  test('groups sockets into the kit year that owns the part', () => {
    expect(LHIKAN_KIT_2001_ATTACHMENTS.AxleMod2LArmUpperL?.kitNodeName).toBe(
      KIT_2001_NODES.AxleMod2L
    );
    expect(LHIKAN_KIT_2003_ATTACHMENTS.Pin3LChestL?.kitNodeName).toBe(KIT_2003_NODES.Pin3L);
    expect(LHIKAN_KIT_2004_ATTACHMENTS.MetruFootFootL?.kitNodeName).toBe(KIT_2004_NODES.MetruFoot);
    expect(LHIKAN_KIT_2004_ATTACHMENTS.SocketDouble1LArmUpperL?.kitNodeName).toBe(
      KIT_2004_NODES.SocketDouble1L
    );
    expect(LHIKAN_KIT_2001_ATTACHMENTS.SocketDouble1LArmUpperL).toBeUndefined();
  });

  test('attaches MetruArm to the runtime duplicate socket name', () => {
    const { kit2004 } = buildLhikanKitAttachments(['ArmLowerL_1', 'ArmLowerR_1']);
    expect(kit2004.ArmLowerL_1?.kitNodeName).toBe(KIT_2004_NODES.MetruArm);
    expect(kit2004.ArmLowerR_1?.kitNodeName).toBe(KIT_2004_NODES.MetruArm);
  });
});
