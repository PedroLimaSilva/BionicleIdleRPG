import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_2001_NODES } from '../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../nodes/kit2003Nodes';
import { KIT_2004_NODES } from '../nodes/kit2004Nodes';
import { LegoColor } from '../../../../types/Colors';
import {
  VAHKI_HOOD_EMISSIVE_INTENSITY,
  VAHKI_KIT_PALETTE_BODY,
  VAHKI_KIT_PALETTE_HOOD,
  VAHKI_KIT_PALETTE_SOCKET,
} from '../palettes/vahkiKitPalette';
import {
  VAHKI_KIT_2001_ATTACHMENTS,
  VAHKI_KIT_2003_ATTACHMENTS,
  VAHKI_KIT_2004_ATTACHMENTS,
} from './vahki';

const GLB_HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;

/** Three.js GLTFLoader: strip `.`, spaces become `_`. */
function sanitizeNodeName(name: string): string {
  return name.replace(/\./g, '').replace(/ /g, '_');
}

function readGlbNodeNames(relativePath: string): Set<string> {
  const buffer = readFileSync(join(__dirname, '../../../../../public', relativePath));
  const jsonChunkLength = buffer.readUInt32LE(GLB_HEADER_BYTES);
  const jsonStart = GLB_HEADER_BYTES + CHUNK_HEADER_BYTES;
  const gltf = JSON.parse(buffer.subarray(jsonStart, jsonStart + jsonChunkLength).toString()) as {
    nodes?: { name?: string }[];
  };
  return new Set(
    (gltf.nodes ?? []).map((node) => sanitizeNodeName(node.name ?? '')).filter(Boolean)
  );
}

