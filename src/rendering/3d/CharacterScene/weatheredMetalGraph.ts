import { MeshStandardMaterial, type Texture } from 'three';
import {
  faceDirection,
  float,
  hash,
  materialColor,
  materialMetalness,
  materialReference,
  materialRoughness,
  mix,
  normalView,
  positionLocal,
  positionView,
  vec2,
  vec3,
} from 'three/tsl';
import {
  bakedDiscolorationAmountFromMaterial,
  bakedDiscolorationColorFromMaterial,
  ensureBakeSampleSlot,
  isRenderableBakeMap,
  writeBakedDiscolorationUserData,
} from '../hooks/bakedDiscoloration';

type WeatheringGraphOpts = {
  color?: string;
  debugGrimeAsColor?: boolean;
  dentStrength?: number;
  discolorationMap?: Texture;
  fineScale?: number;
  grimeDarken?: number;
  grimeMetalnessReduce?: number;
  grimeRoughness?: number;
  largeScale?: number;
  metalness?: number;
};

const FINE_ROUGHNESS_VARIATION = 0.08;
const METAL_DENT_ATTENUATION = 0.88;
/**
 * PCG increment mixed into object-space lattice hashes via Three's `hash()`.
 * Same seed every run so bake-absent value-noise FBM is VR-stable (the old GLSL
 * `sin`/`fract` hash drifted across GPUs; MaterialX Perlin had no caller seed).
 */
export const WEATHERING_NOISE_SEED = 2891336453;
const LATTICE_BASIS = vec3(1, 57, 113);

/** Shader-graph vec3; Three's TSL types do not compose through custom helpers. */
type NoiseVec = {
  add: (v: unknown) => NoiseVec;
  dot: (v: unknown) => { add: (n: number) => never };
  floor: () => NoiseVec;
  fract: () => NoiseVec;
  mul: (v: unknown) => NoiseVec;
  sub: (v: unknown) => NoiseVec;
  x: never;
  y: never;
  z: never;
};

function asNoiseVec(value: unknown): NoiseVec {
  return value as NoiseVec;
}

const UD = {
  dentStrength: 'weatheringDentStrength',
  fineScale: 'weatheringFineScale',
  grimeDarken: 'weatheringGrimeDarken',
  grimeMetalnessReduce: 'weatheringGrimeMetalnessReduce',
  grimeRoughness: 'weatheringGrimeRoughness',
  largeScale: 'weatheringLargeScale',
} as const;

const grimeDarkenRef = materialReference(`userData.${UD.grimeDarken}`, 'float') as never;
const grimeRoughnessRef = materialReference(`userData.${UD.grimeRoughness}`, 'float') as never;
const grimeMetalnessReduceRef = materialReference(
  `userData.${UD.grimeMetalnessReduce}`,
  'float'
) as never;
const largeScaleRef = materialReference(`userData.${UD.largeScale}`, 'float') as never;
const fineScaleRef = materialReference(`userData.${UD.fineScale}`, 'float') as never;
const dentStrengthRef = materialReference(`userData.${UD.dentStrength}`, 'float') as never;

function seededLatticeHash(i: NoiseVec) {
  return hash(i.dot(LATTICE_BASIS).add(WEATHERING_NOISE_SEED));
}

/** Trilinear value noise hashed with {@link WEATHERING_NOISE_SEED}. */
function seededValueNoise(p: NoiseVec) {
  const i = p.floor();
  const f = p.fract();
  const u = asNoiseVec(f.mul(f).mul(asNoiseVec(float(3)).sub(f.mul(2))));
  const n000 = seededLatticeHash(i);
  const n100 = seededLatticeHash(i.add(vec3(1, 0, 0)));
  const n010 = seededLatticeHash(i.add(vec3(0, 1, 0)));
  const n110 = seededLatticeHash(i.add(vec3(1, 1, 0)));
  const n001 = seededLatticeHash(i.add(vec3(0, 0, 1)));
  const n101 = seededLatticeHash(i.add(vec3(1, 0, 1)));
  const n011 = seededLatticeHash(i.add(vec3(0, 1, 1)));
  const n111 = seededLatticeHash(i.add(vec3(1, 1, 1)));
  const nx00 = mix(n000, n100, u.x);
  const nx10 = mix(n010, n110, u.x);
  const nx01 = mix(n001, n101, u.x);
  const nx11 = mix(n011, n111, u.x);
  return mix(mix(nx00, nx10, u.y), mix(nx01, nx11, u.y), u.z);
}

