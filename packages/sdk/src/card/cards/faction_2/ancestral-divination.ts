import { defineSerializedBlueprint } from '../../type-helpers';

export const f2AncestralDivination = defineSerializedBlueprint({
  id: 'f2_ancestral_divination',
  name: 'Ancestral Divination',
  collectable: true,
  keywords: ['discover', 'echo'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'SPELL',
  rarity: 'epic',
  effects: [
    {
      text: '@Discover@ a Songhai spell.',
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
                  [
                    { type: 'spell', params: {} },
                    { type: 'from_faction', params: { factions: ['f2'] } }
                  ]
                ]
              }
            }
          }
        ]
      },
      vfx: { tracks: [] }
    },
    {
      text: '@Echo@.',
      config: {
        executionContext: 'while_in_hand',
        actions: [
          {
            type: 'echo',
            params: { filter: { candidates: [], random: false }, execute: 'now' }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 1, targets: [[[{ type: 'any_cell' }]]] },
  cellHighlights: [],
  sounds: {},
  spriteId: 'icon_f2_ancestralpact',
  cost: 1,
  faction: 'f2'
});
