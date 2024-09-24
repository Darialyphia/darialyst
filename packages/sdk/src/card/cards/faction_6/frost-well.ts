import { defineSerializedBlueprint } from '../../card-blueprint';

export const f6FrostWell = defineSerializedBlueprint({
  id: 'f6_frost_well',
  name: 'Frost Well',
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
    },
    {
      text: '@Provoke@.',
      config: {
        executionContext: 'while_on_board',
        actions: [
          {
            type: 'provoke',
            params: {
              filter: { candidates: [], random: false },
              activeWhen: { candidates: [], random: false },
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
  spriteId: 'f6_gravitywell',
  cost: 1,
  attack: 0,
  maxHp: 1,
  faction: 'f6'
});
