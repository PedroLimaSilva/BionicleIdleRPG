import { Environment, useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { DESERT_ENVIRONMENT_PROPS } from '../../utils/desertEnvironmentHdri';
import { ARENA_CENTER } from './arenaLayout';
import { prepareArenaGlbScene } from './arenaGlbUtils';

const ARENA_GLB_URL = import.meta.env.BASE_URL + '/arena_blockout.glb';

/** Warm sandstone palette for Po-Wahi desert lighting and fog. */
const COLORS = {
  fog: '#e8c992',
  sandDark: '#a8844f',
  skyFill: '#c8dff5',
  sun: '#fff0d4',
} as const;

function EnvironmentIntensity({ value }: { value: number }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scene as any).environmentIntensity = value;
  }, [scene, value]);
  return null;
}

/** HDRI is used for IBL only — keep scene.background null so no visible skybox. */
function ArenaNoSkybox() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const previousBackground = scene.background;
    scene.background = null;
    return () => {
      scene.background = previousBackground;
    };
  }, [scene]);
  return null;
}

function ArenaFog() {
  return <fog attach="fog" args={[COLORS.fog, 2.5, 9]} />;
}

interface ArenaLightingProps {
  castShadow: boolean;
}

function ArenaDesertLighting({ castShadow }: ArenaLightingProps) {
  return (
    <>
      <ambientLight color="#f5e6c8" intensity={0.35} />
      <hemisphereLight args={[COLORS.sun, COLORS.sandDark, 0.45]} />
      <directionalLight
        ref={(el) => {
          if (el && el.parent && !el.target.parent) {
            el.target.position.set(...ARENA_CENTER);
            el.parent.add(el.target);
          }
        }}
        position={[2.8, 4.5, 2.2]}
        color={COLORS.sun}
        intensity={1.45}
        castShadow={castShadow}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={15}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0005}
        shadow-normalBias={0.005}
      />
      <directionalLight position={[-2.5, 2.5, -1.5]} color={COLORS.skyFill} intensity={0.2} />
    </>
  );
}

interface ArenaGlbSceneProps {
  receiveShadow: boolean;
}

function ArenaGlbScene({ receiveShadow }: ArenaGlbSceneProps) {
  const { scene } = useGLTF(ARENA_GLB_URL);
  const arena = useMemo(
    () => prepareArenaGlbScene(scene, { receiveShadow }),
    [receiveShadow, scene]
  );

  return <primitive object={arena} />;
}

interface ArenaEnvironmentProps {
  receiveShadow: boolean;
}

/**
 * Desert arena — loads `public/arena_blockout.glb` (ground, rocks, walls from Blender).
 * Layout markers left in the export are hidden at runtime.
 */
export function ArenaEnvironment({ receiveShadow }: ArenaEnvironmentProps) {
  return (
    <>
      <ArenaFog />
      <Environment {...DESERT_ENVIRONMENT_PROPS} />
      <EnvironmentIntensity value={0.55} />
      <ArenaNoSkybox />
      <ArenaDesertLighting castShadow={receiveShadow} />
      <group name="ArenaEnvironment">
        <ArenaGlbScene receiveShadow={receiveShadow} />
      </group>
    </>
  );
}

useGLTF.preload(ARENA_GLB_URL);

export {
  ARENA_BOX_SIZE,
  ARENA_CENTER,
  ARENA_MARGIN,
  ENEMY_POSITIONS,
  TEAM_POSITIONS,
} from './arenaLayout';
