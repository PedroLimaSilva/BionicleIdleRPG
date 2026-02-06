import { Suspense } from 'react';
import { OrthographicCamera, Stage } from '@react-three/drei';

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
    <Stage environment='forest' adjustCamera={false} shadows={false}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <OrthographicCamera makeDefault zoom={20} position={[0, 8.15, 100]} />
        <CharacterModel matoran={matoran} />
      </Suspense>
    </Stage>
  );
}
