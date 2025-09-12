import { z } from 'zod';
import { GAME_PHASES } from '../game.constants';
import { GameAction } from './action';
import { defaultActionSchema } from './action.constants';

const schema = defaultActionSchema.extend({
  cardIndices: z.number().nonnegative().array()
});

export class MulliganAction extends GameAction<typeof schema> {
  readonly name = 'mulligan';
  readonly phase = GAME_PHASES.MULLIGAN;
  protected override allowDuringEnemyTurn = true;

  protected payloadSchema = schema;

  async impl() {
    if (this.player.hasMulliganed) return;

    this.player.mulliganIndices = this.payload.cardIndices;
    this.player.hasMulliganed = true;

    const shouldSwitchToBattlePhase = this.session.playerSystem
      .getList()
      .every(player => player.hasMulliganed);

    if (shouldSwitchToBattlePhase) {
      await this.session.playerSystem.switchToBattlePhase();
    }
  }
}
