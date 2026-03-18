/**
 * Lego-style PBR shader material using object-space coordinates.
 *
 * Takes a legoColor and optional tileable textures (dents, corrosion, fingerprints)
 * and generates roughness, normals, metalness, and diffuse from object-space
 * sampling. Works with normalized mesh scale in Blender—object-space ensures
 * consistent tiling across all models regardless of orientation.
 *
 * Texture usage:
 * - Dents: grayscale height → bump/normals + roughness variation
 * - Corrosion: grayscale mask → darken diffuse, increase roughness, reduce metalness
 * - Fingerprints: grayscale → subtle roughness variation
 */

import {
  Color,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  Object3D,
  RepeatWrapping,
  ShaderMaterial,
  Texture,
  Vector3,
} from 'three';

export type LegoPBRShaderOptions = {
  color?: ColorRepresentation;
  /** Base roughness (0–1). Texture variations add on top. */
  roughness?: number;
  /** Base metalness (0–1). Corrosion reduces this. */
  metalness?: number;
  /** Object-space scale for texture tiling. Higher = smaller tiles. */
  objectScale?: number;
  /** Strength of dents texture on normals (bump). */
  dentsBumpStrength?: number;
  /** How much dents affect roughness. */
  dentsRoughnessStrength?: number;
  /** How much corrosion darkens diffuse and increases roughness. */
  corrosionStrength?: number;
  /** How much fingerprints add micro-roughness. */
  fingerprintStrength?: number;
  /** Optional tileable dents texture (grayscale height). */
  dentsTexture?: Texture | null;
  /** Optional tileable corrosion mask (grayscale). */
  corrosionTexture?: Texture | null;
  /** Optional tileable fingerprint texture (grayscale). */
  fingerprintTexture?: Texture | null;
  /** Light direction (world space). */
  lightDirection?: Vector3;
  lightColor?: ColorRepresentation;
  ambient?: number;
};

const DEFAULT_LIGHT_DIR = new Vector3(3, 5, 2).normalize();
const DEFAULT_LIGHT_DIR2 = new Vector3(-3, 2, -2).normalize();

