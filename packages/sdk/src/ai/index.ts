import { randomInt, type Nullable } from '@game/shared';
import type { SerializedAction } from '../action/action';
import { GAME_PHASES } from '../game-session';
import type { ServerSession } from '../server-session';
import { Entity } from '../entity/entity';

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

    if (this.player.isActive || this.session.phase === GAME_PHASES.MULLIGAN) {
      const now = Date.now();
      const nextAction = await this.evaluateNextAction();
      console.log(`AI action computed in ${Date.now() - now}`);
      return nextAction;
    }
  }

  async evaluateNextAction(): Promise<SerializedAction> {
    if (this.session.phase === GAME_PHASES.MULLIGAN) {
      return { type: 'mulligan', payload: { playerId: this.playerId, cardIndices: [] } };
    }

    const replaceAction = this.tryToReplace();
    if (replaceAction) return replaceAction;

    const generalAction = this.getEntityAction(this.general);
    if (generalAction) return generalAction;

    for (let i = 0; i < this.player.hand.length; i++) {
      const action = this.tryToPlayCardAtIndex(i);
      if (action) return action;
    }

    for (const entity of this.player.entities) {
      const action = this.getEntityAction(entity);
      if (action) return action;
    }

    return { type: 'endTurn', payload: { playerId: this.playerId } };
  }

  tryToReplace() {
    if (!this.player.canReplace()) return;

    const idx = this.getMostExpensiveCardIndex();
    if (idx !== -1) {
      return {
        type: 'replaceCard',
        payload: {
          playerId: this.playerId,
          cardIndex: idx
        }
      };
    }
  }

  getMostExpensiveCardIndex() {
    let index = -1;
    let highest = 0;
    this.player.hand.forEach((card, i) => {
      if (card.cost >= highest) {
        index = i;
        highest = card.cost;
      }
    });

    return index;
  }

  getEntityAction(entity: Entity) {
    const distanceMap = this.session.boardSystem.getDistanceMap(
      entity.position,
      entity.speed * (entity.maxMovements - entity.movementsTaken)
    )!;

    const [bestTarget] = this.player.opponent.entities
      .filter(enemy => {
        if (entity.canAttackAt(enemy.position)) return true;

        const neighbors = this.session.boardSystem.getNeighborsDestinations(
          enemy.position
        );
        return neighbors.some(neighbor => {
          return (
            entity.canMove(distanceMap.get(neighbor), { countAllMovements: true }) &&
            entity.canAttackAt(enemy.position, neighbor)
          );
        });
      })
      .sort((a, b) => {
        if (a.isGeneral && !b.isGeneral) return -1;
        if (b.isGeneral && !a.isGeneral) return 1;
        const aIsKillingBlow =
          a.getTakenDamage(entity.getDealtDamage(entity.attack), entity.card) >= a.hp;

        const bIsKillingBlow =
          b.getTakenDamage(entity.getDealtDamage(entity.attack), entity.card) >= b.hp;

        if (aIsKillingBlow && !bIsKillingBlow) return -1;
        if (!aIsKillingBlow && bIsKillingBlow) return -1;

        const aRetaliationIsKillingBlow =
          entity.getTakenDamage(a.getDealtDamage(a.attack), a.card) >= entity.hp;
        const bRetaliationIsKillingBlow =
          entity.getTakenDamage(b.getDealtDamage(b.attack), b.card) >= entity.hp;

        if (aRetaliationIsKillingBlow && !bRetaliationIsKillingBlow) return 1;
        if (!aRetaliationIsKillingBlow && bRetaliationIsKillingBlow) return 1;

        return 0;
      });

    if (bestTarget) {
      if (entity.canAttack(bestTarget)) {
        return this.attack(entity, bestTarget);
      } else {
        return this.tryToWalkTowardsEntity(entity, bestTarget);
      }
    } else {
      return this.tryToWalkTowardsEntity(entity, this.player.opponent.general);
    }
  }

  attack(attacker: Entity, target: Entity) {
    return {
      type: 'attack',
      payload: {
        playerId: this.playerId,
        entityId: attacker.id,
        targetId: target.id
      }
    };
  }

  tryToPlayCardAtIndex(index: number) {
    const card = this.player.hand[index];
    const canPlay = this.player.canPlayCardAtIndex(index);
    if (!canPlay) return;

    const needsTarget = card.blueprint.targets?.minTargetCount;
    if (needsTarget) return;

    const [cell] = this.session.boardSystem.cells
      .filter(cell => card.canPlayAt(cell, true))
      .sort((a, b) => {
        const aHasGoldCoin = a.tile?.blueprintId === 'gold_coin';
        const bHasGoldCoin = b.tile?.blueprintId === 'gold_coin';

        if (aHasGoldCoin && !bHasGoldCoin) return -1;
        if (!aHasGoldCoin && bHasGoldCoin) return -1;

        return (
          a.position.dist(this.player.general.position) -
          b.position.dist(this.player.general.position)
        );
      });

    if (!cell) return;

    return {
      type: 'playCard',
      payload: {
        playerId: this.player.id,
        cardIndex: index,
        position: cell.position.serialize(),
        targets: [],
        choice: 0
      }
    };
  }

  getShortestPathToEntity(source: Entity, target: Entity) {
    const [destination] = this.session.boardSystem
      .getNeighbors3D(target.position)
      .map(cell => {
        const path = this.session.boardSystem.getPathTo(source, cell);

        return { cell, path };
      })
      .filter(({ path }) => path)
      .sort((a, b) => source.position.dist(a.cell) - source.position.dist(b.cell));

    if (!destination) return null;
    if (!destination.path) return null;

    return destination.path.path;
  }

  tryToWalkTowardsEntity(entity: Entity, target: Entity) {
    if (!entity.canMove(entity.speed)) return;
    const path = this.getShortestPathToEntity(entity, target);
    if (!path) return null;

    const index = Math.min(path.length - 1, entity.speed - 1);
    const targetCell = path[index]!;

    return {
      type: 'move',
      payload: {
        playerId: this.playerId,
        entityId: entity.id,
        position: targetCell.serialize()
      }
    };
  }
}
