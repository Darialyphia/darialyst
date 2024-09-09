import { randomInt, type Nullable } from '@game/shared';
import type { SerializedAction } from '../action/action';
import { GAME_PHASES } from '../game-session';
import type { ServerSession } from '../server-session';
import type { Entity } from '../entity/entity';

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
    console.group('AI: compute next action');
    console.log('AI: process action', action.type);
    await this.session.dispatch(action);

    if (this.player.isActive || this.session.phase === GAME_PHASES.MULLIGAN) {
      const nextAction = await this.evaluateNextAction();
      console.log('AI: next action is', nextAction.type);
      console.groupEnd();
      return nextAction;
    } else {
      console.log('AI: is not the active player. Do nothing');
      console.groupEnd();
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
    if (entity.canAttack(this.player.opponent.general)) {
      return this.attackGeneral(entity);
    } else {
      return this.tryToWalkTowardsGeneral(entity);
    }
  }

  attackGeneral(entity: Entity) {
    return {
      type: 'attack',
      payload: {
        playerId: this.playerId,
        entityId: entity.id,
        targetId: this.player.opponent.general.id
      }
    };
  }

  tryToPlayCardAtIndex(index: number) {
    const card = this.player.hand[index];
    console.log('try to play', card.blueprintId);
    const canPlay = this.player.canPlayCardAtIndex(index);
    if (!canPlay) {
      console.log('too expensive');
      return;
    }

    const needsTarget = card.blueprint.targets?.minTargetCount;
    if (needsTarget) return;

    const elligiblePostions = this.session.boardSystem.cells.filter(cell =>
      card.canPlayAt(cell, true)
    );

    if (!elligiblePostions.length) return;
    const targetIndex = randomInt(elligiblePostions.length - 1);

    return {
      type: 'playCard',
      payload: {
        playerId: this.player.id,
        cardIndex: index,
        position: elligiblePostions[targetIndex].position.serialize(),
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

  tryToWalkTowardsGeneral(entity: Entity) {
    if (!entity.canMove(entity.speed)) return;
    const path = this.getShortestPathToEntity(entity, this.player.opponent.general);
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
