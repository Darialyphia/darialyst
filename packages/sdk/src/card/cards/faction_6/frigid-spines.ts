import { defineSerializedBlueprint } from '../../type-helpers';

export const f6FrigidSpines = defineSerializedBlueprint({
  id: 'f6_frigid_spines',
  name: 'Frigid Spines',
  collectable: false,
  keywords: ['wall'],
  relatedBlueprintIds: [],
  tags: [],
  kind: 'MINION',
  rarity: 'token',
  effects: [
    {
      text: '@Wall@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'wall',
            params: {
              filter: { candidates: [], random: false },
              execute: 'now',
              duration: 'always'
            }
          }
        ]
      },
      vfx: { tracks: [] }
    }
  ],
  targets: { min: 0, targets: [] },
  cellHighlights: [],
  spriteId: 'f6_blazingspines',
  cost: 1,
  attack: 2,
  maxHp: 3,
  faction: 'f6'
});
