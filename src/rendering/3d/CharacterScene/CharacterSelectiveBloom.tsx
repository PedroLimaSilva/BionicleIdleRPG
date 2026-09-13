import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { shouldEnableSelectiveBloom } from '../../../utils/testMode';
import { createSelectiveBloomPipeline, type SelectiveBloomVariant } from './selectiveBloomPipeline';

export type { SelectiveBloomVariant };

export type CharacterSelectiveBloomProps = {
  /**
   * `card` — character viewer: premultiplied alpha + card backdrop for halos.
   * `scene` — full-screen battle: opaque output so transmissive kit brains and
   * glow slots stay visible (card alpha math hides them).
   */
  variant?: SelectiveBloomVariant;
  /** When false, keeps the MRT scene pass but skips bloom convolution (battle perf). */
  bloomEnabled?: boolean;
};

/**
 * WebGPU selective bloom for CharacterScene (and Rahkshi preview).
 * Battle arenas use `variant="scene"` with `bloomEnabled={false}`: the MRT scene
 * pass keeps transmissive brains and mask-power Kanohi visible, without bloom cost.
 *
 * Default MRT `bloomIntensity` is 0. Kit brains, kit Glow, Rahkshi Eyes, and
 * active Kanohi mask-power write 1; Glowing Eyes do not.
 *
 * Card variant: the HTML compositor ignores RGB at alpha 0, so halo pixels get
 * coverage from the bloom buffer and are composited onto a card-colored stand-in.
 *
 * Scene variant: writes opaque pixels — transmissive MRT materials must not be
 * multiplied by scene alpha or they vanish against the arena.
 */
export function CharacterSelectiveBloom({
  bloomEnabled = true,
  variant = 'card',
}: CharacterSelectiveBloomProps) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const enabled = shouldEnableSelectiveBloom();

  const pipeline = useMemo(() => {
    if (!enabled) return null;
    const rp = createSelectiveBloomPipeline(gl, scene, camera, { bloomEnabled, variant });
    const renderer = gl as { setClearColor?: (color: number, alpha: number) => void };
    renderer.setClearColor?.(0x000000, variant === 'scene' ? 1 : 0);
    return rp;
  }, [bloomEnabled, camera, enabled, gl, scene, variant]);

  useEffect(() => {
    return () => pipeline?.dispose();
  }, [pipeline]);

  useFrame(
    () => {
      pipeline?.render();
    },
    enabled ? 1 : 0
  );

  return null;
}
