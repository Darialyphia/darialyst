import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6AncientGrove = defineSerializedBlueprint({
  id: 'f6_ancient_grove',
  name: 'Ancient Grove',
  collectable: true,
  keywords: ['provoke', 'opening_gambit'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'legendary',
  effects: [
    {
      text: '@Provoke@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'provoke',
            params: {
              filter: { candidates: [], random: false },
              activeWhen: { candidates: [], random: false },
              execute: 'now',
              duration: 'always'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: '@Opening Gambit@: Give allied minions "@Dying Wish@: Summon a @Treant@ on this space.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'add_effect',
            params: {
              unit: {
                candidates: [
                  [
                    { type: 'is_ally', params: { not: false } },
                    { type: 'is_minion', params: { not: false } }
                  ]
                ],
                random: false
              },
              effect: {
                executionContext: 'trigger_while_on_board',
                actions: [
                  {
                    type: 'summon_unit',
                    params: {
                      filter: { candidates: [], random: false },
                      execute: 'now',
                      blueprint: {
                        candidates: [
                          [{ type: 'static', params: { blueprints: ['f6_treant'] } }]
                        ]
                      },
                      player: { candidates: [[{ type: 'ally_player' }]], random: false },
                      position: {
                        candidates: [
                          [
                            {
                              type: 'has_unit',
                              params: {
                                unit: {
                                  candidates: [
                                    [{ type: 'is_self', params: { not: false } }]
                                  ],
                                  random: false
                                }
                              }
                            }
                          ]
                        ],
                        random: false
                      }
                    }
                  }
                ],
                triggers: [
                  {
                    type: 'on_before_unit_destroyed',
                    params: {
                      unit: {
                        candidates: [[{ type: 'is_self', params: { not: false } }]],
                        random: false
                      },
                      frequency: { type: 'always' }
                    }
                  }
                ]
              },
              linkToCard: false,
              execute: 'now',
              filter: { candidates: [], random: false }
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'f6_treant',
  cost: 7,
  attack: 7,
  maxHp: 9,
  faction: 'f6'
});
