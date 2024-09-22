import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6Razorback = defineSerializedBlueprint({
  id: 'f6_razorback',
  name: 'Razorback',
  collectable: true,
  keywords: ['opening_gambit'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'rare',
  effects: [
    {
      text: '@Opening Gambt@: give other ally minions +2/+0.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'change_stats',
            params: {
              mode: 'give',
              stackable: true,
              attack: {
                amount: { type: 'fixed', params: { value: 2 } },
                activeWhen: { candidates: [], random: false }
              },
              hp: {
                amount: { type: 'fixed', params: { value: 0 } },
                activeWhen: { candidates: [], random: false }
              },
              speed: {
                amount: { type: 'fixed', params: { value: 0 } },
                activeWhen: { candidates: [], random: false }
              },
              targets: {
                candidates: [
                  [
                    { type: 'is_ally', params: { not: false } },
                    { type: 'is_minion', params: { not: false } },
                    { type: 'is_self', params: { not: true } }
                  ]
                ],
                random: false
              },
              filter: {
                candidates: [[{ type: 'played_from_hand', params: {} }]],
                random: false
              },
              duration: 'always',
              execute: 'now'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [
    [
      {
        type: 'has_unit',
        params: {
          unit: {
            candidates: [
              [
                { type: 'is_ally', params: { not: false } },
                { type: 'is_minion', params: { not: false } }
              ]
            ],
            random: false
          }
        }
      }
    ]
  ],
  spriteId: 'f6_sentinel',
  cost: 4,
  attack: 4,
  maxHp: 3,
  faction: 'f6'
});
