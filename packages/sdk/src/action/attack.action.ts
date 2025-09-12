import { z } from 'zod';
import { GameAction } from './action';
import { GAME_PHASES } from '../game.constants';
import { defaultActionSchema } from './action.constants';

const schema = defaultActionSchema.extend({
  entityId: z.number(),
  targetId: z.number()
});

export class AttackAction extends GameAction<typeof schema> {
  readonly name = 'attack';
  readonly phase = GAME_PHASES.BATTLE;
  protected payloadSchema = schema;

  get entity() {
    return this.session.entitySystem.getEntityById(this.payload.entityId);
  }

  get target() {
    return this.session.entitySystem.getEntityById(this.payload.targetId);
  }

  async impl() {
    if (!this.entity) {
      return this.printError(`Entity not found: ${this.payload.entityId}`);
    }

    if (!this.target) {
      return this.printError(`Entity not found: ${this.payload.targetId}`);
    }

    if (!this.session.playerSystem.activePlayer.equals(this.entity.player)) {
      return this.printError(
        `Entity ${this.entity.id} doesn't belong to the active player.`
      );
    }

    if (!this.entity.canAttack(this.target)) {
      return this.printError(
        `Entity ${this.entity.id}(${this.entity.card.blueprintId}) cannot attack Entity ${this.target.id}(${this.target.card.blueprintId})`
      );
    }
    await this.entity.performAttack(this.target);
  }
}
