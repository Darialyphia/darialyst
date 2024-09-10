import type { ServerSession } from '../server-session';
import { getHighestScoredAction, type AIAgent } from './agent';
import type { Player } from '../player/player';
import type { SerializedAction } from '../action/action';
import { AISessionScorer } from './session-scorer';
import { AIEntityAgent } from './entity-agent';
import { isDefined } from '@game/shared';

export class AIPlayerAgent implements AIAgent {
  constructor(
    private session: ServerSession,
    private player: Player
  ) {}

  async getNextAction() {
    const [replaceScores, entitiesScores, playCardScore] = await Promise.all([
      this.computeReplaceScores(),
      this.computeEntitiesScores(),
      this.computePlayCardScores()
    ]);
    return getHighestScoredAction(
      [...replaceScores, ...entitiesScores, ...playCardScore].filter(isDefined)
    );
  }

  private async runSimulation(action: SerializedAction) {
    const session = this.session.clone();
    await this.session.runSimulation(action, session);
    const scorer = new AISessionScorer(
      session,
      session.playerSystem.getPlayerById(this.player.id)!
    );

    return scorer.getScore();
  }

  private async evaluateAction(action: SerializedAction) {
    const score = await this.runSimulation(action);
    return { action, score };
  }

  private async computeReplaceScores() {
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

  private async computeEntitiesScores() {
    return Promise.all(
      this.player.entities.map(entity => {
        const agent = new AIEntityAgent(this.session, entity);
        return agent.getNextAction();
      })
    );
  }

  private async computePlayCardScores() {
    const actions = await Promise.all(
      this.player.hand.map(async (card, index) => {
        const canPlay = this.player.canPlayCardAtIndex(index);
        if (!canPlay) return;

        const needsTarget = card.blueprint.targets?.minTargetCount;
        if (needsTarget) return;

        const cells = this.session.boardSystem.cells.filter(cell => {
          return card.canPlayAt(cell.position, true);
        });

        return Promise.all(
          cells.map(cell => {
            return this.evaluateAction({
              type: 'playCard',
              payload: {
                playerId: this.player.id,
                cardIndex: index,
                position: cell.position.serialize(),
                targets: [],
                choice: 0
              }
            });
          })
        );
      })
    );
    return actions.flat().filter(isDefined);
  }
}
