import { defineSerializedBlueprint } from '../../type-helpers';

export const f3ScionsReliquary = defineSerializedBlueprint({
  id: 'f3_scions_reliquary',
  name: "Scion's Reliquary",
  collectable: true,
  keywords: ['discover'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'rare',
  effects: [
    {
      text: "@Discover@ a @Scion's First Wish@, @Scions's Second Wish@ or @Scion's Third Wish@.",
      config: {
        executionContext: 'while_in_hand',
        actions: [
          {
            type: 'discover',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              blueprints: {
                candidates: [
                  [{ type: 'static', params: { blueprints: ['f3_scions_first_wish'] } }],
                  [{ type: 'static', params: { blueprints: ['f3_scions_second_wish'] } }],
                  [{ type: 'static', params: { blueprints: ['f3_scions_third_wish'] } }]
                ]
              }
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 1, targets: [[[{ type: 'any_cell' }]]] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'icon_f3_autarchsgift',
  cost: 1,
  faction: 'f3'
});
