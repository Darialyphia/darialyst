import type { Card } from '../card/card';
import type { Entity } from '../entity/entity';
import type { GameSession } from '../game-session';
import type { Player } from '../player/player';
import type { PlayerArtifact } from '../player/player-artifact';

const sum = (arr: number[]) => arr.reduce((total, curr) => total + curr, 0);
const BASE_SCORES = {
  ENTITY: 10,
  PLAYABLE_CARD: 2,
  CARD: 1,
  ARTIFACT: 3
} as const;

export class AISessionScorer {
  constructor(
    private session: GameSession,
    private player: Player
  ) {}

  getScore() {
    return this.getPlayerScore(this.player) - this.getPlayerScore(this.player.opponent);
  }

  private getPlayerScore(player: Player) {
    return (
      sum(player.entities.map(this.getEntityScore)) +
      sum(player.artifacts.map(this.getArtifactScore)) +
      sum(player.hand.map(this.getCardScore))
    );
  }

  private getEntityScore(entity: Entity) {
    return BASE_SCORES.ENTITY + entity.hp + entity.attack;
  }

  private getArtifactScore(artifact: PlayerArtifact) {
    return BASE_SCORES.ARTIFACT + artifact.durability;
  }

  private getCardScore(card: Card) {
    return this.player.canPlayCardAtIndex(this.player.hand.indexOf(card))
      ? BASE_SCORES.PLAYABLE_CARD
      : BASE_SCORES.CARD;
  }
}
