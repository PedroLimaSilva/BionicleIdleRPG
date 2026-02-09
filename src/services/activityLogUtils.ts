import { ActivityLogEntry, LogType } from '../types/Logging';

export function createLogEntry(message: string, type: LogType): ActivityLogEntry {
  return {
    id: crypto.randomUUID(),
    message,
    type,
    timestamp: Date.now(),
  };
}

export function removeLogEntry(log: ActivityLogEntry[], id: string): ActivityLogEntry[] {
  return log.filter((entry) => entry.id !== id);
}
