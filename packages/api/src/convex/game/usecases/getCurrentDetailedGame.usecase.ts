import { authedQuery } from '../../auth/auth.utils';
import { toGameDetailsDto, toGameDto } from '../game.mapper';
import { getCurrentGame } from '../game.utils';

export const getCurrentDetailedGameUsecase = authedQuery({
  args: {},
  handler: async ctx => {
    const game = await getCurrentGame({ db: ctx.db }, ctx.user._id);
    if (!game) return null;
    const details = await ctx.db
      .query('gameDetails')
      .withIndex('by_game_id', q => q.eq('gameId', game._id))
      .unique();
    if (!details) return null;
    return toGameDetailsDto({ ...game, details });
  }
});
