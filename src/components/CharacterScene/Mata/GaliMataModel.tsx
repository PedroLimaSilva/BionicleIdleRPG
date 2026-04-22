import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useMask } from '../../../hooks/useMask';
import { useKitAttachments } from '../../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../../game/kit/kit2001';
import { collectSkipWeatheredMetalMaterialKeys } from '../../../game/kit/kitMaterialUtils';
import { LegoColor } from '../../../types/Colors';
import type { KitSocketAttachment } from '../../../types/KitParts';
import { useBumpCharacterBloomRecollection } from '../selectiveBloom';
import { applyWeatheredMetalToObject } from '../WeatheredMetalMaterial';

const USE_WEATHERED_METAL = true;

/**
 * Per-material slot (kit material `.name`, case-insensitive):
 * - Shorthand: `{ kind: 'lego', value: LegoColor.Blue }` → color only
 * - Full: `{ color: …, roughness: 0.4, metalness: 0.9, skipWeatheredMetal: true,
 *   emissiveFromEyes: true, emissiveIntensity: 2 }` for hook lenses / bloom
 */
const GALI_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  AxleConPin2: {
    kitNodeName: 'AxleConPin2',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  MataFootL: {
    kitNodeName: 'MataFoot',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
    },
  },
  MataFootR: {
    kitNodeName: 'MataFoot',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
      Metal: { kind: 'lego', value: LegoColor.LightGray },
    },
  },
  MataChest: {
    kitNodeName: 'MataChest',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Arm_L_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: {
      Main: {
        kind: 'lego',
        value: LegoColor.Blue,
      },
    },
  },
  Arm_L_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Arm_L_Piston_Upper_L_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_L_Piston_Upper_R_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Lower_L_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Arm_R_Piston_Lower_R_1: {
    kitNodeName: 'MataSingleArmPistonLowerL',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Arm_R_Piston_Upper_L_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  Arm_R_Piston_Upper_R_1: { kitNodeName: 'MataSingleArmPistonUpperL' },
  HipPinBackL: { kitNodeName: 'Pin2L' },
  HipPinBackR: { kitNodeName: 'Pin2L' },
  HipPinFrontL: { kitNodeName: 'Pin2L' },
  HipPinFrontR: { kitNodeName: 'Pin2L' },
  Head: { kitNodeName: 'AxleSocket1L' },
  Face: { kitNodeName: 'MataFace' },
  Glowing_Eyes: { kitNodeName: 'MataGlowingEyes' },
  Brain: {
    kitNodeName: 'MataBrain',
    materialColors: { Main: { kind: 'lego', value: LegoColor.TransNeonYellow } },
  },
  MataAbdomen: {
    kitNodeName: 'MataAbdomen',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  MataHip: {
    kitNodeName: 'MataHip',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Arm_Upper_L_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  Arm_Upper_R_1: {
    kitNodeName: 'MataSingleArmUpper',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  Arm_Lower_L_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  Arm_Lower_R_1: {
    kitNodeName: 'MataSingleArmLower',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
    },
  },
  AxleMod2L: { kitNodeName: 'AxleMod2L' },
  AxleSpacer1L001: { kitNodeName: 'AxleSpacer1L' },
  AxleSpacer1L: { kitNodeName: 'AxleSpacer1L' },
  AxleModHips: { kitNodeName: 'AxleModHips' },
  AxleShoulderL: { kitNodeName: 'AxleMod3L' },
  AxleShoulderR: { kitNodeName: 'AxleMod3L' },
  Gear_Big: { kitNodeName: 'GearB' },
  Shoulder_Joint_R_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Shoulder_Joint_L_1: {
    kitNodeName: 'SocketModSide',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Leg_Upper_Piston_L_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Leg_Upper_Piston_R_1: {
    kitNodeName: 'MataLegModPistonT',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Leg_Lower_Piston_L_1: { kitNodeName: 'MataLegModPistonN' },
  Leg_Lower_Piston_R_1: { kitNodeName: 'MataLegModPistonN' },
  Axle2L: { kitNodeName: 'Axle2L' },
  Axle6L: { kitNodeName: 'Axle6L' },
  GearML: { kitNodeName: 'GearM' },
  GearMM: { kitNodeName: 'GearM' },
  GearMR: { kitNodeName: 'GearM' },
  Hand_L_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: { kind: 'lego', value: LegoColor.MediumBlue } },
  },
  Hand_R_1: {
    kitNodeName: 'MataSingleArmHand',
    materialColors: { Main: { kind: 'lego', value: LegoColor.MediumBlue } },
  },
  Hip_Joint_L_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  Hip_Joint_R_1: {
    kitNodeName: 'SocketModTop',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Black } },
  },
  HookL: { kitNodeName: 'Hook', materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } } },
  HookR: { kitNodeName: 'Hook', materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } } },
  LegAnkleL: {
    kitNodeName: 'MataLegModShin',
    materialColors: { Secondary: { kind: 'lego', value: LegoColor.MediumBlue } },
  },
  LegAnkleR: {
    kitNodeName: 'MataLegModShin',
    materialColors: { Secondary: { kind: 'lego', value: LegoColor.MediumBlue } },
  },
  Leg_Upper_L_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
      Secondary: { kind: 'lego', value: LegoColor.Blue },
    },
  },
  Leg_Upper_R_1: {
    kitNodeName: 'MataLegModThigh',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.MediumBlue },
      Secondary: { kind: 'lego', value: LegoColor.Blue },
    },
  },
  ObliqueNL: { kitNodeName: 'MataObliqueN' },
  ObliqueNR: { kitNodeName: 'MataObliqueN' },
  ObliqueTL: {
    kitNodeName: 'MataObliqueW',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  ObliqueTR: {
    kitNodeName: 'MataObliqueW',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  Socket: {
    kitNodeName: 'Socket',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
};

export const GaliMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const [kitAttachGeneration, setKitAttachGeneration] = useState(0);
  const skipWeatheredMetalMaterialKeys = useMemo(
    () => collectSkipWeatheredMetalMaterialKeys(GALI_KIT_2001_ATTACHMENTS),
    []
  );
  const bumpBloomRecollection = useBumpCharacterBloomRecollection();
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/gali.glb');
  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: matoran.id,
    attackResolveAtFraction: 0.6,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  useKitAttachments({
    characterNodes: nodes as Record<string, Object3D | undefined>,
    kitUrl: KIT_2001_GLB_PATH,
    attachments: GALI_KIT_2001_ATTACHMENTS,
    colors: matoran.colors,
    eyesColorHex: matoran.colors.eyes,
    onAttached: () => {
      setKitAttachGeneration((g) => g + 1);
      bumpBloomRecollection?.();
    },
  });

  useEffect(() => {
    const root = group.current;
    if (!root || !nodes) return;
    if (USE_WEATHERED_METAL) {
      applyWeatheredMetalToObject(root, {
        roughness: 0.55,
        metalness: 0.05,
        grimeDarken: 0.4,
        grimeRoughness: 0.2,
        grimeMetalnessReduce: 0.5,
        largeScale: 3.5,
        fineScale: 18.0,
        cavityStrength: 1,
        edgeColor: '#ffffff',
        edgeStrength: 0.15,
        edgeCurvatureScale: 2,
        excludeMaterialNames: ['Gali Glow', 'Brain', 'Glowing Eyes'],
        excludeMaterialNameSubstrings: ['glow'],
        excludeMaterialNamesNormalized: skipWeatheredMetalMaterialKeys,
      });
    }
  }, [nodes, kitAttachGeneration, skipWeatheredMetalMaterialKeys]);

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Gali} position={[0, 0, -0.4]} />
    </group>
  );
});
