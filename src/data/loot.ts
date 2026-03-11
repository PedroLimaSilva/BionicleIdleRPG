/**
 * Generic game item infrastructure – retained for future quest-item mechanics.
 * Kraata are tracked via a dedicated KraataCollection (see types/Kraata.ts).
 */
export enum GameItemId {}

export interface GameItem {
  name: string;
  description?: string;
}

export const ITEM_DICTIONARY: Record<GameItemId, GameItem> = {};
