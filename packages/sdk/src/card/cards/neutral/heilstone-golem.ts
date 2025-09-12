import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralHailstoneGolem = defineSerializedBlueprint({
  id: 'neutral_hailstone_golem',
  name: 'Hailstone Golem',
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
  spriteId: 'neutral_golem_ice',
  cost: 4,
  attack: 4,
  maxHp: 6,
  faction: null
});
