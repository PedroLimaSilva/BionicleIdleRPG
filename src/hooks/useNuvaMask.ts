import { Object3D } from 'three';
import { BaseMatoran, RecruitedCharacterData } from '../types/Matoran';
import { useGame } from '../context/Game';
import { getEffectiveNuvaMaskColor } from '../game/maskColor';
import { useMask } from './useMask';

/**
 * Mask hook for Toa Nuva models. Derives mask color from user override and game state
 * (light gray when nuva symbols are sequestered), then delegates to useMask.
 */
export function useNuvaMask(
  masksParent: Object3D | undefined,
  maskName: string,
  matoran: BaseMatoran & RecruitedCharacterData,
  glowColor?: string
) {
  const { completedQuests } = useGame();
  const maskColor = getEffectiveNuvaMaskColor(matoran, completedQuests);
  return useMask(masksParent, maskName, maskColor, glowColor);
}
