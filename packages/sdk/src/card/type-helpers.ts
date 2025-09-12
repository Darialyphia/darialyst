import type { SerializedBlueprint } from './card-blueprint';
import type { GenericCardEffect } from './card-effect';

export const defineSerializedBlueprint = <T extends GenericCardEffect[]>(
  bp: SerializedBlueprint<T>
) => bp;
