import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import {
  ARENA_CENTER,
  ARENA_DIAMETER,
  ARENA_GLB_PLACEHOLDER_DIAMETER,
  ARENA_RADIUS,
  ARENA_RIM_ROCKS,
  ENEMY_POSITIONS,
  TEAM_POSITIONS,
  USE_ARENA_GLB_GROUND,
} from './arenaLayout';

const ARENA_GLB_URL = import.meta.env.BASE_URL + '/arena.glb';

/** Ground-focused palette — background fill is intentionally omitted for now. */
const COLORS = {
  rock: '#8b7355',
  sand: '#c9a66b',
  sandDark: '#a8844f',
  sun: '#fff0d4',
} as const;

/** No skybox, HDRI, fog, or backdrop meshes — keeps the void behind the stage neutral. */
function ArenaClearBackground() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const previousBackground = scene.background;
    const previousEnvironment = scene.environment;
    const previousFog = scene.fog;

    scene.background = null;
    scene.environment = null;
    scene.fog = null;

    return () => {
      scene.background = previousBackground;
      scene.environment = previousEnvironment;
      scene.fog = previousFog;
    };
  }, [scene]);
  return null;
}

interface ArenaLightingProps {
  castShadow: boolean;
}

function ArenaLighting({ castShadow }: ArenaLightingProps) {
  return (
    <>
      <ambientLight color="#e8e4dc" intensity={0.45} />
      <hemisphereLight args={['#f5f0e8', COLORS.sandDark, 0.35]} />
      <directionalLight
        ref={(el) => {
          if (el && el.parent && !el.target.parent) {
            el.target.position.set(...ARENA_CENTER);
            el.parent.add(el.target);
          }
        }}
        position={[2.8, 4.5, 2.2]}
        color={COLORS.sun}
        intensity={1.35}
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
      <directionalLight position={[-2.5, 2.5, -1.5]} color="#d8e8f8" intensity={0.15} />
    </>
  );
}

interface ShadowSurfaceProps {
  receiveShadow: boolean;
}

function ArenaBlockoutGround({ receiveShadow }: ShadowSurfaceProps) {
  return (
    <mesh
      name="ArenaBlockoutGround"
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.002, 0]}
      receiveShadow={receiveShadow}
    >
      <circleGeometry args={[ARENA_RADIUS, 72]} />
      <meshStandardMaterial color={COLORS.sand} metalness={0.02} roughness={0.92} />
    </mesh>
  );
}

function ArenaGlbGround({ receiveShadow }: ShadowSurfaceProps) {
  const { scene } = useGLTF(ARENA_GLB_URL);
  const ground = useMemo(() => {
    const mesh = scene.getObjectByName('Ground');
    if (!mesh) return null;
    const clone = mesh.clone(true);
    const scale = ARENA_DIAMETER / ARENA_GLB_PLACEHOLDER_DIAMETER;
    clone.scale.set(scale, 1, scale);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const m = child as THREE.Mesh;
        m.receiveShadow = receiveShadow;
        m.castShadow = false;
      }
    });
    return clone;
  }, [receiveShadow, scene]);

  if (!ground) return null;
  return <primitive object={ground} />;
}

function ArenaGround({ receiveShadow }: ShadowSurfaceProps) {
  return USE_ARENA_GLB_GROUND ? (
    <ArenaGlbGround receiveShadow={receiveShadow} />
  ) : (
    <ArenaBlockoutGround receiveShadow={receiveShadow} />
  );
}

function ArenaRimRocks() {
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.rock,
        flatShading: true,
        metalness: 0,
        roughness: 0.95,
      }),
    []
  );

  return (
    <group name="ArenaRimRocks">
      {ARENA_RIM_ROCKS.map((rock, index) => (
        <mesh
          key={`rock-${index}`}
          name={`RimRock${index}`}
          geometry={geometry}
          material={material}
          position={rock.position}
          rotation={rock.rotation}
          scale={rock.scale}
          castShadow={false}
          receiveShadow={false}
        />
      ))}
    </group>
  );
}

/** Dev-only markers showing combat slots and the playable boundary ring. */
function ArenaLayoutGuides() {
  const boundaryMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#f5d742',
        depthWrite: false,
        opacity: 0.85,
        transparent: true,
      }),
    []
  );

  const teamMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#4ac878' }), []);
  const enemyMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#e85c4a' }), []);
  const centerMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff' }), []);

  if (!import.meta.env.DEV) return null;

  return (
    <group name="ArenaLayoutGuides" renderOrder={10}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} material={boundaryMaterial}>
        <ringGeometry args={[ARENA_RADIUS - 0.02, ARENA_RADIUS, 64]} />
      </mesh>

      <mesh position={[0, 0.04, 0]} material={centerMaterial}>
        <sphereGeometry args={[0.03, 8, 8]} />
      </mesh>

      {TEAM_POSITIONS.map((position, index) => (
        <mesh
          key={`team-guide-${index}`}
          name={`TeamSlotGuide${index}`}
          position={[position[0], 0.05, position[2]]}
          material={teamMaterial}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
        </mesh>
      ))}

      {ENEMY_POSITIONS.map((position, index) => (
        <mesh
          key={`enemy-guide-${index}`}
          name={`EnemySlotGuide${index}`}
          position={[position[0], 0.05, position[2]]}
          material={enemyMaterial}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
        </mesh>
      ))}
    </group>
  );
}

interface ArenaEnvironmentProps {
  receiveShadow: boolean;
}

/**
 * Arena stage — ground mesh, rim rocks, and neutral lighting only.
 * Background (skybox, canyon walls, fog) is intentionally blank until art is ready.
 */
export function ArenaEnvironment({ receiveShadow }: ArenaEnvironmentProps) {
  return (
    <>
      <ArenaClearBackground />
      <ArenaLighting castShadow={receiveShadow} />
      <group name="ArenaEnvironment">
        <ArenaGround receiveShadow={receiveShadow} />
        <ArenaRimRocks />
        <ArenaLayoutGuides />
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
