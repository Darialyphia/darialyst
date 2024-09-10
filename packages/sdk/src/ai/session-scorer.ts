import type { Card } from '../card/card';
import type { Entity } from '../entity/entity';
import type { GameSession } from '../game-session';
import type { Player } from '../player/player';
import type { PlayerArtifact } from '../player/player-artifact';

const sum = (arr: number[]) => arr.reduce((total, curr) => total + curr, 0);
const BASE_SCORES = {
  ENTITY: 0,
  PLAYABLE_CARD: 1,
  CARD: 0,
  ARTIFACT: 0
} as const;

const WEIGHTS = {
  GOLD: 2
} as const;

export class AISessionScorer {
  constructor(
    private session: GameSession,
    private player: Player
  ) {
    this.getCardScore = this.getCardScore.bind(this);
    this.getEntityScore = this.getEntityScore.bind(this);
    this.getArtifactScore = this.getArtifactScore.bind(this);
  }

  getScore() {
    return this.getPlayerScore(this.player) - this.getPlayerScore(this.player.opponent);
  }

  private getPlayerScore(player: Player) {
    return (
      player.currentGold * WEIGHTS.GOLD +
      sum(player.entities.map(this.getEntityScore)) +
      sum(player.artifacts.map(this.getArtifactScore)) +
      sum(player.hand.map(this.getCardScore))
    );
  }

  private getEntityScore(entity: Entity) {
    const enemiesDistance = this.player.opponent.entities
      .map(e =>
        this.session.boardSystem.getManhattanDistance(entity.position, e.position)
      )
      .sort((a, b) => a - b);
    const enemiesScoreOffset = enemiesDistance.at(0) ?? 0;

    const base = BASE_SCORES.ENTITY + entity.hp + entity.attack - enemiesScoreOffset;

    return base;
  }

  private getArtifactScore(artifact: PlayerArtifact) {
    return BASE_SCORES.ARTIFACT + artifact.durability;
  }

  private getCardScore(card: Card) {
    return card.player.canPlayCardAtIndex(card.player.hand.indexOf(card))
      ? BASE_SCORES.PLAYABLE_CARD
      : BASE_SCORES.CARD;
  }
}
