import { Suspense, useEffect, useRef, useState } from 'react';
import { Environment, PresentationControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { EffectComposer, SSAO, SelectiveBloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { DirectionalLight, Mesh, Object3D } from 'three';

import { useSettings } from '../../context/Settings';
import { CYLINDER_RADIUS } from './BoundsCylinder';

import { BaseMatoran, MatoranStage, RecruitedCharacterData } from '../../types/Matoran';
import { DiminishedMatoranModel } from './DiminishedMatoranModel';
import { GaliMataModel } from './Mata/GaliMataModel';
import { PohatuMataModel } from './Mata/PohatuMataModel';
import { KopakaMataModel } from './Mata/KopakaMataModel';
import { OnuaMataModel } from './Mata/OnuaMataModel';
import { LewaMataModel } from './Mata/LewaMataModel';
import { ToaNuvaPlaceholderModel } from './Nuva/PlaceholderModel';
import { CYLINDER_HEIGHT } from './BoundsCylinder';
import { TahuMataModel } from './Mata/TahuMataModel';
import { TahuNuvaModel } from './Nuva/TahuNuvaModel';
import { GaliNuvaModel } from './Nuva/GaliNuvaModel';
import { BohrokModel } from './BohrokModel';
import { useEyeMeshes } from './selectiveBloom';
import { OnuaNuvaModel } from './Nuva/OnuaNuvaModel';

/** Vertical center of the character framing volume. */
const CHARACTER_CENTER_Y = CYLINDER_HEIGHT / 2;

/** Scale down environment map contribution so IBL doesn't wash out shadows. */
function EnvironmentIntensity({ value }: { value: number }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scene as any).environmentIntensity = value;
  }, [scene, value]);
  return null;
}

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
        case 'Toa_Onua_Nuva':
          return <OnuaNuvaModel matoran={matoran} />;
        case 'Toa_Gali_Nuva':
          return <GaliNuvaModel matoran={matoran} />;
        case 'Toa_Tahu_Nuva':
          return <TahuNuvaModel matoran={matoran} />;
        default:
          return <ToaNuvaPlaceholderModel matoran={matoran} />;
      }
    case MatoranStage.Bohrok:
      return (
        <group scale={4.5} position={[0, 5.6, -3.5]}>
          <BohrokModel name={matoran.name} />
        </group>
      );
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

export function CharacterScene({ matoran }: { matoran: BaseMatoran & RecruitedCharacterData }) {
  const characterRootRef = useRef<Object3D>(null);
  const [lightsForBloom, setLightsForBloom] = useState<Object3D[]>([]);
  const eyeMeshes = useEyeMeshes(characterRootRef, matoran);
  const { shadowsEnabled } = useSettings();
  useEffect(() => {
    if (!shadowsEnabled || !characterRootRef.current) return;
    const applyShadowProps = () => {
      characterRootRef.current?.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    };
    applyShadowProps();
    const t = setTimeout(applyShadowProps, 500);
    return () => clearTimeout(t);
  }, [shadowsEnabled, matoran]);

  const setMainLightRef = (el: DirectionalLight | null) => {
    if (el) {
      setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
      el.target.position.set(0, CHARACTER_CENTER_Y, 0);
      if (el.parent && !el.target.parent) {
        el.parent.add(el.target);
      }
    }
  };

  return (
    <>
      <CharacterFraming />
      <Environment preset="city" />
      <EnvironmentIntensity value={0.4} />
      <directionalLight
        ref={setMainLightRef}
        position={[3, CHARACTER_CENTER_Y + 8, 10]}
        intensity={1.2}
        castShadow={shadowsEnabled}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-CYLINDER_RADIUS * 2}
        shadow-camera-right={CYLINDER_RADIUS * 2}
        shadow-camera-top={CYLINDER_HEIGHT * 0.75}
        shadow-camera-bottom={-CYLINDER_HEIGHT * 0.75}
        shadow-bias={-0.0005}
        shadow-normalBias={0.01}
      />
      <directionalLight
        ref={(el) => {
          if (el) setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
        }}
        position={[-3, CHARACTER_CENTER_Y + 2, -2]}
        intensity={0.15}
      />
      <ambientLight intensity={0.05} />
      {shadowsEnabled && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[CYLINDER_RADIUS * 3, CYLINDER_RADIUS * 3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      )}
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
