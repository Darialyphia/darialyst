import { isDefined } from '@game/shared';
import type { SerializedAction } from '../action/action';
import type { Entity } from '../entity/entity';
import type { ServerSession } from '../server-session';
import { AISessionScorer } from './session-scorer';
import { getHighestScoredAction, type AIAgent } from './agent';

export class AIEntityAgent implements AIAgent {
  constructor(
    private session: ServerSession,
    private entity: Entity
  ) {}

  get player() {
    return this.entity.player;
  }

  get opponent() {
    return this.player.opponent;
  }

  private async runSimulation(action: SerializedAction) {
    const session = this.session.clone();
    await this.session.runSimulation(action, session);
    const scorer = new AISessionScorer(session, this.entity.player);

    return scorer.getScore();
  }

  private async evaluateAction(action: SerializedAction) {
    const score = await this.runSimulation(action);
    return { action, score };
  }

  private computeAttackScores() {
    return Promise.all(
      this.opponent.entities.map(async enemy => {
        if (!this.entity.canAttack(enemy)) return;
        return this.evaluateAction({
          type: 'attack',
          payload: {
            playerId: this.entity.player.id,
            entityId: this.entity.id,
            targetId: enemy.id
          }
        });
      })
    );
  }

  private computeMovementScores() {
    return Promise.all(
      this.session.boardSystem.cells
        .filter(c => c.isWalkable)
        .map(async cell => {
          if (!this.entity.canMove(this.entity.speed)) return;

          const path = this.session.boardSystem.getPathTo(this.entity, cell);
          if (!path) return;
          const index = Math.min(path.path.length - 1, this.entity.speed - 1);
          const targetCell = path.path[index]!;

          return this.evaluateAction({
            type: 'move',
            payload: {
              playerId: this.entity.player.id,
              entityId: this.entity.id,
              position: targetCell.serialize()
            }
          });
        })
    );
  }

  async getNextAction() {
    const [attackScores, movementScores] = await Promise.all([
      this.computeAttackScores(),
      this.computeMovementScores()
    ]);

    return getHighestScoredAction([...attackScores, ...movementScores].filter(isDefined));
  }
}
