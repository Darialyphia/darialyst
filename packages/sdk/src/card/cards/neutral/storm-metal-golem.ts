import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralStormMetalGolem = defineSerializedBlueprint({
  id: 'neutral_storm_metal_golem',
  name: 'Storm Metal Golem',
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
  spriteId: 'neutral_golem_stormmetal',
  cost: 6,
  attack: 8,
  maxHp: 8,
  faction: null
});
