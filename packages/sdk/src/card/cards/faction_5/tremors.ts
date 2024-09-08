import { defineSerializedBlueprint } from '../../card-blueprint';

export const f5Tremors = defineSerializedBlueprint({
  id: 'f5_tremors',
  name: 'Tremors',
  collectable: true,
  keywords: ['stunned'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'common',
  effects: [
    {
      text: 'Stun enemies in a 2v2 area.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'stun',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              target: {
                candidates: [
                  [
                    {
                      type: 'is_on_cell',
                      params: {
                        cell: {
                          candidates: [
                            [
                              {
                                type: '2x2_area',
                                params: {
                                  topLeft: {
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
                    }
                  ]
                ],
                random: false
              },
              duration: 'always'
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
        type: '2x2_area',
        params: {
          topLeft: {
            candidates: [[{ type: 'is_manual_target', params: { index: 0 } }]],
            random: false
          }
        }
      }
    ]
  ],
  faction: 'f5',
  cost: 2,
  spriteId: 'icon_f5_tremor'
});
