import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../hooks/useCombatAnimations';
import { CHARACTER_DEX } from '../../../data/dex/index';
import { applyBohrokSheetMaterials } from '../kit/palettes/bohrokSheetPalette';
import { cloneGltfInstance } from '../utils/cloneGltfInstance';
import { setAuthoredNormalMapsEnabled } from '../hooks/authoredNormalMaps';
import { setBakedDiscolorationEnabled } from '../hooks/bakedDiscoloration';
import { setPackedMetalnessEnabled, setPackedRoughnessEnabled } from '../hooks/packedPbrMaps';
import {
  attachBohrokSheetAccessories,
  bohrokSheetBreedName,
  BOHROK_SHEET_RIG_NODE,
} from './bohrokSheetMeshes';

const BOHROK_GLB = import.meta.env.BASE_URL + 'Bohrok.glb';

export type BohrokModelProps = {
  id: string;
  discolorationBakesActive?: boolean;
  normalMapsActive?: boolean;
  packedMetalnessActive?: boolean;
  packedRoughnessActive?: boolean;
  onKitMeshesAttached?: () => void;
};

function isBohrokKal(id: string): boolean {
  return id.split('_').length > 1;
}

export const BohrokModel = forwardRef<CombatantModelHandle, BohrokModelProps>(
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
    const isKal = isBohrokKal(id);

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
      const accessoryClones = attachBohrokSheetAccessories({
        breed: bohrokSheetBreedName(id),
        isKal,
        root: instance,
        templates: packedGltf.nodes as Record<string, Object3D>,
      });
      applyBohrokSheetMaterials(instance, colorScheme);
      applyPreviewMapToggles(instance);
      onKitMeshesAttached?.();
      return () => {
        for (const clone of accessoryClones) {
          clone.parent?.remove(clone);
        }
        setBakedDiscolorationEnabled(instance, true);
        setAuthoredNormalMapsEnabled(instance, true);
        setPackedRoughnessEnabled(instance, true);
        setPackedMetalnessEnabled(instance, true);
      };
    }, [
      applyPreviewMapToggles,
      colorScheme,
      id,
      instance,
      isKal,
      onKitMeshesAttached,
      packedGltf.nodes,
    ]);

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

useGLTF.preload(BOHROK_GLB);
