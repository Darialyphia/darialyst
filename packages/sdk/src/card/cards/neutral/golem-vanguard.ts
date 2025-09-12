import { defineSerializedBlueprint } from '../../type-helpers';

export const neutralGolemVanguard = defineSerializedBlueprint({
  id: 'neutral_golem_vanguard',
  name: 'Golem Vanguard',
  collectable: true,
  keywords: ['provoke'],
  relatedBlueprintIds: [],
  tags: ['golem'],
  kind: 'MINION',
  rarity: 'epic',
  effects: [
    {
      text: '@Provoke@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'provoke',
            params: {
              filter: { candidates: [], random: false },
              activeWhen: { candidates: [], random: false },
              execute: 'now',
              duration: 'always'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: 'Other allied @Golem@s have @Provoke@.',
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
                    { type: 'is_self', params: { not: true } },
                    { type: 'is_ally', params: { not: false } },
                    { type: 'is_minion', params: { not: false } },
                    { type: 'has_tag', params: { tag: 'golem', not: false } }
                  ]
                ],
                random: false
              },
              effect: {
                executionContext: 'while_on_board',
                actions: [
                  {
                    type: 'provoke',
                    params: {
                      filter: { candidates: [], random: false },
                      activeWhen: { candidates: [], random: false },
                      execute: 'now',
                      duration: 'always'
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
  spriteId: 'neutral_golem_stone',
  cost: 3,
  attack: 3,
  maxHp: 4,
  faction: null
});
