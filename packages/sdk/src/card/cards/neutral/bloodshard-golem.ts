import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralBloodshardGolem = defineSerializedBlueprint({
  id: 'neutral_bloodshard_golem',
  name: 'Bloodshard Golem',
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
  spriteId: 'neutral_golem_bloodshard',
  cost: 3,
  attack: 5,
  maxHp: 3,
  faction: null
});
