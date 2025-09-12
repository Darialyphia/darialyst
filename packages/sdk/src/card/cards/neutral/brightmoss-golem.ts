import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralBrightmossGolem = defineSerializedBlueprint({
  id: 'neutral_brightmoss_golem',
  name: 'Brightmoss Golem',
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
  spriteId: 'neutral_golem_nature',
  cost: 5,
  attack: 4,
  maxHp: 9,
  faction: null
});
