import * as THREE from 'three';
import { isArenaLayoutMarker, shouldSkipArenaShadow } from './arenaGlbUtils';

describe('arenaGlbUtils', () => {
  it('detects layout marker object names', () => {
    expect(isArenaLayoutMarker(new THREE.Object3D())).toBe(false);
    expect(isArenaLayoutMarker(Object.assign(new THREE.Object3D(), { name: 'ArenaBoundary' }))).toBe(
      true
    );
    expect(isArenaLayoutMarker(Object.assign(new THREE.Object3D(), { name: 'TeamSlotMarker1' }))).toBe(
      true
    );
    expect(isArenaLayoutMarker(Object.assign(new THREE.Object3D(), { name: 'EnemySlot2' }))).toBe(true);
  });

  it('detects layout marker meshes by marker materials', () => {
    const mesh = new THREE.Mesh();
    mesh.material = new THREE.MeshStandardMaterial({ name: 'Material_7' });
    expect(isArenaLayoutMarker(mesh)).toBe(true);
  });

  it('skips arena shadow assignment for markers and particles', () => {
    const marker = new THREE.Mesh();
    marker.name = 'TeamSlotGuide0';
    expect(shouldSkipArenaShadow(marker)).toBe(true);

    const particles = new THREE.Mesh();
    particles.name = 'HitImpactParticles';
    expect(shouldSkipArenaShadow(particles)).toBe(true);

    const ground = new THREE.Mesh();
    ground.name = 'Ground';
    expect(shouldSkipArenaShadow(ground)).toBe(false);
  });
});
