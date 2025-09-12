import { defineSerializedBlueprint } from '../../type-helpers';

export const f5ScaleShaper = defineSerializedBlueprint({
  id: 'f5_scaleshaper',
  attack: 2,
  cellHighlights: [],
  collectable: true,
  cost: 2,
  effects: [
    {
      config: {
        actions: [
          {
            params: {
              blueprints: {
                candidates: [
                  [
                    { params: {}, type: 'minion' },
                    { params: { factions: ['f5'] }, type: 'from_faction' }
                  ]
                ]
              },
              execute: 'now',
              filter: { candidates: [], random: false }
            },
            type: 'discover'
          }
        ],
        executionContext: 'while_in_hand'
      },
      text: '@Opening Gambit@: @Discover@ a magmar minion.',
      vfx: { tracks: [] }
    }
  ],
  faction: 'f5',
  keywords: ['discover', 'opening_gambit'],
  kind: 'MINION',
  maxHp: 3,
  name: 'Scaleshaper',
  rarity: 'rare',
  relatedBlueprintIds: [],
  sounds: {},
  spriteId: 'f5_gibblegup',
  tags: [],
  targets: { min: 0, targets: [] }
});
