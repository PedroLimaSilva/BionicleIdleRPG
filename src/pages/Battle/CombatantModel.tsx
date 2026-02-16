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
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Group } from 'three';

interface CombatantModelProps {
  combatant: Combatant;
  position: [number, number, number];
  side: 'enemy' | 'team';
}

export interface CombatantModelHandle {
  playAnimation: (name: 'Attack' | 'Hit' | 'Idle') => Promise<void>;
}

export const CombatantModel = forwardRef<CombatantModelHandle, CombatantModelProps>(
  ({ combatant, position, side }, ref) => {
    const modelGroup = useRef<Group>(null);

    const childRef = useRef<CombatantModelHandle>(null);

    useImperativeHandle(ref, () => ({
      playAnimation: (name) => {
        return childRef.current?.playAnimation(name) ?? Promise.resolve();
      },
    }));

    const rotation: Euler = [0, side === 'team' ? Math.PI : 0, 0];

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
