import { defineSerializedBlueprint } from '../../card-blueprint';

export const f5KineticEquilibrium = defineSerializedBlueprint({
  id: 'f5_kinetic_equilibrium',
  name: 'Kinetic Equilibrium',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'rare',
  effects: [
    {
      text: 'Your effect Text',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 2 } },
              targets: {
                candidates: [
                  [
                    {
                      type: 'is_on_cell',
                      params: {
                        cell: {
                          candidates: [
                            [
                              {
                                type: '3x3_area',
                                params: {
                                  center: {
                                    candidates: [
                                      [{ type: 'is_manual_target', params: { index: 0 } }]
                                    ],
                                    random: false
                                  }
                                }
                              }
                            ]
                          ]
                        },
                        not: false
                      }
                    },
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
                    {
                      type: 'is_on_cell',
                      params: {
                        cell: {
                          candidates: [
                            [
                              {
                                type: '3x3_area',
                                params: { center: { candidates: [[]], random: false } }
                              }
                            ]
                          ]
                        },
                        not: false
                      }
                    },
                    { type: 'is_minion', params: { not: false } },
                    { type: 'is_ally', params: { not: false } }
                  ]
                ],
                random: false
              },
              filter: { candidates: [], random: false },
              duration: 'always',
              execute: 'now'
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
        type: '3x3_area',
        params: {
          center: {
            candidates: [[{ type: 'is_manual_target', params: { index: 0 } }]],
            random: false
          }
        }
      }
    ]
  ],
  faction: 'f5',
  cost: 2,
  spriteId: 'icon_f5_kineticequilibrium'
});
