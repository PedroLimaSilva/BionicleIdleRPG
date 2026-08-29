import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { Color as ColorType } from '../../../types/Colors';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../hooks/useCombatAnimations';
import { useKitAttachments } from '../hooks/useKitAttachments';
import { CHARACTER_DEX } from '../../../data/dex/index';
import { BaseMatoran } from '../../../types/Matoran';
import { KIT_2001_GLB_PATH } from '../kit/kit2001';
import { KIT_2003_GLB_PATH } from '../kit/kit2003';
import {
  BOHROK_KIT_2001_ATTACHMENTS,
  buildBohrokKit2003Attachments,
} from '../kit/attachments/bohrok';
import {
  BOHROK_SHIELD_KAL_PALETTE,
  BOHROK_PRIMARY_PALETTE,
} from '../kit/palettes/bohrokKitPalette';
import type { KitMaterialSlotEntry } from '../../../types/KitParts';
import { normalizeKitMaterialSlotEntry } from '../kit/kitMaterialUtils';
import { resolveKitColorSource } from '../hooks/kitMaterialApplication';
import { getWeatheredMetalMaterial, type WeatheredMetalOptions } from './WeatheredMetalMaterial';

const BOHROK_MASTER_GLB = import.meta.env.BASE_URL + 'bohrok_master.glb';

const BOHROK_WEATHERED: WeatheredMetalOptions = {
  cavityStrength: 1,
  edgeColor: '#ffffff',
  edgeCurvatureScale: 2,
  edgeStrength: 0.15,
  fineScale: 18,
  grimeDarken: 0.4,
  grimeMetalnessReduce: 0.5,
  grimeRoughness: 0.2,
  largeScale: 5,
  metalness: 0.05,
  roughness: 0.55,
};

/** Cache key: materialName + color. Shared across Bohrok instances with the same Krana tint. */
const kranaMaterialCache = new Map<string, MeshStandardMaterial>();

function capitalizeBreed(id: string): string {
  const [breed] = id.split('_');
  return breed.replace(/^./, (char) => char.toUpperCase());
}

function isBohrokKal(id: string): boolean {
  return id.split('_').length > 1;
}

/** Deepest node wins for duplicate socket names (e.g. nested `Foot L`). */
function buildKitCharacterNodes(root: Object3D): Record<string, Object3D> {
  const map: Record<string, Object3D> = {};
  root.traverse((child) => {
    if (child.name) map[child.name] = child;
  });
  return map;
}

function showObjectTree(root: Object3D): void {
  root.visible = true;
  root.traverse((child) => {
    child.visible = true;
  });
}

/** Parents a GLB template onto a rig socket at the socket origin. */
function attachTemplateAtSocket(template: Object3D, socket: Object3D): Object3D {
  const clone = template.clone(true);
  clone.position.set(0, 0, 0);
  clone.rotation.set(0, 0, 0);
  clone.scale.set(1, 1, 1);
  showObjectTree(clone);
  socket.add(clone);
  return clone;
}

function normalizeSlotName(name: string): string {
  return name.trim().toLowerCase();
}

function buildSlotLookup(
  materialColors: Partial<Record<string, KitMaterialSlotEntry>>
): Map<string, ReturnType<typeof normalizeKitMaterialSlotEntry>> {
  const lookup = new Map<string, ReturnType<typeof normalizeKitMaterialSlotEntry>>();
  for (const [slotName, entry] of Object.entries(materialColors)) {
    if (!entry) continue;
    lookup.set(normalizeSlotName(slotName), normalizeKitMaterialSlotEntry(entry));
  }
  return lookup;
}

function applyShieldMaterials(
  root: Object3D,
  slotLookup: Map<string, ReturnType<typeof normalizeKitMaterialSlotEntry>>,
  palette: BaseMatoran['colors']
): void {
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const raw = mesh.material;
    const mats = Array.isArray(raw) ? raw : [raw];
    const next = mats.map((mat) => {
      if (!(mat instanceof MeshStandardMaterial)) return mat;
      const spec = slotLookup.get(normalizeSlotName(mat.name));
      if (!spec) return mat;

      if (BOHROK_WEATHERED && spec.weathered !== false && !spec.emissive) {
        const color = spec.color
          ? resolveKitColorSource(spec.color, palette)
          : mat.color.getStyle();
        return getWeatheredMetalMaterial(color, BOHROK_WEATHERED);
      }

      const cloned = mat.clone();
      if (spec.color) {
        cloned.color.set(resolveKitColorSource(spec.color, palette) as ColorType);
      }
      return cloned;
    });
    mesh.material = Array.isArray(raw) ? next : next[0];
  });
}

