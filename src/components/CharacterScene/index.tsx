import { Suspense } from 'react';
import { Stage } from '@react-three/drei';

import {
  BaseMatoran,
  MatoranStage,
  RecruitedCharacterData,
} from '../../types/Matoran';
import { DiminishedMatoranModel } from './DiminishedMatoranModel';
import { ToaTahuMataModel } from './ToaTahuMataModel';
import { ToaGaliMataModel } from './ToaGaliMataModel';
import { ToaPohatuMataModel } from './ToaPohatuMataModel';
import { ToaKopakaMataModel } from './ToaKopakaMataModel';
import { ToaOnuaMataModel } from './ToaOnuaMataModel';
import { ToaLewaMataModel } from './ToaLewaMataModel';
import { BoundsCylinder } from './BoundsCylinder';

function CharacterModel({
  matoran,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
}) {
  switch (matoran.stage) {
    case MatoranStage.ToaMata:
      switch (matoran.id) {
        case 'Toa_Gali':
          return (
            <group position={[0, 7.1, 0]}>
              <ToaGaliMataModel matoran={matoran} />
            </group>
          );
        case 'Toa_Pohatu':
          return (
            <group position={[0, 6.4, 0]}>
              <ToaPohatuMataModel matoran={matoran} />
            </group>
          );
        case 'Toa_Kopaka':
          return (
            <group position={[0, 6.9, 0]}>
              <ToaKopakaMataModel matoran={matoran} />
            </group>
          );
        case 'Toa_Onua':
          return (
            <group position={[0, 7, 0]}>
              <ToaOnuaMataModel matoran={matoran} />
            </group>
          );
        case 'Toa_Lewa':
          return (
            <group position={[0, 7, 0]}>
              <ToaLewaMataModel matoran={matoran} />
            </group>
          );
        default:
          return (
            <group position={[0, 7.4, 0]}>
              <ToaTahuMataModel matoran={matoran} />
            </group>
          );
      }
    case MatoranStage.Diminished:
    default:
      return <DiminishedMatoranModel matoran={matoran} />;
  }
}

export function CharacterScene({
  matoran,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
}) {
  return (
    <Stage
      shadows={false}
      adjustCamera={1}
      fit
      maxDuration={0}
      preset='soft'
      environment='city'
      intensity={0.4}
    >
      {/* Fixed cylinder bounds – keeps camera framing stable across all characters */}
      <BoundsCylinder />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />
      <ambientLight intensity={0.2} />
      <Suspense fallback={null}>
        <CharacterModel matoran={matoran} />
      </Suspense>
    </Stage>
  );
}
