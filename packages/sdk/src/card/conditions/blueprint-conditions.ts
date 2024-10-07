import { match } from 'ts-pattern';
import type { GameSession } from '../../game-session';
import type { Player } from '../../player/player';
import type { Card } from '../card';
import type { Filter } from '../card-effect';
import type { AnyObject, Nullable, Point3D } from '@game/shared';
import { getUnits, type UnitCondition } from './unit-conditions';
import { getCards, type CardCondition } from './card-conditions';
import type { CardBlueprint } from '../card-blueprint';
import type { Entity } from '../../entity/entity';

export type BlueprintCondition =
  | { type: 'static'; params: { blueprints: string[] } }
  | { type: 'from_unit'; params: { unit: Filter<UnitCondition> } }
  | { type: 'from_card'; params: { card: Filter<CardCondition> } };

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
