import { defineSerializedBlueprint } from '../../card-blueprint';

export const neutralWorldcoreGolem = defineSerializedBlueprint({
  id: 'neutral_worldcore_golem',
  name: 'Worldcore Golem',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: ['golem'],
  kind: 'MINION',
  rarity: 'rare',
  effects: [
    {
      text: 'This card costs 1 less for each enemy minion and 1 more for each allied minion.',
      config: {
        executionContext: 'while_in_hand',
        actions: [
          {
            type: 'change_card_cost',
            params: {
              filter: { candidates: [], random: false },
              activeWhen: { candidates: [], random: false },
              execute: 'now',
              amount: {
                type: 'count_of_units',
                params: {
                  unit: {
                    candidates: [
                      [
                        { type: 'is_enemy', params: { not: false } },
                        { type: 'is_minion', params: { not: false } }
                      ]
                    ],
                    random: false
                  },
                  scale: -1
                }
              },
              card: { candidates: [[{ type: 'self' }]], random: false },
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              occurences_count: 0,
              duration: 'always'
            }
          },
          {
            type: 'change_card_cost',
            params: {
              filter: { candidates: [], random: false },
              activeWhen: { candidates: [], random: false },
              execute: 'now',
              amount: {
                type: 'count_of_units',
                params: {
                  unit: {
                    candidates: [[{ type: 'is_ally', params: { not: false } }]],
                    random: false
                  }
                }
              },
              card: { candidates: [[{ type: 'self' }]], random: false },
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              occurences_count: 0,
              duration: 'always'
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
  spriteId: 'neutral_moltengolem',
  cost: 9,
  attack: 12,
  maxHp: 12,
  faction: null
});
