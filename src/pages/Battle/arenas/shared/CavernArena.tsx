import * as THREE from 'three';
import { useMemo } from 'react';
import { ArenaSky } from './ArenaSky';

/**
 * Lighting mode for a cavern biome — the "time of day" axis. Any cavern palette
 * can be rendered either deep `underground` (dark, fogged, no sky) or in
 * `daylight` (open, brighter, overhead skylight). See issue #366.
 */
export type CavernLighting = 'underground' | 'daylight';

/** Default overhead skylight used by `daylight` caverns unless overridden. */
const DEFAULT_DAY_SKY = { color: '#bcd2ec', ground: '#33424f', intensity: 0.85 } as const;

/**
 * Palette for the cavern arena. Drives both the procedural scene
 * (`CavernArenaScene`) and atmosphere (`CavernAtmosphere`) so the same biome
 * can represent Mangaia (organic) or Metru Nui (technological), each in either
 * lighting mode — see issue #366.
 */
export interface CavernPalette {
  /** Lighting mode — supports both daytime and underground. Default `underground`. */
  lighting?: CavernLighting;
  /** Energy beam + its bloom glow. */
  beam: string;
  /** Ceiling veins / accent point lights. */
  glow: string;
  /** Central dome (the "Kini" backdrop prop). */
  dome: string;
  /** Whether the dome reads as metal (Metru) or stone-gold (Mangaia). */
  domeMetalness: number;
  /** Floor + wall base color. */
  stone: string;
  /** Inlaid floor border / cross lines. */
  floorAccent: string;
  /** Ambient/fill tint. */
  ambient: string;
  /** Ambient light intensity — the "time of day" knob. Default `0.18` (night). */
  ambientIntensity?: number;
  /**
   * Optional overhead daylight. When set, a hemisphere skylight + brighter key
   * give an open, daytime "biome" feel (used for Metru Nui).
   */
  skyLight?: { color: string; ground: string; intensity: number };
  /** Fog `[near, far]`. Default `[3.5, 16]` (claustrophobic cave). */
  fogRange?: [number, number];
  /** Beam/dome backdrop anchor `[x, y, z]`. Default top-left, pushed back. */
  anchor?: [number, number, number];
}

interface CavernSceneProps {
  palette: CavernPalette;
  receiveShadow: boolean;
}

/** Default backdrop position for the dome + beam: upper-left of frame, set back. */
const DEFAULT_ANCHOR: [number, number, number] = [-3.1, 0, -2.7];
const BEAM_TOP = 6.2;
const DOME_RADIUS = 0.62;

