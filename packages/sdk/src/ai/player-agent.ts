import type { ServerSession } from '../server-session';
import type { AIAgent } from './agent';
import type { Player } from '../player/player';
import type { SerializedAction } from '../action/action';
import { AISessionScorer } from './session-scorer';

export class AIPlayerAgent implements AIAgent {
  constructor(
    private session: ServerSession,
    private player: Player
  ) {}

  async getNextAction() {
    return null;
  }

  private async runSimulation(action: SerializedAction) {
    const session = this.session.clone();
    await this.session.runSimulation(action, session);
    const scorer = new AISessionScorer(session, this.player);

    return scorer.getScore();
  }

  private async evaluateAction(action: SerializedAction) {
    const score = await this.runSimulation(action);
    return { action, score };
  }

  private async computeReplaceAction() {
    if (!this.player.canReplace()) return [];

    return Promise.all(
      this.player.hand.map((card, index) => {
        return this.evaluateAction({
          type: 'replaceCard',
          payload: {
            playerId: this.player.id,
            cardIndex: index
          }
        });
      })
    );
  }
}