function ensureRepeatWrapping(tex: Texture): void {
  tex.wrapS = tex.wrapT = RepeatWrapping;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;
  varying vec3 vObjectPosition;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vObjectPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform float uRoughness;
  uniform float uMetalness;
  uniform float uObjectScale;
  uniform float uDentsBumpStrength;
  uniform float uDentsRoughnessStrength;
  uniform float uCorrosionStrength;
  uniform float uFingerprintStrength;
  uniform sampler2D uDentsTexture;
  uniform sampler2D uCorrosionTexture;
  uniform sampler2D uFingerprintTexture;
  uniform bool uHasDentsTexture;
  uniform bool uHasCorrosionTexture;
  uniform bool uHasFingerprintTexture;
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

  // Triplanar mapping: project object-space position onto XY, XZ, YZ planes
  // and blend based on surface normal. Ensures consistent tiling in object space.
  vec4 triplanarSample(sampler2D tex, vec3 pos, vec3 n, float scale) {
    vec3 absN = abs(n);
    float blend = max(absN.x, max(absN.y, absN.z));
    absN = max(absN - 0.2, vec3(0.0));
    absN /= dot(absN, vec3(1.0));

    vec2 uvX = pos.yz * scale;
    vec2 uvY = pos.xz * scale;
    vec2 uvZ = pos.xy * scale;

    vec4 sampleX = texture2D(tex, uvX);
    vec4 sampleY = texture2D(tex, uvY);
    vec4 sampleZ = texture2D(tex, uvZ);

    return sampleX * absN.x + sampleY * absN.y + sampleZ * absN.z;
  }

  // Fallback procedural noise when no texture
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
    vec3 objPos = vObjectPosition * uObjectScale;

    // Sample textures or use procedural fallback
    float dents = 0.5;
    float corrosion = 0.0;
    float fingerprints = 0.5;

    if (uHasDentsTexture) {
      dents = triplanarSample(uDentsTexture, vObjectPosition, normal, uObjectScale).r;
    } else {
      dents = fbm(vObjectPosition * 0.5 + 50.0);
    }
    if (uHasCorrosionTexture) {
      corrosion = triplanarSample(uCorrosionTexture, vObjectPosition, normal, uObjectScale).r;
    } else {
      corrosion = fbm(vObjectPosition * 0.3 + 100.0) * 0.15;
    }
    if (uHasFingerprintTexture) {
      fingerprints = triplanarSample(uFingerprintTexture, vObjectPosition, normal, uObjectScale * 2.0).r;
    } else {
      fingerprints = fbm(vObjectPosition * 1.2 + 80.0);
    }

    // Bump from dents
    float bumpHeight = uDentsBumpStrength * (dents - 0.5);
    vec2 dHdxy = vec2(dFdx(bumpHeight), dFdy(bumpHeight));
    vec3 surf_pos = -vViewPosition;
    vec3 vSigmaX = normalize(dFdx(surf_pos));
    vec3 vSigmaY = normalize(dFdy(surf_pos));
    float fDet = dot(vSigmaX, cross(vSigmaY, normal)) * faceDirection;
    vec3 vGrad = sign(fDet) * (dHdxy.x * cross(vSigmaY, normal) + dHdxy.y * cross(normal, vSigmaX));
    normal = normalize(abs(fDet) * normal - vGrad);

    // Roughness: base + dents + corrosion + fingerprints
    float roughness = uRoughness;
    roughness += (dents - 0.5) * uDentsRoughnessStrength;
    roughness += corrosion * uCorrosionStrength * 0.5;
    roughness += (fingerprints - 0.5) * uFingerprintStrength;
    roughness = clamp(roughness, 0.04, 1.0);

    // Metalness: reduced by corrosion
    float metalness = uMetalness * (1.0 - corrosion * uCorrosionStrength);
    metalness = clamp(metalness, 0.0, 1.0);

    // Diffuse: base color darkened by corrosion
    vec3 baseColor = uColor;
    baseColor *= 1.0 - corrosion * uCorrosionStrength * 0.6;
    baseColor = clamp(baseColor, vec3(0.0), vec3(1.0));

    // Fresnel edge tint (subtle)
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float NdotV = max(dot(normal, viewDir), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.0);
    float lum = dot(baseColor, vec3(0.299, 0.587, 0.114));
    float edgeMix = mix(0.5, 0.75, 1.0 - lum);
    vec3 edgeTint = mix(baseColor, vec3(1.0), edgeMix);
    baseColor = mix(baseColor, edgeTint, fresnel * 0.3);

    // Lighting
    vec3 lightDir1World = normalize(uLightDirection);
    vec3 lightDir2World = normalize(uLightDirection2);
    vec3 lightDir1 = normalize((viewMatrix * vec4(lightDir1World, 0.0)).xyz);
    vec3 lightDir2 = normalize((viewMatrix * vec4(lightDir2World, 0.0)).xyz);
    float NdotL1 = max(dot(normal, lightDir1), 0.0);
    float NdotL2 = max(dot(normal, lightDir2), 0.0);
    vec3 diffuse = baseColor * (uAmbient + uLightColor * NdotL1 + uLightColor2 * NdotL2);
    diffuse *= 1.0 - metalness;
    vec3 metalFill = baseColor * (uAmbient * 0.6 + uLightColor * NdotL1 + uLightColor2 * NdotL2);
    diffuse += metalFill * metalness;

    // Specular
    vec3 viewDirView = -normalize(vViewPosition);
    vec3 half1 = normalize(lightDir1 + viewDirView);
    vec3 half2 = normalize(lightDir2 + viewDirView);
    float specExp = 1.0 + (1.0 - roughness) * 64.0;
    float spec1 = pow(max(dot(normal, half1), 0.0), specExp);
    float spec2 = pow(max(dot(normal, half2), 0.0), specExp);
    float spec = spec1 + spec2 * 0.5;
    vec3 specColor = mix(vec3(0.04), baseColor, metalness);
    float specStrength = 1.0 + metalness * 3.0;
    diffuse += specColor * spec * (uLightColor + uLightColor2 * 0.5) * specStrength;
    diffuse += uEmissive * uEmissiveIntensity;

    gl_FragColor = vec4(diffuse, uOpacity);
  }
