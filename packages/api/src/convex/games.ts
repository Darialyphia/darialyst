import { getCurrentGameUsecase } from './game/usecases/getCurrentGame.usecase';
import { startGameUsecase } from './game/usecases/startGame.usecase';
import { timeoutGameUsecase } from './game/usecases/timeoutGame.usecase';
import { finishGameUsecase } from './game/usecases/finishGame.usecase';
import { internalCancelGameUsecase } from './game/usecases/internalCancelGame.usecase';
import { cancelGameUsecase } from './game/usecases/cancelGame.usecase';
import { endGameUsecase } from './game/usecases/end-game.usecase';
import { getGameUsecase } from './game/usecases/getGame.usercase';
import { getAllOngoingGamesUsecase } from './game/usecases/getAllOngoingGames.usecase';
import { getGameHistoryUsecase } from './game/usecases/getGameHistory.usecase';
import { getLatestGamesWithReplaysUsecase } from './game/usecases/getLatestGamesWithReplays.usecase';
import { createGameReplayUsecase } from './game/usecases/createGameReplay.usecase';
import { getGameReplayUsecase } from './game/usecases/getGameReplay.usecase';
import { getGameByRoomIdUsecase } from './game/usecases/getGameByRoomId.usecase';
import { internalMutation, internalQuery } from './_generated/server';
import { getCurrentDetailedGameUsecase } from './game/usecases/getCurrentDetailedGame.usecase';

export const getCurrent = getCurrentGameUsecase;
export const getCurrentWithDetails = getCurrentDetailedGameUsecase;
export const start = startGameUsecase;
export const timeout = timeoutGameUsecase;
export const finish = finishGameUsecase;
export const internalCancel = internalCancelGameUsecase;
export const cancel = cancelGameUsecase;
export const end = endGameUsecase;
export const byId = getGameUsecase;
export const getAllOngoing = getAllOngoingGamesUsecase;
export const gameHistory = getGameHistoryUsecase;
export const latestGamesWithReplays = getLatestGamesWithReplaysUsecase;
export const createReplay = createGameReplayUsecase;
export const replayByGameId = getGameReplayUsecase;
export const byRoomId = getGameByRoomIdUsecase;

export const internalMigrateGameDetails = internalMutation({
  async handler(ctx, args) {
    const games = await ctx.db.query('games').collect();
    await Promise.all(
      games.map(async game => {
        if (game.cachedFormat && game.cachedPlayers) {
          await ctx.db.insert('gameDetails', {
            gameId: game._id,
            cachedFormat: game.cachedFormat,
            cachedPlayers: game.cachedPlayers
          });

          await ctx.db.patch(game._id, {
            cachedFormat: undefined,
            cachedPlayers: undefined
          });
        }
      })
    );
  }
});
