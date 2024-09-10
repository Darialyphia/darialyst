import { isDefined } from '@game/shared';
import type { SerializedAction } from '../action/action';
import type { Entity } from '../entity/entity';
import { GameSession } from '../game-session';
import { ServerRngSystem } from '../rng-system';
import type { ServerSession } from '../server-session';
import { AISessionScorer } from './session-scorer';

type ScoredAction = {
  action: SerializedAction;
  score: number;
};

export class AIAgent {
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

  async getBestAction() {
    const attackScores = await Promise.all(
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

    const movementScores = await Promise.all(
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

    return [...attackScores, ...movementScores]
      .filter(isDefined)
      .sort((a, b) => b.score - a.score);
  }

  getNextAction() {
    const bestTarget = this.getBestTarget();
    if (bestTarget) {
      if (this.entity.canAttack(bestTarget)) {
        return this.attack(bestTarget);
      } else {
        return this.tryToWalkTowardsEntity(bestTarget);
      }
    } else {
      return this.tryToWalkTowardsEntity(this.entity.player.opponent.general);
    }
  }

  private getBestTarget() {
    const distanceMap = this.session.boardSystem.getDistanceMap(
      this.entity.position,
      this.entity.speed * (this.entity.maxMovements - this.entity.movementsTaken)
    )!;

    const [bestTarget] = this.entity.player.opponent.entities
      .filter(enemy => {
        if (this.entity.canAttackAt(enemy.position)) return true;

        const neighbors = this.session.boardSystem.getNeighborsDestinations(
          enemy.position
        );
        return neighbors.some(neighbor => {
          return (
            this.entity.canMove(distanceMap.get(neighbor), { countAllMovements: true }) &&
            this.entity.canAttackAt(enemy.position, neighbor)
          );
        });
      })
      .sort((a, b) => {
        if (a.isGeneral && !b.isGeneral) return -1;
        if (b.isGeneral && !a.isGeneral) return 1;
        const aIsKillingBlow =
          a.getTakenDamage(
            this.entity.getDealtDamage(this.entity.attack),
            this.entity.card
          ) >= a.hp;

        const bIsKillingBlow =
          b.getTakenDamage(
            this.entity.getDealtDamage(this.entity.attack),
            this.entity.card
          ) >= b.hp;

        if (aIsKillingBlow && !bIsKillingBlow) return -1;
        if (!aIsKillingBlow && bIsKillingBlow) return 1;

        const aRetaliationIsKillingBlow =
          this.entity.getTakenDamage(a.getDealtDamage(a.attack), a.card) >=
          this.entity.hp;
        const bRetaliationIsKillingBlow =
          this.entity.getTakenDamage(b.getDealtDamage(b.attack), b.card) >=
          this.entity.hp;

        if (aRetaliationIsKillingBlow && !bRetaliationIsKillingBlow) return 1;
        if (!aRetaliationIsKillingBlow && bRetaliationIsKillingBlow) return -1;

        return 0;
      });

    return bestTarget;
  }

  private attack(target: Entity) {
    return {
      type: 'attack',
      payload: {
        playerId: this.entity.player.id,
        entityId: this.entity.id,
        targetId: target.id
      }
    };
  }

  private getShortestPathToEntity(target: Entity) {
    const [destination] = this.session.boardSystem
      .getNeighbors3D(target.position)
      .map(cell => {
        const path = this.session.boardSystem.getPathTo(this.entity, cell);

        return { cell, path };
      })
      .filter(({ path }) => path)
      .sort(
        (a, b) => this.entity.position.dist(a.cell) - this.entity.position.dist(b.cell)
      );

    if (!destination) return null;
    if (!destination.path) return null;

    return destination.path.path;
  }

  private tryToWalkTowardsEntity(target: Entity) {
    if (!this.entity.canMove(this.entity.speed)) return;
    const path = this.getShortestPathToEntity(target);
    if (!path) return null;

    const index = Math.min(path.length - 1, this.entity.speed - 1);
    const targetCell = path[index]!;

    return {
      type: 'move',
      payload: {
        playerId: this.entity.player.id,
        entityId: this.entity.id,
        position: targetCell.serialize()
      }
    };
  }
}