describe('Vahki kit attachments', () => {
  test('staff sockets clone BordakhTool until hive-specific tools exist', () => {
    expect(VAHKI_KIT_2004_ATTACHMENTS.Tool_L.kitNodeName).toBe(KIT_2004_NODES.BordakhTool);
    expect(VAHKI_KIT_2004_ATTACHMENTS.Tool_R.kitNodeName).toBe(KIT_2004_NODES.BordakhTool);
  });

  test('every attachment socket exists on Vahki.glb after Three.js name sanitization', () => {
    const sockets = readGlbNodeNames('Vahki.glb');
    for (const socketName of [
      ...Object.keys(VAHKI_KIT_2004_ATTACHMENTS),
      ...Object.keys(VAHKI_KIT_2003_ATTACHMENTS),
      ...Object.keys(VAHKI_KIT_2001_ATTACHMENTS),
    ]) {
      expect(sockets.has(socketName)).toBe(true);
    }
  });

  test('kit node names exist in kit_2004.glb / kit_2003.glb / kit_2001.glb', () => {
    const kit2004 = readGlbNodeNames('kit_2004.glb');
    const kit2003 = readGlbNodeNames('kit_2003.glb');
    const kit2001 = readGlbNodeNames('kit_2001.glb');
    for (const row of Object.values(VAHKI_KIT_2004_ATTACHMENTS)) {
      expect(kit2004.has(row.kitNodeName)).toBe(true);
    }
    for (const row of Object.values(VAHKI_KIT_2003_ATTACHMENTS)) {
      expect(kit2003.has(row.kitNodeName)).toBe(true);
    }
    for (const row of Object.values(VAHKI_KIT_2001_ATTACHMENTS)) {
      expect(kit2001.has(row.kitNodeName)).toBe(true);
    }
  });

  test('socket keys are Three.js runtime names (no leftover Blender dots)', () => {
    for (const socketName of [
      ...Object.keys(VAHKI_KIT_2004_ATTACHMENTS),
      ...Object.keys(VAHKI_KIT_2003_ATTACHMENTS),
      ...Object.keys(VAHKI_KIT_2001_ATTACHMENTS),
    ]) {
      expect(socketName).not.toContain('.');
    }
  });

  test('head-only kit duplicates use the _Head suffix', () => {
    expect(VAHKI_KIT_2001_ATTACHMENTS.Axle2L_Head.kitNodeName).toBe(KIT_2001_NODES.Axle2L);
    expect(VAHKI_KIT_2001_ATTACHMENTS.Pin2L_Head_B.kitNodeName).toBe(KIT_2001_NODES.Pin2L);
    expect(VAHKI_KIT_2001_ATTACHMENTS.Pin2L_Head_F.kitNodeName).toBe(KIT_2001_NODES.Pin2L);
  });

  test('Vahki.glb root is named Vahki after sanitization', () => {
    const sockets = readGlbNodeNames('Vahki.glb');
    expect(sockets.has('Vahki')).toBe(true);
    expect(sockets.has('Bordakh')).toBe(false);
  });

  test('hood socket clones the baked visor kit node', () => {
    expect(VAHKI_KIT_2004_ATTACHMENTS.VahkiHood_Baked.kitNodeName).toBe(
      KIT_2004_NODES.VahkiHoodBaked
    );
  });

  test('hood visor uses a modest emissive intensity instead of the baked default of 1', () => {
    expect(VAHKI_KIT_PALETTE_HOOD.VahkiHood_baked).toEqual(
      expect.objectContaining({
        emissiveIntensity: VAHKI_HOOD_EMISSIVE_INTENSITY,
      })
    );
    expect(VAHKI_HOOD_EMISSIVE_INTENSITY).toBe(0.1);
    expect(VAHKI_KIT_2004_ATTACHMENTS.VahkiHood_Baked.materialColors).toBe(VAHKI_KIT_PALETTE_HOOD);
  });

  test('RahkshiBody clones the kit_2003 torso shell named on the rig', () => {
    expect(VAHKI_KIT_2003_ATTACHMENTS.RahkshiBody.kitNodeName).toBe(KIT_2003_NODES.RahkshiBody);
  });

  test('RahkshiBody uses the same DarkBluishGray as sockets', () => {
    expect(VAHKI_KIT_2003_ATTACHMENTS.RahkshiBody.materialColors).toBe(VAHKI_KIT_PALETTE_SOCKET);
  });

  test('TechnicTorsoPivot clones the kit_2003 piece named on the rig', () => {
    expect(VAHKI_KIT_2003_ATTACHMENTS.TechnicTorsoPivot.kitNodeName).toBe(
      KIT_2003_NODES.TechnicTorsoPivot
    );
  });

  test('TechnicTorsoPivot uses hive body color', () => {
    expect(VAHKI_KIT_2003_ATTACHMENTS.TechnicTorsoPivot.materialColors).toBe(
      VAHKI_KIT_PALETTE_BODY
    );
  });

  test('sockets and double sockets are DarkBluishGray', () => {
    expect(VAHKI_KIT_PALETTE_SOCKET.Main).toEqual({
      kind: 'lego',
      value: LegoColor.DarkBluishGray,
    });
    expect(VAHKI_KIT_2004_ATTACHMENTS.SocketDouble1L_L.materialColors).toBe(
      VAHKI_KIT_PALETTE_SOCKET
    );
    expect(VAHKI_KIT_2004_ATTACHMENTS.SocketDouble1L_R.materialColors).toBe(
      VAHKI_KIT_PALETTE_SOCKET
    );
    expect(VAHKI_KIT_2001_ATTACHMENTS.Socket_ShoulderL.materialColors).toBe(
      VAHKI_KIT_PALETTE_SOCKET
    );
    expect(VAHKI_KIT_2001_ATTACHMENTS.Socket_ShoulderR.materialColors).toBe(
      VAHKI_KIT_PALETTE_SOCKET
    );
    expect(VAHKI_KIT_2003_ATTACHMENTS.RahkshiBody.materialColors).toBe(VAHKI_KIT_PALETTE_SOCKET);
  });
});
