import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6BlazingSpines = defineSerializedBlueprint({
  id: 'f6_blazing_spines',
  name: 'Blazing Spines',
  collectable: true,
  keywords: ['wall'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'rare',
  effects: [
    {
      text: 'Summon two joined @Frigid Spines@.',
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
                  [{ type: 'static', params: { blueprints: ['f6_frigid_spines'] } }]
                ]
              },
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              position: {
                candidates: [
                  [{ type: 'is_manual_target', params: { index: 0 } }],
                  [{ type: 'is_manual_target', params: { index: 1 } }]
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
    min: 2,
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
      ]
    ]
  },
  cellHighlights: [],
  spriteId: 'icon_f6_blazingspines',
  cost: 2,
  faction: 'f6'
});
