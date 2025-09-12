import { defineSerializedBlueprint } from '../../type-helpers';

export const f6HailstonePrison = defineSerializedBlueprint({
  id: 'f6_hailstone_prison',
  name: 'Hailstone Prison',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'common',
  effects: [
    {
      text: "Return a minion to its owner's hand.",
      config: {
        actions: [
          {
            type: 'bounce_unit',
            params: {
              targets: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ],
                random: false
              },
              filter: { candidates: [], random: false },
              execute: 'now'
            }
          }
        ],
        executionContext: 'immediate'
      },
      vfx: { tracks: [] }
    }
  ],
  targets: {
    min: 1,
    targets: [
      [
        [
          {
            type: 'has_unit',
            params: {
              unit: {
                candidates: [[{ type: 'is_minion', params: { not: false } }]],
                random: false
              }
            }
          }
        ]
      ]
    ]
  },
  cellHighlights: [],
  sounds: {},
  spriteId: 'icon_f6_hailstoneprison',
  cost: 2,
  faction: 'f6'
});
