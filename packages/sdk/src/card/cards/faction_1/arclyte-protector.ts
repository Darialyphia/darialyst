import { defineSerializedBlueprint } from '../../type-helpers';

export const f1ArclyteProtector = defineSerializedBlueprint({
  id: 'f1_arclyte_protector',
  name: 'Arclyte Protector',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'epic',
  effects: [
    {
      text: 'Allied units nearby this have @Tough(1)@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'aura',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              isElligible: {
                candidates: [
                  [
                    { type: 'is_ally', params: { not: false } },
                    {
                      type: 'is_nearby',
                      params: {
                        unit: {
                          candidates: [[{ type: 'is_self', params: { not: false } }]],
                          random: false
                        },
                        cell: { candidates: [], random: false },
                        not: false
                      }
                    }
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
              activeWhen: { candidates: [], random: false }
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
  spriteId: 'f1_invincibuddy',
  cost: 5,
  attack: 4,
  maxHp: 6,
  faction: 'f1'
});
