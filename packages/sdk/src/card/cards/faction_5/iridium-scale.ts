import { defineSerializedBlueprint } from '../../type-helpers';

export const f5IridiumScale = defineSerializedBlueprint({
  id: 'f5_iridium_scale',
  name: 'Iridium Scale',
  collectable: true,
  keywords: ['tough'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'ARTIFACT',
  rarity: 'rare',
  effects: [
    {
      text: 'Your general has @Tough(1)@.',
      config: {
        executionContext: 'trigger_while_equiped',
        actions: [
          {
            type: 'add_effect',
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
              effect: {
                executionContext: 'while_on_board',
                actions: [
                  {
                    type: 'tough',
                    params: {
                      filter: { candidates: [], random: false },
                      execute: 'now',
                      activeWhen: { candidates: [], random: false },
                      duration: 'always',
                      stacks: { type: 'fixed', params: { value: 1 } }
                    }
                  }
                ]
              },
              linkToCard: true,
              execute: 'now',
              filter: { candidates: [], random: false }
            }
          }
        ],
        triggers: [
          {
            type: 'on_artifact_equiped',
            params: {
              card: { candidates: [[{ type: 'self', params: {} }]], random: false },
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
  spriteId: 'icon_f5_artifact_irridiumscale',
  cost: 3,
  faction: 'f5'
});
