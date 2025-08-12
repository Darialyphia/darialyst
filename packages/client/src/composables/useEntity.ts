import type { EntityId } from '@game/sdk';

export const useEntity = (entityId: EntityId) => {
  const { session } = useGame();
  const [entity, unsub] = createClientSessionRef(
    session => session.entitySystem.getEntityById(entityId)!,
    [
      'entity:after_bounce',
      'entity:after_destroy',
      'entity:after_move',
      'entity:after_teleport',
      'scheduler:flushed',
      'entity:after_take_damage',
      'entity:after_heal',
      'entity:created'
    ]
  )(session);

  onUnmounted(unsub);

  return entity;
};
