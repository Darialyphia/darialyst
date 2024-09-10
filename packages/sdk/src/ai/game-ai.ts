import { isDefined, randomInt, type Nullable } from '@game/shared';
import type { SerializedAction } from '../action/action';
import { GAME_PHASES } from '../game-session';
import type { ServerSession } from '../server-session';
import { Entity } from '../entity/entity';
import { AIEntityAgent } from './entity-agent';
import { AIPlayerAgent } from './player-agent';

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

    const agent = new AIPlayerAgent(this.session, this.player);
    const action = await agent.getNextAction();

    return action ?? { type: 'endTurn', payload: { playerId: this.playerId } };
  }

  private tryToReplace() {
    if (!this.player.canReplace()) return;

    const [card] = this.player.hand
      .filter((card, index) => {
        if (!this.player.canPlayCardAtIndex(index)) return true;
        return false;
      })
      .sort((a, b) => b.cost - a.cost);

    if (!card) return null;

    return {
      type: 'replaceCard',
      payload: {
        playerId: this.playerId,
        cardIndex: this.player.hand.indexOf(card)
      }
    };
  }

  private tryToPlayCardAtIndex(index: number) {
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
        if (!aHasGoldCoin && bHasGoldCoin) return 1;

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
}
