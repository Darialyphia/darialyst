import { defineSerializedBlueprint } from '../../card-blueprint';
import { f6SeismicElemental } from './seismic_elemental';

export const f6AspectOfTheMountain = defineSerializedBlueprint({
  id: 'f6_aspect_of_the_mountain',
  name: 'Aspect of the Mountain',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [f6SeismicElemental.id],
  tags: [],
  kind: 'SPELL',
  rarity: 'legendary',
  effects: [
    {
      text: 'Transform a minion into a Seismic Elemental and deal 5 damage to enemy minions nearby it.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'transform_unit',
            params: {
              blueprint: {
                candidates: [
                  [{ type: 'static', params: { blueprints: ['f6_seismic_elemental'] } }]
                ]
              },
              unit: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ]
              },
              execute: 'now',
              duration: 'always',
              filter: { candidates: [], random: false }
            }
          },
          {
            type: 'deal_damage',
            params: {
              artifact: { candidates: [], random: false },
              execute: 'now',
              filter: { candidates: [], random: false },
              amount: { type: 'fixed', params: { value: 5 } },
              targets: {
                candidates: [
                  [
                    {
                      type: 'is_nearby',
                      params: {
                        unit: {
                          candidates: [
                            [
                              {
                                type: 'is_manual_target',
                                params: { not: false, index: 0 }
                              },
                              { type: 'is_enemy', params: { not: false } }
                            ]
                          ],
                          random: false
                        },
                        cell: { candidates: [], random: false },
                        not: false
                      }
                    }
                  ]
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
  faction: 'f6',
  spriteId: 'icon_f6_aspectofthemountains',
  cost: 6
});
