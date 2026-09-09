import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KIT_2001_NODES } from '../nodes/kit2001Nodes';
import { KIT_2003_NODES } from '../nodes/kit2003Nodes';
import { LegoColor } from '../../../../types/Colors';
import { KraataPower } from '../../../../types/Kraata';
import { getRahkshiArmorColors } from '../../../../data/rahkshiArmorColors';
import {
  RAHKSHI_KIT_PALETTE_CHASSIS,
  RAHKSHI_KIT_PALETTE_HEAD_SOCKET,
  RAHKSHI_KIT_PALETTE_LIMB_SOCKET,
  RAHKSHI_KIT_PALETTE_METAL,
  RAHKSHI_KIT_PALETTE_PISTON_N,
  RAHKSHI_KIT_PALETTE_SPINE_SOCKET,
  RAHKSHI_KIT_PALETTE_TAN,
  rahkshiKitColors,
} from '../palettes/rahkshiKitPalette';
import { RAHKSHI_KIT_2001_ATTACHMENTS, RAHKSHI_KIT_2003_ATTACHMENTS } from './rahkshi';

const GLB_HEADER_BYTES = 12;
const CHUNK_HEADER_BYTES = 8;

/** Three.js GLTFLoader: strip `.`, spaces become `_`. */
function sanitizeNodeName(name: string): string {
  return name.replace(/\./g, '').replace(/ /g, '_');
}

function readGlbNodes(relativePath: string): { mesh: boolean; name: string }[] {
  const buffer = readFileSync(join(__dirname, '../../../../../public', relativePath));
  const jsonChunkLength = buffer.readUInt32LE(GLB_HEADER_BYTES);
  const jsonStart = GLB_HEADER_BYTES + CHUNK_HEADER_BYTES;
  const gltf = JSON.parse(buffer.subarray(jsonStart, jsonStart + jsonChunkLength).toString()) as {
    nodes?: { mesh?: number; name?: string }[];
  };
  return (gltf.nodes ?? [])
    .map((node) => ({
      mesh: node.mesh !== undefined,
      name: sanitizeNodeName(node.name ?? ''),
    }))
    .filter((node) => node.name);
}

function readGlbNodeNames(relativePath: string): Set<string> {
  return new Set(readGlbNodes(relativePath).map((node) => node.name));
}

type GlbMaterial = {
  emissiveTexture?: { index: number };
  name?: string;
  normalTexture?: { index: number };
  pbrMetallicRoughness?: {
    baseColorTexture?: { index: number };
    metallicRoughnessTexture?: { index: number };
  };
};

function readGlbMaterials(relativePath: string): GlbMaterial[] {
  const buffer = readFileSync(join(__dirname, '../../../../../public', relativePath));
  const jsonChunkLength = buffer.readUInt32LE(GLB_HEADER_BYTES);
  const jsonStart = GLB_HEADER_BYTES + CHUNK_HEADER_BYTES;
  const gltf = JSON.parse(buffer.subarray(jsonStart, jsonStart + jsonChunkLength).toString()) as {
    materials?: GlbMaterial[];
  };
  return gltf.materials ?? [];
}

const RAHKSHI_BAKED_SLOTS = [
  'Back_baked',
  'Face_baked',
  'KraataCradle_baked',
  'KraataCradleHolder_baked',
  'RahkshiShoulders_baked',
] as const;

