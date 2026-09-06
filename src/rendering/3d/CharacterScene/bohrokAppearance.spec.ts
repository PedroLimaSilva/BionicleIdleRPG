import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { CHARACTER_DEX } from '../../../data/dex/index';
import { LegoColor } from '../../../types/Colors';
import {
  applyKitMaterialsToObject,
  buildKitMaterialSlotLookup,
} from '../hooks/kitMaterialApplication';
import { BOHROK_KIT_PALETTE_BODY } from '../kit/palettes/bohrokKitPalette';
import { cloneGltfInstance } from '../utils/cloneGltfInstance';

const BOHROK_WEATHERED = {
  metalness: 0.05,
  roughness: 0.55,
};

function makeSharedBohrokShell() {
  const main = new MeshStandardMaterial({ color: '#ffffff', name: 'Main' });
  const mesh = new Mesh(new BoxGeometry(), main);
  mesh.name = 'Bohrok_BodyL';
  const root = new Group();
  root.add(mesh);
  return root;
}

function applyBreedColors(root: Group, id: string) {
  applyKitMaterialsToObject(
    root,
    buildKitMaterialSlotLookup(BOHROK_KIT_PALETTE_BODY),
    CHARACTER_DEX[id].colors,
    BOHROK_WEATHERED
  );
}

function bodyColor(root: Group): string {
  return ((root.children[0] as Mesh).material as MeshStandardMaterial).color.getHexString();
}

describe('Bohrok kal pair instance coloring', () => {
  it('keeps Tahnok Kal and Gahlok Kal body colors distinct on clones of the same rig', () => {
    const template = makeSharedBohrokShell();
    const tahnok = cloneGltfInstance(template) as Group;
    const gahlok = cloneGltfInstance(template) as Group;

    applyBreedColors(tahnok, 'tahnok_kal');
    applyBreedColors(gahlok, 'gahlok_kal');

    const red = LegoColor.Red.replace('#', '').toLowerCase();
    const blue = LegoColor.Blue.replace('#', '').toLowerCase();

    expect(bodyColor(tahnok)).toBe(red);
    expect(bodyColor(gahlok)).toBe(blue);
    expect((tahnok.children[0] as Mesh).material).not.toBe((gahlok.children[0] as Mesh).material);
  });

  it('mutating one instance color does not retint a different breed', () => {
    const template = makeSharedBohrokShell();
    const tahnok = cloneGltfInstance(template) as Group;
    const gahlok = cloneGltfInstance(template) as Group;
    applyBreedColors(tahnok, 'tahnok_kal');
    applyBreedColors(gahlok, 'gahlok_kal');

    const tahnokMat = (tahnok.children[0] as Mesh).material as MeshStandardMaterial;
    tahnokMat.color.set('#000000');

    expect(bodyColor(gahlok)).toBe(LegoColor.Blue.replace('#', '').toLowerCase());
  });
});
