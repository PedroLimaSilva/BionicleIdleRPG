import { Suspense, useEffect, useRef } from 'react';
import { PresentationControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { DirectionalLight, Mesh, Object3D } from 'three';

import { useSettings } from '../../../context/useSettings';
import { SceneHdriEnvironment } from '../SceneHdriEnvironment';
import { CITY_ENVIRONMENT_PROPS } from '../utils/cityEnvironmentHdri';
import { shouldEnableShadows } from '../../../utils/testMode';
import { KraataPower } from '../../../types/Kraata';
import { CYLINDER_CENTER_Y, CYLINDER_HEIGHT, CYLINDER_RADIUS } from './BoundsCylinder';
import { RahkshiModel } from './Rahkshi';

const CENTER_Y = CYLINDER_CENTER_Y;

/** Moodier than the character sheet so Rahkshi glow still reads. Env stays a little above master's 0.01 so working IBL does not leave metals black. */
const SHEET_KEY_INTENSITY = 1.2;
const SHEET_FILL_INTENSITY = 0.015;
const SHEET_AMBIENT_INTENSITY = 0.005;
const SHEET_ENV_INTENSITY = 0.08;

function RahkshiFraming() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (camera.type !== 'OrthographicCamera') return;
    if (size.width <= 0 || size.height <= 0) return;
    camera.position.set(0, CENTER_Y, 100);
    camera.lookAt(0, CENTER_Y, 0);
    camera.near = 0.1;
    camera.far = 1000;
    camera.zoom = Math.min(size.width / (CYLINDER_RADIUS * 2), size.height / CYLINDER_HEIGHT);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, size]);
  return null;
}

export function RahkshiScene({ hasKraata, kraata }: { kraata: KraataPower; hasKraata: boolean }) {
  const sceneRootRef = useRef<Object3D>(null);
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
      el.target.position.set(0, CENTER_Y, 0);
      if (el.parent && !el.target.parent) {
        el.parent.add(el.target);
      }
    }
  };

  return (
    <>
      <RahkshiFraming />
      <SceneHdriEnvironment {...CITY_ENVIRONMENT_PROPS} intensity={SHEET_ENV_INTENSITY} />
      <ambientLight intensity={SHEET_AMBIENT_INTENSITY} />
      <directionalLight
        ref={setMainLightRef}
        position={[3, CENTER_Y + 8, 10]}
        intensity={SHEET_KEY_INTENSITY}
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
      <directionalLight position={[-3, CENTER_Y + 2, -2]} intensity={SHEET_FILL_INTENSITY} />
      {effectiveShadows && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[CYLINDER_RADIUS * 3, CYLINDER_RADIUS * 3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      )}
      <group ref={sceneRootRef}>
        <PresentationControls global snap={false} speed={2} zoom={1} polar={[0, 0]}>
          <Suspense fallback={null}>
            <RahkshiModel kraata={kraata} hasKraata={hasKraata} />
          </Suspense>
        </PresentationControls>
      </group>
    </>
  );
}
