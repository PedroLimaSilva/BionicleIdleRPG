import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
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
import { BOHROK_SHIELD_KAL_PALETTE, BOHROK_WEATHERED } from '../kit/palettes/bohrokKitPalette';
import { applyBohrokSheetMaterials } from '../kit/palettes/bohrokSheetPalette';
import type { KitMaterialSlotEntry } from '../../../types/KitParts';
import { normalizeKitMaterialSlotEntry } from '../kit/kitMaterialUtils';
import { resolveKitColorSource } from '../hooks/kitMaterialApplication';
import { getWeatheredMetalMaterial } from './WeatheredMetalMaterial';
import { cloneGltfInstance } from '../utils/cloneGltfInstance';
import { setAuthoredNormalMapsEnabled } from '../hooks/authoredNormalMaps';
import { setBakedDiscolorationEnabled } from '../hooks/bakedDiscoloration';
import { setPackedMetalnessEnabled, setPackedRoughnessEnabled } from '../hooks/packedPbrMaps';
import {
  attachBohrokSwarmShields,
  bohrokSheetBreedName,
  BOHROK_SHEET_RIG_NODE,
} from './bohrokSheetMeshes';

const BOHROK_GLB = import.meta.env.BASE_URL + 'Bohrok.glb';
const BOHROK_MASTER_GLB = import.meta.env.BASE_URL + 'bohrok_master.glb';

export type BohrokModelProps = {
  id: string;
  discolorationBakesActive?: boolean;
  normalMapsActive?: boolean;
  packedMetalnessActive?: boolean;
  packedRoughnessActive?: boolean;
  onKitMeshesAttached?: () => void;
};

/** Cache key: materialName + color. Shared across Bohrok instances with the same Krana tint. */
const kranaMaterialCache = new Map<string, MeshStandardMaterial>();

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
  const clone = cloneGltfInstance(template);
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

function attachBreedShields(args: {
  breed: string;
  colorScheme: BaseMatoran['colors'];
  isKal: boolean;
  kitCharacterNodes: Record<string, Object3D>;
  nodes: Record<string, Object3D>;
  shieldSlotLookup: Map<string, ReturnType<typeof normalizeKitMaterialSlotEntry>>;
  sockets: readonly string[];
}): Object3D[] {
  const { breed, colorScheme, isKal, kitCharacterNodes, nodes, shieldSlotLookup, sockets } = args;
  const shieldTemplateName = isKal ? `${breed}Kal` : breed;
  const shieldTemplate = nodes[shieldTemplateName];
  if (!shieldTemplate) {
    console.warn(
      `[BohrokModel] Shield template '${shieldTemplateName}' not found in ${BOHROK_MASTER_GLB}`
    );
  }

  const shieldClones: Object3D[] = [];
  for (const socketName of sockets) {
    const socket = kitCharacterNodes[socketName];
    if (!socket) {
      console.warn(`[BohrokModel] Socket '${socketName}' not found on Bohrok rig`);
      continue;
    }
    if (!shieldTemplate) continue;
    const clone = attachTemplateAtSocket(shieldTemplate, socket);
    applyShieldMaterials(clone, shieldSlotLookup, colorScheme);
    shieldClones.push(clone);
  }
  return shieldClones;
}

