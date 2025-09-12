import { defineSerializedBlueprint } from '../../type-helpers';
import { f6FoxRavager } from './fox-ravager';

export const f6AspectOfTheFox = defineSerializedBlueprint({
  id: 'f6_asect_of_the_fox',
  name: 'Aspect of the Fox',
  collectable: true,
  keywords: [],
  relatedBlueprintIds: [f6FoxRavager.id],
  tags: [],
  kind: 'SPELL',
  cost: 1,
  rarity: 'common',
  effects: [
    {
      text: 'Transform a minion into a @Fox Ravager@.',
      config: {
        executionContext: 'immediate',
        actions: [
          {
            type: 'transform_unit',
            params: {
              blueprint: {
                candidates: [
                  [{ type: 'static', params: { blueprints: ['f6_fox_ravager'] } }]
                ]
              },
              unit: {
                candidates: [
                  [{ type: 'is_manual_target', params: { not: false, index: 0 } }]
                ]
              },
              execute: 'now',
              duration: 'always',
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
  spriteId: 'icon_f6_aspectofthefox',
  faction: 'f6'
});
