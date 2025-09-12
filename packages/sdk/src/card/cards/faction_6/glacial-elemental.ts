import { defineSerializedBlueprint } from '../../type-helpers';

export const f6GlacialElemental = defineSerializedBlueprint({
  id: 'f6_glacial_elemental',
  name: 'Glacial Elemental',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: ['vespyr'],
  kind: 'MINION',
  rarity: 'rare',
  effects: [
    {
      text: 'When you summon a @Vespyr@, Deal 2 damage to a random enemy minion.',
      config: {
        executionContext: 'trigger_while_on_board',
        actions: [
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 2 } },
              targets: {
                candidates: [
                  [
                    { type: 'is_enemy', params: { not: false } },
                    { type: 'is_minion', params: { not: false } }
                  ]
                ],
                random: true
              },
              execute: 'now',
              filter: { candidates: [], random: false }
            }
          }
        ],
        triggers: [
          {
            type: 'on_unit_play',
            params: {
              unit: {
                candidates: [
                  [
                    { type: 'is_self', params: { not: true } },
                    { type: 'has_tag', params: { tag: 'vespyr', not: false } },
                    { type: 'is_ally', params: { not: false } }
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
  spriteId: 'f6_snowman',
  cost: 3,
  attack: 1,
  maxHp: 3,
  faction: 'f6'
});