const SwarmPackedBohrokModel = forwardRef<CombatantModelHandle, BohrokModelProps>(
  (
    {
      discolorationBakesActive,
      id,
      normalMapsActive,
      onKitMeshesAttached,
      packedMetalnessActive,
      packedRoughnessActive,
    },
    ref
  ) => {
    const group = useRef<Group>(null);
    const packedGltf = useGLTF(BOHROK_GLB);
    const colorScheme = CHARACTER_DEX[id].colors;

    const instance = useMemo(() => {
      const root =
        (packedGltf.scene.getObjectByName(BOHROK_SHEET_RIG_NODE) as Object3D | null) ??
        (packedGltf.nodes[BOHROK_SHEET_RIG_NODE] as Object3D | undefined);
      if (!root) return new Group();
      return cloneGltfInstance(root);
    }, [packedGltf.nodes, packedGltf.scene]);

    const { playAnimation } = useCombatAnimations(packedGltf.animations, group, {
      actionTimeScale: 2,
      attackResolveAtFraction: 0.1,
      modelId: id,
      transitionMode: 'stopAll',
    });

    useImperativeHandle(ref, () => ({ playAnimation }));

    const bakesActive = discolorationBakesActive !== false;
    const normalsActive = normalMapsActive !== false;
    const roughnessActive = packedRoughnessActive !== false;
    const metalnessActive = packedMetalnessActive !== false;
    const bakesActiveRef = useRef(bakesActive);
    const normalsActiveRef = useRef(normalsActive);
    const roughnessActiveRef = useRef(roughnessActive);
    const metalnessActiveRef = useRef(metalnessActive);
    bakesActiveRef.current = bakesActive;
    normalsActiveRef.current = normalsActive;
    roughnessActiveRef.current = roughnessActive;
    metalnessActiveRef.current = metalnessActive;

    const applyPreviewMapToggles = useCallback((root: Object3D) => {
      setBakedDiscolorationEnabled(root, bakesActiveRef.current);
      setAuthoredNormalMapsEnabled(root, normalsActiveRef.current);
      setPackedRoughnessEnabled(root, roughnessActiveRef.current);
      setPackedMetalnessEnabled(root, metalnessActiveRef.current);
    }, []);

    useLayoutEffect(() => {
      const shieldClones = attachBohrokSwarmShields(instance, bohrokSheetBreedName(id));
      applyBohrokSheetMaterials(instance, colorScheme);
      applyPreviewMapToggles(instance);
      onKitMeshesAttached?.();
      return () => {
        for (const clone of shieldClones) {
          clone.parent?.remove(clone);
        }
        setBakedDiscolorationEnabled(instance, true);
        setAuthoredNormalMapsEnabled(instance, true);
        setPackedRoughnessEnabled(instance, true);
        setPackedMetalnessEnabled(instance, true);
      };
    }, [applyPreviewMapToggles, colorScheme, id, instance, onKitMeshesAttached]);

    useLayoutEffect(() => {
      applyPreviewMapToggles(instance);
    }, [
      applyPreviewMapToggles,
      bakesActive,
      instance,
      metalnessActive,
      normalsActive,
      roughnessActive,
    ]);

    return (
      <group ref={group} dispose={null}>
        <primitive object={instance} />
      </group>
    );
  }
);

const KalKitBohrokModel = forwardRef<CombatantModelHandle, BohrokModelProps>(
  ({ id, onKitMeshesAttached }, ref) => {
    const group = useRef<Group>(null);
    const { animations, nodes } = useGLTF(BOHROK_MASTER_GLB);

    const breed = bohrokSheetBreedName(id);
    const colorScheme = CHARACTER_DEX[id].colors;

    const bohrokInstance = useMemo(() => cloneGltfInstance(nodes.Bohrok), [nodes]);
    const kitCharacterNodes = useMemo(
      () => buildKitCharacterNodes(bohrokInstance),
      [bohrokInstance]
    );
    const kit2003Attachments = useMemo(() => buildBohrokKit2003Attachments(true), []);
    const shieldSlotLookup = useMemo(() => buildSlotLookup(BOHROK_SHIELD_KAL_PALETTE), []);

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
      const shieldClones = attachBreedShields({
        breed,
        colorScheme,
        isKal: true,
        kitCharacterNodes,
        nodes: nodes as Record<string, Object3D>,
        shieldSlotLookup,
        sockets: ['ShieldL', 'ShieldR'],
      });

      let kalSymbol: Object3D | undefined;
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

      bohrokInstance.traverse((child) => {
        if (!(child instanceof Mesh)) return;
        const mat = child.material as MeshStandardMaterial;
        if (mat?.name === 'Krana') {
          child.material = getKranaMaterial(mat, colorScheme);
        }
      });

      onKitMeshesAttached?.();

      return () => {
        for (const clone of shieldClones) {
          clone.parent?.remove(clone);
        }
        if (kalSymbol?.parent) kalSymbol.parent.remove(kalSymbol);
      };
    }, [
      bohrokInstance,
      breed,
      colorScheme,
      kitCharacterNodes,
      nodes,
      onKitMeshesAttached,
      shieldSlotLookup,
    ]);

    return (
      <group ref={group} dispose={null}>
        <primitive object={bohrokInstance} scale={1} position={[0, 0, 0]} />
      </group>
    );
  }
);

export const BohrokModel = forwardRef<CombatantModelHandle, BohrokModelProps>((props, ref) => {
  if (isBohrokKal(props.id)) {
    return <KalKitBohrokModel ref={ref} {...props} />;
  }
  return <SwarmPackedBohrokModel ref={ref} {...props} />;
});

useGLTF.preload(BOHROK_GLB);
useGLTF.preload(BOHROK_MASTER_GLB);
useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2003_GLB_PATH);
