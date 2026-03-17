/** Mirrors the telemetry_sessions table in Supabase. */
export interface TelemetrySession {
  id: number;
  received_at: string;
  client_id: string | null;
  app_version: string;
  game_state_version: number;
  client_timestamp: string;
  game_state: GameStateSnapshot;
  error_message: string | null;
  error_stack: string | null;
}

/**
 * Game state snapshot as sent by the client.
 * Matches PartialGameState from the game app.
 */
export interface GameStateSnapshot {
  version: number;
  protodermis: number;
  protodermisCap: number;
  collectedKrana: Record<string, string[]>;
  kraataCollection: Record<string, Record<number, number>>;
  rahkshi: RahkshiArmor[];
  recruitedCharacters: RecruitedCharacter[];
  activeQuests: QuestProgress[];
  completedQuests: string[];
}

export interface RecruitedCharacter {
  id: string;
  exp: number;
  assignment?: {
    job: string;
    expRatePerSecond: number;
    assignedAt: number;
  };
  maskOverride?: string;
  quest?: string;
}

export interface QuestProgress {
  questId: string;
  assignedMatoran: string[];
  startedAt: number;
  endsAt: number;
}

export interface RahkshiArmor {
  id: string;
  power: string;
  status: string;
  kraata?: { power: string; stage: number };
}
