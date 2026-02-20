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
import { Group } from 'three';

interface CombatantModelProps {
  combatant: Combatant;
  position: [number, number, number];
  side: 'enemy' | 'team';
}

export interface PlayAnimationOptions {
  /** When set, combatant rotates to face this target during the animation, then restores original orientation. */
  faceTargetId?: string;
}

export interface CombatantModelHandle {
  playAnimation: (
    name: 'Attack' | 'Hit' | 'Defeat' | 'Idle',
    options?: PlayAnimationOptions
  ) => Promise<void>;
}

/** Compute Y rotation (radians) to face target from self position. Team faces -Z by default, enemy +Z. */
function getFacingRotation(
  selfPos: [number, number, number],
  targetPos: [number, number, number],
  side: 'team' | 'enemy'
): number {
  const dx = targetPos[0] - selfPos[0];
  const dz = targetPos[2] - selfPos[2];
  const angle = Math.atan2(dx, dz);
  return side === 'team' ? angle + Math.PI : angle;
}

export const CombatantModel = forwardRef<CombatantModelHandle, CombatantModelProps>(
  ({ combatant, position, side }, ref) => {
    const modelGroup = useRef<Group>(null);
    const childRef = useRef<CombatantModelHandle | null>(null);

    const baseRotationY = side === 'team' ? Math.PI : 0;
    const [overrideRotationY, setOverrideRotationY] = useState<number | null>(null);
    const rotationY = overrideRotationY ?? baseRotationY;

    useImperativeHandle(ref, () => ({
      playAnimation: async (name, options) => {
        const faceTargetId = options?.faceTargetId;

        if (faceTargetId && (name === 'Attack' || name === 'Hit' || name === 'Defeat')) {
          const positions = (window as { combatantPositions?: Record<string, [number, number, number]> })
            .combatantPositions;
          const selfPos = positions?.[combatant.id];
          const targetPos = positions?.[faceTargetId];

          if (selfPos && targetPos) {
            setOverrideRotationY(getFacingRotation(selfPos, targetPos, side));
          }
        }

        try {
          await (childRef.current?.playAnimation(name) ?? Promise.resolve());
        } finally {
          if (faceTargetId) {
            setOverrideRotationY(null);
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
