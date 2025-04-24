import { Combatant } from '../../types/Combat';
import { BohrokModel } from '../../components/CharacterScene/BohrokModel';
import { ToaKopakaMataModel } from '../../components/CharacterScene/ToaKopakaMataModel';
import { MATORAN_DEX } from '../../data/matoran';
import { Euler } from '@react-three/fiber';
import { ToaTahuMataModel } from '../../components/CharacterScene/ToaTahuMataModel';
import { ToaPohatuMataModel } from '../../components/CharacterScene/ToaPohatuMataModel';
import { ToaOnuaMataModel } from '../../components/CharacterScene/ToaOnuaMataModel';
import { ToaLewaMataModel } from '../../components/CharacterScene/ToaLewaMataModel';
import { ToaGaliMataModel } from '../../components/CharacterScene/ToaGaliMataModel';
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

export const CombatantModel = forwardRef<
  CombatantModelHandle,
  CombatantModelProps
>(({ combatant, position, side }, ref) => {
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
            <ToaKopakaMataModel
              ref={childRef}
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Tahu':
        return (
          <group scale={0.04} position={[0, 0.375, 0]}>
            <ToaTahuMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Pohatu':
        return (
          <group scale={0.04} position={[0, 0.375, 0]}>
            <ToaPohatuMataModel
              ref={childRef}
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Onua':
        return (
          <group scale={0.04} position={[0, 0.375, 0]}>
            <ToaOnuaMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Lewa':
        return (
          <group scale={0.04} position={[0, 0.375, 0]}>
            <ToaLewaMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Gali':
        return (
          <group scale={0.04} position={[0, 0.375, 0]}>
            <ToaGaliMataModel
              ref={childRef}
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
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
});
