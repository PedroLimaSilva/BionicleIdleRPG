import { Suspense, useEffect, useRef, useState } from 'react';
import { Environment, PresentationControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { EffectComposer, SSAO, SelectiveBloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Object3D } from 'three';

import { BaseMatoran, MatoranStage, RecruitedCharacterData } from '../../types/Matoran';
import { DiminishedMatoranModel } from './DiminishedMatoranModel';
import { GaliMataModel } from './Mata/GaliMataModel';
import { PohatuMataModel } from './Mata/PohatuMataModel';
import { KopakaMataModel } from './Mata/KopakaMataModel';
import { OnuaMataModel } from './Mata/OnuaMataModel';
import { LewaMataModel } from './Mata/LewaMataModel';
import { ToaNuvaPlaceholderModel } from './Nuva/PlaceholderModel';
import { CYLINDER_HEIGHT, CYLINDER_RADIUS } from './BoundsCylinder';
import { TahuMataModel } from './Mata/TahuMataModel';
import { ToaTahuNuvaModel } from './Nuva/TahuNuvaModel';
import { ToaGaliNuvaModel } from './Nuva/GaliNuvaModel';
import { useEyeMeshes } from './selectiveBloom';

function CharacterModel({ matoran }: { matoran: BaseMatoran & RecruitedCharacterData }) {
  switch (matoran.stage) {
    case MatoranStage.ToaMata:
      switch (matoran.id) {
        case 'Toa_Gali':
          return <GaliMataModel matoran={matoran} />;
        case 'Toa_Pohatu':
          return <PohatuMataModel matoran={matoran} />;
        case 'Toa_Kopaka':
          return <KopakaMataModel matoran={matoran} />;
        case 'Toa_Onua':
          return <OnuaMataModel matoran={matoran} />;
        case 'Toa_Lewa':
          return <LewaMataModel matoran={matoran} />;
        default:
          return <TahuMataModel matoran={matoran} />;
      }
    case MatoranStage.ToaNuva:
      switch (matoran.id) {
        case 'Toa_Gali_Nuva':
          return <ToaGaliNuvaModel matoran={matoran} />;
        case 'Toa_Tahu_Nuva':
          return <ToaTahuNuvaModel matoran={matoran} />;
        default:
          return <ToaNuvaPlaceholderModel matoran={matoran} />;
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
    if (camera.type !== 'OrthographicCamera') return;

    // Skip when container has no layout yet (e.g. hidden via CSS).
    // OrthographicCamera.updateProjectionMatrix() divides by zoom internally;
    // zoom=0 causes division by zero → Infinity/NaN in projection matrix.
    if (size.width <= 0 || size.height <= 0) return;

    // Look head-on from the front, vertically centered on the cylinder
    camera.position.set(0, CYLINDER_HEIGHT / 2, 100);
    camera.lookAt(0, CYLINDER_HEIGHT / 2, 0);
    camera.near = 0.1;
    camera.far = 1000;

    // Zoom so the cylinder just fits the viewport
    camera.zoom = Math.min(size.width / (CYLINDER_RADIUS * 2), size.height / CYLINDER_HEIGHT);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

/**
 * Signals to the canvas context when the character model has finished loading.
 * Renders inside Suspense so it only mounts after CharacterModel resolves.
 */
function SceneReadyNotifier() {
  const { setSceneReady } = useSceneCanvas();
  useEffect(() => {
    setSceneReady(true);
    // Don't set false on unmount - parent handles that when changing scenes.
    // Clearing here can hide the canvas if Suspense re-shows fallback or Strict Mode double-mounts.
  }, [setSceneReady]);
  return null;
}

export function CharacterScene({ matoran }: { matoran: BaseMatoran & RecruitedCharacterData }) {
  const characterRootRef = useRef<Object3D>(null);
  const [lightsForBloom, setLightsForBloom] = useState<Object3D[]>([]);
  const eyeMeshes = useEyeMeshes(characterRootRef, matoran);

  return (
    <>
      <CharacterFraming />
      <Environment preset="city" />
      <directionalLight
        ref={(el) => {
          if (el) setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
        }}
        position={[3, 5, 2]}
        intensity={1.2}
      />
      <directionalLight
        ref={(el) => {
          if (el) setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
        }}
        position={[-3, 2, -2]}
        intensity={0.4}
      />
      <ambientLight intensity={0.2} />
      <group ref={characterRootRef}>
        <PresentationControls
          global={true}
          snap={false}
          speed={2}
          zoom={1}
          polar={[0, 0]}
          config={{ mass: 0.5, tension: 170, friction: 26 }}
        >
          <Suspense fallback={null}>
            <CharacterModel matoran={matoran} />
            <SceneReadyNotifier />
          </Suspense>
        </PresentationControls>
      </group>
      <EffectComposer multisampling={0} enableNormalPass resolutionScale={0.5}>
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={24}
          rings={4}
          intensity={1.0}
          radius={6}
          bias={0.5}
          luminanceInfluence={0.35}
        />
        {lightsForBloom.length > 0 ? (
          <SelectiveBloom
            selection={eyeMeshes}
            lights={lightsForBloom}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.5}
            intensity={0.28}
            mipmapBlur
          />
        ) : (
          <></>
        )}
      </EffectComposer>
    </>
  );
}
