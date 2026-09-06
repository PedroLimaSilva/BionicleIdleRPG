import { BoxGeometry, DataTexture, Group, Mesh, MeshStandardMaterial } from 'three';
import { getRahkshiArmorColors } from '../../../data/rahkshiArmorColors';
import { KraataPower } from '../../../types/Kraata';
import { cloneGltfInstance } from '../utils/cloneGltfInstance';
import { applyWeatheredMetalToObject } from './WeatheredMetalMaterial';

function rahkshiColorMap(power: KraataPower) {
  const dex = getRahkshiArmorColors(power);
  return {
    Back_baked: dex.armor,
    Face_baked: dex.armor,
    Primary: dex.armor,
    Secondary: dex.joint,
  };
}

function makeSharedRahkshiRig() {
  const primary = new MeshStandardMaterial({ color: '#ffffff', name: 'Primary' });
  const secondary = new MeshStandardMaterial({ color: '#dddddd', name: 'Secondary' });
  const armor = new Mesh(new BoxGeometry(), primary);
  const joint = new Mesh(new BoxGeometry(), secondary);
  const root = new Group();
  root.add(armor, joint);
  return root;
}

function applyGauntletColors(root: Group, power: KraataPower) {
  applyWeatheredMetalToObject(root, {
    materialColorMap: rahkshiColorMap(power),
    metalness: 0.05,
    roughness: 0.55,
    uniqueMaterials: true,
  });
}

function meshColor(root: Group, index: number): string {
  return ((root.children[index] as Mesh).material as MeshStandardMaterial).color.getHexString();
}

describe('Rahkshi gauntlet instance coloring', () => {
  it('keeps distinct armor colors on clones of the same rig', () => {
    const template = makeSharedRahkshiRig();
    const fragmentation = cloneGltfInstance(template) as Group;
    const disintegration = cloneGltfInstance(template) as Group;
    const poison = cloneGltfInstance(template) as Group;

    applyGauntletColors(fragmentation, KraataPower.Fragmentation);
    applyGauntletColors(disintegration, KraataPower.Disintegration);
    applyGauntletColors(poison, KraataPower.Poison);

    const brown = getRahkshiArmorColors(KraataPower.Fragmentation)
      .armor.replace('#', '')
      .toLowerCase();
    const blue = getRahkshiArmorColors(KraataPower.Disintegration)
      .armor.replace('#', '')
      .toLowerCase();
    const green = getRahkshiArmorColors(KraataPower.Poison).armor.replace('#', '').toLowerCase();

    expect(meshColor(fragmentation, 0)).toBe(brown);
    expect(meshColor(disintegration, 0)).toBe(blue);
    expect(meshColor(poison, 0)).toBe(green);
    expect(meshColor(fragmentation, 0)).not.toBe(meshColor(disintegration, 0));
    expect(meshColor(disintegration, 0)).not.toBe(meshColor(poison, 0));

    expect((fragmentation.children[0] as Mesh).material).not.toBe(
      (disintegration.children[0] as Mesh).material
    );
  });

  it('mutating one instance color does not retint the others', () => {
    const template = makeSharedRahkshiRig();
    const first = cloneGltfInstance(template) as Group;
    const second = cloneGltfInstance(template) as Group;
    applyGauntletColors(first, KraataPower.Fear);
    applyGauntletColors(second, KraataPower.Anger);

    const firstMat = (first.children[0] as Mesh).material as MeshStandardMaterial;
    firstMat.color.set('#000000');

    expect(meshColor(second, 0)).toBe(
      getRahkshiArmorColors(KraataPower.Anger).armor.replace('#', '').toLowerCase()
    );
  });

  it('keeps Face_baked and Back_baked PBR maps while tinting armor color', () => {
    const albedo = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    const normal = new DataTexture(new Uint8Array([128, 128, 255, 255]), 1, 1);
    const face = new MeshStandardMaterial({
      color: '#ffffff',
      map: albedo,
      name: 'Face_baked',
      normalMap: normal,
      roughnessMap: albedo,
    });
    const back = new MeshStandardMaterial({
      color: '#ffffff',
      map: albedo,
      name: 'Back_baked',
      normalMap: normal,
      roughnessMap: albedo,
    });
    const root = new Group();
    root.add(new Mesh(new BoxGeometry(), face), new Mesh(new BoxGeometry(), back));
    applyGauntletColors(root, KraataPower.Fear);
    const armor = getRahkshiArmorColors(KraataPower.Fear).armor.replace('#', '').toLowerCase();
    const faceNext = (root.children[0] as Mesh).material as MeshStandardMaterial;
    const backNext = (root.children[1] as Mesh).material as MeshStandardMaterial;
    expect(faceNext.color.getHexString()).toBe(armor);
    expect(backNext.color.getHexString()).toBe(armor);
    expect(faceNext.map).toBe(albedo);
    expect(backNext.map).toBe(albedo);
    expect(faceNext.normalMap).toBe(normal);
    expect(backNext.normalMap).toBe(normal);
    expect(faceNext.roughnessMap).toBe(albedo);
    expect(backNext.roughnessMap).toBe(albedo);
  });
});
