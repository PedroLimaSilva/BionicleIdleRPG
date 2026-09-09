import { BoxGeometry, DataTexture, Group, Mesh, MeshStandardMaterial } from 'three';
import { getRahkshiArmorColors } from '../../../data/rahkshiArmorColors';
import { KraataPower } from '../../../types/Kraata';
import { DISCOLORATION_MAP_USERDATA_KEY } from '../hooks/bakedDiscoloration';
import { RAHKSHI_WEATHERED } from '../kit/palettes/rahkshiKitPalette';
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
    ...RAHKSHI_WEATHERED,
    materialColorMap: rahkshiColorMap(power),
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

  it('tints Face_baked and Back_baked, keeps normal/roughness, and matches kit metalness', () => {
    const discolor = new DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    const normal = new DataTexture(new Uint8Array([128, 128, 255, 255]), 1, 1);
    const roughness = new DataTexture(new Uint8Array([255, 40, 255, 255]), 1, 1);
    const face = new MeshStandardMaterial({
      color: '#ffffff',
      emissiveMap: discolor,
      metalness: 0.5,
      metalnessMap: roughness,
      name: 'Face_baked',
      normalMap: normal,
      roughness: 1,
      roughnessMap: roughness,
    });
    const back = new MeshStandardMaterial({
      color: '#ffffff',
      emissiveMap: discolor,
      metalness: 0.5,
      metalnessMap: roughness,
      name: 'Back_baked',
      normalMap: normal,
      roughness: 1,
      roughnessMap: roughness,
    });
    const root = new Group();
    root.add(new Mesh(new BoxGeometry(), face), new Mesh(new BoxGeometry(), back));
    applyGauntletColors(root, KraataPower.Fear);
    const armor = getRahkshiArmorColors(KraataPower.Fear).armor.replace('#', '').toLowerCase();
    const faceNext = (root.children[0] as Mesh).material as MeshStandardMaterial & {
      metalnessNode?: unknown;
    };
    const backNext = (root.children[1] as Mesh).material as MeshStandardMaterial;
    expect(faceNext.color.getHexString()).toBe(armor);
    expect(backNext.color.getHexString()).toBe(armor);
    expect(faceNext.map).toBeNull();
    expect(backNext.map).toBeNull();
    expect(faceNext.normalMap).toBe(normal);
    expect(backNext.normalMap).toBe(normal);
    expect(faceNext.roughnessMap).toBe(roughness);
    expect(backNext.roughnessMap).toBe(roughness);
    expect(faceNext.metalnessMap).toBeNull();
    expect(backNext.metalnessMap).toBeNull();
    expect(faceNext.metalness).toBe(RAHKSHI_WEATHERED.metalness);
    expect(backNext.metalness).toBe(RAHKSHI_WEATHERED.metalness);
    expect(faceNext.metalnessNode).toBeDefined();
    expect(faceNext.emissiveMap).toBeNull();
    expect(faceNext.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(discolor);
    expect(backNext.userData[DISCOLORATION_MAP_USERDATA_KEY]).toBe(discolor);
  });
});
