import { defineSerializedBlueprint } from '../../card-blueprint';
import { defineCardEffect } from '../../card-effect';

export const f6FrosthornRhyno = defineSerializedBlueprint({
  id: 'f6_frosthorn_rhyno',
  name: 'Frosthorn Rhyno',
  collectable: true,
  keywords: ['infiltrate', 'celerity'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'epic',
  effects: [
    defineCardEffect({
      text: '@Infiltrate@: +1/+0 and @Celerity@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'infiltrate',
            params: {
              effect: {
                executionContext: 'while_on_board',
                actions: [
                  {
                    type: 'change_stats',
                    params: {
                      mode: 'give',
                      stackable: true,
                      attack: {
                        amount: { type: 'fixed', params: { value: 1 } },
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
                      targets: {
                        candidates: [[{ type: 'is_self', params: { not: false } }]],
                        random: false
                      },
                      filter: { candidates: [], random: false },
                      duration: 'always',
                      execute: 'now'
                    }
                  },
                  {
                    type: 'celerity',
                    params: {
                      filter: { candidates: [], random: false },
                      activeWhen: { candidates: [], random: false },
                      execute: 'now',
                      duration: 'always'
                    }
                  }
                ]
              },
              filter: { candidates: [], random: false },
              execute: 'now'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    })
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'f6_arcticrhyno',
  cost: 6,
  attack: 6,
  maxHp: 8,
  faction: 'f6'
});
