import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6ChromaticCold = defineSerializedBlueprint({
  id: 'f6_chromatic_cold',
  name: 'Chromatic Cold',
  collectable: true,
  keywords: ['dispel'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'common',
  effects: [
    {
      text: '@Dispel@ a space. If there is an enemy on that space, deal 2 damage to it. ',
      config: {
        actions: [
          {
            type: 'dispel_cell',
            params: {
              cells: {
                candidates: [[{ type: 'is_manual_target', params: { index: 0 } }]],
                random: false
              },
              filter: { candidates: [], random: false },
              execute: 'now'
            }
          },
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 2 } },
              targets: {
                candidates: [
                  [
                    { type: 'is_enemy', params: { not: false } },
                    { type: 'is_manual_target', params: { not: false, index: 0 } }
                  ]
                ],
                random: false
              },
              execute: 'now',
              filter: { candidates: [], random: false }
            }
          }
        ],
        executionContext: 'immediate'
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 1, targets: [[[{ type: 'any_cell' }]]] },
  cellHighlights: [],
  spriteId: 'icon_f6_chromaticcold',
  cost: 2,
  faction: 'f6'
});