function getKranaMaterial(
  original: MeshStandardMaterial,
  colorScheme: BaseMatoran['colors']
): MeshStandardMaterial {
  const color = colorScheme.eyes;
  const cacheKey = `Krana_${color}`;
  let mat = kranaMaterialCache.get(cacheKey);
  if (!mat) {
    mat = original.clone();
    mat.color.set(color as ColorType);
    mat.emissive.set(0x000000);
    mat.emissiveIntensity = 0;
    kranaMaterialCache.set(cacheKey, mat);
  }
  return mat;
}

export const BohrokModel = forwardRef<CombatantModelHandle, { id: string }>(({ id }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(BOHROK_MASTER_GLB);

  const breed = capitalizeBreed(id);
  const isKal = isBohrokKal(id);
  const colorScheme = CHARACTER_DEX[id].colors;

  const bohrokInstance = useMemo(() => nodes.Bohrok.clone(true), [nodes]);
  const kitCharacterNodes = useMemo(() => buildKitCharacterNodes(bohrokInstance), [bohrokInstance]);

  const kit2003Attachments = useMemo(() => buildBohrokKit2003Attachments(isKal), [isKal]);

  const shieldPalette = isKal ? BOHROK_SHIELD_KAL_PALETTE : BOHROK_PRIMARY_PALETTE;
  const shieldSlotLookup = useMemo(() => buildSlotLookup(shieldPalette), [shieldPalette]);

  const { playAnimation } = useCombatAnimations(animations, group, {
    actionTimeScale: 2,
    attackResolveAtFraction: 0.1,
    modelId: id,
    transitionMode: 'stopAll',
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  useKitAttachments({
    attachments: BOHROK_KIT_2001_ATTACHMENTS,
    characterNodes: kitCharacterNodes,
    colors: colorScheme,
    kitUrl: KIT_2001_GLB_PATH,
    weathered: BOHROK_WEATHERED,
  });

  useKitAttachments({
    attachments: kit2003Attachments,
    characterNodes: kitCharacterNodes,
    colors: colorScheme,
    kitUrl: KIT_2003_GLB_PATH,
    weathered: BOHROK_WEATHERED,
  });

  useEffect(() => {
    const shieldTemplateName = isKal ? `${breed}Kal` : breed;
    const shieldTemplate = nodes[shieldTemplateName] as Object3D | undefined;
    if (!shieldTemplate) {
      console.warn(
        `[BohrokModel] Shield template '${shieldTemplateName}' not found in ${BOHROK_MASTER_GLB}`
      );
    }

    const shieldClones: Object3D[] = [];
    (['L', 'R'] as const).forEach((side) => {
      const socket = kitCharacterNodes[`Shield${side}`];
      if (!socket) {
        console.warn(`[BohrokModel] Socket 'Shield${side}' not found on Bohrok rig`);
        return;
      }
      if (!shieldTemplate) return;

      const clone = attachTemplateAtSocket(shieldTemplate, socket);
      applyShieldMaterials(clone, shieldSlotLookup, colorScheme);
      shieldClones.push(clone);
    });

    let kalSymbol: Object3D | undefined;
    if (isKal) {
      const symbolTemplate = nodes[`${breed}Symbol`] as Object3D | undefined;
      const symbolSocket = kitCharacterNodes.Symbol;
      if (!symbolTemplate) {
        console.warn(
          `[BohrokModel] Symbol template '${breed}Symbol' not found in ${BOHROK_MASTER_GLB}`
        );
      } else if (!symbolSocket) {
        console.warn("[BohrokModel] Socket 'Symbol' not found on Bohrok rig");
      } else {
        kalSymbol = attachTemplateAtSocket(symbolTemplate, symbolSocket);
      }
    }

    bohrokInstance.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const mat = child.material as MeshStandardMaterial;
      if (mat?.name === 'Krana') {
        child.material = getKranaMaterial(mat, colorScheme);
      }
    });

    return () => {
      for (const clone of shieldClones) {
        const parent = clone.parent;
        if (parent) parent.remove(clone);
      }
      if (kalSymbol?.parent) kalSymbol.parent.remove(kalSymbol);
    };
  }, [bohrokInstance, breed, colorScheme, isKal, kitCharacterNodes, nodes, shieldSlotLookup]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={bohrokInstance} scale={1} position={[0, 0, 0]} />
    </group>
  );
});

useGLTF.preload(BOHROK_MASTER_GLB);
useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2003_GLB_PATH);
