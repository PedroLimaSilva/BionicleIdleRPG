import { useGame } from './Game';
import { LogType } from '../types/Logging';

export function useActivityLog() {
  const { addActivityLog } = useGame();

  const log = (message: string, type: LogType = LogType.Event) => {
    addActivityLog(message, type);
  };

  return { log };
}
