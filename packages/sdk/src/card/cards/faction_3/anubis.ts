import { defineSerializedBlueprint } from '../../card-blueprint';

export const f3Anubis = defineSerializedBlueprint({
  id: 'f3_anubis',
  name: 'Anubis',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'legendary',
  effects: [
    {
      text: 'Your general deals double damage.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'aura',
            params: {
              isElligible: {
                candidates: [
                  [
                    { type: 'is_general', params: { not: false } },
                    { type: 'is_ally', params: { not: false } }
                  ]
                ]
              },
              effect: {
                executionContext: 'while_on_board',
                actions: [
                  {
                    type: 'change_damage_dealt',
                    params: {
                      mode: 'scale',
                      stackable: true,
                      targets: {
                        candidates: [
                          [
                            { type: 'is_general', params: { not: false } },
                            { type: 'is_ally', params: { not: false } }
                          ]
                        ],
                        random: false
                      },
                      filter: { candidates: [], random: false },
                      frequency: { type: 'always' },
                      amount: { type: 'fixed', params: { value: 2 } },
                      duration: 'always',
                      execute: 'now'
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: 'Your general takes no damage during your turn',
      config: {
        executionContext: 'trigger_while_on_board',
        actions: [
          {
            type: 'change_damage_taken',
            params: {
              mode: 'set',
              stackable: true,
              targets: {
                candidates: [
                  [
                    { type: 'is_ally', params: { not: false } },
                    { type: 'is_general', params: { not: false } }
                  ]
                ],
                random: false
              },
              filter: { candidates: [], random: false },
              frequency: { type: 'always' },
              amount: { type: 'fixed', params: { value: 0 } },
              duration: 'end_of_turn',
              execute: 'now',
              source: { candidates: [], random: false }
            }
          }
        ],
        triggers: [
          {
            type: 'on_player_turn_start',
            params: {
              player: {
                candidates: [[{ type: 'ally_player', params: {} }]],
                random: false
              },
              frequency: { type: 'always' }
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
  spriteId: 'f3_anubis',
  cost: 2,
  attack: 9,
  maxHp: 8,
  faction: 'f3'
});
