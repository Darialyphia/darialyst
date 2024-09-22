import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6GhostWolf = defineSerializedBlueprint({
  id: 'f6_ghost_wolf',
  name: 'Ghost Wolf',
  collectable: false,
  keywords: ['dying_wish'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'token',
  effects: [],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  cost: 2,
  attack: 3,
  maxHp: 3,
  spriteId: 'f6_spiritwolf',
  faction: 'f6'
});
