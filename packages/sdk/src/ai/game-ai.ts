import { isDefined, randomInt, type Nullable } from '@game/shared';
import type { SerializedAction } from '../action/action';
import { GAME_PHASES } from '../game-session';
import type { ServerSession } from '../server-session';
import { Entity } from '../entity/entity';
import { AIAgent } from './ai-agent';

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

    const generalAgent = new AIAgent(this.session, this.general);
    const generalAction = generalAgent.getNextAction();
    if (generalAction) return generalAction;

    const [playCardAction] = this.player.hand
      .map((card, index) => ({ card, action: this.tryToPlayCardAtIndex(index) }))
      .filter(({ action }) => isDefined(action))
      .sort((a, b) => {
        return b.card.cost - a.card.cost;
      });

    if (playCardAction) return playCardAction.action!;

    const entityActions = (
      await Promise.all(
        this.player.entities.map(entity => {
          const agent = new AIAgent(this.session, entity);
          return agent.getBestAction();
        })
      )
    ).flat();
    if (entityActions.length) {
      const action = entityActions.sort((a, b) => b.score - a.score);
      return action[0].action;
    }

    return { type: 'endTurn', payload: { playerId: this.playerId } };
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
