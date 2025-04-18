import { Suspense, useLayoutEffect } from 'react';
import { Bounds, OrbitControls, Stage, useBounds } from '@react-three/drei';

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
          return <ToaGaliMataModel matoran={matoran} />;
        case 'Toa_Pohatu':
          return <ToaPohatuMataModel matoran={matoran} />;
        case 'Toa_Kopaka':
          return <ToaKopakaMataModel matoran={matoran} />;
        case 'Toa_Onua':
          return <ToaOnuaMataModel matoran={matoran} />;
        case 'Toa_Lewa':
          return <ToaLewaMataModel matoran={matoran} />;
        default:
          return <ToaTahuMataModel matoran={matoran} />;
      }
    case MatoranStage.Diminished:
    default:
      return <DiminishedMatoranModel matoran={matoran} />;
  }
}

const isPreview = false;

export function FitBoundsBox({
  isToa,
  modelId,
}: {
  isToa: boolean;
  modelId: string;
}) {
  const bounds = useBounds();

  useLayoutEffect(() => {
    bounds.refresh().fit();
    console.log();
  }, [bounds, isToa, modelId]); // Trigger on change

  return (
    <mesh
      castShadow={false}
      receiveShadow={false}
      position={isToa ? [0, 0, 0] : [0, -5, 3]}
    >
      <boxGeometry args={isToa ? [15, 20, 15] : [10, 10, 10]} />
      <meshStandardMaterial
        transparent={!isPreview}
        visible={isPreview}
        opacity={isPreview ? 1 : 0}
        wireframe={isPreview}
        color={'#E7AD00'}
      />
    </mesh>
  );
}

function getBoundingBox(matoran: BaseMatoran) {
  const isToa = matoran.stage === MatoranStage.ToaMata;
  return (
    <Bounds fit clip observe margin={1}>
      <FitBoundsBox isToa={isToa} modelId={matoran.id} />
    </Bounds>
  );
}

export function CharacterScene({
  matoran,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
}) {
  return (
    <Stage environment='forest'>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
        />
        <CharacterModel matoran={matoran} />
        {getBoundingBox(matoran)}
      </Suspense>
    </Stage>
  );
}
