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
  ARTIFACT: 0,
  MINION_KILLING_BLOW: 3,
  GENERAL_KILLING_BLOW: 999
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
    let score = BASE_SCORES.ENTITY + entity.hp + entity.attack;

    if (entity.player.equals(this.player)) {
      score -= this.getClosestEnemyDistance(entity);
    }

    if (this.canKillUnit(entity)) {
      score += BASE_SCORES.MINION_KILLING_BLOW;
    }
    if (this.canKillGeneral(entity)) {
      score += BASE_SCORES.GENERAL_KILLING_BLOW;
    }

    return score;
  }

  private getArtifactScore(artifact: PlayerArtifact) {
    return BASE_SCORES.ARTIFACT + artifact.durability;
  }

  private getCardScore(card: Card) {
    return card.player.canPlayCardAtIndex(card.player.hand.indexOf(card))
      ? BASE_SCORES.PLAYABLE_CARD
      : BASE_SCORES.CARD;
  }

  private getClosestEnemyDistance(entity: Entity) {
    const enemiesDistance = entity.player.opponent.entities
      .map(e =>
        this.session.boardSystem.getManhattanDistance(entity.position, e.position)
      )
      .sort((a, b) => a - b);

    return enemiesDistance.at(0) ?? 0;
  }

  private predictDamage(attacker: Entity, defender: Entity) {
    return defender.getTakenDamage(
      attacker.getDealtDamage(attacker.attack),
      attacker.card
    );
  }

  private canKillGeneral(entity: Entity) {
    return (
      this.predictDamage(entity, entity.player.opponent.general) >=
      entity.player.opponent.general.hp
    );
  }

  private canKillUnit(entity: Entity) {
    const attackableEnemies = entity.player.opponent.entities.filter(e =>
      entity.canAttack(e)
    );
    const hasKillingBlow = attackableEnemies.some(
      enemy => this.predictDamage(entity, enemy) >= enemy.hp
    );

    return hasKillingBlow;
  }
}
