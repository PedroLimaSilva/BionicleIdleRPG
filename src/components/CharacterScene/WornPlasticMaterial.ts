import {
  Color,
  ColorRepresentation,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from 'three';

type WornPlasticOptions = {
  color?: ColorRepresentation;
  roughness?: number;
  metalness?: number;
  roughnessNoise?: number;
  fresnelStrength?: number;
};

export function createWornPlasticMaterial({
  color = '#ffffff',
  roughness = 0.55,
  metalness = 0.05,
  roughnessNoise = 0.15,
  fresnelStrength = 0.2,
}: WornPlasticOptions = {}) {
  const material = new MeshStandardMaterial({
    color,
    roughness,
    metalness,
  });
  material.side = DoubleSide;
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uRoughnessNoise = { value: roughnessNoise };
    shader.uniforms.uFresnelStrength = { value: fresnelStrength };

    // Vertex: declare varying
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
        #include <common>
        varying vec3 vWorldPosition;
      `,
    );

    // Vertex: assign world position
    shader.vertexShader = shader.vertexShader.replace(
      '#include <worldpos_vertex>',
      `
        #include <worldpos_vertex>
        vWorldPosition = worldPosition.xyz;
      `,
    );

    // Fragment: declare uniforms + varying
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      `
        #include <common>
        uniform float uRoughnessNoise;
        uniform float uFresnelStrength;
        varying vec3 vWorldPosition;
      `,
    );

    // Roughness breakup (world-space)
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <roughnessmap_fragment>',
      `
      #include <roughnessmap_fragment>

      float noise = fract(
        sin(dot(vWorldPosition.xz * 10.0, vec2(12.9898,78.233))) * 43758.5453
      );

      roughnessFactor = clamp(
        roughnessFactor + noise * uRoughnessNoise,
        0.04,
        1.0
      );
    `,
    );

    // Fresnel wear
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>

      float fresnel = pow(
        1.0 - dot(normalize(vNormal), normalize(vViewPosition)),
        2.0
      );

      diffuseColor.rgb *= 1.0 - fresnel * uFresnelStrength;
    `,
    );
  };

  return material;
}

const materialCache = new Map<string, MeshStandardMaterial>();

/**
 * Returns a shared worn plastic material for the given color. All pieces
 * of the same color share the same material instance. Do not mutate the
 * returned material's color; clone it if you need a variant (e.g. emissive
 * or transparent).
 */
export function getWornMaterial(color: ColorRepresentation): MeshStandardMaterial {
  const key = new Color(color).getStyle();
  if (!materialCache.has(key)) {
    materialCache.set(
      key,
      createWornPlasticMaterial({
        color,
        roughness: 0.55,
        roughnessNoise: 0.12,
        fresnelStrength: 0.18,
      }),
    );
  }
  return materialCache.get(key)!;
}

/**
 * Copies transparency and emissive from the original material onto the worn
 * material. Use when the original had transparent or emissive and we must preserve it.
 */
function copySpecialProperties(
  worn: MeshStandardMaterial,
  original: MeshStandardMaterial,
): MeshStandardMaterial {
  const needsTransparent = original.transparent;
  const needsEmissive =
    'emissiveIntensity' in original && original.emissiveIntensity > 0;
  if (!needsTransparent && !needsEmissive) return worn;
  const cloned = worn.clone();
  if (needsTransparent) {
    cloned.transparent = true;
    cloned.opacity = original.opacity;
  }
  if (needsEmissive) {
    cloned.emissive.copy(original.emissive);
    cloned.emissiveIntensity = original.emissiveIntensity;
  }
  return cloned;
}

/**
 * Traverses an object and replaces every mesh's material with a cached
 * worn plastic material keyed by the current material's color. Preserves
 * the original material's transparency and emissive when present.
 */
export function applyWornPlasticToObject(object: Object3D | null | undefined): void {
  if (!object) return;
  object.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    const mesh = child as Mesh;
    const original = mesh.material as MeshStandardMaterial | undefined;
    if (!original || !original.color) return;
    const color = original.color;
    let worn = getWornMaterial(color);
    worn = copySpecialProperties(worn, original);
    mesh.material = worn;
  });
}
