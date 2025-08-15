import { isDefined, type Point3D } from '@game/shared';
import type { SerializedAction } from '../action/action';
import type { Entity } from '../entity/entity';
import type { ServerSession } from '../server-session';
import { AISessionScorer } from './session-scorer';
import { getHighestScoredAction, type AIAgent, type ScoredAction } from './agent';
import type { Cell } from '../board/cell';

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
    session.isAISimulation = true;
    const now = Date.now();
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

  private async computeAttackScores() {
    const results: ScoredAction[] = [];

    for (const enemy of this.opponent.entities) {
      if (!this.entity.canAttack(enemy)) continue;
      results.push(
        await this.evaluateAction({
          type: 'attack',
          payload: {
            playerId: this.entity.player.id,
            entityId: this.entity.id,
            targetId: enemy.id
          }
        })
      );
    }

    return results;
  }

  private async computeMovementScores() {
    const results: ScoredAction[] = [];
    const positions = new Set<Cell>();

    this.session.boardSystem.cells.forEach(async cell => {
      if (!cell.isWalkable) return null;
      if (!this.entity.canMove(this.entity.speed)) return;

      const path = this.session.boardSystem.getPathTo(this.entity, cell);
      if (!path) return;
      const index = Math.min(path.path.length - 1, this.entity.speed - 1);
      const target = path.path[index]!;

      positions.add(this.session.boardSystem.getCellAt(target)!);
    });

    for (const cell of positions) {
      results.push(
        await this.evaluateAction({
          type: 'move',
          payload: {
            playerId: this.entity.player.id,
            entityId: this.entity.id,
            position: cell.position.serialize()
          }
        })
      );
    }

    return results;
  }

  async getNextAction() {
    const attackScores = await this.computeAttackScores();
    const movementScores = await this.computeMovementScores();

    return getHighestScoredAction([...attackScores, ...movementScores].filter(isDefined));
  }
}
