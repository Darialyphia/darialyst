import { defineSerializedBlueprint } from '../../card-blueprint';

export const f2Whiplash = defineSerializedBlueprint({
  id: 'EfMypc',
  name: 'Whiplash',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'rare',
  effects: [
    {
      text: 'Nearby enemies have @Vulnerable(1)@.',
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
                    { type: 'is_enemy', params: { not: false } },
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
                    type: 'add_effect',
                    params: {
                      filter: { candidates: [], random: false },
                      execute: 'now',
                      activeWhen: { candidates: [], random: false },
                      duration: 'always',
                      stacks: { type: 'fixed', params: { value: 1 } },
                      unit: {
                        candidates: [[{ type: 'is_self', params: { not: false } }]],
                        random: false
                      },
                      effect: {
                        executionContext: 'while_on_board',
                        actions: [
                          {
                            type: 'vulnerable',
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
                      linkToCard: false
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
  spriteId: 'f2_sepukku',
  cost: 3,
  attack: 2,
  maxHp: 5,
  faction: 'f2'
});
