/**
 * Generate `public/arena_blockout.glb` from `arenaLayout.ts` for Blender import.
 *
 * Usage: yarn generate:arena-blockout
 *
 * The output is a layout reference (ground disc, canyon walls, rim rocks, slot
 * empties, boundary ring) — not the final in-game asset. Import into Blender,
 * model on top, then export your finished floor as `public/arena.glb`.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import {
  ARENA_BACKDROP_WALLS,
  ARENA_RADIUS,
  ARENA_RIM_ROCKS,
  ENEMY_POSITIONS,
  TEAM_POSITIONS,
} from '../src/pages/Battle/arenaLayout.ts';

// three.js GLTFExporter binary mode expects browser FileReader.
if (typeof FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    result: ArrayBuffer | null = null;
    onloadend: (() => void) | null = null;
    readAsArrayBuffer(blob: Blob) {
      void blob.arrayBuffer().then((buffer) => {
        this.result = buffer;
        this.onloadend?.();
      });
    }
  } as unknown as typeof FileReader;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '../public/arena_blockout.glb');

const COLORS = {
  boundary: 0xf5d742,
  canyon: 0x7a5c42,
  enemy: 0xe85c4a,
  rock: 0x8b7355,
  sand: 0xc9a66b,
  team: 0x4ac878,
} as const;

function addCircleGround(parent: THREE.Group) {
  const geometry = new THREE.CircleGeometry(ARENA_RADIUS, 72);
  geometry.rotateX(-Math.PI / 2);
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color: COLORS.sand, metalness: 0.02, roughness: 0.92 })
  );
  mesh.name = 'Ground';
  mesh.position.y = -0.002;
  parent.add(mesh);
}

function addBackdrop(parent: THREE.Group) {
  const group = new THREE.Group();
  group.name = 'ArenaBackdrop';
  const material = new THREE.MeshStandardMaterial({
    color: COLORS.canyon,
    metalness: 0,
    roughness: 0.98,
    side: THREE.DoubleSide,
  });

  ARENA_BACKDROP_WALLS.forEach((wall, index) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(wall.size[0], wall.size[1]), material);
    mesh.name = `BackdropWall${index}`;
    mesh.position.set(...wall.position);
    mesh.rotation.set(0, wall.rotation[1], 0);
    group.add(mesh);
  });

  parent.add(group);
}

function addRimRocks(parent: THREE.Group) {
  const group = new THREE.Group();
  group.name = 'ArenaRimRocks';
  const geometry = new THREE.DodecahedronGeometry(1, 0);
  const material = new THREE.MeshStandardMaterial({
    color: COLORS.rock,
    flatShading: true,
    metalness: 0,
    roughness: 0.95,
  });

  ARENA_RIM_ROCKS.forEach((rock, index) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `RimRock${index}`;
    mesh.position.set(...rock.position);
    mesh.rotation.set(...rock.rotation);
    mesh.scale.setScalar(rock.scale);
    group.add(mesh);
  });

  parent.add(group);
}

function addLayoutGuides(parent: THREE.Group) {
  const group = new THREE.Group();
  group.name = 'ArenaLayoutGuides';

  const boundary = new THREE.Mesh(
    new THREE.RingGeometry(ARENA_RADIUS - 0.02, ARENA_RADIUS, 64),
    new THREE.MeshBasicMaterial({ color: COLORS.boundary, opacity: 0.85, transparent: true })
  );
  boundary.name = 'ArenaBoundary';
  boundary.rotation.x = -Math.PI / 2;
  boundary.position.y = 0.03;
  group.add(boundary);

  const center = new THREE.Object3D();
  center.name = 'ArenaCenter';
  group.add(center);

  TEAM_POSITIONS.forEach((position, index) => {
    const slot = new THREE.Object3D();
    slot.name = `TeamSlot${index}`;
    slot.position.set(position[0], position[1], position[2]);
    group.add(slot);

    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.08, 12),
      new THREE.MeshBasicMaterial({ color: COLORS.team })
    );
    marker.name = `TeamSlotMarker${index}`;
    marker.position.set(position[0], 0.05, position[2]);
    group.add(marker);
  });

  ENEMY_POSITIONS.forEach((position, index) => {
    const slot = new THREE.Object3D();
    slot.name = `EnemySlot${index}`;
    slot.position.set(position[0], position[1], position[2]);
    group.add(slot);

    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.08, 12),
      new THREE.MeshBasicMaterial({ color: COLORS.enemy })
    );
    marker.name = `EnemySlotMarker${index}`;
    marker.position.set(position[0], 0.05, position[2]);
    group.add(marker);
  });

  parent.add(group);
}

function buildScene() {
  const scene = new THREE.Group();
  scene.name = 'ArenaBlockout';
  addCircleGround(scene);
  addBackdrop(scene);
  addRimRocks(scene);
  addLayoutGuides(scene);
  return scene;
}

async function exportGlb(root: THREE.Object3D, outFile: string) {
  const exporter = new GLTFExporter();
  const arrayBuffer = await exporter.parseAsync(root, { binary: true });
  writeFileSync(outFile, Buffer.from(arrayBuffer as ArrayBuffer));
}

const scene = buildScene();
await exportGlb(scene, OUT_PATH);
console.log(`Wrote ${OUT_PATH}`);
