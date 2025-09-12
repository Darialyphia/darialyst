import { defineSerializedBlueprint } from '../../type-helpers';
import { defineCardEffect } from '../../card-effect';

export const f5PrimordialGazer = defineSerializedBlueprint({
  id: 'f5_primordial_gazer',
  name: 'Primordial Gazer',
  collectable: true,
  keywords: ['opening_gambit'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'common',
  effects: [
    defineCardEffect({
      text: '@Opening Gambit@: give a nearby minion +2/+2',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'change_stats',
            params: {
              mode: 'give',
              stackable: true,
              attack: {
                amount: { type: 'fixed', params: { value: 2 } },
                activeWhen: { candidates: [], random: false }
              },
              hp: {
                amount: { type: 'fixed', params: { value: 2 } },
                activeWhen: { candidates: [], random: false }
              },
              speed: {
                amount: { type: 'fixed', params: { value: 0 } },
                activeWhen: { candidates: [], random: false }
              },
              targets: {
                candidates: [
                  [{ type: 'is_manual_target', params: { index: 0, not: false } }]
                ],
                random: false
              },
              filter: {
                candidates: [[{ type: 'played_from_hand', params: {} }]],
                random: false
              },
              duration: 'always',
              execute: 'now'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    })
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
                candidates: [[{ type: 'is_minion', params: { not: false } }]],
                random: false
              }
            }
          },
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
  spriteId: 'f5_primordial_gazer',
  cost: 3,
  attack: 4,
  maxHp: 2,
  faction: 'f5'
});
