import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { toGameDetailsDto } from '../game.mapper';
import { getGameById } from '../game.utils';

export const getGameReplayUsecase = query({
  args: { gameId: v.id('games') },
  async handler(ctx, args) {
    const replay = await ctx.db
      .query('gameReplays')
      .withIndex('by_game_id', q => q.eq('gameId', args.gameId))
      .unique();

    if (!replay) throw new Error('Replay not found.');

    const game = await getGameById(ctx, replay.gameId);
    if (!game) throw new Error('Game not found.');

    const details = await ctx.db
      .query('gameDetails')
      .withIndex('by_game_id', q => q.eq('gameId', game._id))
      .unique();
    if (!details) throw new Error('game details not found');

    return {
      game: toGameDetailsDto({ ...game, details }),
      replay: replay.replay,
      initialState: replay.initialState
    };
  }
});
