import { ColorRepresentation, DoubleSide, MeshStandardMaterial } from 'three';

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

export const getWornMaterial = (key: string, color: ColorRepresentation) => {
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
};
