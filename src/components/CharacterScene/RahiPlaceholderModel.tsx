import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import type { CombatantModelHandle, PlayAnimationOptions } from '../../pages/Battle/CombatantModel';
import { ElementTribe } from '../../types/Matoran';

const BODY = 0.55;
const HEAD = 0.28;

/** Muted body tint per tribe (placeholder until real Rahi meshes ship). */
const PLACEHOLDER_BODY: Record<ElementTribe, string> = {
  [ElementTribe.Fire]: '#8b4513',
  [ElementTribe.Water]: '#1e5f8a',
  [ElementTribe.Air]: '#2d6b3a',
  [ElementTribe.Ice]: '#4a6b8a',
  [ElementTribe.Stone]: '#6b5a3a',
  [ElementTribe.Earth]: '#4a3d2a',
  [ElementTribe.Light]: '#9a9a7a',
  [ElementTribe.Shadow]: '#3a3a3a',
};

const PLACEHOLDER_HEAD: Record<ElementTribe, string> = {
  [ElementTribe.Fire]: '#c45c26',
  [ElementTribe.Water]: '#3a8cc8',
  [ElementTribe.Air]: '#5cb85c',
  [ElementTribe.Ice]: '#a8d4f0',
  [ElementTribe.Stone]: '#c49a5c',
  [ElementTribe.Earth]: '#7a6548',
  [ElementTribe.Light]: '#dcdcc8',
  [ElementTribe.Shadow]: '#5a5a5a',
};

const ATTACK_CONTACT_MS = 140;
const ATTACK_TOTAL_MS = 420;
const HIT_MS = 280;
const DEFEAT_MS = 600;

type Anim = 'idle' | 'attack' | 'hit' | 'defeat';

function asStdMat(mesh: Mesh): MeshStandardMaterial {
  return mesh.material as MeshStandardMaterial;
}

/**
 * Procedural stand-in for Rahi in battle. Replace with a GLB-backed component later;
 * keep the same `forwardRef` + `playAnimation` contract as other combat models.
 */
export const RahiPlaceholderModel = forwardRef<
  CombatantModelHandle,
  { element: ElementTribe }
>(({ element }, ref) => {
  const root = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);
  const [anim, setAnim] = useState<Anim>('idle');
  const animStartRef = useRef(0);

  useImperativeHandle(ref, () => ({
    playAnimation: async (name, options?: PlayAnimationOptions) => {
      if (name === 'Idle') return;

      if (name === 'Attack') {
        setAnim('attack');
        animStartRef.current = performance.now();
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, ATTACK_CONTACT_MS);
        });
        window.setTimeout(() => {
          setAnim('idle');
          options?.onAnimationComplete?.();
        }, ATTACK_TOTAL_MS);
        return;
      }

      if (name === 'Hit') {
        setAnim('hit');
        animStartRef.current = performance.now();
        await new Promise<void>((resolve) => {
          window.setTimeout(() => {
            setAnim('idle');
            resolve();
          }, HIT_MS);
        });
        return;
      }

      if (name === 'Defeat') {
        setAnim('defeat');
        animStartRef.current = performance.now();
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, DEFEAT_MS);
        });
        options?.onAnimationComplete?.();
      }
    },
  }));

  useFrame((state) => {
    const g = root.current;
    const body = bodyRef.current;
    const head = headRef.current;
    if (!g || !body || !head) return;

    const bodyMat = asStdMat(body);
    const headMat = asStdMat(head);
    const t = state.clock.elapsedTime;

    if (anim === 'idle') {
      g.position.y = Math.sin(t * 2.2) * 0.04;
      g.position.z = 0;
      g.rotation.x = 0;
      g.rotation.z = 0;
      bodyMat.color.set(PLACEHOLDER_BODY[element]);
      headMat.color.set(PLACEHOLDER_HEAD[element]);
      bodyMat.emissive.set('#000000');
      headMat.emissive.set('#000000');
      bodyMat.emissiveIntensity = 0;
      headMat.emissiveIntensity = 0;
      return;
    }

    const elapsed = (performance.now() - animStartRef.current) / 1000;

    if (anim === 'attack') {
      const punch = Math.min(1, elapsed / (ATTACK_TOTAL_MS / 1000));
      const lunge = Math.sin(punch * Math.PI) * 0.35;
      g.position.z = lunge;
      g.position.y = Math.sin(t * 2.2) * 0.02;
    } else if (anim === 'hit') {
      g.rotation.z = Math.sin(elapsed * 28) * 0.12;
      bodyMat.emissive.set('#ff4422');
      bodyMat.emissiveIntensity = 0.45;
    } else if (anim === 'defeat') {
      const k = Math.min(1, elapsed / (DEFEAT_MS / 1000));
      g.rotation.x = k * (Math.PI / 2);
      g.position.y = -k * 0.25;
      bodyMat.emissive.set('#000000');
      bodyMat.emissiveIntensity = 0;
    }
  });

  const bodyColor = PLACEHOLDER_BODY[element];
  const headColor = PLACEHOLDER_HEAD[element];

  return (
    <group ref={root} scale={0.22}>
      <mesh ref={bodyRef} position={[0, BODY * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[BODY * 0.9, BODY, BODY * 1.1]} />
        <meshStandardMaterial color={bodyColor} roughness={0.65} metalness={0.05} />
      </mesh>
      <mesh ref={headRef} position={[0, BODY + HEAD * 0.45, BODY * 0.15]} castShadow>
        <boxGeometry args={[HEAD, HEAD * 0.85, HEAD * 0.95]} />
        <meshStandardMaterial color={headColor} roughness={0.6} metalness={0.05} />
      </mesh>
    </group>
  );
});

RahiPlaceholderModel.displayName = 'RahiPlaceholderModel';
