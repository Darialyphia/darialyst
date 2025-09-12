import type { SerializedAction } from '../action/action';
import { GAME_PHASES } from '../game.constants';
import type { ServerSession } from '../server-session';
import { AIPlayerAgent } from './player-agent';

export class GameAI {
  constructor(
    private session: ServerSession,
    private playerId: string
  ) {
    this.session.logger = () => void 0;
  }

  get player() {
    return this.session.playerSystem.getPlayerById(this.playerId)!;
  }

  get general() {
    return this.player.general;
  }

  async onUpdate(action: SerializedAction) {
    await this.session.dispatch(action);

    if (this.session.winnerId) return;

    if (this.player.isActive || this.session.phase === GAME_PHASES.MULLIGAN) {
      console.log('evaluate next action =================================');
      const nextAction = await this.evaluateNextAction();
      return nextAction;
    }
  }

  async evaluateNextAction(): Promise<SerializedAction> {
    const now = Date.now();
    const agent = new AIPlayerAgent(this.session, this.player);
    const action = await agent.getNextAction();
    console.log(`AI action computed in ${Date.now() - now}`, action);

    return action?.action ?? { type: 'endTurn', payload: { playerId: this.playerId } };
  }
}
