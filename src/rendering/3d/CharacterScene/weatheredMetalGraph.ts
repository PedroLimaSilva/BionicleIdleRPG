import { MeshStandardMaterial, type Texture } from 'three';
import {
  faceDirection,
  materialColor,
  materialMetalness,
  materialReference,
  materialRoughness,
  mix,
  mx_noise_float,
  normalView,
  positionLocal,
  positionView,
  vec2,
} from 'three/tsl';
import {
  bakedDiscolorationAmountFromMaterial,
  bakedDiscolorationColorFromMaterial,
  writeBakedDiscolorationUserData,
} from '../hooks/bakedDiscoloration';
import { isDummyDiscolorationMap } from '../hooks/dummyTextures';

type WeatheringGraphOpts = {
  color?: string;
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

function objectSpaceFbm(offset: number, scale: never) {
  const p = positionLocal.add(offset).mul(scale);
  const n1 = mx_noise_float(p, 0.5, 0.5);
  const n2 = mx_noise_float(p.mul(2), 0.5, 0.5);
  const n3 = mx_noise_float(p.mul(4), 0.5, 0.5);
  return n1.mul(0.5).add(n2.mul(0.25)).add(n3.mul(0.125));
}

function objectSpaceDentHeight(offset: number, scale: never) {
  const p = positionLocal.add(offset).mul(scale);
  const n1 = mx_noise_float(p, 0.5, 0.5);
  const n2 = mx_noise_float(p.mul(2), 0.5, 0.5);
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

const grimyAlbedo = materialColor.mul(grime.mul(grimeDarkenRef).oneMinus());
const colorWithBake = mix(
  grimyAlbedo,
  bakedDiscolorationColorFromMaterial() as never,
  bakedDiscolorationAmountFromMaterial() as never
);
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

/** GPU pipeline identity: topology only. Color, grime, and texture instances are uniforms/bindings. */
export function weatheredProgramCacheKey(
  mat: MeshStandardMaterial,
  opts: { dentStrength: number; hasDiscoloration: boolean }
): string {
  return [
    'WeatheredMetal',
    mat.map ? 'alb' : '',
    mat.normalMap ? 'nm' : '',
    mat.roughnessMap ? 'rgh' : '',
    mat.metalnessMap ? 'met' : '',
    opts.hasDiscoloration ? 'dc' : '',
    opts.dentStrength > 0 && !mat.normalMap ? 'dent' : '',
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
  const hasDiscoloration = !!discolorMap && !isDummyDiscolorationMap(discolorMap);
  const needsColorNode = grimeDarken > 0 || !!mat.map || hasDiscoloration;

  if (needsColorNode) {
    mat.colorNode = colorWithBake;
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
    weatheredProgramCacheKey(mat, { dentStrength, hasDiscoloration });
}
