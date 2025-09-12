import { defineSerializedBlueprint } from '../../type-helpers';

export const f6BonechillBarrier = defineSerializedBlueprint({
  id: 'f6_bonechill_barrier',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'common',
  effects: [
    {
      text: 'Summon three joined @Ice Barrier@.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'summon_unit',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              blueprint: {
                candidates: [
                  [{ type: 'static', params: { blueprints: ['f6_ice_barrier'] } }]
                ]
              },
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              position: {
                candidates: [
                  [{ type: 'is_manual_target', params: { index: 0 } }],
                  [{ type: 'is_manual_target', params: { index: 1 } }],
                  [{ type: 'is_manual_target', params: { index: 2 } }]
                ],
                random: false
              }
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: {
    min: 3,
    targets: [
      [
        [
          { type: 'is_empty' },
          {
            type: 'is_nearby',
            params: {
              unit: {
                candidates: [[{ type: 'is_ally', params: { not: false } }]],
                random: false
              },
              cell: { candidates: [], random: false }
            }
          }
        ]
      ],
      [
        [
          { type: 'is_empty' },
          {
            type: 'is_nearby',
            params: {
              unit: { candidates: [], random: false },
              cell: {
                candidates: [[{ type: 'is_manual_target', params: { index: 0 } }]],
                random: false
              }
            }
          }
        ]
      ],
      [
        [
          { type: 'is_empty' },
          {
            type: 'is_nearby',
            params: {
              unit: { candidates: [], random: false },
              cell: {
                candidates: [
                  [{ type: 'is_manual_target', params: { index: 0 } }],
                  [{ type: 'is_manual_target', params: { index: 1 } }]
                ],
                random: false
              }
            }
          }
        ]
      ]
    ]
  },
  cellHighlights: [],
  spriteId: 'icon_f6_bonechillbarrier',
  name: 'Bonechill Barrier',
  cost: 2,
  faction: 'f6'
});
