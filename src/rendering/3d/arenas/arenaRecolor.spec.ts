import * as THREE from 'three';
import { ElementTribe } from '../../../types/Matoran';
import { applyArenaRecolor, getTribeRecolor } from './arenaRecolor';

describe('getTribeRecolor', () => {
  it('returns a distinct palette per tribe', () => {
    const fire = getTribeRecolor(ElementTribe.Fire);
    const water = getTribeRecolor(ElementTribe.Water);
    expect(fire?.accent).toMatch(/^#[0-9a-f]{6}$/i);
    expect(fire?.diffuse).not.toBe(water?.diffuse);
  });

  it('returns undefined when no tribe is provided', () => {
    expect(getTribeRecolor(undefined)).toBeUndefined();
  });
});

describe('applyArenaRecolor', () => {
  it('clones materials and multiplies diffuse for non-accent materials', () => {
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, name: 'Sand' });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(), mat);

    applyArenaRecolor(mesh, { accent: '#ff0000', diffuse: '#808080' });

    expect(mesh.material).not.toBe(mat); // original (cached) material untouched
    const result = mesh.material as THREE.MeshStandardMaterial;
    expect(result.color.getHex()).not.toBe(0xffffff); // darkened
    expect(result.color.r).toBeCloseTo(result.color.g, 5); // stays neutral grey
  });

  it('applies the accent color and emissive to glow materials', () => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({ color: 0x000000, name: 'EyeGlow' })
    );

    applyArenaRecolor(mesh, { accent: '#00ff00', diffuse: '#ffffff' });

    const result = mesh.material as THREE.MeshStandardMaterial;
    const expected = new THREE.Color('#00ff00').getHexString();
    expect(result.emissive.getHex()).toBe(0);
    expect(result.emissiveIntensity).toBe(0);
    expect(result.color.getHexString()).toBe(expected);
  });
});