describe('Rahkshi kit attachments', () => {
  test('limb bones and staff variants use Name.Side after Three.js sanitization', () => {
    const sockets = readGlbNodeNames('rahkshi.glb');
    expect(sockets.has('FootL')).toBe(true);
    expect(sockets.has('HandL')).toBe(true);
    expect(sockets.has('LowerLegL')).toBe(true);
    expect(sockets.has('UpperLegR')).toBe(true);
    expect(sockets.has('GuurahkL')).toBe(true);
    expect(sockets.has('TurahkS')).toBe(true);
  });

  test('every attachment socket exists on rahkshi.glb after Three.js name sanitization', () => {
    const sockets = readGlbNodeNames('rahkshi.glb');
    for (const socketName of [
      ...Object.keys(RAHKSHI_KIT_2001_ATTACHMENTS),
      ...Object.keys(RAHKSHI_KIT_2003_ATTACHMENTS),
    ]) {
      expect(sockets.has(socketName)).toBe(true);
    }
  });

  test('kit node names exist in kit_2001.glb / kit_2003.glb', () => {
    const kit2001 = readGlbNodeNames('kit_2001.glb');
    const kit2003 = readGlbNodeNames('kit_2003.glb');
    for (const row of Object.values(RAHKSHI_KIT_2001_ATTACHMENTS)) {
      expect(kit2001.has(row.kitNodeName)).toBe(true);
    }
    for (const row of Object.values(RAHKSHI_KIT_2003_ATTACHMENTS)) {
      expect(kit2003.has(row.kitNodeName)).toBe(true);
    }
  });

  test('socket keys are Three.js runtime names (no leftover Blender dots)', () => {
    for (const socketName of [
      ...Object.keys(RAHKSHI_KIT_2001_ATTACHMENTS),
      ...Object.keys(RAHKSHI_KIT_2003_ATTACHMENTS),
    ]) {
      expect(socketName).not.toContain('.');
    }
  });

  test('unique head, spine, shoulders, and kraata parts stay baked on the rig', () => {
    const baked = readGlbNodes('rahkshi.glb');
    const kit2003 = readGlbNodeNames('kit_2003.glb');
    for (const name of ['Back', 'Face', 'KraataCradle', 'KraataCradleHolder', 'RahkshiShoulders']) {
      expect(baked.some((node) => node.name === name && node.mesh)).toBe(true);
      expect(kit2003.has(name)).toBe(false);
    }
  });

  test('baked unique parts ship emissive discoloration, normal, and roughness — no albedo', () => {
    const byName = new Map(readGlbMaterials('rahkshi.glb').map((mat) => [mat.name, mat]));
    for (const name of RAHKSHI_BAKED_SLOTS) {
      const mat = byName.get(name);
      expect(mat).toBeDefined();
      expect(mat?.pbrMetallicRoughness?.baseColorTexture).toBeUndefined();
      expect(mat?.emissiveTexture).toBeDefined();
      expect(mat?.normalTexture).toBeDefined();
      expect(mat?.pbrMetallicRoughness?.metallicRoughnessTexture).toBeDefined();
    }
  });

  test('RahkshiBody, feet, and legs clone the kit_2003 pieces named on the rig', () => {
    expect(RAHKSHI_KIT_2003_ATTACHMENTS.RahkshiBody.kitNodeName).toBe(KIT_2003_NODES.RahkshiBody);
    expect(RAHKSHI_KIT_2003_ATTACHMENTS.RahkshiFoot_L.kitNodeName).toBe(KIT_2003_NODES.RahkshiFoot);
    expect(RAHKSHI_KIT_2003_ATTACHMENTS.RahkshiFoot_R.kitNodeName).toBe(KIT_2003_NODES.RahkshiFoot);
    expect(RAHKSHI_KIT_2003_ATTACHMENTS.RahkshiLeg_L.kitNodeName).toBe(KIT_2003_NODES.RahkshiLeg);
    expect(RAHKSHI_KIT_2003_ATTACHMENTS.RahkshiLimb_L.kitNodeName).toBe(KIT_2003_NODES.RahkshiLimb);
  });

  test('chassis plastic is DarkBluishGray', () => {
    expect(RAHKSHI_KIT_PALETTE_CHASSIS.Main).toEqual({
      kind: 'lego',
      value: LegoColor.DarkBluishGray,
    });
    expect(RAHKSHI_KIT_2003_ATTACHMENTS.RahkshiBody.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_CHASSIS
    );
    expect(RAHKSHI_KIT_2003_ATTACHMENTS.RahkshiLeg_L.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_CHASSIS
    );
    expect(RAHKSHI_KIT_2003_ATTACHMENTS.RahkshiLimb_L.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_CHASSIS
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.TechnicArmMain_L.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_CHASSIS
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.TechnicArmJoint_L.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_CHASSIS
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.AxleConnRidged_B.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_CHASSIS
    );
  });

  test('limb sockets match the feet; shoulder sockets match the spine', () => {
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Socket_FL.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_LIMB_SOCKET
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Socket_FR.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_LIMB_SOCKET
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.SocketHL.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_LIMB_SOCKET
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Socket_HR.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_LIMB_SOCKET
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Socket_KL.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_LIMB_SOCKET
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Socket_KR.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_LIMB_SOCKET
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Socket_SL.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_SPINE_SOCKET
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Socket_SR.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_SPINE_SOCKET
    );
  });

  test('head socket is emissive; axle pins are tan; staff-side axle connectors are metal', () => {
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Socket_Head.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_HEAD_SOCKET
    );
    expect(RAHKSHI_KIT_PALETTE_HEAD_SOCKET.Main).toMatchObject({
      emissive: { key: 'eyes', kind: 'palette' },
      weathered: false,
    });
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.AxlePin_T.materialColors).toBe(RAHKSHI_KIT_PALETTE_TAN);
    expect(RAHKSHI_KIT_PALETTE_TAN.Main).toEqual({ kind: 'lego', value: LegoColor.Tan });
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.AxleConnRidged_SL.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_METAL
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.AxleConnRidged_SR.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_METAL
    );
  });

  test('technic axles clone kit_2001 Axle2L / Axle3L / AxlePin', () => {
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Axle2L_F.kitNodeName).toBe(KIT_2001_NODES.Axle2L);
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.Axle3L_H.kitNodeName).toBe(KIT_2001_NODES.Axle3L);
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.AxlePin_T.kitNodeName).toBe(KIT_2001_NODES.AxlePin);
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.TechnicArmMain_L.kitNodeName).toBe(
      KIT_2001_NODES.TechnicArmMain
    );
  });

  test('kit colors map armor to the spine and joints to the feet', () => {
    const dex = getRahkshiArmorColors(KraataPower.Chameleon);
    const colors = rahkshiKitColors(dex);
    expect(colors.body.main).toBe(dex.armor);
    expect(colors.feet.main).toBe(dex.joint);
    expect(colors.feet.secondary).toBe(dex.armor);
  });

  test('arm piston N matches the feet main color', () => {
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.TechnicArmPistonN_L.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_PISTON_N
    );
    expect(RAHKSHI_KIT_2001_ATTACHMENTS.TechnicArmPistonN_R.materialColors).toBe(
      RAHKSHI_KIT_PALETTE_PISTON_N
    );
  });
});
