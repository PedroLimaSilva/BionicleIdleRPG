export const enum LogType {
  Gain = 'gain',
  Active = 'active',
  Event = 'event',
}

export type ActivityLogEntry = {
  id: string;
  message: string;
  type: LogType;
  timestamp: number;
};
