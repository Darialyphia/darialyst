import { z } from 'zod';
import { GameAction } from './action';
import { GAME_PHASES } from '../game.constants';
import { defaultActionSchema } from './action.constants';

const schema = defaultActionSchema.extend({
  cardIndex: z.number().nonnegative()
});

export class ReplaceCardAction extends GameAction<typeof schema> {
  readonly name = 'replaceCard';
  readonly phase = GAME_PHASES.BATTLE;

  protected payloadSchema = schema;

  async impl() {
    await this.player.replaceCard(this.payload.cardIndex);
  }
}
