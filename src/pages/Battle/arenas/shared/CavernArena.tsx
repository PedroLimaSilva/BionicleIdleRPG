import * as THREE from 'three';
import { useMemo } from 'react';

/**
 * Palette for the underground cavern arena. Drives both the procedural scene
 * (`CavernArenaScene`) and atmosphere (`CavernAtmosphere`) so the same biome
 * can represent Mangaia (green, organic) or Metru Nui (cyan, technological) —
 * see issue #366.
 */
export interface CavernPalette {
  /** Energy beam + its bloom glow. */
  beam: string;
  /** Ceiling veins / accent point lights. */
  glow: string;
  /** Central dome. */
  dome: string;
  /** Whether the dome reads as metal (Metru) or stone-gold (Mangaia). */
  domeMetalness: number;
  /** Floor + wall base color. */
  stone: string;
  /** Inlaid floor border / cross lines. */
  floorAccent: string;
  /** Ambient/fill tint. */
  ambient: string;
}

interface CavernSceneProps {
  palette: CavernPalette;
  receiveShadow: boolean;
}

const BEAM_CENTER: [number, number, number] = [0, 0, -0.55];
const BEAM_TOP = 5.2;
const DOME_RADIUS = 0.55;

/** Additive, depth-light energy beam descending from the ceiling to the dome. */
function EnergyBeam({ color }: { color: string }) {
  const beamColor = useMemo(() => new THREE.Color(color), [color]);
  const beamHeight = BEAM_TOP - DOME_RADIUS * 0.6;
  const beamMidY = DOME_RADIUS * 0.6 + beamHeight / 2;
  return (
    <group position={BEAM_CENTER}>
      {/* Soft outer glow */}
      <mesh position={[0, beamMidY, 0]}>
        <cylinderGeometry args={[0.18, 0.3, beamHeight, 24, 1, true]} />
        <meshBasicMaterial
          color={beamColor}
          transparent
          opacity={0.13}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Bright solid core */}
      <mesh position={[0, beamMidY, 0]}>
        <cylinderGeometry args={[0.06, 0.09, beamHeight, 20]} />
        <meshBasicMaterial
          color={'#ffffff'}
          transparent
          opacity={0.92}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Pool of light where the beam meets the dome */}
      <mesh position={[0, DOME_RADIUS * 0.62, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.5, 24]} />
        <meshBasicMaterial
          color={beamColor}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight color={beamColor} intensity={6} distance={6} position={[0, 1.2, 0]} />
    </group>
  );
}

/** Glowing ceiling veins approximating the organic webbing of the reference. */
function CeilingVeins({ color, receiveShadow }: { color: string; receiveShadow: boolean }) {
  const veinColor = useMemo(() => new THREE.Color(color), [color]);
  const veins = useMemo(() => {
    const count = 7;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        key: i,
        radius: 1.6 + (i % 3) * 0.5,
        rotationY: angle,
        thickness: 0.05 + ((i * 7) % 3) * 0.015,
      };
    });
  }, []);
  return (
    <group position={[0, 5.6, BEAM_CENTER[2]]}>
      {veins.map((v) => (
        <mesh
          key={v.key}
          rotation={[0, v.rotationY, Math.PI / 2.4]}
          position={[
            Math.cos(v.rotationY) * v.radius * 0.5,
            0,
            Math.sin(v.rotationY) * v.radius * 0.5,
          ]}
          castShadow={false}
          receiveShadow={receiveShadow}
        >
          <torusGeometry args={[v.radius, v.thickness, 6, 16, Math.PI * 0.9]} />
          <meshStandardMaterial
            color={veinColor}
            emissive={veinColor}
            emissiveIntensity={1.4}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Procedural underground arena: dark stone enclosure, an inlaid floor, a central
 * dome, a descending energy beam, and glowing ceiling veins.
 */
export function CavernArenaScene({ palette, receiveShadow }: CavernSceneProps) {
  return (
    <group name="CavernArenaDecor">
      {/* Floor slab */}
      <mesh position={[0, -0.06, 0]} receiveShadow={receiveShadow}>
        <boxGeometry args={[14, 0.12, 14]} />
        <meshStandardMaterial color={palette.stone} roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Inlaid square platform */}
      <mesh position={[0, 0.001, 0]} rotation-x={-Math.PI / 2} receiveShadow={receiveShadow}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshStandardMaterial color={palette.floorAccent} roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation-x={-Math.PI / 2} receiveShadow={receiveShadow}>
        <planeGeometry args={[3.7, 3.7]} />
        <meshStandardMaterial color={palette.stone} roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Cavern wall shell (open-topped cylinder, viewed from inside) */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[8.5, 9.5, 8, 40, 1, true]} />
        <meshStandardMaterial
          color={palette.stone}
          roughness={1}
          metalness={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Ceiling dome cap */}
      <mesh position={[0, 6.4, 0]}>
        <sphereGeometry args={[9.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={'#0d0f0c'} roughness={1} metalness={0} side={THREE.BackSide} />
      </mesh>

      {/* Central dome */}
      <group position={BEAM_CENTER}>
        <mesh position={[0, 0, 0]} castShadow={receiveShadow} receiveShadow={receiveShadow}>
          <sphereGeometry args={[DOME_RADIUS, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={palette.dome}
            roughness={0.35}
            metalness={palette.domeMetalness}
            emissive={new THREE.Color(palette.beam)}
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* Dome base ring */}
        <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2} receiveShadow={receiveShadow}>
          <ringGeometry args={[DOME_RADIUS, DOME_RADIUS + 0.18, 32]} />
          <meshStandardMaterial
            color={palette.dome}
            roughness={0.5}
            metalness={palette.domeMetalness}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <EnergyBeam color={palette.beam} />
      <CeilingVeins color={palette.glow} receiveShadow={receiveShadow} />
    </group>
  );
}

interface CavernAtmosphereProps {
  palette: CavernPalette;
  castShadow: boolean;
}

/** Dark, moody atmosphere for the underground cavern arena. */
export function CavernAtmosphere({ castShadow, palette }: CavernAtmosphereProps) {
  return (
    <>
      <fog attach="fog" args={[palette.ambient, 3.5, 16]} />
      <ambientLight color={palette.ambient} intensity={0.18} />
      <hemisphereLight args={[palette.glow, '#050605', 0.25]} />
      {/* Key glow from the beam direction */}
      <pointLight color={palette.beam} intensity={3} distance={9} position={[0, 3, -0.55]} />
      {/* Rim accents around the chamber */}
      <pointLight color={palette.glow} intensity={1.6} distance={10} position={[-4, 4.5, -2]} />
      <pointLight color={palette.glow} intensity={1.6} distance={10} position={[4, 4.5, -2]} />
      {/* Soft warm bounce on the dome from below */}
      <pointLight color={palette.dome} intensity={1} distance={4} position={[0, 0.6, -0.55]} />
      {/* Subtle front fill so fighters are readable */}
      <directionalLight
        position={[0.6, 3, 3]}
        color={'#9fb0c8'}
        intensity={0.5}
        castShadow={castShadow}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
        shadow-normalBias={0.005}
      />
    </>
  );
}
