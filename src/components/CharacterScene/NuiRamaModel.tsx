import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import type { AnimationAction, AnimationClip } from 'three';
import { Group, LoopRepeat } from 'three';
import type { CombatantModelHandle, PlayAnimationOptions } from '../../pages/Battle/CombatantModel';
import type { NuiRamaVariant } from '../../types/Combat';
import { getAnimationTimeScale, setupAnimationForTestMode } from '../../utils/testMode';
import { applyWeatheredMetalToObject } from './WeatheredMetalMaterial';
import { LegoColor } from '../../types/Colors';

const GLB_PATH = import.meta.env.BASE_URL + 'Rahi/NuiRama.glb';

const ACCENT_ORANGE = LegoColor.Orange;
const ACCENT_LIME = LegoColor.Lime;

const ATTACK_CONTACT_MS = 140;
const ATTACK_TOTAL_MS = 420;
const HIT_MS = 280;
const DEFEAT_MS = 600;

type Anim = 'idle' | 'attack' | 'hit' | 'defeat';

/** GLB clip: wing flutter; loops for the whole fight. */
const WINGS_CLIP = 'Wings';

const WEATHERED_OPTS = {
  roughness: 0.55,
  metalness: 0.05,
  grimeDarken: 0.4,
  grimeRoughness: 0.2,
  grimeMetalnessReduce: 0.5,
  largeScale: 3.5,
  fineScale: 18.0,
  cavityStrength: 1,
  edgeColor: '#ffffff',
  edgeStrength: 0.15,
  edgeCurvatureScale: 2,
  excludeMaterialNames: ['Glow Mask', 'Glow Glass'],
};

/**
 * GLB-backed Nui-Rama. `Wings` plays on loop; combat motion (attack/hit/defeat) is procedural on the root group.
 * Orange: hook jaw; lime: teeth jaw. Accent color is driven by `variant`.
 */
export const NuiRamaModel = forwardRef<CombatantModelHandle, { variant: NuiRamaVariant }>(
  ({ variant }, ref) => {
    const root = useRef<Group>(null);
    const { nodes, animations } = useGLTF(GLB_PATH) as unknown as {
      nodes: { Nui_Rama: Group };
      animations: AnimationClip[];
    };

    const instance = useMemo(() => nodes.Nui_Rama.clone(true), [nodes]);

    const { actions, mixer } = useAnimations(animations, root);
    const wingsActionRef = useRef<AnimationAction | null>(null);

    useLayoutEffect(() => {
      mixer.timeScale = getAnimationTimeScale();
      const wings = actions[WINGS_CLIP];
      if (!wings) {
        wingsActionRef.current = null;
        return;
      }
      wingsActionRef.current = wings;
      wings.stop();
      wings.reset();
      wings.setLoop(LoopRepeat, Infinity);
      wings.clampWhenFinished = false;
      wings.play();
      setupAnimationForTestMode(wings);
      return () => {
        wings.stop();
        wingsActionRef.current = null;
      };
    }, [actions, mixer]);

    const [anim, setAnim] = useState<Anim>('idle');
    const animStartRef = useRef(0);
    /** Desync root bob between multiple Nui-Rama on screen (shared clock → same `t` otherwise). */
    const idleBobPhase = useMemo(() => Math.random() * Math.PI * 2, []);

    useEffect(() => {
      const hook = instance.getObjectByName('Hook');
      const teeth = instance.getObjectByName('Teeth');
      if (hook) hook.visible = variant === 'orange';
      if (teeth) teeth.visible = variant === 'lime';

      const accentHex = variant === 'orange' ? ACCENT_ORANGE : ACCENT_LIME;

      applyWeatheredMetalToObject(instance, {
        ...WEATHERED_OPTS,
        materialColorMap: {
          Accent: accentHex,
          'Solid Black': '#1a1a1a',
          Solid_Light_Grey: '#c8c8c8',
        },
      });
    }, [instance, variant]);

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
          wingsActionRef.current?.stop();
          setAnim('defeat');
          animStartRef.current = performance.now();
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, DEFEAT_MS);
          });
        }
      },
    }));

    useFrame((state) => {
      const g = root.current;
      if (!g) return;

      const t = state.clock.elapsedTime;

      if (anim === 'idle') {
        // Hover is subtle so it does not fight the skeletal `Wings` flutter.
        g.position.y = Math.sin(t * 2.2 + idleBobPhase) * 0.5;
        g.position.z = 0;
        g.rotation.x = 0;
        g.rotation.z = 0;
        return;
      }

      const elapsed = (performance.now() - animStartRef.current) / 1000;

      if (anim === 'attack') {
        const punch = Math.min(1, elapsed / (ATTACK_TOTAL_MS / 1000));
        const lunge = Math.sin(punch * Math.PI) * 0.35;
        g.position.z = lunge;
        g.position.y = Math.sin(t * 2.2 + idleBobPhase) * 0.02;
      } else if (anim === 'hit') {
        g.rotation.z = Math.sin(elapsed * 28) * 0.12;
      } else if (anim === 'defeat') {
        const k = Math.min(1, elapsed / (DEFEAT_MS / 1000));
        g.rotation.z = 0;
        // Fall backwards (negative pitch vs previous forward tip), slight drop and recoil in -Z.
        g.rotation.x = -k * (Math.PI / 2);
        g.position.y = -k * 0.22;
        g.position.z = -k * 0.18;
      }
    });

    return (
      <group ref={root} scale={1} dispose={null}>
        <primitive object={instance} />
      </group>
    );
  }
);

NuiRamaModel.displayName = 'NuiRamaModel';

useGLTF.preload(GLB_PATH);
