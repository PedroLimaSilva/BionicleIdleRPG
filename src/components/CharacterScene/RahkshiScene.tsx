import { Suspense, useEffect, useRef, useState } from 'react';
import { Environment, PresentationControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { EffectComposer, SSAO } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { DirectionalLight, Mesh, Object3D } from 'three';

import { useSettings } from '../../context/useSettings';
import { CITY_ENVIRONMENT_PROPS } from '../../utils/cityEnvironmentHdri';
import { shouldEnableSelectiveBloom, shouldEnableShadows } from '../../utils/testMode';
import { KraataPower } from '../../types/Kraata';
import { CYLINDER_HEIGHT, CYLINDER_RADIUS } from './BoundsCylinder';
import { RahkshiModel } from './Rahkshi';
import { useEmissiveMeshes } from './selectiveBloom';
import { StableSelectiveBloom } from './StableSelectiveBloom';

const CENTER_Y = CYLINDER_HEIGHT / 2;

/** Scale down environment map contribution so IBL doesn't wash out shadows. */
function EnvironmentIntensity({ value }: { value: number }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scene as any).environmentIntensity = value;
  }, [scene, value]);
  return null;
}

function RahkshiFraming() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    if (camera.type !== 'OrthographicCamera') return;
    if (size.width <= 0 || size.height <= 0) return;
    camera.position.set(0, CENTER_Y, 100);
    camera.lookAt(0, CENTER_Y, 0);
    camera.near = 0.1;
    camera.far = 1000;
    camera.zoom = Math.min(size.width / (CYLINDER_RADIUS * 2), size.height / CYLINDER_HEIGHT);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export function RahkshiScene({ hasKraata, kraata }: { kraata: KraataPower; hasKraata: boolean }) {
  const sceneRootRef = useRef<Object3D>(null);
  const [lightsForBloom, setLightsForBloom] = useState<Object3D[]>([]);
  const bloomMeshes = useEmissiveMeshes(sceneRootRef, [kraata, hasKraata]);
  const { shadowsEnabled } = useSettings();
  const effectiveShadows = shadowsEnabled && shouldEnableShadows();

  useEffect(() => {
    if (!effectiveShadows || !sceneRootRef.current) return;
    const applyShadowProps = () => {
      sceneRootRef.current?.traverse((child) => {
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
  }, [effectiveShadows, kraata, hasKraata]);

  const setMainLightRef = (el: DirectionalLight | null) => {
    if (el) {
      setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
      el.target.position.set(0, CENTER_Y, 0);
      if (el.parent && !el.target.parent) {
        el.parent.add(el.target);
      }
    }
  };

  return (
    <>
      <RahkshiFraming />
      <Environment {...CITY_ENVIRONMENT_PROPS} />
      <EnvironmentIntensity value={0.01} />
      <ambientLight intensity={0.005} />
      <directionalLight
        ref={setMainLightRef}
        position={[3, CENTER_Y + 8, 10]}
        intensity={1.2}
        castShadow={effectiveShadows}
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
        position={[-3, CENTER_Y + 2, -2]}
        intensity={0.015}
      />
      {effectiveShadows && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[CYLINDER_RADIUS * 3, CYLINDER_RADIUS * 3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      )}
      <group ref={sceneRootRef}>
        <PresentationControls
          global
          snap={false}
          speed={2}
          zoom={1}
          polar={[0, 0]}
          config={{ friction: 26, mass: 0.5, tension: 170 }}
        >
          <Suspense fallback={null}>
            <RahkshiModel kraata={kraata} hasKraata={hasKraata} />
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
        {lightsForBloom.length > 0 && shouldEnableSelectiveBloom() ? (
          <StableSelectiveBloom
            selection={bloomMeshes}
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
