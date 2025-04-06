export const enum LogType {
  Gain = 'gain',
  Active = 'active',
  Event = 'event',
  Loot = 'loot',
  Widgets = 'widgets',
}

export type ActivityLogEntry = {
  id: string;
  message: string;
  type: LogType;
  timestamp: number;
};
