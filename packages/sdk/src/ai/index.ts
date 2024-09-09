import type { Nullable } from '@game/shared';
import type { SerializedAction } from '../action/action';
import { GAME_PHASES } from '../game-session';
import type { ServerSession } from '../server-session';

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
      const nextAction = await this.evaluateNextAction();
      if (nextAction) return nextAction;
      return { type: 'endTurn', payload: { playerId: this.playerId } };
    }
  }

  async evaluateNextAction(): Promise<Nullable<SerializedAction>> {
    if (this.session.phase === GAME_PHASES.MULLIGAN) {
      return { type: 'mulligan', payload: { playerId: this.playerId, cardIndices: [] } };
    }

    if (this.general.canAttack(this.player.opponent.general)) {
      return this.attackGeneral();
    } else {
      return this.tryToWalkTowardsGeneral();
    }
  }

  attackGeneral() {
    return {
      type: 'attack',
      payload: {
        playerId: this.playerId,
        entityId: this.general.id,
        targetId: this.player.opponent.general.id
      }
    };
  }

  tryToWalkTowardsGeneral() {
    const [destination] = this.session.boardSystem
      .getNeighbors3D(this.player.opponent.general.position)
      .map(cell => {
        const path = this.session.boardSystem.getPathTo(this.general, cell);

        return { cell, path };
      })
      .filter(({ path }) => path)
      .sort(
        (a, b) => this.general.position.dist(a.cell) - this.general.position.dist(b.cell)
      );
    if (!destination) return;

    return {
      type: 'move',
      payload: {
        playerId: this.playerId,
        entityId: this.general.id,
        position: destination.path!.path[this.general.speed - 1]!.serialize()
      }
    };
  }
}
