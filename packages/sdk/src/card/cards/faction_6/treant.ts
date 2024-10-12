import { defineSerializedBlueprint } from '../../card-blueprint';
import { defineCardEffect } from '../../card-effect';

export const f6Treant = defineSerializedBlueprint({
  id: 'f6_treant',
  name: 'Treant',
  collectable: false,
  keywords: [],
  relatedBlueprintIds: [],
  tags: ['vespyr'],
  kind: 'MINION',
  rarity: 'token',
  effects: [
    defineCardEffect({
      text: '@Provoke@.',
      config: {
        executionContext: 'while_on_board',
        actions: [{ type: 'provoke', params: {} }]
      }
    })
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'f6_minitreant',
  cost: 1,
  attack: 1,
  maxHp: 1,
  faction: 'f6'
});
