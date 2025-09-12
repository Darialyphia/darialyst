import { GAME_PHASES } from '../game.constants';
import { GameAction } from './action';
import { defaultActionSchema } from './action.constants';

const schema = defaultActionSchema;

export class EndTurnAction extends GameAction<typeof schema> {
  readonly name = 'endTurn';
  readonly phase = GAME_PHASES.BATTLE;

  protected payloadSchema = schema;

  async impl() {
    await this.session.playerSystem.switchActivePlayer();
  }
}
