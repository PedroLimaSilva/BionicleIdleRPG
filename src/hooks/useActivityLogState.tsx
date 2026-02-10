import { useState } from 'react';
import { ActivityLogEntry, LogType } from '../types/Logging';
import { createLogEntry, removeLogEntry } from '../services/activityLogUtils';

export function useActivityLogState(initialLog: ActivityLogEntry[]) {
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>(initialLog);

  const addActivityLog = (message: string, type: LogType) => {
    setActivityLog((log) => [...log, createLogEntry(message, type)]);
  };

  const removeActivityLogEntry = (id: string) => {
    setActivityLog((log) => removeLogEntry(log, id));
  };

  const clearActivityLog = () => {
    setActivityLog([]);
  };

  return {
    activityLog,
    setActivityLog,
    addActivityLog,
    removeActivityLogEntry,
    clearActivityLog,
  };
}
