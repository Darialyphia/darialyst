import { isDefined, Vec3, type Defined, type Point3D } from '@game/shared';
import { type Entity } from '../entity/entity';
import type { GameFormat, GameSession } from '../game-session';
import { createCardModifier } from '../modifier/card-modifier';
import { CARD_KINDS, getFactionById } from './card-enums';
import { getKeywordById } from '../utils/keywords';
import { getTagById } from '../utils/tribes';
import { match } from 'ts-pattern';
import {
  whileEquipped,
  whileInDeck,
  whileInHand,
  whileOnBoard
} from '../modifier/modifier-utils';
import { type EntityModifier } from '../modifier/entity-modifier';
import type { CardBlueprint, SerializedBlueprint } from './card-blueprint';
import type { GenericCardEffect } from './card-effect';
import { parseTargets } from './card-targets';
import type { PlayerArtifact } from '../player/player-artifact';
import { defaultConfig } from '../config';
import { CARDS } from './card-lookup';
import type { Card } from './card';
import { getCells } from './conditions/cell-conditions';

import { getEffectCtxEntity, parseSerializedBlueprintEffect } from './effect-parser';

export type EffectCtx = Parameters<Defined<CardBlueprint['onPlay']>>[0] & {
  entity?: Entity;
  artifact?: PlayerArtifact;
  playedPoint?: Point3D;
  modifierRecipient?: Entity;
};

