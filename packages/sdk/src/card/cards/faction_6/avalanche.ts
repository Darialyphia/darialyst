import { defineSerializedBlueprint } from '../../type-helpers';

export const f6Avalanche = defineSerializedBlueprint({
  id: 'f6_avalanche',
  name: 'Avalanche',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'common',
  effects: [
    {
      text: 'Deal 4 damage to units on your side of the battlefield and @Freeze@ them until your next turn.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 4 } },
              targets: {
                candidates: [
                  [{ type: 'is_on_own_side_of_board', params: { not: false } }]
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
                  [{ type: 'is_on_own_side_of_board', params: { not: false } }]
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
        type: 'has_unit',
        params: {
          unit: {
            candidates: [[{ type: 'is_on_own_side_of_board', params: { not: false } }]],
            random: false
          }
        }
      }
    ]
  ],
  spriteId: 'icon_f6_avalanche',
  cost: 4,
  faction: 'f6'
});
