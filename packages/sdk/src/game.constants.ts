import type { Values } from '@game/shared';

export const GAME_PHASES = {
  MULLIGAN: 'MULLIGAN',
  BATTLE: 'BATTLE'
} as const;

export type GamePhase = Values<typeof GAME_PHASES>;
