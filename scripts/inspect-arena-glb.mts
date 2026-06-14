import { readFileSync } from 'node:fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Object3D } from 'three';

globalThis.self = { URL, webkitURL: URL } as typeof globalThis;

const buf = readFileSync('public/arena_blockout.glb');
const loader = new GLTFLoader();

const gltf = await new Promise<{ scene: Object3D }>((resolve, reject) => {
  loader.parse(buf.buffer, '', resolve, reject);
});

function walk(object: Object3D, depth = 0) {
  const mesh = (object as { isMesh?: boolean }).isMesh ? ' [mesh]' : '';
  const meshObj = object as { material?: { name: string } | { name: string }[] };
  let mat = '';
  if ((object as { isMesh?: boolean }).isMesh && meshObj.material) {
    const materials = Array.isArray(meshObj.material) ? meshObj.material : [meshObj.material];
    mat = ` mat=${materials.map((m) => m.name).join(',')}`;
  }
  console.log(`${'  '.repeat(depth)}${object.name}${mesh}${mat}`);
  object.children.forEach((child) => walk(child, depth + 1));
}

walk(gltf.scene);
