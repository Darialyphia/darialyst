import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralDragonboneGolem = defineSerializedBlueprint({
  id: 'neutral_dragonbone_golem',
  name: 'Dragonbone Golem',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: ['golem'],
  kind: 'MINION',
  rarity: 'common',
  effects: [],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'neutral_golem_dragonbone',
  cost: 7,
  attack: 10,
  maxHp: 10,
  faction: null
});
