import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6Hearthsister = defineSerializedBlueprint({
  id: 'f6_hearthsister',
  name: 'Hearthsister',
  collectable: true,
  keywords: ['opening_gambit'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'common',
  effects: [
    {
      text: '@Opening Gambit@: This switches position with another minion.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'swap_units',
            params: {
              unit1: {
                candidates: [[{ type: 'is_self', params: { not: false } }]],
                random: false
              },
              unit2: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ],
                random: false
              },
              filter: {
                candidates: [[{ type: 'played_from_hand', params: {} }]],
                random: false
              },
              execute: 'now'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: {
    min: 0,
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
  spriteId: 'f6_justice',
  cost: 2,
  attack: 3,
  maxHp: 2,
  faction: 'f6'
});
