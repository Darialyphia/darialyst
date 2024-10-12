import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6Bubblesmith = defineSerializedBlueprint({
  id: 'f6_bubblesmith',
  name: 'Bubblesmith',
  collectable: true,
  keywords: ['opening_gambit'],
  relatedBlueprintIds: [],
  tags: ['vespyr'],
  kind: 'MINION',
  rarity: 'common',
  effects: [
    {
      text: '@Opening Gambit@: Give your General "The next time this would take damage, reduce that damage to 1".',
      config: {
        executionContext: 'immediate',
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
              source: { candidates: [], random: false },
              filter: {
                candidates: [[{ type: 'played_from_hand', params: {} }]],
                random: false
              },
              frequency: { type: 'once' },
              amount: { type: 'fixed', params: { value: 1 } },
              duration: 'always',
              execute: 'now',
              unit: {
                candidates: [
                  [
                    { type: 'is_ally', params: { not: false } },
                    { type: 'is_general', params: { not: false } }
                  ]
                ],
                random: false
              },
              effect: {
                executionContext: 'trigger_while_on_board',
                actions: [],
                triggers: [{ params: {} }]
              },
              linkToCard: false
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
  spriteId: 'f6_ynuyttracker',
  cost: 2,
  attack: 2,
  maxHp: 3,
  faction: 'f6'
});
