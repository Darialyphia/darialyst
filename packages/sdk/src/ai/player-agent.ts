import type { ServerSession } from '../server-session';
import { getHighestScoredAction, type AIAgent } from './agent';
import type { Player } from '../player/player';
import type { SerializedAction } from '../action/action';
import { AISessionScorer } from './session-scorer';
import { AIEntityAgent } from './entity-agent';
import { isDefined } from '@game/shared';
import { GAME_PHASES } from '../game-session';

export class AIPlayerAgent implements AIAgent {
  constructor(
    private session: ServerSession,
    private player: Player
  ) {}

  async getNextAction() {
    if (this.session.phase === GAME_PHASES.MULLIGAN) {
      return {
        action: {
          type: 'mulligan',
          payload: { playerId: this.player.id, cardIndices: this.evaluateMulligan() }
        },
        score: 1
      };
    }

    if (this.player.canReplace()) {
      return getHighestScoredAction(await this.computeReplaceScores());
    }

    const [entitiesScores, playCardScore] = await Promise.all([
      this.computeEntitiesScores(),
      this.computePlayCardScores()
    ]);

    return getHighestScoredAction(
      [...entitiesScores, ...playCardScore].filter(isDefined)
    );
  }

  private evaluateMulligan() {
    const indices: number[] = [];
    const hasPlayableTurn1 = this.player.hand.some(
      c => c.cost <= this.player.currentGold
    );

    this.player.hand.forEach((card, index) => {
      if (hasPlayableTurn1) {
        if (card.cost > this.player.currentGold + 1) indices.push(index);
      } else {
        if (card.cost > this.player.currentGold) indices.push(index);
      }
    });

    return indices;
  }

  private async runSimulation(action: SerializedAction) {
    const session = this.session.clone();

    let invalid = false;
    session.on('game:error', () => {
      console.log('invalid action');
      invalid = true;
    });

    await this.session.runSimulation(action, session);
    const scorer = new AISessionScorer(
      session,
      session.playerSystem.getPlayerById(this.player.id)!
    );

    if (invalid) return Number.NEGATIVE_INFINITY;
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
