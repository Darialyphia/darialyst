import { defineSerializedBlueprint } from '../../type-helpers';

export const f6ArcticDisplacer = defineSerializedBlueprint({
  id: 'f6_arctic_displacer',
  name: 'ArcticDisplacer',
  collectable: true,
  keywords: ['airdrop'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'common',
  effects: [
    {
      text: '@Airdrop@.',
      config: {
        executionContext: 'while_in_hand',
        actions: [
          {
            type: 'airdrop',
            params: { execute: 'now', filter: { candidates: [], random: false } }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: '@Opening Gambit@: @Freeze@ a nearby minion.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'freeze',
            params: {
              filter: {
                candidates: [[{ type: 'played_from_hand', params: {} }]],
                random: false
              },
              execute: 'now',
              target: {
                candidates: [
                  [
                    { type: 'is_minion', params: { not: false } },
                    { type: 'is_manual_target', params: { not: false, index: 0 } }
                  ]
                ],
                random: false
              },
              duration: 'always'
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
            type: 'is_nearby',
            params: {
              unit: { candidates: [], random: false },
              cell: {
                candidates: [[{ type: 'summon_target' }]],
                random: false
              }
            }
          }
        ]
      ]
    ]
  },
  cellHighlights: [],
  spriteId: 'f6_snowwyvern',
  cost: 5,
  attack: 10,
  maxHp: 4,
  faction: 'f6'
});