function objectSpaceFbm(offset: number, scale: never) {
  const p = asNoiseVec(positionLocal.add(offset).mul(scale));
  const n1 = seededValueNoise(p);
  const n2 = seededValueNoise(p.mul(2));
  const n3 = seededValueNoise(p.mul(4));
  return n1.mul(0.5).add(n2.mul(0.25)).add(n3.mul(0.125));
}

function objectSpaceDentHeight(offset: number, scale: never) {
  const p = asNoiseVec(positionLocal.add(offset).mul(scale));
  const n1 = seededValueNoise(p);
  const n2 = seededValueNoise(p.mul(2));
  return n1.mul(0.7).add(n2.mul(0.3));
}

function perturbViewNormalFromHeight(
  height: ReturnType<typeof objectSpaceDentHeight>,
  bumpScale: never
) {
  const dHdxy = vec2(height.dFdx(), height.dFdy()).mul(bumpScale);
  const vSigmaX = positionView.dFdx().normalize();
  const vSigmaY = positionView.dFdy().normalize();
  const vN = normalView;
  const R1 = vSigmaY.cross(vN);
  const R2 = vN.cross(vSigmaX);
  const fDet = vSigmaX.dot(R1).mul(faceDirection);
  const vGrad = fDet.sign().mul(dHdxy.x.mul(R1).add(dHdxy.y.mul(R2)));
  return fDet.abs().mul(vN).sub(vGrad).normalize();
}

const largeCloud = objectSpaceFbm(50, largeScaleRef);
const fineGrain = objectSpaceFbm(80, fineScaleRef);
const grime = largeCloud.sub(0.35).mul(2).clamp(0, 1);

/**
 * Master multiplied `materialColor` (already map×color) by `texture(map)` again
 * whenever an albedo map was present. Keep that double-multiply via a map
 * materialReference so mapped kits match E2E goldens without capturing UUIDs.
 */
const albedoMapRef = materialReference('map', 'texture') as never;
const grimyUnmapped = materialColor.mul(grime.mul(grimeDarkenRef).oneMinus());
const grimyMapped = materialColor.mul(albedoMapRef).mul(grime.mul(grimeDarkenRef).oneMinus());
/** Opt-in debug: GLSL `diffuseColor.rgb = vec3(grime)`. Not used in TEST_MODE. */
const debugGrimeColor = vec3(grime);
const bakeColor = bakedDiscolorationColorFromMaterial() as never;
const bakeAmount = bakedDiscolorationAmountFromMaterial() as never;
const colorUnmappedWithBake = mix(grimyUnmapped, bakeColor, bakeAmount);
const colorMappedWithBake = mix(grimyMapped, bakeColor, bakeAmount);
const roughnessNode = materialRoughness
  .add(grime.mul(grimeRoughnessRef))
  .add(fineGrain.sub(0.5).mul(FINE_ROUGHNESS_VARIATION))
  .clamp(0.04, 1);
const metalnessNode = materialMetalness
  .mul(grime.mul(grimeMetalnessReduceRef).oneMinus())
  .clamp(0, 1);
const dentNormalNode = perturbViewNormalFromHeight(
  objectSpaceDentHeight(50, largeScaleRef),
  dentStrengthRef
);

export type WeatheredTslMaterial = MeshStandardMaterial & {
  colorNode?: unknown;
  metalnessNode?: unknown;
  normalNode?: unknown;
  roughnessNode?: unknown;
};

/** True only for the explicit debug overlay. E2E keeps character albedo. */
export function shouldVisualizeWeatheringGrime(opts: { debugGrimeAsColor?: boolean }): boolean {
  return !!opts.debugGrimeAsColor;
}