/** Additive, depth-light energy beam descending from the ceiling to the dome. */
function EnergyBeam({ anchor, color }: { color: string; anchor: [number, number, number] }) {
  const beamColor = useMemo(() => new THREE.Color(color), [color]);
  const beamHeight = BEAM_TOP - DOME_RADIUS * 0.6;
  const beamMidY = DOME_RADIUS * 0.6 + beamHeight / 2;
  return (
    <group position={anchor}>
      {/* Soft outer glow */}
      <mesh position={[0, beamMidY, 0]}>
        <cylinderGeometry args={[0.2, 0.34, beamHeight, 24, 1, true]} />
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
        <cylinderGeometry args={[0.07, 0.1, beamHeight, 20]} />
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
        <circleGeometry args={[0.55, 24]} />
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
function CeilingVeins({
  anchor,
  color,
  receiveShadow,
}: {
  color: string;
  anchor: [number, number, number];
  receiveShadow: boolean;
}) {
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
    <group position={[anchor[0], 5.9, anchor[2]]}>
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
 * Glowing radial floor segments fanning out from the Kini, echoing the Mangaia
 * reference's shrine floor. Rendered flat on the ground around the dome anchor.
 */
function KiniRadialSegments({
  accent,
  glow,
  receiveShadow,
}: {
  accent: string;
  glow: string;
  receiveShadow: boolean;
}) {
  const COUNT = 12;
  const INNER = DOME_RADIUS + 0.12;
  const OUTER = 2.3;
  const mid = (INNER + OUTER) / 2;
  const length = OUTER - INNER;
  const angles = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => (i / COUNT) * Math.PI * 2),
    []
  );
  return (
    <group position={[0, 0.014, 0]}>
      {angles.map((a, i) => (
        <group key={i} rotation-y={a}>
          <mesh position={[mid, 0, 0]} receiveShadow={receiveShadow}>
            <boxGeometry args={[length, 0.02, 0.07]} />
            <meshStandardMaterial
              color={accent}
              emissive={glow}
              emissiveIntensity={0.7}
              roughness={0.6}
            />
          </mesh>
        </group>
      ))}
      {/* Inner + outer rings tying the spokes together. */}
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[INNER - 0.04, INNER + 0.04, 48]} />
        <meshStandardMaterial
          color={accent}
          emissive={glow}
          emissiveIntensity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[OUTER - 0.05, OUTER + 0.03, 64]} />
        <meshStandardMaterial
          color={accent}
          emissive={glow}
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/**
 * Procedural underground arena: dark stone enclosure, an inlaid floor (the
 * combat stage), and — set back in the upper-left as a backdrop prop — a domed
 * shrine ("Kini") with a descending energy beam and glowing ceiling veins.
 */
export function CavernArenaScene({ palette, receiveShadow }: CavernSceneProps) {
  const anchor = palette.anchor ?? DEFAULT_ANCHOR;
  const isDay = (palette.lighting ?? 'underground') === 'daylight';
  // Sky/enclosure: blue dome in daylight, dark interior sphere underground.
  const skyTop = isDay
    ? '#6f9fd0'
    : new THREE.Color(palette.ambient).multiplyScalar(0.4).getStyle();
  const skyBottom = isDay
    ? new THREE.Color(palette.ambient).lerp(new THREE.Color('#dfe9f5'), 0.6).getStyle()
    : palette.ambient;
  return (
    <group name="CavernArenaDecor">
      {/* Floor slab */}
      <mesh position={[0, -0.06, 0]} receiveShadow={receiveShadow}>
        <boxGeometry args={[16, 0.12, 16]} />
        <meshStandardMaterial color={palette.stone} roughness={0.95} metalness={0.05} />
      </mesh>
      {/* Inlaid square platform (combat stage) */}
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
        <cylinderGeometry args={[9.5, 10.5, 8, 40, 1, true]} />
        <meshStandardMaterial
          color={palette.stone}
          roughness={1}
          metalness={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Sky / enclosure (backside sphere — the camera only sees the inside) */}
      <ArenaSky top={skyTop} bottom={skyBottom} radius={13} />

      {/* Backdrop dome ("Kini") */}
      <group position={anchor}>
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
          <ringGeometry args={[DOME_RADIUS, DOME_RADIUS + 0.2, 32]} />
          <meshStandardMaterial
            color={palette.dome}
            roughness={0.5}
            metalness={palette.domeMetalness}
            side={THREE.DoubleSide}
          />
        </mesh>
        <KiniRadialSegments
          accent={palette.floorAccent}
          glow={palette.glow}
          receiveShadow={receiveShadow}
        />
      </group>

      <EnergyBeam color={palette.beam} anchor={anchor} />
      <CeilingVeins color={palette.glow} anchor={anchor} receiveShadow={receiveShadow} />
    </group>
  );
}

interface CavernAtmosphereProps {
  palette: CavernPalette;
  castShadow: boolean;
}

/** Atmosphere for the cavern arena; brightness driven by the lighting mode + palette knobs. */
export function CavernAtmosphere({ castShadow, palette }: CavernAtmosphereProps) {
  const anchor = palette.anchor ?? DEFAULT_ANCHOR;
  const isDay = (palette.lighting ?? 'underground') === 'daylight';
  const skyLight = isDay
    ? (palette.skyLight ?? { ...DEFAULT_DAY_SKY, intensity: 1.25 })
    : undefined;
  const ambientIntensity = palette.ambientIntensity ?? (isDay ? 0.85 : 0.42);
  const [fogNear, fogFar] = palette.fogRange ?? (isDay ? [9, 34] : [5, 18]);
  const keyIntensity = isDay ? 1.15 : 1.0;
  const keyColor = isDay ? '#eaf1fb' : '#9fb0c8';
  // Daylight haze is a bright, airy tint; underground fades to the dark ambient.
  const fogColor = isDay
    ? new THREE.Color(palette.ambient).lerp(new THREE.Color('#dfe9f5'), 0.7).getStyle()
    : palette.ambient;

  return (
    <>
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
      <ambientLight color={isDay ? '#cdddf0' : palette.ambient} intensity={ambientIntensity} />
      {skyLight ? (
        <hemisphereLight args={[skyLight.color, skyLight.ground, skyLight.intensity]} />
      ) : (
        <hemisphereLight args={[palette.glow, '#050605', 0.25]} />
      )}
      {/* Glow from the backdrop beam */}
      <pointLight
        color={palette.beam}
        intensity={3}
        distance={9}
        position={[anchor[0], 3, anchor[2]]}
      />
      {/* Rim accents around the chamber */}
      <pointLight color={palette.glow} intensity={1.6} distance={10} position={[-4, 4.5, -2]} />
      <pointLight color={palette.glow} intensity={1.6} distance={10} position={[4, 4.5, -2]} />
      {/* Cool fill (no decay) so fighters stay readable when underground */}
      {!isDay && <directionalLight color={palette.glow} intensity={0.55} position={[-2, 4, 1.5]} />}
      {/* Soft bounce on the dome from below */}
      <pointLight
        color={palette.dome}
        intensity={1}
        distance={4}
        position={[anchor[0], 0.6, anchor[2]]}
      />
      {/* Front key / fill so fighters are readable (stronger in daylight) */}
      <directionalLight
        position={[0.6, 4, 3]}
        color={keyColor}
        intensity={keyIntensity}
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
