/**
 * Worn plastic material: ShaderMaterial with object-space FBM (roughness + bump)
 * and subtle edge wear. Preserves base color; no onBeforeCompile.
 *
 * WebGPU: For a WebGPU/TSL migration, same ideas apply—object-space FBM and
 * fresnel-based edge blend. R3F supports WebGPU via async gl with WebGPURenderer.
 */

import {
  Color,
  ColorRepresentation,
  DataTexture,
  DoubleSide,
  LinearFilter,
  Mesh,
  Object3D,
  RepeatWrapping,
  ShaderMaterial,
  Vector3,
} from 'three';

export type WornPlasticOptions = {
  color?: ColorRepresentation;
  roughness?: number;
  metalness?: number;
  roughnessNoise?: number;
  /** Lighter wear on sharp edges (0–1). Kept subtle to avoid washing out. */
  edgeWear?: number;
  bumpStrength?: number;
  noiseScale?: number;
  /** Override light direction (world space). Default matches scene key light. */
  lightDirection?: Vector3;
  lightColor?: ColorRepresentation;
  ambient?: number;
  /** UV scale for noise map: lower = bigger patches (e.g. 0.3–0.5). */
  noiseScaleUV?: number;
};

const NOISE_SIZE = 128;

function createTileableNoiseTexture(): DataTexture {
  const size = NOISE_SIZE;
  const grid: number[] = [];
  for (let i = 0; i < size * size; i++) grid.push(Math.random());
  const sample = (ix: number, iy: number) => grid[(iy % size) * size + (ix % size)];
  const data = new Uint8Array(size * size * 4);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      const x = i + 0.5;
      const y = j + 0.5;
      const i0 = Math.floor(x) % size;
      const i1 = (i0 + 1) % size;
      const j0 = Math.floor(y) % size;
      const j1 = (j0 + 1) % size;
      const fx = x - Math.floor(x);
      const fy = y - Math.floor(y);
      const v =
        (1 - fx) * (1 - fy) * sample(i0, j0) +
        fx * (1 - fy) * sample(i1, j0) +
        (1 - fx) * fy * sample(i0, j1) +
        fx * fy * sample(i1, j1);
      const idx = (j * size + i) * 4;
      const byte = Math.floor(v * 255);
      data[idx] = data[idx + 1] = data[idx + 2] = byte;
      data[idx + 3] = 255;
    }
  }
  const tex = new DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.minFilter = tex.magFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

let sharedNoiseMap: DataTexture | null = null;

function getNoiseMap(): DataTexture {
  if (!sharedNoiseMap) sharedNoiseMap = createTileableNoiseTexture();
  return sharedNoiseMap;
}

