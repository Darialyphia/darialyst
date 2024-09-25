import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6CrystalCloaker = defineSerializedBlueprint({
  id: 'f6_crystal_cloaker',
  name: 'Crystal Cloaker',
  collectable: true,
  keywords: ['infiltrate'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'common',
  effects: [
    {
      text: '@Infiltrate@: +2+0.',
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
                        amount: { type: 'fixed', params: { value: 2 } },
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
    }
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'f6_crystalbeetle',
  cost: 2,
  attack: 2,
  maxHp: 3,
  faction: 'f6'
});
