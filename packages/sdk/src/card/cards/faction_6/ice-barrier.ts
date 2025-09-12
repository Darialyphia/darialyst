import { defineSerializedBlueprint } from '../../type-helpers';

export const f6IceBarrier = defineSerializedBlueprint({
  id: 'f6_ice_barrier',
  name: 'Ice Barrier',
  collectable: false,
  keywords: ['wall'],
  relatedBlueprintIds: [],
  tags: ['vespyr'],
  kind: 'MINION',
  rarity: 'token',
  effects: [
    {
      text: '@Wall@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'wall',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              duration: 'always'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: 'When a nearby minion damages this, @Freeze@ that minion.',
      config: {
        executionContext: 'trigger_while_on_board',
        actions: [
          {
            type: 'freeze',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              target: {
                candidates: [[{ type: 'attack_source', params: { not: false } }]],
                random: false
              },
              duration: 'always'
            }
          }
        ],
        triggers: [
          {
            type: 'on_after_unit_deal_damage',
            params: {
              target: {
                candidates: [[{ type: 'is_self', params: { not: false } }]],
                random: false
              },
              unit: {
                candidates: [
                  [
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
                    },
                    { type: 'is_minion', params: { not: false } }
                  ]
                ],
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
  attack: 0,
  maxHp: 2,
  cost: 1,
  spriteId: 'f6_bonechillbarrier',
  faction: 'f6'
});
