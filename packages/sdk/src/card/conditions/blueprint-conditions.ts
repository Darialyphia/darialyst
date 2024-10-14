import { match } from 'ts-pattern';
import type { GameSession } from '../../game-session';
import type { Player } from '../../player/player';
import type { Card } from '../card';
import type { Filter, NumericOperator } from '../card-effect';
import type { AnyObject, Nullable, Point3D } from '@game/shared';
import {
  getUnits,
  type UnitCondition,
  type UnitConditionExtras
} from './unit-conditions';
import { getCards, type CardCondition } from './card-conditions';
import type { CardBlueprint } from '../card-blueprint';
import type { Entity } from '../../entity/entity';
import { getAmount, type Amount } from '../helpers/amount';
import { CARD_KINDS, Faction, type FactionId } from '../card-enums';
import type { KeywordId } from '../../utils/keywords';

export type BlueprintCondition =
  | { type: 'static'; params: { blueprints: string[] } }
  | { type: 'from_unit'; params: { unit: Filter<UnitCondition> } }
  | { type: 'from_card'; params: { card: Filter<CardCondition> } }
  | { type: 'minion'; params: {} }
  | { type: 'spell'; params: {} }
  | { type: 'artifact'; params: {} }
  | {
      type: 'cost';
      params: {
        operator: NumericOperator;
        amount: Amount<{ unit: UnitConditionExtras['type'] }>;
      };
    }
  | { type: 'has_tag'; params: { tag: string } }
  | { type: 'has_keyword'; params: { keyword: KeywordId } }
  | { type: 'from_faction'; params: { factions: (FactionId | null)[] } };

export const getBlueprints = ({
  session,
  entity,
  card,
  targets,
  conditions,
  event,
  eventName
}: {
  session: GameSession;
  entity?: Entity;
  card: Card;
  targets: Array<Nullable<Point3D>>;
  conditions: Filter<BlueprintCondition>;
  event: AnyObject;
  eventName?: string;
}): CardBlueprint[] => {
  const results = Object.values(session.cardBlueprints).filter(blueprint => {
    return conditions.candidates.some(group => {
      return group.every(condition => {
        return match(condition)
          .with({ type: 'static' }, condition => {
            return condition.params.blueprints.includes(blueprint.id);
          })
          .with({ type: 'from_unit' }, condition => {
            const units = getUnits({
              conditions: condition.params.unit,
              targets,
              session,
              entity,
              card,
              event,
              eventName
            });

            return units.some(unit => unit.card.blueprintId === blueprint.id);
          })
          .with({ type: 'from_card' }, condition => {
            const cards = getCards({
              conditions: condition.params.card,
              targets,
              session,
              entity,
              card,
              event,
              eventName
            });

            return cards.some(card => card.blueprintId === blueprint.id);
          })
          .with({ type: 'minion' }, () => blueprint.kind === CARD_KINDS.MINION)
          .with({ type: 'spell' }, () => blueprint.kind === CARD_KINDS.SPELL)
          .with({ type: 'artifact' }, () => blueprint.kind === CARD_KINDS.ARTIFACT)
          .with({ type: 'cost' }, condition => {
            const amount = getAmount({
              session,
              entity,
              card,
              targets,
              amount: condition.params.amount,
              event,
              eventName
            });
            return match(condition.params.operator)
              .with('equals', () => blueprint.cost === amount)
              .with('less_than', () => blueprint.cost < amount)
              .with('more_than', () => blueprint.cost > amount)
              .exhaustive();
          })
          .with({ type: 'has_tag' }, condition => {
            return blueprint.tags?.some(tag => tag.id === condition.params.tag);
          })
          .with({ type: 'has_keyword' }, condition => {
            return blueprint.keywords?.some(
              keyword => keyword.id === condition.params.keyword
            );
          })
          .with({ type: 'from_faction' }, condition => {
            return condition.params.factions.includes(
              (blueprint.faction?.id as FactionId) ?? null
            );
          })
          .exhaustive();
      });
    });
  });
  if (conditions.random && results.length) {
    const index = session.rngSystem.nextInt(results.length - 1);
    return [results[index]];
  }
  return results;
};
