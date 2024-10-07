import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6BoreanBear = defineSerializedBlueprint({
  id: 'f6_borean_bear',
  name: 'Borean Bear',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: ['vespyr'],
  kind: 'MINION',
  rarity: 'epic',
  effects: [
    {
      text: 'This has +1/+0 for each allied @Wall@.',
      config: {
        actions: [
          {
            type: 'change_stats',
            params: {
              mode: 'give',
              stackable: true,
              attack: {
                amount: {
                  type: 'count_of_units',
                  params: {
                    unit: {
                      candidates: [
                        [
                          { type: 'is_ally', params: { not: false } },
                          { type: 'has_keyword', params: { not: false, keyword: 'wall' } }
                        ]
                      ],
                      random: false
                    }
                  }
                },
                activeWhen: { candidates: [], random: false }
              },
              hp: {
                amount: { type: 'fixed', params: { value: 0 } },
                activeWhen: { candidates: [], random: false }
              },
              speed: {
                amount: { type: 'fixed', params: { value: 0 } },
                activeWhen: { candidates: [], random: false }
              },
              targets: { candidates: [[{ type: 'any_unit' }]], random: false },
              filter: { candidates: [], random: false },
              duration: 'always',
              execute: 'now'
            }
          }
        ],
        executionContext: 'while_on_board'
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'f6_waterbear',
  cost: 2,
  attack: 1,
  maxHp: 4,
  faction: 'f6'
});