const WORN_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec3 vObjectPosition;
  varying vec2 vUv;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vObjectPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPos.xyz;
    vUv = uv;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const WORN_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uRoughness;
  uniform float uMetalness;
  uniform float uRoughnessNoise;
  uniform float uEdgeWear;
  uniform float uBumpStrength;
  uniform float uNoiseScale;
  uniform float uNoiseScaleUV;
  uniform sampler2D uNoiseMap;
  uniform vec3 uLightDirection;
  uniform vec3 uLightColor;
  uniform vec3 uLightDirection2;
  uniform vec3 uLightColor2;
  uniform float uAmbient;
  uniform vec3 uEmissive;
  uniform float uEmissiveIntensity;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec3 vObjectPosition;
  varying vec2 vUv;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }
  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0, a = 0.5, f = 1.0;
    for (int i = 0; i < 3; i++) {
      v += a * noise3(p * f);
      a *= 0.5;
      f *= 2.0;
    }
    return v;
  }

  void main() {
    float faceDirection = gl_FrontFacing ? 1.0 : -1.0;
    vec3 normal = normalize(vNormal) * faceDirection;

    bool useUVs = length(vUv) > 0.001;
    vec2 noiseUV = useUVs ? vUv * uNoiseScaleUV : fract(vObjectPosition.xy * 0.05) * uNoiseScaleUV;
    float patchNoise = texture2D(uNoiseMap, noiseUV).r;
    float microNoise = fbm(vObjectPosition * uNoiseScale * 0.5 + 50.0);
    float bumpHeight = uBumpStrength * (patchNoise + 0.15 * (microNoise - 0.5));
    vec2 dHdxy = vec2(dFdx(bumpHeight), dFdy(bumpHeight));
    vec3 surf_pos = -vViewPosition;
    vec3 vSigmaX = normalize(dFdx(surf_pos));
    vec3 vSigmaY = normalize(dFdy(surf_pos));
    float fDet = dot(vSigmaX, cross(vSigmaY, normal)) * faceDirection;
    vec3 vGrad = sign(fDet) * (dHdxy.x * cross(vSigmaY, normal) + dHdxy.y * cross(normal, vSigmaX));
    normal = normalize(abs(fDet) * normal - vGrad);

    float marks = fbm(vObjectPosition * uNoiseScale * 0.7 + 80.0);
    float roughnessNoiseAmount = 1.0 - uMetalness;
    float roughness = clamp(
      uRoughness + roughnessNoiseAmount * ((patchNoise - 0.5) * uRoughnessNoise + (marks - 0.5) * 0.03),
      0.04, 1.0
    );

    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float NdotV = max(dot(normal, viewDir), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.0);
    vec3 baseColor = uColor;
    float lum = dot(baseColor, vec3(0.299, 0.587, 0.114));
    float edgeMix = mix(0.5, 0.75, 1.0 - lum);
    vec3 edgeTint = mix(baseColor, vec3(1.0), edgeMix);
    baseColor = mix(baseColor, edgeTint, fresnel * uEdgeWear);

    vec3 lightDir1World = normalize(uLightDirection);
    vec3 lightDir2World = normalize(uLightDirection2);
    vec3 lightDir1 = normalize((viewMatrix * vec4(lightDir1World, 0.0)).xyz);
    vec3 lightDir2 = normalize((viewMatrix * vec4(lightDir2World, 0.0)).xyz);
    float NdotL1 = max(dot(normal, lightDir1), 0.0);
    float NdotL2 = max(dot(normal, lightDir2), 0.0);
    vec3 diffuse = baseColor * (uAmbient + uLightColor * NdotL1 + uLightColor2 * NdotL2);
    diffuse *= 1.0 - uMetalness;
    vec3 metalFill = baseColor * (uAmbient * 0.6 + uLightColor * NdotL1 + uLightColor2 * NdotL2);
    diffuse += metalFill * uMetalness;

    vec3 viewDirView = -normalize(vViewPosition);
    vec3 half1 = normalize(lightDir1 + viewDirView);
    vec3 half2 = normalize(lightDir2 + viewDirView);
    float spec1 = pow(max(dot(normal, half1), 0.0), 1.0 + (1.0 - roughness) * 64.0);
    float spec2 = pow(max(dot(normal, half2), 0.0), 1.0 + (1.0 - roughness) * 64.0);
    float spec = spec1 + spec2 * 0.5;
    vec3 specColor = mix(vec3(0.04), baseColor, uMetalness);
    float specStrength = 1.0 + uMetalness * 3.0;
    diffuse += specColor * spec * (uLightColor + uLightColor2 * 0.5) * specStrength;
    diffuse += uEmissive * uEmissiveIntensity;

    gl_FragColor = vec4(diffuse, uOpacity);
  }
