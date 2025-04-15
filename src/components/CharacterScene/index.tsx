import { Suspense, useLayoutEffect } from 'react';
import { Bounds, OrbitControls, Stage, useBounds } from '@react-three/drei';

import { BaseMatoran, MatoranStage } from '../../types/Matoran';
import { DiminishedMatoranModel } from './DiminishedMatoranModel';
import { ToaTahuMataModel } from './ToaTahuMataModel';
import { ToaGaliMataModel } from './ToaGaliMataModel';
import { ToaPohatuMataModel } from './ToaPohatuMataModel';

function CharacterModel({ matoran }: { matoran: BaseMatoran }) {
  switch (matoran.stage) {
    case MatoranStage.ToaMata:
      switch (matoran.id) {
        case 'Toa_Gali':
          return <ToaGaliMataModel />;
        case 'Toa_Pohatu':
          return <ToaPohatuMataModel />;
        default:
          return <ToaTahuMataModel />;
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
  }, [bounds, isToa, modelId]); // Trigger on change

  return (
    <mesh
      castShadow={false}
      receiveShadow={false}
      position={isToa ? [0, 0, 0] : [0, -5, 0]}
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

export function CharacterScene({ matoran }: { matoran: BaseMatoran }) {
  return (
    <Stage
      environment='forest'
      adjustCamera={false}
      shadows={{ type: 'contact', offset: -0.5 }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
      />
      <Suspense fallback={null}>
        <CharacterModel matoran={matoran} />
        {getBoundingBox(matoran)}
      </Suspense>
    </Stage>
  );
}
