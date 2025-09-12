import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralWhistlingBlade = defineSerializedBlueprint({
  id: 'neutral_whistling_blade',
  name: 'Whistling Blade',
  collectable: true,
  keywords: ['veil', 'fearsome'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'rare',
  effects: [
    {
      text: '@Veil@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'veil',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              activeWhen: { candidates: [], random: false },
              duration: 'always'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: '@Fearsome@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'fearsome',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              activeWhen: { candidates: [], random: false },
              duration: 'always'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: '@Essence(1)@: Give a minion @Veil@ until your next turn.',
      config: {
        executionContext: 'while_in_hand',
        actions: [
          {
            type: 'essence',
            params: {
              execute: 'now',
              filter: { candidates: [], random: false },
              effect: {
                executionContext: 'immediate',
                actions: [
                  {
                    type: 'add_effect',
                    params: {
                      unit: {
                        candidates: [
                          [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                        ],
                        random: false
                      },
                      effect: {
                        executionContext: 'while_on_board',
                        actions: [
                          {
                            type: 'veil',
                            params: {
                              filter: { candidates: [], random: false },
                              execute: 'now',
                              activeWhen: { candidates: [], random: false },
                              duration: 'start_of_next_turn'
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
              cost: 1,
              targets: {
                min: 1,
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
              }
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
  spriteId: 'neutral_monsterwhistlingblade',
  cost: 7,
  attack: 4,
  maxHp: 10,
  faction: null
});
