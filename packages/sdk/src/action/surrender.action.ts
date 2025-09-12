import { GAME_PHASES } from '../game.constants';
import { GameAction } from './action';
import { defaultActionSchema } from './action.constants';

const schema = defaultActionSchema;

export class SurrenderAction extends GameAction<typeof schema> {
  readonly name = 'surrender';
  readonly phase = GAME_PHASES.BATTLE;

  protected override readonly allowDuringEnemyTurn = true;

  protected payloadSchema = schema;

  async impl() {
    await this.player.general.destroy();
  }
}
