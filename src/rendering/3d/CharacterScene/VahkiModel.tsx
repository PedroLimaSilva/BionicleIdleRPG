import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../hooks/useCombatAnimations';
import { VAHKI_IDLE_SWITCH } from './idleSwitchConfigs';
import { useKitAttachments } from '../hooks/useKitAttachments';
import { CHARACTER_DEX } from '../../../data/dex/index';
import { MatoranStage } from '../../../types/Matoran';
import { KIT_2001_GLB_PATH } from '../kit/kit2001';
import { KIT_2003_GLB_PATH } from '../kit/kit2003';
import { KIT_2004_GLB_PATH } from '../kit/kit2004';
import {
  getVahkiKit2004Attachments,
  VAHKI_KIT_2001_ATTACHMENTS,
  VAHKI_KIT_2003_ATTACHMENTS,
} from '../kit/attachments/vahki';
import { VAHKI_WEATHERED } from '../kit/palettes/vahkiKitPalette';

const VAHKI_GLB = import.meta.env.BASE_URL + 'Vahki.glb';

/**
 * `Vahki.glb` authors the Vahki root at Y=10 so feet sit near 0 (same
 * CharacterScene framing as Toa Metru). Do not zero Y — that drops the legs
 * below the camera.
 *
 * The updated rest pose faces −Z (visor toward the character-sheet camera).
 * Yaw 180° so combat still treats +Z as forward, matching other combatants.
 * CharacterScene applies another 180° for the sheet camera.
 */
const VAHKI_BIND_POSE_Y = 10;
const VAHKI_BIND_POSE_YAW = Math.PI;

/** Must match how many `useKitAttachments` calls this component makes. */
const VAHKI_ATTACHMENT_RUNS = 3;

/** Deepest node wins for duplicate socket names. */
function buildKitCharacterNodes(root: Object3D): Record<string, Object3D> {
  const map: Record<string, Object3D> = {};
  root.traverse((child) => {
    if (child.name) map[child.name] = child;
  });
  return map;
}

/**
 * One Vahki chassis for all six hives. `Vahki.glb` is a socket-only rig; every
 * visible piece (including hive staffs) is cloned from kit_2004 / kit_2003 /
 * kit_2001. Idle clips use {@link VAHKI_IDLE_SWITCH}; combat still falls back to
 * procedural Attack / Hit / Defeat when those clips are absent.
 */
export const VahkiModel = forwardRef<
  CombatantModelHandle,
  { id: string; onKitMeshesAttached?: () => void }
>(({ id, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(VAHKI_GLB);

  const colorScheme = CHARACTER_DEX[id].colors;
  const kitLayersDone = useRef(0);
  useEffect(() => {
    kitLayersDone.current = 0;
  }, [id]);
  const onKitLayerAttached = useMemo(() => {
    if (!onKitMeshesAttached) return undefined;
    return () => {
      kitLayersDone.current += 1;
      if (kitLayersDone.current >= VAHKI_ATTACHMENT_RUNS) {
        kitLayersDone.current = 0;
        onKitMeshesAttached();
      }
    };
  }, [onKitMeshesAttached]);

  const vahkiInstance = useMemo(() => {
    const root = nodes.Vahki as Object3D | undefined;
    if (!root) {
      console.warn(`[VahkiModel] Root 'Vahki' not found in ${VAHKI_GLB}`);
      return new Group();
    }
    return root.clone(true);
  }, [nodes]);

  const kitCharacterNodes = useMemo(() => buildKitCharacterNodes(vahkiInstance), [vahkiInstance]);

  const { playAnimation } = useCombatAnimations(animations, group, {
    actionTimeScale: 1,
    attackResolveAtFraction: 0.1,
    idleSwitch: VAHKI_IDLE_SWITCH,
    modelId: id,
    transitionMode: 'stopAll',
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  const kit2004Attachments = useMemo(() => getVahkiKit2004Attachments(id), [id]);

  useKitAttachments({
    attachments: kit2004Attachments,
    characterNodes: kitCharacterNodes,
    colors: colorScheme,
    kitUrl: KIT_2004_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: MatoranStage.Vahki,
    weathered: VAHKI_WEATHERED,
  });

  useKitAttachments({
    attachments: VAHKI_KIT_2003_ATTACHMENTS,
    characterNodes: kitCharacterNodes,
    colors: colorScheme,
    kitUrl: KIT_2003_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: MatoranStage.Vahki,
    weathered: VAHKI_WEATHERED,
  });

  useKitAttachments({
    attachments: VAHKI_KIT_2001_ATTACHMENTS,
    characterNodes: kitCharacterNodes,
    colors: colorScheme,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached: onKitLayerAttached,
    stage: MatoranStage.Vahki,
    weathered: VAHKI_WEATHERED,
  });

  return (
    <group ref={group} dispose={null} rotation={[0, VAHKI_BIND_POSE_YAW, 0]}>
      <primitive object={vahkiInstance} scale={1} position={[0, VAHKI_BIND_POSE_Y, 0]} />
    </group>
  );
});

VahkiModel.displayName = 'VahkiModel';

useGLTF.preload(VAHKI_GLB);
useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2003_GLB_PATH, KIT_2004_GLB_PATH);
