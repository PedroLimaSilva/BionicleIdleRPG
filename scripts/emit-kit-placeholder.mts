/**
 * Writes a minimal kit GLB with named empty nodes (for wiring tests).
 * Replace with a real export from Blender when meshes are ready.
 * Run: yarn tsx scripts/emit-kit-placeholder.mts
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';

const NAMES = ['MataFoot', 'MataChest', 'MataAbdomen', 'MataHip', 'GearM', 'Socket'] as const;

const doc = new Document();
const scene = doc.createScene().setName('Kit2001');
for (const name of NAMES) {
  scene.addChild(doc.createNode(name));
}

const io = new NodeIO();
const buf = await io.writeBinary(doc);
const out = join(process.cwd(), 'public/kit_2001.glb');
writeFileSync(out, Buffer.from(buf));
console.log(`Wrote ${out} (${buf.byteLength} bytes)`);
