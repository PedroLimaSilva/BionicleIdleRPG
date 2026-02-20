import { Combatant } from '../../types/Combat';
import { BohrokModel } from '../../components/CharacterScene/BohrokModel';
import { KopakaMataModel } from '../../components/CharacterScene/Mata/KopakaMataModel';
import { MATORAN_DEX } from '../../data/matoran';
import { Euler } from '@react-three/fiber';
import { TahuMataModel } from '../../components/CharacterScene/Mata/TahuMataModel';
import { PohatuMataModel } from '../../components/CharacterScene/Mata/PohatuMataModel';
import { OnuaMataModel } from '../../components/CharacterScene/Mata/OnuaMataModel';
import { LewaMataModel } from '../../components/CharacterScene/Mata/LewaMataModel';
import { GaliMataModel } from '../../components/CharacterScene/Mata/GaliMataModel';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

const ROTATION_RESTORE_DURATION = 0.25;

/** Linear interpolation between two angles, taking the shortest path. */
function lerpAngle(from: number, to: number, t: number): number {
  let diff = to - from;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return from + diff * t;
}

interface CombatantModelProps {
  combatant: Combatant;
  position: [number, number, number];
  side: 'enemy' | 'team';
}

export interface PlayAnimationOptions {
  /** When set, combatant rotates to face this target during the animation, then restores original orientation. */
  faceTargetId?: string;
  /** Internal: called when animation fully ends (used when CombatantModel calls child for Attack). */
  onAnimationComplete?: () => void;
}

export interface CombatantModelHandle {
  playAnimation: (
    name: 'Attack' | 'Hit' | 'Defeat' | 'Idle',
    options?: PlayAnimationOptions
  ) => Promise<void>;
}

/** Compute Y rotation (radians) to face target from self position. Model +Z axis rotates to point at target. */
function getFacingRotation(
  selfPos: [number, number, number],
  targetPos: [number, number, number]
): number {
  const dx = targetPos[0] - selfPos[0];
  const dz = targetPos[2] - selfPos[2];
  return Math.atan2(dx, dz);
}

export const CombatantModel = forwardRef<CombatantModelHandle, CombatantModelProps>(
  ({ combatant, position, side }, ref) => {
    const modelGroup = useRef<Group>(null);
    const childRef = useRef<CombatantModelHandle | null>(null);

    const baseRotationY = side === 'team' ? Math.PI : 0;
    const [overrideRotationY, setOverrideRotationY] = useState<number | null>(null);
    const restoreRef = useRef<{ from: number; startTimeMs: number } | null>(null);

    useFrame(() => {
      const restore = restoreRef.current;
      if (!restore) return;
      const elapsedSec = (performance.now() - restore.startTimeMs) / 1000;
      const t = Math.min(1, elapsedSec / ROTATION_RESTORE_DURATION);
      setOverrideRotationY(lerpAngle(restore.from, baseRotationY, t));
      if (t >= 1) {
        restoreRef.current = null;
        setOverrideRotationY(null);
      }
    });

    const rotationY = overrideRotationY ?? baseRotationY;

    useImperativeHandle(ref, () => ({
      playAnimation: async (name, options) => {
        const faceTargetId = options?.faceTargetId;
        const shouldFace = faceTargetId && (name === 'Attack' || name === 'Hit' || name === 'Defeat');

        let facingY: number | null = null;
        if (shouldFace) {
          const positions = (window as { combatantPositions?: Record<string, [number, number, number]> })
            .combatantPositions;
          const selfPos = positions?.[combatant.id];
          const targetPos = positions?.[faceTargetId];

          if (selfPos && targetPos) {
            facingY = getFacingRotation(selfPos, targetPos);
            setOverrideRotationY(facingY);
          }
        }

        const startRestore = () => {
          if (facingY !== null) {
            restoreRef.current = { from: facingY, startTimeMs: performance.now() };
          }
        };

        try {
          const callOptions =
            name === 'Attack' && faceTargetId && facingY !== null
              ? { onAnimationComplete: startRestore }
              : undefined;
          await (childRef.current?.playAnimation(name, callOptions) ?? Promise.resolve());
        } finally {
          if (faceTargetId && name === 'Hit' && facingY !== null) {
            startRestore();
          }
        }
      },
    }));

    const rotation: Euler = [0, rotationY, 0];

    const model = (() => {
      switch (combatant.model) {
        case 'bohrok':
          return (
            <group scale={0.175} position={[0, 0.215, -0.15]}>
              <BohrokModel ref={childRef} name={combatant.name} />
            </group>
          );
        case 'Toa_Kopaka':
          return (
            <group scale={0.04} position={[0, 0.375, 0]}>
              <KopakaMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...MATORAN_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                }}
              />
            </group>
          );
        case 'Toa_Tahu':
          return (
            <group scale={0.04} position={[0, 0.375, 0]}>
              <TahuMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...MATORAN_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                }}
              />
            </group>
          );
        case 'Toa_Pohatu':
          return (
            <group scale={0.04} position={[0, 0.375, 0]}>
              <PohatuMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...MATORAN_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                }}
              />
            </group>
          );
        case 'Toa_Onua':
          return (
            <group scale={0.04} position={[0, 0.375, 0]}>
              <OnuaMataModel
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...MATORAN_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                }}
              />
            </group>
          );
        case 'Toa_Lewa':
          return (
            <group scale={0.04} position={[0, 0.375, 0]}>
              <LewaMataModel
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...MATORAN_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                }}
              />
            </group>
          );
        case 'Toa_Gali':
          return (
            <group scale={0.04} position={[0, 0.375, 0]}>
              <GaliMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...MATORAN_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                }}
              />
            </group>
          );
        default:
          return null;
      }
    })();
    return (
      <group ref={modelGroup} position={position} rotation={rotation}>
        {model}
      </group>
    );
  }
);
