import { internalMutation } from '../../_generated/server';

export const cleanupInactiveLobbiesUsecae = internalMutation({
  args: {},
  async handler(ctx, args) {
    const lobbies = await ctx.db.query('lobbies').collect();

    await Promise.all(
      lobbies.map(async lobby => {
        const lobbyUsers = await ctx.db
          .query('lobbyUsers')
          .withIndex('by_lobby_id', q => q.eq('lobbyId', lobby._id))
          .collect();

        const users = await Promise.all(lobbyUsers.map(lu => ctx.db.get(lu.userId)));
        const isInactive = users.every(user => {
          if (!user) return true;
          return user.presence === 'offline';
        });

        if (isInactive) {
          await Promise.all(lobbyUsers.map(lu => ctx.db.delete(lu._id)));
          await ctx.db.delete(lobby._id);
        }
      })
    );
  }
});