`;

const DEFAULT_LIGHT_DIR = new Vector3(3, 5, 2).normalize();
const DEFAULT_LIGHT_DIR2 = new Vector3(-3, 2, -2).normalize();

function makeWornUniforms(
  color: ColorRepresentation,
  opts: WornPlasticOptions
): Record<string, { value: unknown }> {
  const c = new Color(color);
  return {
    uColor: { value: c },
    uRoughness: { value: opts.roughness ?? 0.55 },
    uMetalness: { value: opts.metalness ?? 0.05 },
    uRoughnessNoise: { value: opts.roughnessNoise ?? 0.14 },
    uEdgeWear: { value: opts.edgeWear ?? 0.5 },
    uBumpStrength: { value: opts.bumpStrength ?? 0.1 },
    uNoiseScale: { value: opts.noiseScale ?? 14.0 },
    uNoiseScaleUV: { value: opts.noiseScaleUV ?? 0.1 },
    uNoiseMap: { value: getNoiseMap() },
    uLightDirection: {
      value: (opts.lightDirection ?? DEFAULT_LIGHT_DIR).clone(),
    },
    uLightColor: {
      value: new Color(opts.lightColor ?? '#ffffff').multiplyScalar(1.5),
    },
    uLightDirection2: { value: DEFAULT_LIGHT_DIR2.clone() },
    uLightColor2: { value: new Color('#ffffff').multiplyScalar(0.6) },
    uAmbient: { value: opts.ambient ?? 0.6 },
    uEmissive: { value: new Color(0, 0, 0) },
    uEmissiveIntensity: { value: 0 },
    uOpacity: { value: 1 },
  };
}

export type WornPlasticShaderMaterial = ShaderMaterial & {
  uniforms: ReturnType<typeof makeWornUniforms>;
};

export function createWornPlasticMaterial(opts: WornPlasticOptions = {}) {
  const color = opts.color ?? '#ffffff';
  const material = new ShaderMaterial({
    vertexShader: WORN_VERTEX,
    fragmentShader: WORN_FRAGMENT,
    uniforms: makeWornUniforms(color, opts),
    side: DoubleSide,
    lights: false,
  }) as WornPlasticShaderMaterial;
  material.extensions.derivatives = true;
  return material;
}

const materialCache = new Map<string, WornPlasticShaderMaterial>();

/**
 * Returns a shared worn plastic shader material for the given color.
 * Do not mutate the returned material; clone it for variants (e.g. emissive, transparent).
 */
export function getWornMaterial(color: ColorRepresentation): WornPlasticShaderMaterial {
  const key = new Color(color).getStyle();
  if (!materialCache.has(key)) {
    materialCache.set(key, createWornPlasticMaterial({ color }) as WornPlasticShaderMaterial);
  }
  return materialCache.get(key)!;
}

/**
 * Copy transparency, opacity, emissive and metalness from an original
 * MeshStandardMaterial onto a worn shader material by cloning and updating
 * uniforms when needed.
 */
function copySpecialProperties(
  worn: WornPlasticShaderMaterial,
  original: MeshLike
): WornPlasticShaderMaterial {
  const needsTransparent = original.transparent === true;
  const emissiveIntensity = (original as { emissiveIntensity?: number }).emissiveIntensity ?? 0;
  const needsEmissive = 'emissiveIntensity' in original && emissiveIntensity > 0;
  const originalMetalness = (original as { metalness?: number }).metalness ?? 0;
  const hasMetalnessMap =
    'metalnessMap' in original && !!(original as { metalnessMap?: unknown }).metalnessMap;
  const needsMetalness = originalMetalness > 0 || hasMetalnessMap;
  if (!needsTransparent && !needsEmissive && !needsMetalness) return worn;
  const cloned = worn.clone() as WornPlasticShaderMaterial;
  if (needsTransparent && 'opacity' in original && original.opacity !== undefined) {
    cloned.transparent = true;
    cloned.opacity = original.opacity;
    if (cloned.uniforms.uOpacity) cloned.uniforms.uOpacity.value = original.opacity;
  }
  if (needsEmissive && 'emissive' in original && original.emissive && cloned.uniforms.uEmissive) {
    cloned.uniforms.uEmissive.value.copy(original.emissive as Color);
    cloned.uniforms.uEmissiveIntensity.value = emissiveIntensity;
  }
  if (needsMetalness && cloned.uniforms.uMetalness) {
    cloned.uniforms.uMetalness.value = 1;
    cloned.uniforms.uRoughness.value = 0;
    cloned.uniforms.uRoughnessNoise.value = 0;
  }
  return cloned;
}

type MeshLike = {
  transparent?: boolean;
  opacity?: number;
  color?: Color | { getStyle(): string };
  emissive?: Color;
  emissiveIntensity?: number;
  metalness?: number;
};

/**
 * Traverses the object and replaces every mesh's material with a cached
 * worn plastic shader material keyed by the original material's color.
 * Call with the root group (e.g. group.current) so all children are covered.
 */
export function applyWornPlasticToObject(object: Object3D | null | undefined): void {
  if (!object) return;
  object.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const raw = mesh.material;
    if (!raw) return;
    if (
      (raw as ShaderMaterial).isShaderMaterial &&
      (raw as WornPlasticShaderMaterial).uniforms?.uColor
    )
      return;
    const original = raw as MeshLike;
    const color = original.color;
    if (!color) return;
    const colorStyle =
      color instanceof Color
        ? color.getStyle()
        : new Color(color as ColorRepresentation).getStyle();
    let worn = getWornMaterial(colorStyle as ColorRepresentation);
    worn = copySpecialProperties(worn, original);
    mesh.material = worn;
  });
}