/** GPU pipeline identity: topology only. Color, grime, and texture instances are uniforms/bindings. */
export function weatheredProgramCacheKey(
  mat: MeshStandardMaterial,
  opts: { debugGrime?: boolean; dentStrength: number; hasDiscoloration: boolean }
): string {
  return [
    'WeatheredMetal',
    mat.map ? 'alb' : '',
    mat.normalMap ? 'nm' : '',
    mat.roughnessMap ? 'rgh' : '',
    mat.metalnessMap ? 'met' : '',
    opts.hasDiscoloration ? 'dc' : '',
    opts.dentStrength > 0 && !mat.normalMap ? 'dent' : '',
    opts.debugGrime ? 'dbg' : '',
  ].join('|');
}

export function writeWeatheringUserData(
  mat: MeshStandardMaterial,
  opts: WeatheringGraphOpts,
  defaults: {
    dentStrength: number;
    fineScale: number;
    grimeDarken: number;
    grimeMetalnessReduce: number;
    grimeRoughness: number;
    largeScale: number;
    metalness: number;
  }
): void {
  const metalness = opts.metalness ?? defaults.metalness;
  const dentStrength =
    (opts.dentStrength ?? defaults.dentStrength) *
    (1 - Math.min(1, Math.max(0, metalness)) * METAL_DENT_ATTENUATION);
  mat.userData[UD.grimeDarken] = opts.grimeDarken ?? defaults.grimeDarken;
  mat.userData[UD.grimeRoughness] = opts.grimeRoughness ?? defaults.grimeRoughness;
  mat.userData[UD.grimeMetalnessReduce] =
    opts.grimeMetalnessReduce ?? defaults.grimeMetalnessReduce;
  mat.userData[UD.largeScale] = opts.largeScale ?? defaults.largeScale;
  mat.userData[UD.fineScale] = opts.fineScale ?? defaults.fineScale;
  mat.userData[UD.dentStrength] = dentStrength;
}

export function applySharedWeatheringGraph(
  mat: WeatheredTslMaterial,
  opts: WeatheringGraphOpts,
  defaults: {
    dentStrength: number;
    fineScale: number;
    grimeDarken: number;
    grimeMetalnessReduce: number;
    grimeRoughness: number;
    largeScale: number;
    metalness: number;
  }
): void {
  writeWeatheringUserData(mat, opts, defaults);
  const discolorMap = opts.discolorationMap ?? null;
  writeBakedDiscolorationUserData(mat, discolorMap, opts.color ?? '#ffffff');
  const grimeDarken = opts.grimeDarken ?? defaults.grimeDarken;
  const metalness = opts.metalness ?? defaults.metalness;
  const dentStrength =
    (opts.dentStrength ?? defaults.dentStrength) *
    (1 - Math.min(1, Math.max(0, metalness)) * METAL_DENT_ATTENUATION);
  const hasDiscoloration = isRenderableBakeMap(discolorMap);
  const hasAlbedoMap = !!mat.map;
  const visualizeGrime = shouldVisualizeWeatheringGrime({
    debugGrimeAsColor: opts.debugGrimeAsColor,
  });
  const needsColorNode = grimeDarken > 0 || hasAlbedoMap || hasDiscoloration || visualizeGrime;

  if (needsColorNode) {
    if (visualizeGrime) {
      mat.colorNode = debugGrimeColor;
    } else if (hasDiscoloration) {
      ensureBakeSampleSlot(mat);
      mat.colorNode = hasAlbedoMap ? colorMappedWithBake : colorUnmappedWithBake;
    } else {
      mat.colorNode = hasAlbedoMap ? grimyMapped : grimyUnmapped;
    }
  }
  if (!mat.roughnessMap) {
    mat.roughnessNode = roughnessNode;
  }
  if (!mat.metalnessMap) {
    mat.metalnessNode = metalnessNode;
  }
  if (dentStrength > 0 && !mat.normalMap) {
    mat.normalNode = dentNormalNode;
  }
  mat.customProgramCacheKey = () =>
    weatheredProgramCacheKey(mat, {
      debugGrime: visualizeGrime,
      dentStrength,
      hasDiscoloration,
    });
}
