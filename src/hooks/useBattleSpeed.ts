import { useEffect, useState } from 'react';
import {
  cycleBattleSpeed,
  getBattleSpeedMultiplier,
  subscribeBattleSpeed,
  type BattleSpeedMultiplier,
} from '../utils/battleSpeed';

export function useBattleSpeed(): {
  speed: BattleSpeedMultiplier;
  cycleSpeed: () => BattleSpeedMultiplier;
} {
  const [speed, setSpeed] = useState(getBattleSpeedMultiplier);

  useEffect(() => subscribeBattleSpeed(() => setSpeed(getBattleSpeedMultiplier())), []);

  return { cycleSpeed: cycleBattleSpeed, speed };
}
