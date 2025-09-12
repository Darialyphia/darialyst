import { defineSerializedBlueprint } from '../../type-helpers';

export const f6Mesmerize = defineSerializedBlueprint({
  id: 'f6_mesmerize',
  name: 'Mesmerize',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'common',
  effects: [
    {
      text: 'Deal 3 damage to enemy minions on a column and freeze them until your next turn.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 3 } },
              targets: {
                candidates: [
                  [
                    {
                      type: 'is_same_column',
                      params: {
                        cell: {
                          candidates: [
                            [{ type: 'is_manual_target', params: { index: 0 } }]
                          ],
                          random: false
                        },
                        not: false
                      }
                    },
                    { type: 'is_enemy', params: { not: false } },
                    { type: 'is_minion', params: { not: false } }
                  ]
                ],
                random: false
              },
              execute: 'now',
              filter: { candidates: [], random: false }
            }
          },
          {
            type: 'freeze',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              target: {
                candidates: [
                  [
                    {
                      type: 'is_same_column',
                      params: { cell: { candidates: [], random: false }, not: false }
                    },
                    { type: 'is_enemy', params: { not: false } },
                    { type: 'is_minion', params: { not: false } }
                  ]
                ],
                random: false
              },
              duration: 'start_of_next_turn'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 1, targets: [[[{ type: 'any_cell' }]]] },
  cellHighlights: [
    [
      {
        type: 'is_same_column',
        params: {
          cell: {
            candidates: [[{ type: 'is_manual_target', params: { index: 0 } }]],
            random: false
          }
        }
      },
      {
        type: 'has_unit',
        params: {
          unit: {
            candidates: [
              [
                { type: 'is_enemy', params: { not: false } },
                { type: 'is_minion', params: { not: false } }
              ]
            ],
            random: false
          }
        }
      }
    ]
  ],
  spriteId: 'icon_f6_mesmerize',
  cost: 2,
  faction: 'f6'
});
