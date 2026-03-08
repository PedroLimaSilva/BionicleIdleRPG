import { SelectiveBloomEffect, BlendFunction } from 'postprocessing';
import { forwardRef, Ref, useContext, useEffect, useMemo } from 'react';
import { Object3D } from 'three';
import { useThree } from '@react-three/fiber';
import { EffectComposerContext, resolveRef } from '@react-three/postprocessing';

interface StableSelectiveBloomProps {
  selection?: Object3D[];
  lights?: Object3D[];
  selectionLayer?: number;
  luminanceThreshold?: number;
  luminanceSmoothing?: number;
  intensity?: number;
  mipmapBlur?: boolean;
}

/**
 * Drop-in replacement for @react-three/postprocessing's SelectiveBloom
 * that avoids re-creating the underlying SelectiveBloomEffect on every
 * render.  The upstream component spreads a rest-props object into its
 * useMemo deps, which creates a new reference each render and exhausts
 * the postprocessing Selection idManager (layers 2-31).
 */
export const StableSelectiveBloom = forwardRef(function StableSelectiveBloom(
  {
    selection = [],
    lights = [],
    selectionLayer = 10,
    luminanceThreshold,
    luminanceSmoothing,
    intensity,
    mipmapBlur,
  }: StableSelectiveBloomProps,
  ref: Ref<SelectiveBloomEffect>
) {
  const invalidate = useThree((s) => s.invalidate);
  const { scene, camera } = useContext(EffectComposerContext);

  const effect = useMemo(
    () =>
      new SelectiveBloomEffect(scene, camera, {
        blendFunction: BlendFunction.ADD,
        luminanceThreshold,
        luminanceSmoothing,
        intensity,
        mipmapBlur,
      }),
    [scene, camera, luminanceThreshold, luminanceSmoothing, intensity, mipmapBlur]
  );

  useEffect(() => {
    if (selection) {
      effect.selection.set(selection.map(resolveRef) as Object3D[]);
      invalidate();
      return () => {
        effect.selection.clear();
        invalidate();
      };
    }
  }, [effect, selection, invalidate]);

  useEffect(() => {
    effect.selection.layer = selectionLayer;
    invalidate();
  }, [effect, invalidate, selectionLayer]);

  useEffect(() => {
    if (lights.length > 0) {
      lights.forEach((light) => light.layers.enable(effect.selection.layer));
      invalidate();
      return () => {
        lights.forEach((light) => light.layers.disable(effect.selection.layer));
        invalidate();
      };
    }
  }, [effect, invalidate, lights, selectionLayer]);

  return <primitive ref={ref} object={effect} dispose={null} />;
});
