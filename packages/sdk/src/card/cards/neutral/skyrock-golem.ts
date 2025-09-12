import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralSkyrockGolem = defineSerializedBlueprint({
  id: 'neutral_skyrock_golem',
  name: 'Skyrock Golem',
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
  spriteId: 'neutral_golem_runesand',
  cost: 2,
  attack: 4,
  maxHp: 2,
  faction: null
});
