import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { toGameDetailsDto } from '../game.mapper';
import { getGameById } from '../game.utils';

export const getGameUsecase = query({
  args: {
    gameId: v.id('games')
  },
  async handler(ctx, args) {
    const game = await getGameById(ctx, args.gameId);
    if (!game) return null;

    const details = await ctx.db
      .query('gameDetails')
      .withIndex('by_game_id', q => q.eq('gameId', game._id))
      .unique();
    if (!details) return null;

    return toGameDetailsDto({ ...game, details });
  }
});
