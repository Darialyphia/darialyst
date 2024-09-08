import { defineSerializedBlueprint } from '../../card-blueprint';
import { defineCardEffect } from '../../card-effect';

export const f5DampeningWave = defineSerializedBlueprint({
  id: 'f5_dampening_wave',
  name: 'Dampening Wave',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'common',
  effects: [
    defineCardEffect({
      text: 'Give a minion "This can\'t counterattack.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'change_can_retaliate',
            params: {
              execute: 'now',
              unit: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ],
                random: false
              },
              attacker: { candidates: [[{ type: 'any_unit' }]], random: false },
              duration: 'always'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    })
  ],
  targets: {
    min: 1,
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
          }
        ]
      ]
    ]
  },
  cellHighlights: [],
  spriteId: 'icon_f5_dampeningwave',
  cost: 0,
  faction: 'f5'
});
