import { defineSerializedBlueprint } from '../../card-blueprint';
import { f6WhiteWyrm } from './white_wyrm';

export const f6AspectOfTheWyrm = defineSerializedBlueprint({
  id: 'f6_aspect_of_the_wyrm',
  name: 'Aspect of the Wyrm',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [f6WhiteWyrm.id],
  tags: [],
  kind: 'SPELL',
  rarity: 'epic',
  effects: [
    {
      text: "Put a copy of a minion into its owner's hand and transform that minion into a @White Wyrm@.",
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'generate_card',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              ephemeral: false,
              location: 'hand',
              player: {
                candidates: [[{ type: 'is_manual_target_owner', params: { index: 0 } }]],
                random: false
              },
              blueprint: {
                candidates: [
                  [
                    {
                      type: 'from_unit',
                      params: {
                        unit: {
                          candidates: [
                            [
                              {
                                type: 'is_manual_target',
                                params: { not: false, index: 0 }
                              }
                            ]
                          ]
                        }
                      }
                    }
                  ]
                ]
              }
            }
          },
          {
            type: 'transform_unit',
            params: {
              blueprint: {
                candidates: [
                  [{ type: 'static', params: { blueprints: ['f6_white_wyrm'] } }]
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
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
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
  },
  cellHighlights: [],
  sounds: {},
  spriteId: 'icon_f6_aspectofthedrake',
  cost: 2,
  faction: 'f6'
});
