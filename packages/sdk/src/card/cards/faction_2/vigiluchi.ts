import { defineSerializedBlueprint } from '../../card-blueprint';

export const f2Vigiluchi = defineSerializedBlueprint({
  id: 'f2_vigiluchi',
  name: 'Vigiluchi',
  collectable: true,
  keywords: ['flying'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'common',
  effects: [
    {
      text: '@Flying@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'flying',
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
      text: '@Opening Gambit@: Teleport a minion directly behind your general.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'teleport_unit',
            params: {
              unit: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ],
                random: false
              },
              cell: {
                candidates: [
                  [
                    {
                      type: 'is_behind',
                      params: {
                        unit: {
                          candidates: [
                            [
                              { type: 'is_general', params: { not: false } },
                              { type: 'is_ally', params: { not: false } }
                            ]
                          ],
                          random: false
                        }
                      }
                    }
                  ]
                ],
                random: false
              },
              filter: {
                candidates: [[{ type: 'played_from_hand', params: {} }]],
                random: false
              },
              execute: 'now'
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
                candidates: [[{ type: 'is_minion', params: { not: false } }]],
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
  spriteId: 'f2_masteroftaikwai',
  cost: 3,
  attack: 3,
  maxHp: 3,
  faction: 'f2'
});
