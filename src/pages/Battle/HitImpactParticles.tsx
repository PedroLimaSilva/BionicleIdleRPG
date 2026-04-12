import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { subscribeBattleHitFeedback } from '../../utils/battleHitFeedback';
import { ElementTribe } from '../../types/Matoran';

const MAX_PARTICLES = 64;
const BURST_MIN = 8;
const BURST_MAX = 12;
const BURST_DURATION_MS = 400;
const FLOOR_LIFT = 0.6;

/** Per-model Y offset for hit particles, matching the HP bar placement. */
function hitYOffset(model?: string): number {
  switch (model) {
    case 'bohrok':
      return 0.3;
    case 'rahkshi':
      return 0.2;
    case 'rahi_placeholder':
      return 0.32;
    default:
      return 0.2;
  }
}

const ELEMENT_HIT_COLORS: Record<ElementTribe, string> = {
  [ElementTribe.Fire]: '#ff3b00',
  [ElementTribe.Water]: '#57c4e5',
  [ElementTribe.Air]: '#a8f4a4',
  [ElementTribe.Ice]: '#80d4ff',
  [ElementTribe.Stone]: '#d9a066',
  [ElementTribe.Earth]: '#8b5d30',
  [ElementTribe.Light]: '#fdf6d8',
  [ElementTribe.Shadow]: '#aaaaaa',
};

type ParticleState = {
  active: boolean;
  startMs: number;
  durationMs: number;
  origin: THREE.Vector3;
  velocity: THREE.Vector3;
  baseScale: number;
  color: THREE.Color;
};

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createParticleState(): ParticleState {
  return {
    active: false,
    startMs: 0,
    durationMs: BURST_DURATION_MS,
    origin: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    baseScale: 0.06,
    color: new THREE.Color('#ffffff'),
  };
}

function createSoftParticleMap(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.needsUpdate = true;
    return fallback;
  }

  const half = size * 0.5;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.12, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.25)');
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.05)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  return texture;
}

export function HitImpactParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const camera = useThree((s) => s.camera);

  const particlesRef = useRef<ParticleState[]>(
    Array.from({ length: MAX_PARTICLES }, () => createParticleState())
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const hiddenColor = useMemo(() => new THREE.Color('#000000'), []);
  const spawnPosition = useMemo(() => new THREE.Vector3(), []);
  const particleMap = useMemo(() => createSoftParticleMap(), []);

  useEffect(() => {
    return () => {
      particleMap.dispose();
    };
  }, [particleMap]);

  const hideParticle = useCallback(
    (index: number) => {
      const mesh = meshRef.current;
      if (!mesh) return;
      dummy.position.set(0, -1000, 0);
      dummy.quaternion.identity();
      dummy.scale.setScalar(0.0001);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      mesh.setColorAt(index, hiddenColor);
    },
    [dummy, hiddenColor]
  );

  const spawnBurst = (origin: THREE.Vector3, element: ElementTribe, damageRatio: number) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const available: number[] = [];
    for (let i = 0; i < MAX_PARTICLES; i += 1) {
      if (!particlesRef.current[i].active) available.push(i);
    }
    if (available.length === 0) return;

    const burstTarget = Math.floor(randomInRange(BURST_MIN, BURST_MAX + 1));
    const burstCount = Math.min(available.length, burstTarget);
    const startMs = performance.now();
    const baseColor = ELEMENT_HIT_COLORS[element] ?? '#fdf6d8';

    for (let i = 0; i < burstCount; i += 1) {
      const slot = available[i];
      const particle = particlesRef.current[slot];
      const theta = randomInRange(0, Math.PI * 2);
      const y = randomInRange(0.1, FLOOR_LIFT);
      const radial = randomInRange(0.2, 1);
      const velocity = new THREE.Vector3(Math.cos(theta) * radial, y, Math.sin(theta) * radial)
        .normalize()
        .multiplyScalar(randomInRange(0.9, 1.8));

      particle.active = true;
      particle.startMs = startMs;
      particle.durationMs = BURST_DURATION_MS;
      particle.origin.copy(origin);
      particle.velocity.copy(velocity);
      const scaleMult = Math.min(1 + damageRatio, 2);
      particle.baseScale = randomInRange(0.045, 0.09) * scaleMult;
      particle.color.set(baseColor);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < MAX_PARTICLES; i += 1) {
      hideParticle(i);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [hideParticle]);

  useEffect(() => {
    const unsubscribe = subscribeBattleHitFeedback(
      ({ damageDealt, targetMaxHp, targetId, targetModel, attackerElement, reactionAnimation }) => {
        if (damageDealt <= 0 || reactionAnimation !== 'Hit' || !targetId || !attackerElement) {
          return;
        }
        const targetPosition = window.combatantPositions?.[targetId];
        if (!targetPosition) return;
        const yOff = hitYOffset(targetModel);
        spawnPosition.set(targetPosition[0], targetPosition[1] + yOff, targetPosition[2]);
        const damageRatio = damageDealt / Math.max(1, targetMaxHp);
        spawnBurst(spawnPosition, attackerElement, damageRatio);
      }
    );
    return unsubscribe;
  }, [spawnPosition]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const now = performance.now();
    let matrixDirty = false;
    let colorDirty = false;

    for (let i = 0; i < MAX_PARTICLES; i += 1) {
      const particle = particlesRef.current[i];
      if (!particle.active) continue;

      const elapsedMs = now - particle.startMs;
      if (elapsedMs >= particle.durationMs) {
        particle.active = false;
        hideParticle(i);
        matrixDirty = true;
        colorDirty = true;
        continue;
      }

      const t = elapsedMs / particle.durationMs;
      const alpha = 1 - t;
      const elapsedSec = elapsedMs / 1000;
      const scale = particle.baseScale * (0.6 + t * 0.8);

      dummy.position
        .copy(particle.origin)
        .addScaledVector(particle.velocity, elapsedSec)
        .setY(particle.origin.y + particle.velocity.y * elapsedSec);
      dummy.quaternion.copy(camera.quaternion);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
      tempColor.copy(particle.color).multiplyScalar(alpha);
      mesh.setColorAt(i, tempColor);
      matrixDirty = true;
      colorDirty = true;
    }

    if (matrixDirty) mesh.instanceMatrix.needsUpdate = true;
    if (colorDirty && mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      name="HitImpactParticles"
      args={[undefined, undefined, MAX_PARTICLES]}
      frustumCulled={false}
      castShadow={false}
      receiveShadow={false}
      renderOrder={50}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        map={particleMap}
        color="#ffffff"
        depthWrite={false}
        depthTest={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}
