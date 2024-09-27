import { defineSerializedBlueprint } from '../../card-blueprint';

export const f5Metamorphosis = defineSerializedBlueprint({
  id: 'f5_metamorphosis',
  name: 'Metamorphosis',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'legendary',
  effects: [
    {
      text: 'Transform all minions into @Magma@ until your next turn.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'transform_unit',
            params: {
              blueprint: {
                candidates: [[{ type: 'static', params: { blueprints: ['f5_magma'] } }]]
              },
              unit: { candidates: [[{ type: 'is_minion', params: { not: false } }]] },
              execute: 'now',
              duration: 'start_of_next_turn',
              filter: { candidates: [], random: false }
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 0, targets: [[[{ type: 'any_cell' }]]] },
  cellHighlights: [],
  spriteId: 'icon_f5_metamorphosis',
  cost: 6,
  faction: 'f5'
});