const cache = new Map<string, CardBlueprint>();
// Needed to reevaluate blueprints after a used edits their custom format
export const clearParsedBlueprintCache = () => {
  cache.clear();
};
export const parseSerializeBlueprint = <T extends GenericCardEffect[]>(
  blueprint: SerializedBlueprint<T>,
  format: Pick<GameFormat, 'config' | 'cards'> = { config: defaultConfig, cards: CARDS },
  { noCache }: { noCache: boolean } = { noCache: false }
) => {
  const cacheKey = `${blueprint.id}:${JSON.stringify(format)}`;
  if (cache.has(cacheKey) && !noCache) {
    return cache.get(cacheKey)!;
  }
  // first, parse the blueprint effects

  const effects = blueprint.effects.map(effect => ({
    ...effect,
    actions: parseSerializedBlueprintEffect(effect)
  }));

  // add card modifiers that have already been evaluated
  const cardModifiers = () =>
    effects
      .map(effect => {
        return match(effect.config.executionContext)
          .with('trigger_while_in_hand', () => {
            return effect.actions
              .map(action => {
                if (!action.getCardModifier) return null;
                const modifier = action.getCardModifier();
                return createCardModifier({
                  stackable: false,
                  mixins: [
                    {
                      onApplied(session, card) {
                        whileInHand(
                          card,
                          () => {
                            card.addModifier(modifier);
                          },
                          () => {
                            card.removeModifier(modifier.id);
                          }
                        );
                      }
                    }
                  ]
                });
              })
              .flat()
              .filter(isDefined);
          })
          .with('while_in_hand', () => {
            return effect.actions
              .map(action => {
                if (!action.getCardModifier) return null;
                return action.getCardModifier();
              })
              .flat()
              .filter(isDefined);
          })
          .with('while_in_deck', () => {
            return effect.actions
              .map(action => {
                if (!action.getCardModifier) return null;
                const modifier = action.getCardModifier();
                return createCardModifier({
                  stackable: false,
                  mixins: [
                    {
                      onApplied(session, card) {
                        whileInDeck(
                          card,
                          () => {
                            card.addModifier(modifier);
                          },
                          () => {
                            card.removeModifier(modifier.id);
                          }
                        );
                      }
                    }
                  ]
                });
              })
              .flat()
              .filter(isDefined);
          })
          .with('while_in_graveyard', () => {
            // TODO graveyard management not ready yet
            return null;
          })
          .otherwise(() => null);
      })
      .flat()
      .filter(isDefined);

  // define the base blueprint data
  const base: Omit<CardBlueprint, 'kind'> = {
    id: blueprint.id,
    name: blueprint.name,
    description: blueprint.effects.map(effect => effect.text).join('\n'),
    collectable: blueprint.collectable,
    rarity: blueprint.rarity,
    faction: blueprint.faction ? (getFactionById(blueprint.faction) ?? null) : null,
    spriteId: blueprint.spriteId,
    cost: blueprint.cost,
    relatedBlueprintIds: blueprint.relatedBlueprintIds,
    keywords: blueprint.keywords.map(getKeywordById).filter(isDefined),
    tags: blueprint.tags.map(getTagById).filter(isDefined),
    sounds: blueprint.sounds,
    modifiers: cardModifiers,
    targets: blueprint.targets ? parseTargets(blueprint.targets) : undefined,
    shouldHighlightCell(
      point: Point3D,
      options: {
        session: GameSession;
        playedPoint?: Point3D;
        targets: Point3D[];
        card: Card;
      }
    ) {
      if (!blueprint.cellHighlights || !blueprint.cellHighlights.length) {
        return match(blueprint.kind)
          .with(CARD_KINDS.MINION, CARD_KINDS.GENERAL, CARD_KINDS.ARTIFACT, () => false)
          .with(CARD_KINDS.SPELL, () => {
            return options.targets.some(target => Vec3.fromPoint3D(point).equals(target));
          })
          .exhaustive();
      }

      return getCells({
        session: options.session,
        event: {},
        card: options.card,
        targets: options.targets,
        conditions: { candidates: blueprint.cellHighlights, random: false },
        playedPoint: options.playedPoint
      }).some(cell => {
        return cell.position.equals(point);
      });
    },
    getHighlightedCells(options: {
      session: GameSession;
      playedPoint?: Point3D;
      targets: Point3D[];
      card: Card;
    }) {
      if (!blueprint.cellHighlights || !blueprint.cellHighlights.length) {
        return match(blueprint.kind)
          .with(CARD_KINDS.MINION, CARD_KINDS.GENERAL, CARD_KINDS.ARTIFACT, () => [])
          .with(CARD_KINDS.SPELL, () => {
            return options.targets
              .map(point => options.session.boardSystem.getCellAt(point))
              .filter(isDefined);
          })
          .exhaustive();
      }

      return getCells({
        session: options.session,
        event: {},
        card: options.card,
        targets: options.targets,
        conditions: { candidates: blueprint.cellHighlights, random: false },
        playedPoint: options.playedPoint
      });
    },
    async onPlay(ctx: EffectCtx) {
      for (const effect of effects) {
        await match(effect.config.executionContext)
          .with('trigger_while_on_board', async () => {
            for (const action of effect.actions) {
              if (!action.getEntityModifier) return;
              const entityModifier = action.getEntityModifier(ctx);

              whileOnBoard({
                entity: getEffectCtxEntity(ctx),
                source: ctx.card,
                onApplied(session, attachedTo) {
                  attachedTo.addModifier(entityModifier);
                },
                onRemoved(session, attachedTo) {
                  return session.actionSystem.schedule(async () => {
                    attachedTo.removeModifier(entityModifier.id);
                  });
                }
              });
            }
          })
          .with('trigger_while_equiped', () => {
            effect.actions.forEach(action => {
              if (!action.getEntityModifier) return;
              const entityModifier = action.getEntityModifier(ctx);

              whileEquipped({ artifact: ctx.artifact!, modifier: entityModifier });
            });
          })
          .with('immediate', 'while_on_board', 'while_equiped', async () => {
            for (const action of effect.actions) {
              await action.onPlay?.(ctx);
            }
          })
          .otherwise(() => {
            return;
          });
      }
    }
  };

  // add blueprint kind specific informations
  const withStats = match(blueprint)
    .with({ kind: CARD_KINDS.GENERAL }, { kind: CARD_KINDS.MINION }, blueprint => {
      const parsed = {
        ...base,
        kind: blueprint.kind,
        attack: blueprint.attack,
        maxHp: blueprint.maxHp,
        speed: format.config.UNIT_DEFAULT_SPEED,
        range: 1
      };

      return parsed as CardBlueprint;
    })
    .with({ kind: CARD_KINDS.SPELL }, blueprint => {
      const parsed = {
        ...base,
        kind: blueprint.kind
      };

      return parsed as CardBlueprint;
    })
    .with({ kind: CARD_KINDS.ARTIFACT }, blueprint => {
      const parsed = {
        ...base,
        kind: blueprint.kind
      };

      return parsed as CardBlueprint;
    })
    .exhaustive();

  // finally, run the on init effects now that the blueprint has been fully constructed
  effects.forEach(effect => {
    effect.actions.forEach(action => {
      if (action.onInit) {
        action.onInit(withStats);
      }
    });
  });

  if (!noCache) {
    cache.set(cacheKey, withStats);
  }

  return withStats;
};