`;

function makeUniforms(
  color: ColorRepresentation,
  opts: LegoPBRShaderOptions
): Record<string, { value: unknown }> {
  const c = new Color(color);
  const dentsTex = opts.dentsTexture ?? null;
  const corrosionTex = opts.corrosionTexture ?? null;
  const fingerprintTex = opts.fingerprintTexture ?? null;
  if (dentsTex) ensureRepeatWrapping(dentsTex);
  if (corrosionTex) ensureRepeatWrapping(corrosionTex);
  if (fingerprintTex) ensureRepeatWrapping(fingerprintTex);

  return {
    uColor: { value: c },
    uRoughness: { value: opts.roughness ?? 0.55 },
    uMetalness: { value: opts.metalness ?? 0.05 },
    uObjectScale: { value: opts.objectScale ?? 8.0 },
    uDentsBumpStrength: { value: opts.dentsBumpStrength ?? 0.12 },
    uDentsRoughnessStrength: { value: opts.dentsRoughnessStrength ?? 0.15 },
    uCorrosionStrength: { value: opts.corrosionStrength ?? 0.4 },
    uFingerprintStrength: { value: opts.fingerprintStrength ?? 0.08 },
    uDentsTexture: { value: dentsTex },
    uCorrosionTexture: { value: corrosionTex },
    uFingerprintTexture: { value: fingerprintTex },
    uHasDentsTexture: { value: !!dentsTex },
    uHasCorrosionTexture: { value: !!corrosionTex },
    uHasFingerprintTexture: { value: !!fingerprintTex },
    uLightDirection: { value: (opts.lightDirection ?? DEFAULT_LIGHT_DIR).clone() },
    uLightColor: { value: new Color(opts.lightColor ?? '#ffffff').multiplyScalar(1.5) },
    uLightDirection2: { value: DEFAULT_LIGHT_DIR2.clone() },
    uLightColor2: { value: new Color('#ffffff').multiplyScalar(0.6) },
    uAmbient: { value: opts.ambient ?? 0.6 },
    uEmissive: { value: new Color(0, 0, 0) },
    uEmissiveIntensity: { value: 0 },
    uOpacity: { value: 1 },
  };
}

export type LegoPBRShaderMaterial = ShaderMaterial & {
  uniforms: ReturnType<typeof makeUniforms>;
};

const materialCache = new Map<string, LegoPBRShaderMaterial>();

function cacheKey(color: ColorRepresentation, opts: LegoPBRShaderOptions): string {
  const c = new Color(color).getStyle();
  const hasD = opts.dentsTexture ? 'd' : '';
  const hasC = opts.corrosionTexture ? 'c' : '';
  const hasF = opts.fingerprintTexture ? 'f' : '';
  return `${c}_${opts.objectScale ?? 8}_${hasD}${hasC}${hasF}`;
}

/**
 * Creates a Lego-style PBR shader material with object-space texture sampling.
 * Use normalized mesh scale in Blender so object-space coordinates tile consistently.
 */
export function createLegoPBRMaterial(opts: LegoPBRShaderOptions = {}): LegoPBRShaderMaterial {
  const color = opts.color ?? '#ffffff';
  const material = new ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms: makeUniforms(color, opts),
    side: DoubleSide,
    lights: false,
  }) as LegoPBRShaderMaterial;
  material.extensions.derivatives = true;
  return material;
}

/**
 * Returns a shared Lego PBR material for the given color and options.
 * Do not mutate the returned material; clone for per-mesh overrides.
 */
export function getLegoPBRMaterial(
  color: ColorRepresentation,
  opts: LegoPBRShaderOptions = {}
): LegoPBRShaderMaterial {
  const key = cacheKey(color, opts);
  if (!materialCache.has(key)) {
    materialCache.set(key, createLegoPBRMaterial({ ...opts, color }) as LegoPBRShaderMaterial);
  }
  return materialCache.get(key)!;
}

type MeshLike = {
  transparent?: boolean;
  opacity?: number;
  color?: Color | { getStyle(): string };
  emissive?: Color;
  emissiveIntensity?: number;
  metalness?: number;
};

function copySpecialProperties(
  lego: LegoPBRShaderMaterial,
  original: MeshLike
): LegoPBRShaderMaterial {
  const needsTransparent = original.transparent === true;
  const emissiveIntensity = (original as { emissiveIntensity?: number }).emissiveIntensity ?? 0;
  const needsEmissive = 'emissiveIntensity' in original && emissiveIntensity > 0;
  const originalMetalness = (original as { metalness?: number }).metalness ?? 0;
  const hasMetalnessMap =
    'metalnessMap' in original && !!(original as { metalnessMap?: unknown }).metalnessMap;
  const needsMetalness = originalMetalness > 0 || hasMetalnessMap;
  if (!needsTransparent && !needsEmissive && !needsMetalness) return lego;
  const cloned = lego.clone() as LegoPBRShaderMaterial;
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
  }
  return cloned;
}

/**
 * Traverses the object and replaces every mesh's material with a Lego PBR
 * shader material keyed by the original material's color. Uses object-space
 * coordinates for texture tiling—normalize mesh scale in Blender for consistency.
 */
export function applyLegoPBRToObject(
  object: Object3D | null | undefined,
  opts: LegoPBRShaderOptions = {}
): void {
  if (!object) return;
  object.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const raw = mesh.material;
    if (!raw) return;
    if (
      (raw as ShaderMaterial).isShaderMaterial &&
      (raw as LegoPBRShaderMaterial).uniforms?.uColor
    )
      return;
    const original = raw as MeshLike;
    const color = original.color;
    if (!color) return;
    const colorStyle =
      color instanceof Color
        ? color.getStyle()
        : new Color(color as ColorRepresentation).getStyle();
    let lego = getLegoPBRMaterial(colorStyle as ColorRepresentation, opts);
    lego = copySpecialProperties(lego, original);
    mesh.material = lego;
  });
}
