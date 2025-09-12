import { defineSerializedBlueprint } from '../../type-helpers';

export const f6Cryogenesis = defineSerializedBlueprint({
  id: 'f6_cryogenesis',
  name: 'Cryogenesis',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'rare',
  effects: [
    {
      text: 'Deal 4 damage to a minion. Draw a @Vespyr@.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'deal_damage',
            params: {
              amount: { type: 'fixed', params: { value: 4 } },
              targets: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ],
                random: false
              },
              execute: 'now',
              filter: { candidates: [], random: false }
            }
          },
          {
            type: 'draw_cards',
            params: {
              amount: { type: 'fixed', params: { value: 1 } },
              player: { candidates: [[{ type: 'ally_player' }]], random: false },
              execute: 'now',
              tag: 'vespyr',
              filter: { candidates: [], random: false }
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
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
  sounds: {},
  spriteId: 'icon_f6_cryogenesis',
  cost: 3,
  faction: 'f6'
});
