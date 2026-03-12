import { KraataPower } from './Kraata';

export type RahkshiArmorStatus = 'preparing' | 'ready';

export interface RahkshiArmor {
  id: string;
  /** Power of the kraata used to forge this armor (determines appearance). */
  power: KraataPower;
  status: RahkshiArmorStatus;
  /** Timestamp (ms) when forging started. Present while preparing. */
  startedAt?: number;
  /** Timestamp (ms) when forging completes. Present while preparing. */
  endsAt?: number;
  /** Kraata inserted into this armor. Only ready armor can hold a kraata. */
  kraata?: { power: KraataPower; stage: number };
}

export function generateRahkshiId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
