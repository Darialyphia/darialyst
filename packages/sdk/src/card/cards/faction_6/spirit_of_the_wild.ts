import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6SpiritOfTheWild = defineSerializedBlueprint({
  id: 'f6_spirit_of_the_wild',
  name: 'Spirit of the Wild',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'legendary',
  effects: [
    {
      text: "Activate allied units on your opponent's starting side of the battlefield.",
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'activate_unit',
            params: {
              filter: { candidates: [], random: false },
              targets: {
                candidates: [
                  [
                    { type: 'is_on_opponent_side_of_board', params: { not: false } },
                    { type: 'is_ally', params: { not: false } }
                  ]
                ],
                random: false
              },
              execute: 'now'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 1, targets: [[[{ type: 'any_cell' }]]] },
  cellHighlights: [
    [
      {
        type: 'has_unit',
        params: {
          unit: {
            candidates: [
              [
                { type: 'is_on_opponent_side_of_board', params: { not: false } },
                { type: 'is_ally', params: { not: false } }
              ]
            ],
            random: false
          }
        }
      }
    ]
  ],
  sounds: {},
  spriteId: 'icon_f6_spiritofthewild',
  cost: 5,
  faction: 'f6'
});
