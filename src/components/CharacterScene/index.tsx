import { Suspense, useEffect } from 'react';
import { Environment, PresentationControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { OrthographicCamera } from 'three';

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
import { CYLINDER_HEIGHT, CYLINDER_RADIUS } from './BoundsCylinder';

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

/**
 * Positions the shared orthographic camera so it looks head-on at the
 * cylinder volume defined in BoundsCylinder.  Zoom is set so the
 * cylinder just fits the viewport – whichever dimension is tighter
 * (width or height) wins.
 *
 * Runs once on mount and again whenever the viewport is resized.
 */
function CharacterFraming() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;

    // Look head-on from the front, vertically centered on the cylinder
    camera.position.set(0, CYLINDER_HEIGHT / 2, 100);
    camera.lookAt(0, CYLINDER_HEIGHT / 2, 0);
    camera.near = 0.1;
    camera.far = 1000;

    // Zoom so the cylinder just fits the viewport
    camera.zoom = Math.min(
      size.width / (CYLINDER_RADIUS * 2),
      size.height / CYLINDER_HEIGHT,
    );
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

export function CharacterScene({
  matoran,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
}) {
  return (
    <>
      <CharacterFraming />
      <Environment preset='city' />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />
      <ambientLight intensity={0.2} />
      <PresentationControls
        global={true}
        snap={false}
        speed={0.5}
        zoom={1}
        polar={[0,0]}
        config={{ mass: 0.5, tension: 170, friction: 26 }}
      >
        <Suspense fallback={null}>
          <CharacterModel matoran={matoran} />
        </Suspense>
      </PresentationControls>
    </>
  );
}
