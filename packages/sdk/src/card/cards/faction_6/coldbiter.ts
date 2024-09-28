import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6Coldbiter = defineSerializedBlueprint({
  id: 'f6_coldbiter',
  name: 'Coldbiter',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'ARTIFACT',
  rarity: 'rare',
  effects: [
    {
      text: 'At the end of your turn, deal 2 damage to nearby enemy minions.',
      config: {
        executionContext: 'while_equiped',
        actions: [
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 2 } },
              targets: {
                candidates: [
                  [
                    {
                      type: 'is_nearby',
                      params: {
                        unit: {
                          candidates: [
                            [
                              { type: 'is_general', params: { not: false } },
                              { type: 'is_ally', params: { not: false } }
                            ]
                          ],
                          random: false
                        },
                        cell: { candidates: [], random: false },
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
          }
        ],
        triggers: [
          {
            type: 'on_player_turn_end',
            params: {
              player: {
                candidates: [[{ type: 'ally_player', params: {} }]],
                random: false
              },
              frequency: { type: 'always' }
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
                candidates: [
                  [
                    { type: 'is_ally', params: { not: false } },
                    { type: 'is_general', params: { not: false } }
                  ]
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
  sounds: {},
  spriteId: 'icon_f6_artifact_frostbiter',
  faction: 'f6',
  cost: 2
});
