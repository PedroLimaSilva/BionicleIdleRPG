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

interface CombatantModelProps {
  combatant: Combatant;
  position: [number, number, number];
  side: 'enemy' | 'team';
}

export const CombatantModel: React.FC<CombatantModelProps> = ({
  combatant,
  position,
  side,
}) => {
  const rotation: Euler = [0, side === 'team' ? Math.PI : 0, 0];

  const model = (() => {
    switch (combatant.model) {
      case 'bohrok':
        return (
          <group scale={0.2} position={[0, 0.3, 0]}>
            <BohrokModel name={combatant.name} />
          </group>
        );
      case 'Toa_Kopaka':
        return (
          <group scale={0.05} position={[0, 0.51, 0]}>
            <ToaKopakaMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Tahu':
        return (
          <group scale={0.05} position={[0, 0.51, 0]}>
            <ToaTahuMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Pohatu':
        return (
          <group scale={0.05} position={[0, 0.51, 0]}>
            <ToaPohatuMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Onua':
        return (
          <group scale={0.05} position={[0, 0.51, 0]}>
            <ToaOnuaMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Lewa':
        return (
          <group scale={0.05} position={[0, 0.51, 0]}>
            <ToaLewaMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      case 'Toa_Gali':
        return (
          <group scale={0.05} position={[0, 0.51, 0]}>
            <ToaGaliMataModel
              matoran={{ ...MATORAN_DEX[combatant.id], ...combatant, exp: 0 }}
            />
          </group>
        );
      default:
        return null;
    }
  })();
  return (
    <group position={position} rotation={rotation}>
      {model}
    </group>
  );
};
