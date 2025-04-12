import { Suspense } from 'react';
import { Bounds, OrbitControls, Stage } from '@react-three/drei';

import { BaseMatoran, MatoranStage } from '../../types/Matoran';
import { DiminishedMatoranModel } from './DiminishedMatoranModel';
import { ToaMataModel } from './ToaMataModel';

function getCharacterModel(matoran: BaseMatoran) {
  switch (matoran.stage) {
    case MatoranStage.Diminished: {
      return <DiminishedMatoranModel matoran={matoran} />;
    }
    case MatoranStage.ToaMata: {
      return <ToaMataModel />;
    }
    default:
      return <DiminishedMatoranModel matoran={matoran} />;
  }
}

export function CharacterScene({ matoran }: { matoran: BaseMatoran }) {
  return (
    <Stage environment={'forest'}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2}>
          {getCharacterModel(matoran)}
        </Bounds>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Stage>
  );
}
