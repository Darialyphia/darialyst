import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6GravityWell = defineSerializedBlueprint({
  id: 'f6_gravity_well',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'epic',
  effects: [
    {
      text: 'Summon four joined @Frost Well@.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'summon_unit',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              blueprint: ['f6_frost_well'],
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              position: {
                candidates: [
                  [{ type: 'is_manual_target', params: { index: 0 } }],
                  [{ type: 'is_manual_target', params: { index: 1 } }],
                  [{ type: 'is_manual_target', params: { index: 2 } }],
                  [{ type: 'is_manual_target', params: { index: 3 } }]
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
    min: 4,
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
                  [{ type: 'is_manual_target', params: { index: 1 } }],
                  [{ type: 'is_manual_target', params: { index: 2 } }]
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
  spriteId: 'icon_f6_gravitywell',
  name: 'Gravity Well',
  cost: 3,
  faction: 'f6'
});
