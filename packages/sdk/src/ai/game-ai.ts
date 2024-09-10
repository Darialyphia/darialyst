import { isDefined, randomInt, type Nullable } from '@game/shared';
import type { SerializedAction } from '../action/action';
import { GAME_PHASES } from '../game-session';
import type { ServerSession } from '../server-session';
import { Entity } from '../entity/entity';
import { AiAgent } from './ai-agent';

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

    const generalAgent = new AiAgent(this.session, this.general);
    const generalAction = generalAgent.getNextAction();
    if (generalAction) return generalAction;

    const [playCardAction] = this.player.hand
      .map((card, index) => ({ card, action: this.tryToPlayCardAtIndex(index) }))
      .filter(({ action }) => isDefined(action))
      .sort((a, b) => {
        return b.card.cost - a.card.cost;
      });

    if (playCardAction) return playCardAction.action!;

    for (const entity of this.player.entities) {
      const agent = new AiAgent(this.session, entity);
      const action = agent.getNextAction();
      if (action) return action;
    }

    return { type: 'endTurn', payload: { playerId: this.playerId } };
  }

  private tryToReplace() {
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

  private getMostExpensiveCardIndex() {
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
